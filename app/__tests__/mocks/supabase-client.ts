import type { User } from '@supabase/supabase-js'
import { vi } from 'vitest'
import { mockSupabaseClient } from './supabase'

/**
 * Configuration types for mock Supabase client setup
 */
export interface SupabaseClientConfig {
  shouldAuthenticate?: boolean
  userToReturn?: User | null
  shouldHaveAdminRole?: boolean
}

export interface LoaderDataConfig {
  users?: any[]
  error?: string | null
  hasServiceRole?: boolean
}

/**
 * Creates a mock Supabase client with the specified configuration
 */
export const createMockSupabaseClient = (config: SupabaseClientConfig = {}) => {
  const {
    shouldAuthenticate = true,
    userToReturn = null,
    shouldHaveAdminRole = true
  } = config

  return {
    ...mockSupabaseClient,
    auth: {
      ...mockSupabaseClient.auth,
      getUser: vi.fn().mockResolvedValue({
        data: {
          user: shouldAuthenticate ? userToReturn : null
        }
      })
    }
  }
}

/**
 * Creates a setup function for mock client (to be called after mocks are established)
 */
export const createSetupMockClient = () => {
  const { createClient } = require('~/lib/supabase/client')
  
  return (config: SupabaseClientConfig = {}) => {
    const client = createMockSupabaseClient(config)
    vi.mocked(createClient).mockReturnValue({ supabase: client as any, headers: new Headers() })
  }
}

/**
 * Mock fetcher functions with proper typing
 */
export interface MockFetchers {
  mockFetcherSubmit: ReturnType<typeof vi.fn>
  mockCreateUserFetcherSubmit: ReturnType<typeof vi.fn>
}

export const createMockFetchers = (): MockFetchers => ({
  mockFetcherSubmit: vi.fn(),
  mockCreateUserFetcherSubmit: vi.fn()
})

/**
 * Mock fetcher call counter for tracking separate fetcher instances
 */
export class FetcherCallTracker {
  private callCount = 0
  private fetchers: MockFetchers

  constructor(fetchers: MockFetchers) {
    this.fetchers = fetchers
  }

  getNextFetcher() {
    this.callCount++
    return {
      data: null,
      state: 'idle',
      submit: this.callCount === 1 ? this.fetchers.mockFetcherSubmit : this.fetchers.mockCreateUserFetcherSubmit
    }
  }

  reset() {
    this.callCount = 0
    this.fetchers.mockFetcherSubmit.mockClear()
    this.fetchers.mockCreateUserFetcherSubmit.mockClear()
  }
}