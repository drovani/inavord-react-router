import type { User } from '@supabase/supabase-js'
import type { vi } from 'vitest'

/**
 * Type definitions for admin users testing
 */

export interface TestUserData extends User {
  banned_until?: string | null
}

export interface AdminUsersLoaderData {
  users: TestUserData[]
  error: string | null
  hasServiceRole: boolean
}

export interface MockAuthUser {
  id: string
  email: string
  name: string
  avatar: string
  roles: string[]
  fallback: string
}

export interface MockAuthContext {
  user: MockAuthUser | null
  isAuthenticated: boolean
  signOut: () => void
  updateProfile: () => void
}

export interface TestRenderResult {
  mockFetchers: {
    mockFetcherSubmit: ReturnType<typeof vi.fn>
    mockCreateUserFetcherSubmit: ReturnType<typeof vi.fn>
  }
  testUsers: TestUserData[]
  loaderData: AdminUsersLoaderData
}

export interface FetcherSubmitParams {
  action: string
  userId?: string
  roles?: string
  email?: string
  password?: string
  fullName?: string
}

export interface ErrorScenario {
  readonly name: string
  readonly error: string
  readonly expectedMessage: string
}

/**
 * Test configuration interfaces
 */
export interface TestCounts {
  readonly DUAL_VIEW_MULTIPLIER: number
  readonly ACTIVE_USERS: number
  readonly TOTAL_USERS: number
  readonly DISABLED_USERS: number
}

export interface ScreenSizes {
  readonly DESKTOP: number
  readonly MOBILE: number
}

export interface TestTimeouts {
  readonly SLOW_OPERATION: number
  readonly API_DELAY: number
}