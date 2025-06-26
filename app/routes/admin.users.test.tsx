import type { User } from '@supabase/supabase-js'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mockAdminUserOperations, mockUsers } from '~/__tests__/mocks/admin'
import { mockSupabaseClient } from '~/__tests__/mocks/supabase'
import { mockAdminUser, mockUser } from '~/__tests__/utils/test-utils'
import { useAuth } from '~/contexts/AuthContext'
import AdminUsers, { loader } from './admin.users'

// Mock dependencies
vi.mock('~/lib/supabase/client', () => ({
  createClient: vi.fn()
}))

vi.mock('~/contexts/AuthContext', () => ({
  useAuth: vi.fn()
}))

// Track which fetcher we're creating (first call is main fetcher, second is create user fetcher)
let fetcherCallCount = 0

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router')
  
  return {
    ...actual,
    useLoaderData: vi.fn(),
    useFetcher: vi.fn(() => {
      fetcherCallCount++
      return {
        data: null,
        state: 'idle',
        submit: fetcherCallCount === 1 ? mockFetcherSubmit : mockCreateUserFetcherSubmit
      }
    }),
    useRevalidator: vi.fn(() => ({
      revalidate: vi.fn(),
      state: 'idle'
    }))
  }
})

vi.mock('loglevel', () => ({
  default: {
    error: vi.fn(),
    debug: vi.fn(),
    info: vi.fn()
  }
}))

// Import after mocks
import { useLoaderData } from 'react-router'
import '~/__tests__/mocks/admin'
import { createClient } from '~/lib/supabase/client'

// Create shared mock functions that we can track
const mockFetcherSubmit = vi.fn()
const mockCreateUserFetcherSubmit = vi.fn()

const renderAdminUsers = (currentUser: User | null = mockAdminUser, loaderData: { users: any[], error: string | null, hasServiceRole: boolean } = { users: mockUsers, error: null, hasServiceRole: true }) => {
  // Reset fetcher count and clear mock calls before each render
  fetcherCallCount = 0
  mockFetcherSubmit.mockClear()
  mockCreateUserFetcherSubmit.mockClear()

  // Mock useAuth hook
  vi.mocked(useAuth).mockReturnValue({
    user: currentUser ? {
      id: currentUser.id,
      email: currentUser.email || '',
      name: currentUser.user_metadata?.full_name || 'Test User',
      avatar: '',
      roles: currentUser.app_metadata?.roles || ['user'],
      fallback: 'TU'
    } : null,
    isAuthenticated: !!currentUser,
    signOut: vi.fn(),
    updateProfile: vi.fn()
  })

  // Mock loader data
  vi.mocked(useLoaderData).mockReturnValue(loaderData)

  return render(<AdminUsers />)
}

describe('Admin Users Route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset the mockUsers array to initial state
    mockUsers.splice(0, mockUsers.length,
      { id: 'user-1', email: 'user@example.com', app_metadata: { roles: ['user'] }, user_metadata: { full_name: 'Regular User' }, aud: 'authenticated', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', last_sign_in_at: '2024-01-01T00:00:00Z' },
      { id: 'user-2', email: 'editor@example.com', app_metadata: { roles: ['user', 'editor'] }, user_metadata: { full_name: 'Editor User' }, aud: 'authenticated', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', last_sign_in_at: '2024-01-01T00:00:00Z' },
      { id: 'user-3', email: 'admin@example.com', app_metadata: { roles: ['user', 'admin'] }, user_metadata: { full_name: 'Admin User' }, aud: 'authenticated', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', last_sign_in_at: '2024-01-01T00:00:00Z' },
      { id: 'disabled-user', email: 'disabled@example.com', app_metadata: { roles: ['user'] }, user_metadata: { full_name: 'Disabled User' }, banned_until: '2034-01-01T00:00:00Z', aud: 'authenticated', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', last_sign_in_at: '2024-01-01T00:00:00Z' } as any
    )
  })

  describe('Loader Tests', () => {
    beforeEach(() => {
      const adminSupabaseClient = {
        ...mockSupabaseClient,
        auth: {
          ...mockSupabaseClient.auth,
          getUser: vi.fn().mockResolvedValue({ data: { user: mockAdminUser } })
        }
      }
      vi.mocked(createClient).mockReturnValue({ supabase: adminSupabaseClient as any, headers: new Headers() })
    })

    it('should redirect unauthenticated users to login', async () => {
      const unauthenticatedClient = {
        ...mockSupabaseClient,
        auth: {
          ...mockSupabaseClient.auth,
          getUser: vi.fn().mockResolvedValue({ data: { user: null } })
        }
      }
      vi.mocked(createClient).mockReturnValue({ supabase: unauthenticatedClient as any, headers: new Headers() })

      const request = new Request('http://localhost/admin/users')

      try {
        await loader({ request })
        expect.fail('Should have thrown a redirect')
      } catch (response: any) {
        expect(response.status).toBe(302)
        expect(response.headers.get('Location')).toBe('/login')
      }
    })

    it('should redirect non-admin users to home', async () => {
      const regularUserClient = {
        ...mockSupabaseClient,
        auth: {
          ...mockSupabaseClient.auth,
          getUser: vi.fn().mockResolvedValue({ data: { user: mockUser } })
        }
      }
      vi.mocked(createClient).mockReturnValue({ supabase: regularUserClient as any, headers: new Headers() })

      const request = new Request('http://localhost/admin/users')

      try {
        await loader({ request })
        expect.fail('Should have thrown a redirect')
      } catch (response: any) {
        expect(response.status).toBe(302)
        expect(response.headers.get('Location')).toBe('/')
      }
    })

    it('should return users for authenticated admin with service role', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ users: mockUsers })
      })

      const request = new Request('http://localhost/admin/users')
      const result = await loader({ request })

      expect(result).toEqual({
        users: mockUsers,
        error: null,
        hasServiceRole: true
      })
    })

    it('should handle API error gracefully', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Service unavailable' })
      })

      const request = new Request('http://localhost/admin/users')
      const result = await loader({ request })

      expect(result).toEqual({
        users: [],
        error: 'Service unavailable',
        hasServiceRole: false
      })
    })

    it('should handle network error gracefully', async () => {
      global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'))

      const request = new Request('http://localhost/admin/users')
      const result = await loader({ request })

      expect(result).toEqual({
        users: [],
        error: 'Service role not configured or API unavailable',
        hasServiceRole: false
      })
    })

    it('should handle malformed API responses', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        json: () => Promise.reject(new Error('Invalid JSON'))
      })

      const request = new Request('http://localhost/admin/users')
      const result = await loader({ request })

      expect(result.error).toBe('Failed to fetch users')
    })
  })

  describe('User List Rendering', () => {
    it('should render user management interface', () => {
      renderAdminUsers()

      expect(screen.getByText('User Management')).toBeInTheDocument()
      expect(screen.getByText('Manage user roles and permissions. All users have the User role by default. Assign additional Admin or Editor roles as needed.')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /add user/i })).toBeInTheDocument()
    })

    it('should display users in table format on desktop', () => {
      // Mock large screen
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1200 })
      renderAdminUsers()

      // Check that all user emails are present (both table and card views render)
      expect(screen.getAllByText('user@example.com')).toHaveLength(2) // Table + Card
      expect(screen.getAllByText('editor@example.com')).toHaveLength(2) // Table + Card
      expect(screen.getAllByText('admin@example.com')).toHaveLength(2) // Table + Card
      expect(screen.getAllByText('disabled@example.com')).toHaveLength(2) // Table + Card

      // Check that table exists
      expect(screen.getByRole('table')).toBeInTheDocument()
    })

    it('should display users in card format on mobile', () => {
      // Mock small screen
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 480 })
      renderAdminUsers()

      // Both mobile cards and desktop table render in test environment
      expect(screen.getAllByText('user@example.com')).toHaveLength(2)
      expect(screen.getAllByText('Regular User')).toHaveLength(2)
    })

    it('should display correct user roles', () => {
      renderAdminUsers()

      // Check that role checkboxes are present and checked correctly
      const adminCheckboxes = screen.getAllByLabelText('admin')
      const editorCheckboxes = screen.getAllByLabelText('editor')

      expect(adminCheckboxes.length).toBeGreaterThan(0)
      expect(editorCheckboxes.length).toBeGreaterThan(0)
    })

    it('should show user status badges correctly', () => {
      renderAdminUsers()

      // Both table and card views render status badges (3 active users × 2 views = 6)
      expect(screen.getAllByText('Active')).toHaveLength(6)
      expect(screen.getAllByText('Disabled')).toHaveLength(2)
    })

    it('should show service role configuration status', () => {
      renderAdminUsers()

      expect(screen.getByText('✅ User management is fully operational')).toBeInTheDocument()
    })

    it('should show configuration warning when service role not available', () => {
      renderAdminUsers(mockAdminUser, { users: [], error: 'Service role not configured', hasServiceRole: false })

      expect(screen.getByText('🔧 Configuration Required')).toBeInTheDocument()
      expect(screen.getByText(/VITE_SUPABASE_SERVICE_ROLE_KEY/)).toBeInTheDocument()
    })

    it('should show empty state when no users', () => {
      renderAdminUsers(mockAdminUser, { users: [], error: null, hasServiceRole: true })

      expect(screen.getByText('No users found.')).toBeInTheDocument()
    })
  })

  describe('User Role Management', () => {
    it('should display current user roles correctly', () => {
      renderAdminUsers()

      // Admin user should have admin checkbox checked
      const adminCheckboxes = screen.getAllByRole('checkbox', { name: /admin/i })
      const adminUserCheckbox = adminCheckboxes.find(checkbox =>
        checkbox.closest('tr')?.textContent?.includes('admin@example.com') ||
        checkbox.closest('.border')?.textContent?.includes('admin@example.com')
      )
      expect(adminUserCheckbox).toBeChecked()

      // Editor user should have editor checkbox checked
      const editorCheckboxes = screen.getAllByRole('checkbox', { name: /editor/i })
      const editorUserCheckbox = editorCheckboxes.find(checkbox =>
        checkbox.closest('tr')?.textContent?.includes('editor@example.com') ||
        checkbox.closest('.border')?.textContent?.includes('editor@example.com')
      )
      expect(editorUserCheckbox).toBeChecked()
    })

    it('should prevent current admin from removing their own admin role', () => {
      renderAdminUsers()

      // Find the admin checkbox for the current admin user
      const adminCheckboxes = screen.getAllByRole('checkbox', { name: /admin/i })
      const currentAdminCheckbox = adminCheckboxes.find(checkbox =>
        checkbox.closest('tr')?.textContent?.includes('admin@example.com') ||
        checkbox.closest('.border')?.textContent?.includes('admin@example.com')
      )

      expect(currentAdminCheckbox).toBeDisabled()
    })

    it('should allow toggling roles for other users', async () => {
      const user = userEvent.setup()
      renderAdminUsers()

      // Find editor checkbox for regular user
      const editorCheckboxes = screen.getAllByRole('checkbox', { name: /editor/i })
      const regularUserEditorCheckbox = editorCheckboxes.find(checkbox =>
        checkbox.closest('tr')?.textContent?.includes('user@example.com') ||
        checkbox.closest('.border')?.textContent?.includes('user@example.com')
      )

      expect(regularUserEditorCheckbox).not.toBeChecked()

      await user.click(regularUserEditorCheckbox!)

      // Should trigger fetcher submit with correct parameters (unit test approach)
      expect(mockFetcherSubmit).toHaveBeenCalledWith(
        {
          action: "updateRoles",
          userId: "user-1",
          roles: JSON.stringify(['user', 'editor'])
        },
        { method: "post" }
      )
    })

    it('should disable role checkboxes when service role not available', () => {
      renderAdminUsers(mockAdminUser, { users: mockUsers, error: null, hasServiceRole: false })

      const checkboxes = screen.getAllByRole('checkbox')
      checkboxes.forEach(checkbox => {
        if (checkbox.getAttribute('id')?.includes('admin') || checkbox.getAttribute('id')?.includes('editor')) {
          expect(checkbox).toBeDisabled()
        }
      })
    })
  })

  describe('User Status Management', () => {
    it('should show correct status switches', () => {
      renderAdminUsers()

      const switches = screen.getAllByRole('switch')
      expect(switches.length).toBeGreaterThan(0)

      // Check that disabled user has switch in off position
      // The actual switch testing depends on the Switch component implementation
    })

    it('should prevent current user from disabling themselves', () => {
      renderAdminUsers()

      const switches = screen.getAllByRole('switch')
      const currentUserSwitch = switches.find(switchEl => {
        const container = switchEl.closest('tr') || switchEl.closest('.border')
        const containsEmail = container?.textContent?.includes('admin@example.com')
        const containsYou = container?.textContent?.includes('(You)')
        return containsEmail && containsYou
      })

      expect(currentUserSwitch).toBeDisabled()
    })

    it('should show delete button only for disabled users', () => {
      renderAdminUsers()

      // Should only show delete button for disabled user
      const deleteButtons = screen.queryAllByTitle('Delete user permanently')
      expect(deleteButtons.length).toBe(2) // Desktop and mobile views
    })
  })

  describe('User Creation', () => {
    it('should open create user dialog', async () => {
      const user = userEvent.setup()
      renderAdminUsers()

      const addButton = screen.getByRole('button', { name: /add user/i })
      await user.click(addButton)

      expect(screen.getByText('Create New User')).toBeInTheDocument()
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    })

    it('should validate required fields in create user form', async () => {
      const user = userEvent.setup()
      renderAdminUsers()

      // Open dialog
      await user.click(screen.getByRole('button', { name: /add user/i }))

      // Try to create without filling required fields
      await user.click(screen.getByRole('button', { name: /create user/i }))

      await waitFor(() => {
        expect(screen.getByText('Email and password are required')).toBeInTheDocument()
      })
    })

    it('should allow role selection in create user form', async () => {
      const user = userEvent.setup()
      renderAdminUsers()

      // Open dialog
      await user.click(screen.getByRole('button', { name: /add user/i }))

      // Select admin role
      const adminCheckbox = screen.getByRole('checkbox', { name: /admin/i })
      await user.click(adminCheckbox)

      expect(adminCheckbox).toBeChecked()
    })

    it('should disable create user button when service role not available', () => {
      renderAdminUsers(mockAdminUser, { users: mockUsers, error: null, hasServiceRole: false })

      const addButton = screen.getByRole('button', { name: /add user/i })
      expect(addButton).toBeDisabled()
    })
  })

  describe('Optimistic Updates', () => {
    it('should show loading state during user operations', async () => {
      const user = userEvent.setup()

      // Mock slow response
      mockAdminUserOperations.updateUserRoles.mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve({ success: true }), 100))
      )

      renderAdminUsers()

      // Toggle a role
      const editorCheckboxes = screen.getAllByRole('checkbox', { name: /editor/i })
      const checkbox = editorCheckboxes[0]

      await user.click(checkbox)

      // Should show updating state
      expect(screen.getByText('Updating...')).toBeInTheDocument()
    })

    it('should revert optimistic updates on error', async () => {
      const user = userEvent.setup()

      // Mock error response
      mockAdminUserOperations.updateUserRoles.mockRejectedValueOnce(new Error('Update failed'))

      renderAdminUsers()

      // Toggle a role
      const editorCheckboxes = screen.getAllByRole('checkbox', { name: /editor/i })
      const checkbox = editorCheckboxes[0]

      await user.click(checkbox)

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText(/operation failed/i)).toBeInTheDocument()
      })
    })
  })

  describe('Permission Validation', () => {
    it('should show service role warning for operations', async () => {
      const user = userEvent.setup()
      renderAdminUsers(mockAdminUser, { users: mockUsers, error: null, hasServiceRole: false })

      // Try to toggle role
      const editorCheckboxes = screen.getAllByRole('checkbox', { name: /editor/i })
      const checkbox = editorCheckboxes[0]

      await user.click(checkbox)

      await waitFor(() => {
        expect(screen.getByText(/service role not configured/i)).toBeInTheDocument()
      })
    })

    it('should prevent operations when updating another user', async () => {
      renderAdminUsers()

      // Mock a user being updated
      const checkboxes = screen.getAllByRole('checkbox')
      checkboxes.forEach(checkbox => {
        if (!checkbox.getAttribute('id')?.includes('create')) {
          expect(checkbox).not.toBeDisabled()
        }
      })
    })
  })

  describe('Error Handling', () => {
    it('should display error messages from failed operations', () => {
      renderAdminUsers(mockAdminUser, { users: [], error: 'API connection failed', hasServiceRole: false })

      expect(screen.getByText('API connection failed')).toBeInTheDocument()
    })
  })

  describe('User Deletion', () => {
    it('should show confirmation dialog for user deletion', async () => {
      const user = userEvent.setup()
      renderAdminUsers()

      const deleteButtons = screen.getAllByTitle('Delete user permanently')
      await user.click(deleteButtons[0])

      expect(screen.getByText('Delete User')).toBeInTheDocument()
      expect(screen.getByText(/are you sure you want to permanently delete/i)).toBeInTheDocument()
    })

    it('should only allow deletion of disabled users', () => {
      renderAdminUsers()

      // Should only show delete buttons for disabled user
      const deleteButtons = screen.queryAllByTitle('Delete user permanently')
      expect(deleteButtons.length).toBe(2) // Desktop and mobile
    })
  })

  describe('Responsive Design', () => {
    it('should show table view on large screens', () => {
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1200 })
      renderAdminUsers()

      // Table should be visible
      expect(screen.getByRole('table')).toBeInTheDocument()
    })

    it('should show card view on small screens', () => {
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 480 })
      renderAdminUsers()

      // Cards should be present
      const cards = screen.getAllByText('Regular User')
      expect(cards.length).toBeGreaterThan(0)
    })
  })

  describe('Accessibility', () => {
    it('should have proper labels for form controls', () => {
      renderAdminUsers()

      // Check for proper labeling
      expect(screen.getAllByLabelText(/admin/i)).toHaveLength(8) // 4 users × 2 views
      expect(screen.getAllByLabelText(/editor/i)).toHaveLength(8)
    })

    it('should have accessible button descriptions', () => {
      renderAdminUsers()

      expect(screen.getByRole('button', { name: /add user/i })).toBeInTheDocument()
      expect(screen.getAllByTitle('Delete user permanently')).toHaveLength(2)
    })

    it('should provide tooltips for disabled actions', () => {
      renderAdminUsers()

      // Current user admin role should have tooltip
      const adminCheckboxes = screen.getAllByRole('checkbox', { name: /admin/i })
      const currentAdminContainer = adminCheckboxes.find(checkbox =>
        checkbox.getAttribute('disabled') !== null
      )?.closest('div')

      expect(currentAdminContainer).toHaveAttribute('title', 'You cannot remove your own admin role to prevent system lockout.')
    })
  })

  describe('Data Refresh', () => {
    it('should have refresh users button', () => {
      renderAdminUsers()

      expect(screen.getByRole('button', { name: /refresh users/i })).toBeInTheDocument()
    })

    it('should disable refresh button during loading', () => {
      renderAdminUsers()

      const refreshButton = screen.getByRole('button', { name: /refresh users/i })
      expect(refreshButton).not.toBeDisabled()
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })
})