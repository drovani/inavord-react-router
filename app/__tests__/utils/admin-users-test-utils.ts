import { screen } from '@testing-library/react'
import { expect } from 'vitest'
import { TEST_CONFIG, type UserRole } from '../config/admin-users.config'

/**
 * Common DOM element finding utilities
 */

// Helper to find container element for a user by email
const findUserContainer = (userEmail: string, isCurrentUser = false): HTMLElement | null => {
  const allContainers = [
    ...Array.from(document.querySelectorAll('tr')),
    ...Array.from(document.querySelectorAll('.border'))
  ] as HTMLElement[]
  
  return allContainers.find(container => {
    const containsEmail = container.textContent?.includes(userEmail)
    if (!isCurrentUser) return containsEmail
    
    const containsYou = container.textContent?.includes('(You)')
    return containsEmail && containsYou
  }) || null
}

// Generic helper to find element in user container
const findElementInUserContainer = <T extends HTMLElement>(
  elements: T[], 
  userEmail: string, 
  isCurrentUser = false
): T | undefined => {
  return elements.find(element => {
    const container = element.closest('tr') || element.closest('.border')
    if (!container) return false
    
    const containsEmail = container.textContent?.includes(userEmail)
    if (!isCurrentUser) return containsEmail
    
    const containsYou = container.textContent?.includes('(You)')
    return containsEmail && containsYou
  })
}

export const findUserCheckbox = (role: UserRole, userEmail: string): HTMLElement | undefined => {
  const checkboxes = screen.getAllByRole('checkbox', { name: new RegExp(role, 'i') })
  return findElementInUserContainer(checkboxes, userEmail)
}

export const findUserSwitch = (userEmail: string, isCurrentUser = false): HTMLElement | undefined => {
  const switches = screen.getAllByRole('switch')
  return findElementInUserContainer(switches, userEmail, isCurrentUser)
}

/**
 * Assertion helpers for better type safety and error messages
 */

export function assertElementExists<T extends HTMLElement>(
  element: T | undefined, 
  description: string
): asserts element is T {
  if (!element) {
    throw new Error(`Expected to find ${description} but it was not found`)
  }
}

export const assertElementCount = (
  elements: HTMLElement[], 
  expectedCount: number, 
  description: string
): void => {
  expect(elements).toHaveLength(expectedCount)
  expect.soft(
    elements.length, 
    `Expected ${expectedCount} ${description} but found ${elements.length}`
  ).toBe(expectedCount)
}

/**
 * Dual-view testing helpers
 */

export const expectElementInBothViews = (text: string, count: number): void => {
  expect(screen.getAllByText(text)).toHaveLength(count * TEST_CONFIG.COUNTS.DUAL_VIEW_MULTIPLIER)
}

export const expectElementsInBothViews = (texts: string[], countPerText: number): void => {
  texts.forEach(text => expectElementInBothViews(text, countPerText))
}

/**
 * Screen size mocking utilities
 */

export const mockScreenSize = (width: number): void => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width
  })
}

export const mockDesktopView = (): void => mockScreenSize(TEST_CONFIG.SCREEN_SIZES.DESKTOP)
export const mockMobileView = (): void => mockScreenSize(TEST_CONFIG.SCREEN_SIZES.MOBILE)

/**
 * Test setup utilities
 */

export const cleanupTestEnvironment = (): void => {
  document.body.innerHTML = ''
  // Reset window properties if needed
  delete (window as any).innerWidth
}

/**
 * Custom matchers and utilities for common test patterns
 */

export const getByRoleWithError = (role: string, options?: any) => {
  try {
    return screen.getByRole(role, options)
  } catch (error) {
    throw new Error(`Failed to find element with role "${role}": ${error}`)
  }
}

export const getAllByRoleWithError = (role: string, options?: any) => {
  try {
    return screen.getAllByRole(role, options)
  } catch (error) {
    throw new Error(`Failed to find elements with role "${role}": ${error}`)
  }
}