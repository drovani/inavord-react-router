import type { User } from '@supabase/supabase-js'
import { render } from '@testing-library/react'
import { vi } from 'vitest'
import React from 'react'
import { TestUsers } from '../builders/user-builder'
import type { LoaderDataConfig } from '../mocks/supabase-client'
import { FetcherCallTracker, createMockFetchers } from '../mocks/supabase-client'
import { mockAdminUser } from '../utils/test-utils'

/**
 * Test setup and rendering utilities for admin users tests
 */

// Create shared mock fetchers
const mockFetchers = createMockFetchers()
const fetcherTracker = new FetcherCallTracker(mockFetchers)

/**
 * Sets up all necessary mocks for admin users testing
 */
export const setupAdminUsersMocks = () => {
  // Mock Supabase client
  vi.mock('~/lib/supabase/client', () => ({
    createClient: vi.fn()
  }))

  // Mock auth context
  vi.mock('~/contexts/AuthContext', () => ({
    useAuth: vi.fn()
  }))

  // Mock React Router hooks
  vi.mock('react-router', async () => {
    const actual = await vi.importActual('react-router')
    
    return {
      ...actual,
      useLoaderData: vi.fn(),
      useFetcher: vi.fn(() => fetcherTracker.getNextFetcher()),
      useRevalidator: vi.fn(() => ({
        revalidate: vi.fn(),
        state: 'idle'
      }))
    }
  })

  // Mock loglevel
  vi.mock('loglevel', () => ({
    default: {
      error: vi.fn(),
      debug: vi.fn(),
      info: vi.fn()
    }
  }))

  return { mockFetchers, fetcherTracker }
}

/**
 * Renders the AdminUsers component with proper setup
 */
export const createRenderAdminUsers = () => {
  // These imports need to happen after mocks are set up
  const { useAuth } = require('~/contexts/AuthContext')
  const { useLoaderData } = require('react-router')
  const AdminUsersModule = require('~/routes/admin.users')
  const AdminUsers = AdminUsersModule.default

  return (
    currentUser: User | null = mockAdminUser,
    loaderConfig: LoaderDataConfig = {}
  ) => {
    const testUsers = TestUsers.createTestUserArray()
    
    const loaderData = {
      users: testUsers,
      error: null,
      hasServiceRole: true,
      ...loaderConfig
    }

    // Reset fetcher tracking
    fetcherTracker.reset()

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

    return {
      ...render(React.createElement(AdminUsers)),
      mockFetchers,
      testUsers,
      loaderData
    }
  }
}

/**
 * Get the current mock fetchers for assertions
 */
export const getMockFetchers = () => mockFetchers

/**
 * Reset all mocks to clean state
 */
export const resetAllMocks = () => {
  vi.clearAllMocks()
  fetcherTracker.reset()
}