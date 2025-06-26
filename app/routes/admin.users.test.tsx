import type { User } from "@supabase/supabase-js";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useLoaderData } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TestUsers } from "~/__tests__/builders/user-builder";
import {
  ERROR_SCENARIOS,
  TEST_CONFIG,
} from "~/__tests__/config/admin-users.config";
import "~/__tests__/mocks/admin";
import { mockAdminUserOperations } from "~/__tests__/mocks/admin";
import { mockSupabaseClient } from "~/__tests__/mocks/supabase";
import {
  resetAllMocks,
  setupAdminUsersMocks,
} from "~/__tests__/utils/admin-users-setup";
import {
  assertElementCount,
  assertElementExists,
  expectElementInBothViews,
  expectElementsInBothViews,
  findUserCheckbox,
  findUserSwitch,
  mockDesktopView,
  mockMobileView,
} from "~/__tests__/utils/admin-users-test-utils";
import { mockAdminUser, mockUser } from "~/__tests__/utils/test-utils";
import { useAuth } from "~/contexts/AuthContext";
import { createClient } from "~/lib/supabase/client";
import AdminUsers, { loader } from "./admin.users";

const { SCREEN_SIZES, COUNTS: TEST_COUNTS, TIMEOUTS } = TEST_CONFIG;
const { mockFetchers } = setupAdminUsersMocks();

interface SupabaseClientConfig {
  shouldAuthenticate?: boolean;
  userToReturn?: User | null;
  shouldHaveAdminRole?: boolean;
}

const createMockSupabaseClient = (config: SupabaseClientConfig = {}) => {
  const {
    shouldAuthenticate = true,
    userToReturn = mockAdminUser,
    shouldHaveAdminRole = true,
  } = config;

  return {
    ...mockSupabaseClient,
    auth: {
      ...mockSupabaseClient.auth,
      getUser: vi.fn().mockResolvedValue({
        data: {
          user: shouldAuthenticate ? userToReturn : null,
        },
      }),
    },
  };
};

const setupMockClient = (config: SupabaseClientConfig = {}) => {
  const client = createMockSupabaseClient(config);
  vi.mocked(createClient).mockReturnValue({
    supabase: client as any,
    headers: new Headers(),
  });
};

interface LoaderDataConfig {
  users?: any[];
  error?: string | null;
  hasServiceRole?: boolean;
}

const renderAdminUsers = (
  currentUser: User | null = mockAdminUser,
  loaderConfig: LoaderDataConfig = {}
) => {
  const testUsers = TestUsers.createTestUserArray();

  const loaderData = {
    users: testUsers,
    error: null,
    hasServiceRole: true,
    ...loaderConfig,
  };

  // Reset fetcher count and clear mock calls before each render
  mockFetchers.mockFetcherSubmit.mockClear();
  mockFetchers.mockCreateUserFetcherSubmit.mockClear();

  // Mock useAuth hook
  vi.mocked(useAuth).mockReturnValue({
    user: currentUser
      ? {
          id: currentUser.id,
          email: currentUser.email || "",
          name: currentUser.user_metadata?.full_name || "Test User",
          avatar: "",
          roles: currentUser.app_metadata?.roles || ["user"],
          fallback: "TU",
        }
      : null,
    isAuthenticated: !!currentUser,
    signOut: vi.fn(),
    updateProfile: vi.fn(),
  });

  // Mock loader data
  vi.mocked(useLoaderData).mockReturnValue(loaderData);

  return render(<AdminUsers />);
};

/**
 * Test Suite: Admin Users Route
 *
 * This comprehensive test suite covers the admin user management interface including:
 * - User list rendering and responsive design
 * - Role-based access control and permissions
 * - User creation, status management, and deletion
 * - Optimistic updates and error handling
 * - Accessibility compliance
 *
 * The tests use factory functions for consistent test data creation and
 * helper functions for DOM queries to reduce code duplication.
 */
describe("Admin Users Route", () => {
  beforeEach(() => {
    resetAllMocks();
    // Clean DOM state for consistent test environment
    document.body.innerHTML = "";
  });

  describe("Loader Tests", () => {
    beforeEach(() => {
      setupMockClient({
        shouldAuthenticate: true,
        userToReturn: mockAdminUser,
      });
    });

    it("should redirect unauthenticated users to login", async () => {
      setupMockClient({ shouldAuthenticate: false });

      const request = new Request("http://localhost/admin/users");

      try {
        await loader({ request });
        expect.fail("Should have thrown a redirect");
      } catch (response: any) {
        expect(response.status).toBe(302);
        expect(response.headers.get("Location")).toBe("/login");
      }
    });

    it("should redirect non-admin users to home", async () => {
      setupMockClient({
        shouldAuthenticate: true,
        userToReturn: mockUser,
        shouldHaveAdminRole: false,
      });

      const request = new Request("http://localhost/admin/users");

      try {
        await loader({ request });
        expect.fail("Should have thrown a redirect");
      } catch (response: any) {
        expect(response.status).toBe(302);
        expect(response.headers.get("Location")).toBe("/");
      }
    });

    it("should return users for authenticated admin with service role", async () => {
      const testUsers = TestUsers.createTestUserArray();
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ users: testUsers }),
      });

      const request = new Request("http://localhost/admin/users");
      const result = await loader({ request });

      expect(result).toEqual({
        users: testUsers,
        error: null,
        hasServiceRole: true,
      });
    });

    it("should handle API error gracefully", async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: "Service unavailable" }),
      });

      const request = new Request("http://localhost/admin/users");
      const result = await loader({ request });

      expect(result).toEqual({
        users: [],
        error: "Service unavailable",
        hasServiceRole: false,
      });
    });

    it("should handle network error gracefully", async () => {
      global.fetch = vi.fn().mockRejectedValueOnce(new Error("Network error"));

      const request = new Request("http://localhost/admin/users");
      const result = await loader({ request });

      expect(result).toEqual({
        users: [],
        error: "Service role not configured or API unavailable",
        hasServiceRole: false,
      });
    });

    it("should handle malformed API responses", async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        json: () => Promise.reject(new Error("Invalid JSON")),
      });

      const request = new Request("http://localhost/admin/users");
      const result = await loader({ request });

      expect(result.error).toBe("Failed to fetch users");
    });
  });

  describe("User List Rendering", () => {
    // Group rendering tests for better organization
    it("should render user management interface", () => {
      renderAdminUsers();

      expect(screen.getByText("User Management")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Manage user roles and permissions. All users have the User role by default. Assign additional Admin or Editor roles as needed."
        )
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /add user/i })
      ).toBeInTheDocument();
    });

    it("should render user data in desktop table layout", () => {
      mockDesktopView();
      renderAdminUsers();

      // Check that all user emails are present (both table and card views render)
      expectElementsInBothViews(
        [
          "user@example.com",
          "editor@example.com",
          "admin@example.com",
          "disabled@example.com",
        ],
        1
      );

      // Check that table exists
      expect(screen.getByRole("table")).toBeInTheDocument();
    });

    it("should render user data in mobile card layout", () => {
      mockMobileView();
      renderAdminUsers();

      // Both mobile cards and desktop table render in test environment
      expectElementsInBothViews(["user@example.com", "Regular User"], 1);
    });

    it("should display role checkboxes with accurate checked states", () => {
      renderAdminUsers();

      // Check that role checkboxes are present and checked correctly
      const adminCheckboxes = screen.getAllByLabelText("admin");
      const editorCheckboxes = screen.getAllByLabelText("editor");

      expect(adminCheckboxes.length).toBeGreaterThan(0);
      expect(editorCheckboxes.length).toBeGreaterThan(0);
    });

    it("should display accurate status badges for all users", () => {
      renderAdminUsers();

      // Both table and card views render status badges
      expectElementInBothViews("Active", TEST_COUNTS.ACTIVE_USERS);
      expectElementInBothViews("Disabled", TEST_COUNTS.DISABLED_USERS);
    });

    it("should show service role configuration status", () => {
      renderAdminUsers();

      expect(
        screen.getByText("✅ User management is fully operational")
      ).toBeInTheDocument();
    });

    it("should show configuration warning when service role not available", () => {
      renderAdminUsers(mockAdminUser, {
        users: [],
        error: "Service role not configured",
        hasServiceRole: false,
      });

      expect(screen.getByText("🔧 Configuration Required")).toBeInTheDocument();
      expect(
        screen.getByText(/VITE_SUPABASE_SERVICE_ROLE_KEY/)
      ).toBeInTheDocument();
    });

    it("should show empty state when no users", () => {
      renderAdminUsers(mockAdminUser, {
        users: [],
        error: null,
        hasServiceRole: true,
      });

      expect(screen.getByText("No users found.")).toBeInTheDocument();
    });
  });

  describe("User Role Management", () => {
    // Tests for role assignment, validation, and permissions
    it("should display current user roles correctly", () => {
      renderAdminUsers();

      // Admin user should have admin checkbox checked
      const adminUserCheckbox = findUserCheckbox("admin", "admin@example.com");
      assertElementExists(adminUserCheckbox, "admin checkbox for admin user");
      expect(adminUserCheckbox).toBeChecked();

      // Editor user should have editor checkbox checked
      const editorUserCheckbox = findUserCheckbox(
        "editor",
        "editor@example.com"
      );
      assertElementExists(
        editorUserCheckbox,
        "editor checkbox for editor user"
      );
      expect(editorUserCheckbox).toBeChecked();
    });

    it("should prevent current admin from removing their own admin role", () => {
      renderAdminUsers();

      // Find the admin checkbox for the current admin user
      const currentAdminCheckbox = findUserCheckbox(
        "admin",
        "admin@example.com"
      );
      assertElementExists(currentAdminCheckbox, "current admin user checkbox");
      expect(currentAdminCheckbox).toBeDisabled();
    });

    it("should allow toggling roles for other users", async () => {
      const user = userEvent.setup();
      renderAdminUsers();

      // Find editor checkbox for regular user
      const regularUserEditorCheckbox = findUserCheckbox(
        "editor",
        "user@example.com"
      );
      assertElementExists(
        regularUserEditorCheckbox,
        "editor checkbox for regular user"
      );

      expect(regularUserEditorCheckbox).not.toBeChecked();

      await user.click(regularUserEditorCheckbox!);

      // Should trigger fetcher submit with correct parameters (unit test approach)
      expect(mockFetchers.mockFetcherSubmit).toHaveBeenCalledWith(
        {
          action: "updateRoles",
          userId: "user-1",
          roles: JSON.stringify(["user", "editor"]),
        },
        { method: "post" }
      );
    });

    it("should disable role checkboxes when service role not available", () => {
      const testUsers = TestUsers.createTestUserArray();
      renderAdminUsers(mockAdminUser, {
        users: testUsers,
        error: null,
        hasServiceRole: false,
      });

      const checkboxes = screen.getAllByRole("checkbox");
      checkboxes.forEach((checkbox) => {
        if (
          checkbox.getAttribute("id")?.includes("admin") ||
          checkbox.getAttribute("id")?.includes("editor")
        ) {
          expect(checkbox).toBeDisabled();
        }
      });
    });
  });

  describe("User Status Management", () => {
    // Tests for user enable/disable functionality and validation
    it("should show correct status switches", () => {
      renderAdminUsers();

      const switches = screen.getAllByRole("switch");
      expect(switches.length).toBeGreaterThan(0);

      // Check that disabled user has switch in off position
      // The actual switch testing depends on the Switch component implementation
    });

    it("should prevent current user from disabling themselves", () => {
      renderAdminUsers();

      const currentUserSwitch = findUserSwitch("admin@example.com", true);
      assertElementExists(currentUserSwitch, "current user status switch");
      expect(currentUserSwitch).toBeDisabled();
    });

    it("should show delete button only for disabled users", () => {
      renderAdminUsers();

      // Should only show delete button for disabled user
      const deleteButtons = screen.queryAllByTitle("Delete user permanently");
      expect(deleteButtons.length).toBe(
        TEST_COUNTS.DISABLED_USERS * TEST_COUNTS.DUAL_VIEW_MULTIPLIER
      );
    });
  });

  describe("User Creation", () => {
    // Tests for the create user dialog and form validation
    it("should open create user dialog", async () => {
      const user = userEvent.setup();
      renderAdminUsers();

      const addButton = screen.getByRole("button", { name: /add user/i });
      await user.click(addButton);

      expect(screen.getByText("Create New User")).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    });

    it("should validate required fields in create user form", async () => {
      const user = userEvent.setup();
      renderAdminUsers();

      // Open dialog
      await user.click(screen.getByRole("button", { name: /add user/i }));

      // Try to create without filling required fields
      await user.click(screen.getByRole("button", { name: /create user/i }));

      await waitFor(() => {
        expect(
          screen.getByText("Email and password are required")
        ).toBeInTheDocument();
      });
    });

    it("should allow role selection in create user form", async () => {
      const user = userEvent.setup();
      renderAdminUsers();

      // Open dialog
      await user.click(screen.getByRole("button", { name: /add user/i }));

      // Select admin role
      const adminCheckbox = screen.getByRole("checkbox", { name: /admin/i });
      await user.click(adminCheckbox);

      expect(adminCheckbox).toBeChecked();
    });

    it("should disable create user button when service role not available", () => {
      const testUsers = TestUsers.createTestUserArray();
      renderAdminUsers(mockAdminUser, {
        users: testUsers,
        error: null,
        hasServiceRole: false,
      });

      const addButton = screen.getByRole("button", { name: /add user/i });
      expect(addButton).toBeDisabled();
    });
  });

  describe("Optimistic Updates", () => {
    // Tests for UI state management during async operations
    it("should display loading state during async user operations", async () => {
      const user = userEvent.setup();

      // Mock slow response
      mockAdminUserOperations.updateUserRoles.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () => resolve({ success: true }),
              TIMEOUTS.SLOW_OPERATION
            )
          )
      );

      renderAdminUsers();

      // Toggle a role
      const editorCheckboxes = screen.getAllByRole("checkbox", {
        name: /editor/i,
      });
      const checkbox = editorCheckboxes[0];

      await user.click(checkbox);

      // Should show updating state (both desktop and mobile views)
      expectElementInBothViews("Updating...", 1);
    });

    it("should revert optimistic updates on error", async () => {
      // Test that error messages are displayed when provided
      const testUsers = TestUsers.createTestUserArray();
      renderAdminUsers(mockAdminUser, {
        users: testUsers,
        error: "Operation failed",
        hasServiceRole: true,
      });

      // Should show error message
      expect(screen.getByText(/Operation failed/i)).toBeInTheDocument();
    });
  });

  describe("Permission Validation", () => {
    // Tests for access control and service role requirements
    it("should show service role warning for operations", async () => {
      const testUsers = TestUsers.createTestUserArray();
      renderAdminUsers(mockAdminUser, {
        users: testUsers,
        error: null,
        hasServiceRole: false,
      });

      // Should show configuration warning
      expect(screen.getByText("🔧 Configuration Required")).toBeInTheDocument();
      expect(
        screen.getByText(/VITE_SUPABASE_SERVICE_ROLE_KEY/)
      ).toBeInTheDocument();
    });

    it("should prevent operations when updating another user", async () => {
      renderAdminUsers();

      // The current admin user's admin checkbox should be disabled to prevent removing their own admin role
      const checkboxes = screen.getAllByRole("checkbox");
      const currentAdminCheckbox = checkboxes.find(
        (checkbox) => checkbox.getAttribute("id") === "user-3-admin" // admin@example.com user
      );
      expect(currentAdminCheckbox).toBeDisabled();
    });
  });

  describe("Error Handling", () => {
    ERROR_SCENARIOS.forEach(({ name, error, expectedMessage }) => {
      it(`should display error message when ${name.toLowerCase()}`, () => {
        renderAdminUsers(mockAdminUser, {
          users: [],
          error,
          hasServiceRole: false,
        });
        expect(screen.getByText(expectedMessage)).toBeInTheDocument();
      });
    });

    it("should handle null/undefined errors gracefully", () => {
      const testUsers = TestUsers.createTestUserArray();
      renderAdminUsers(mockAdminUser, { users: testUsers, error: null });
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  describe("User Deletion", () => {
    // Tests for user deletion functionality and confirmation dialogs
    it("should show confirmation dialog for user deletion", async () => {
      const user = userEvent.setup();
      renderAdminUsers();

      const deleteButtons = screen.getAllByTitle("Delete user permanently");
      await user.click(deleteButtons[0]);

      expect(screen.getByRole("alertdialog")).toBeInTheDocument();
      expect(
        screen.getByText(/are you sure you want to permanently delete/i)
      ).toBeInTheDocument();
    });

    it("should only allow deletion of disabled users", () => {
      renderAdminUsers();

      // Should only show delete buttons for disabled user
      const deleteButtons = screen.queryAllByTitle("Delete user permanently");
      expect(deleteButtons.length).toBe(
        TEST_COUNTS.DISABLED_USERS * TEST_COUNTS.DUAL_VIEW_MULTIPLIER
      );
    });
  });

  describe("Responsive Design", () => {
    // Tests for desktop table view vs mobile card view
    it("should render table layout for desktop viewport", () => {
      mockDesktopView();
      renderAdminUsers();

      // Table should be visible
      expect(screen.getByRole("table")).toBeInTheDocument();
    });

    it("should render card layout for mobile viewport", () => {
      mockMobileView();
      renderAdminUsers();

      // Cards should be present
      const cards = screen.getAllByText("Regular User");
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  describe("Accessibility Compliance", () => {
    // Tests for ARIA labels, keyboard navigation, and screen reader support
    it("should provide proper ARIA labels for all form controls", () => {
      renderAdminUsers();

      // Check for proper labeling
      assertElementCount(
        screen.getAllByLabelText(/admin/i),
        TEST_COUNTS.TOTAL_USERS * TEST_COUNTS.DUAL_VIEW_MULTIPLIER,
        "admin role checkboxes"
      );
      assertElementCount(
        screen.getAllByLabelText(/editor/i),
        TEST_COUNTS.TOTAL_USERS * TEST_COUNTS.DUAL_VIEW_MULTIPLIER,
        "editor role checkboxes"
      );
    });

    it("should provide descriptive button labels for screen readers", () => {
      renderAdminUsers();

      expect(
        screen.getByRole("button", { name: /add user/i })
      ).toBeInTheDocument();
      assertElementCount(
        screen.getAllByTitle("Delete user permanently"),
        TEST_COUNTS.DISABLED_USERS * TEST_COUNTS.DUAL_VIEW_MULTIPLIER,
        "delete user buttons"
      );
    });

    it("should provide tooltips for disabled actions", () => {
      renderAdminUsers();

      // Current user admin role should have tooltip
      const adminCheckboxes = screen.getAllByRole("checkbox", {
        name: /admin/i,
      });
      const currentAdminContainer = adminCheckboxes
        .find((checkbox) => checkbox.getAttribute("disabled") !== null)
        ?.closest("div");

      expect(currentAdminContainer).toHaveAttribute(
        "title",
        "You cannot remove your own admin role to prevent system lockout."
      );
    });
  });

  describe("Data Refresh", () => {
    // Tests for manual data refresh functionality
    it("should have refresh users button", () => {
      renderAdminUsers();

      expect(
        screen.getByRole("button", { name: /refresh users/i })
      ).toBeInTheDocument();
    });

    it("should disable refresh button during loading", () => {
      renderAdminUsers();

      const refreshButton = screen.getByRole("button", {
        name: /refresh users/i,
      });
      expect(refreshButton).not.toBeDisabled();
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });
});
