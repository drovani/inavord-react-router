import type { ErrorScenario, ScreenSizes, TestCounts, TestTimeouts } from '../types/admin-users.types'

/**
 * Test configuration constants for admin users tests
 */

export const TEST_CONFIG = {
  SCREEN_SIZES: {
    DESKTOP: 1200,
    MOBILE: 480
  } satisfies ScreenSizes,
  COUNTS: {
    DUAL_VIEW_MULTIPLIER: 2, // Items appear in both desktop table and mobile card views
    ACTIVE_USERS: 3,
    TOTAL_USERS: 4,
    DISABLED_USERS: 1
  } satisfies TestCounts,
  TIMEOUTS: {
    SLOW_OPERATION: 100,
    API_DELAY: 50
  } satisfies TestTimeouts
} as const

export const ERROR_SCENARIOS: readonly ErrorScenario[] = [
  {
    name: 'API connection failed',
    error: 'API connection failed',
    expectedMessage: 'API connection failed'
  },
  {
    name: 'Service role not configured',
    error: 'Service role not configured',
    expectedMessage: 'Service role not configured'
  },
  {
    name: 'Operation failed',
    error: 'Operation failed',
    expectedMessage: 'Operation failed'
  }
] as const

export type UserRole = 'admin' | 'editor'