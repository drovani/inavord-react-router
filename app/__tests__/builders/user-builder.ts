import type { User } from '@supabase/supabase-js'

/**
 * Builder pattern for creating mock users in tests
 */
export class UserBuilder {
  private user: Partial<User> = {
    id: 'default-user-id',
    email: 'default@example.com',
    app_metadata: { roles: ['user'] },
    user_metadata: { full_name: 'Default User' },
    aud: 'authenticated',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    last_sign_in_at: '2024-01-01T00:00:00Z'
  }

  static create(): UserBuilder {
    return new UserBuilder()
  }

  withId(id: string): UserBuilder {
    this.user.id = id
    return this
  }

  withEmail(email: string): UserBuilder {
    this.user.email = email
    return this
  }

  withFullName(fullName: string): UserBuilder {
    this.user.user_metadata = {
      ...this.user.user_metadata,
      full_name: fullName
    }
    return this
  }

  withRoles(roles: string[]): UserBuilder {
    this.user.app_metadata = {
      ...this.user.app_metadata,
      roles
    }
    return this
  }

  withRole(role: string): UserBuilder {
    const currentRoles = this.user.app_metadata?.roles || ['user']
    return this.withRoles([...new Set([...currentRoles, role])])
  }

  asDisabled(bannedUntil = '2034-01-01T00:00:00Z'): UserBuilder {
    // @ts-ignore - Adding banned_until property for disabled user
    this.user.banned_until = bannedUntil
    return this
  }

  build(): User {
    return this.user as User
  }
}

/**
 * Pre-configured test users using the builder pattern
 */
export const TestUsers = {
  createRegularUser: () => UserBuilder.create()
    .withId('user-1')
    .withEmail('user@example.com')
    .withFullName('Regular User')
    .build(),

  createEditorUser: () => UserBuilder.create()
    .withId('user-2')
    .withEmail('editor@example.com')
    .withFullName('Editor User')
    .withRoles(['user', 'editor'])
    .build(),

  createAdminUser: () => UserBuilder.create()
    .withId('user-3')
    .withEmail('admin@example.com')
    .withFullName('Admin User')
    .withRoles(['user', 'admin'])
    .build(),

  createDisabledUser: () => UserBuilder.create()
    .withId('disabled-user')
    .withEmail('disabled@example.com')
    .withFullName('Disabled User')
    .asDisabled()
    .build(),

  createTestUserArray: () => [
    TestUsers.createRegularUser(),
    TestUsers.createEditorUser(),
    TestUsers.createAdminUser(),
    TestUsers.createDisabledUser()
  ]
}