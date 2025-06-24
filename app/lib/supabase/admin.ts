import { createClient } from '@supabase/supabase-js';

// Canonical list of assignable roles (user role is always default)
export const ASSIGNABLE_ROLES = ['admin', 'editor'] as const;
export type AssignableRole = typeof ASSIGNABLE_ROLES[number];

/**
 * Server-side Supabase client with service role key for admin operations
 * This client has admin privileges and should ONLY be used server-side
 */
export function createAdminClient() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing required environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_ROLE_KEY');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

/**
 * Admin operations for user management
 */
export const adminUserOperations = {
  /**
   * Get all users with their metadata
   */
  async getAllUsers() {
    const supabase = createAdminClient();
    const { data, error } = await supabase.auth.admin.listUsers();

    if (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }

    return data.users;
  },

  /**
   * Update user roles
   */
  async updateUserRoles(userId: string, roles: string[]) {
    const supabase = createAdminClient();

    // Validate roles - only admin and editor are assignable, user is default
    const invalidRoles = roles.filter(role => !ASSIGNABLE_ROLES.includes(role as AssignableRole) && role !== 'user');
    if (invalidRoles.length > 0) {
      throw new Error(`Invalid roles: ${invalidRoles.join(', ')}`);
    }

    // Ensure user always has 'user' role plus any assigned elevated roles
    const elevatedRoles = roles.filter(role => role !== 'user');
    const finalRoles = ['user', ...elevatedRoles];

    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      app_metadata: { roles: finalRoles }
    });

    if (error) {
      throw new Error(`Failed to update user roles: ${error.message}`);
    }

    return data.user;
  },

  /**
   * Get user by ID
   */
  async getUserById(userId: string) {
    const supabase = createAdminClient();
    const { data, error } = await supabase.auth.admin.getUserById(userId);

    if (error) {
      throw new Error(`Failed to fetch user: ${error.message}`);
    }

    return data.user;
  },

  /**
   * Disable user by setting ban_duration to a very long time (10 years)
   */
  async disableUser(userId: string) {
    const supabase = createAdminClient();
    // Set ban for 10 years (87600 hours)
    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      ban_duration: '87600h'
    } as any);

    if (error) {
      throw new Error(`Failed to disable user: ${error.message}`);
    }

    return data.user;
  },

  /**
   * Enable user by removing ban_duration
   */
  async enableUser(userId: string) {
    const supabase = createAdminClient();
    
    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      ban_duration: 'none'
    } as any);

    if (error) {
      throw new Error(`Failed to enable user: ${error.message}`);
    }

    return data.user;
  }
};