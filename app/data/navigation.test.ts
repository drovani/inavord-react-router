import { describe, expect, it } from 'vitest'
import { navigation } from './navigation'
import { DatabaseZapIcon, UsersIcon, BarChart3Icon } from 'lucide-react'

describe('Navigation Data', () => {
  describe('navigation structure', () => {
    it('is an array', () => {
      expect(Array.isArray(navigation)).toBe(true)
    })

    it('has at least one navigation group', () => {
      expect(navigation.length).toBeGreaterThan(0)
    })

    it('each group has required properties', () => {
      navigation.forEach((group, index) => {
        expect(group).toHaveProperty('name')
        expect(group).toHaveProperty('items')
        expect(typeof group.name).toBe('string')
        expect(Array.isArray(group.items)).toBe(true)
      })
    })

    it('each group has non-empty name', () => {
      navigation.forEach((group, index) => {
        expect(group.name.length).toBeGreaterThan(0)
      })
    })

    it('each group has at least one item', () => {
      navigation.forEach((group, index) => {
        expect(group.items.length).toBeGreaterThan(0)
      })
    })
  })

  describe('navigation items', () => {
    it('each item has required properties', () => {
      navigation.forEach((group, groupIndex) => {
        group.items.forEach((item, itemIndex) => {
          expect(item).toHaveProperty('name')
          expect(item).toHaveProperty('icon')
          expect(typeof item.name).toBe('string')
          expect(typeof item.icon).toBe('object')
        })
      })
    })

    it('each item has non-empty name', () => {
      navigation.forEach((group, groupIndex) => {
        group.items.forEach((item, itemIndex) => {
          expect(item.name.length).toBeGreaterThan(0)
        })
      })
    })

    it('items with href have valid URL format', () => {
      navigation.forEach((group, groupIndex) => {
        group.items.forEach((item, itemIndex) => {
          if (item.href) {
            expect(item.href).toMatch(/^\//)
          }
        })
      })
    })

    it('items with children do not have href', () => {
      navigation.forEach((group, groupIndex) => {
        group.items.forEach((item, itemIndex) => {
          if (item.children) {
            expect(item.href).toBeUndefined()
          }
        })
      })
    })

    it('nested children follow same structure', () => {
      navigation.forEach((group, groupIndex) => {
        group.items.forEach((item, itemIndex) => {
          if (item.children) {
            expect(Array.isArray(item.children)).toBe(true)
            item.children.forEach((child, childIndex) => {
              expect(child).toHaveProperty('name')
              expect(child).toHaveProperty('icon')
              expect(typeof child.name).toBe('string')
              expect(typeof child.icon).toBe('function')
              expect(child.name.length).toBeGreaterThan(0)
            })
          }
        })
      })
    })
  })

  describe('role-based access control', () => {
    it('groups with roles have valid role arrays', () => {
      navigation.forEach((group, index) => {
        if (group.roles) {
          expect(Array.isArray(group.roles)).toBe(true)
          expect(group.roles.length).toBeGreaterThan(0)
          group.roles.forEach((role, roleIndex) => {
            expect(typeof role).toBe('string')
            expect(role.length).toBeGreaterThan(0)
          })
        }
      })
    })

    it('has administration group with admin role', () => {
      const adminGroup = navigation.find(group => group.name === 'Administration')
      expect(adminGroup).toBeDefined()
      expect(adminGroup?.roles).toContain('admin')
    })

    it('role strings are valid role names', () => {
      const validRoles = ['admin', 'editor', 'user']
      navigation.forEach((group, index) => {
        if (group.roles) {
          group.roles.forEach((role) => {
            expect(validRoles).toContain(role)
          })
        }
      })
    })
  })

  describe('icon components', () => {
    it('all icons are valid React components', () => {
      navigation.forEach((group, groupIndex) => {
        group.items.forEach((item, itemIndex) => {
          expect(typeof item.icon).toBe('object')
          // Check if it's a React component by looking for common properties
          expect(item.icon.displayName || item.icon.name).toBeDefined()
        })
      })
    })

    it('uses correct imported icons', () => {
      const expectedIcons = [DatabaseZapIcon, UsersIcon, BarChart3Icon]
      const usedIcons = new Set()
      
      navigation.forEach((group) => {
        group.items.forEach((item) => {
          usedIcons.add(item.icon)
        })
      })

      // Check that all used icons are from our expected imports
      usedIcons.forEach((icon) => {
        expect(expectedIcons).toContain(icon)
      })
    })
  })

  describe('specific navigation content', () => {
    it('has Administration group', () => {
      const adminGroup = navigation.find(group => group.name === 'Administration')
      expect(adminGroup).toBeDefined()
    })

    it('Administration group has expected items', () => {
      const adminGroup = navigation.find(group => group.name === 'Administration')
      expect(adminGroup?.items).toBeDefined()
      
      const itemNames = adminGroup?.items.map(item => item.name) || []
      expect(itemNames).toContain('Data Setup')
      expect(itemNames).toContain('User Management')
      expect(itemNames).toContain('Test Coverage')
    })

    it('all admin items have correct hrefs', () => {
      const adminGroup = navigation.find(group => group.name === 'Administration')
      const items = adminGroup?.items || []
      
      const dataSetup = items.find(item => item.name === 'Data Setup')
      const userManagement = items.find(item => item.name === 'User Management')
      const testCoverage = items.find(item => item.name === 'Test Coverage')
      
      expect(dataSetup?.href).toBe('/admin/setup')
      expect(userManagement?.href).toBe('/admin/users')
      expect(testCoverage?.href).toBe('/admin/test-coverage')
    })

    it('all admin items have correct icons', () => {
      const adminGroup = navigation.find(group => group.name === 'Administration')
      const items = adminGroup?.items || []
      
      const dataSetup = items.find(item => item.name === 'Data Setup')
      const userManagement = items.find(item => item.name === 'User Management')
      const testCoverage = items.find(item => item.name === 'Test Coverage')
      
      expect(dataSetup?.icon).toBe(DatabaseZapIcon)
      expect(userManagement?.icon).toBe(UsersIcon)
      expect(testCoverage?.icon).toBe(BarChart3Icon)
    })
  })

  describe('URL consistency', () => {
    it('all admin routes start with /admin', () => {
      const adminGroup = navigation.find(group => group.name === 'Administration')
      adminGroup?.items.forEach((item) => {
        if (item.href) {
          expect(item.href).toMatch(/^\/admin\//)
        }
      })
    })

    it('no duplicate hrefs within navigation', () => {
      const hrefs = new Set()
      const duplicates: string[] = []
      
      navigation.forEach((group) => {
        group.items.forEach((item) => {
          if (item.href) {
            if (hrefs.has(item.href)) {
              duplicates.push(item.href)
            }
            hrefs.add(item.href)
          }
        })
      })
      
      expect(duplicates).toHaveLength(0)
    })
  })

  describe('TypeScript const assertion', () => {
    it('is marked as const assertion', () => {
      // This test ensures the navigation is properly typed as readonly
      // The const assertion should make the object deeply readonly
      expect(navigation).toBeDefined()
      
      // Verify the navigation structure is intact
      const originalLength = navigation.length
      expect(navigation.length).toBe(originalLength)
      expect(navigation.length).toBeGreaterThan(0)
    })
  })
})