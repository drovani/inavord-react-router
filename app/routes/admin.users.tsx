import { UserRoundCheckIcon, UserRoundMinusIcon, UserRoundXIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { redirect, useFetcher, useLoaderData, useRevalidator } from "react-router";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "~/components/ui/alert-dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { formatTitle } from "~/config/site";
import { useAuth } from "~/contexts/AuthContext";
import { ASSIGNABLE_ROLES } from "~/lib/supabase/admin";
import { createClient } from "~/lib/supabase/client";

export const loader = async ({ request }: { request: Request }) => {
  const { supabase } = createClient(request);

  // Check if user is authenticated and has admin role
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw redirect("/login");
  }

  const userMetadata = user.app_metadata || {};
  const userRoles = userMetadata.roles || ['user'];

  if (!userRoles.includes('admin')) {
    throw redirect("/");
  }

  // Fetch users from API endpoint
  try {
    const apiUrl = new URL('/api/admin/users', request.url);
    const response = await fetch(apiUrl, {
      headers: {
        'Cookie': request.headers.get('Cookie') || ''
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to fetch users' }));
      return {
        users: [],
        error: errorData.error || 'Failed to fetch users',
        hasServiceRole: false
      };
    }

    const data = await response.json();
    return {
      users: data.users || [],
      error: null,
      hasServiceRole: true
    };
  } catch (error) {
    return {
      users: [],
      error: 'Service role not configured or API unavailable',
      hasServiceRole: false
    };
  }
};

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const action = formData.get("action");

  if (action === "updateRoles" || action === "createUser" || action === "disableUser" || action === "enableUser" || action === "deleteUser") {
    try {
      const apiUrl = new URL('/api/admin/users', request.url);
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Cookie': request.headers.get('Cookie') || ''
        },
        body: formData
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: `Failed to ${action}`
      };
    }
  }

  return { success: false, error: "Invalid action" };
};

export const meta = () => {
  return [{ title: formatTitle('User Management - Admin') }];
};

interface UserData {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    name?: string;
  };
  app_metadata: {
    roles?: string[];
  };
  banned_until?: string | null;
}


export default function AdminUsers() {
  const { users, error, hasServiceRole } = useLoaderData() as {
    users: UserData[];
    error: string | null;
    hasServiceRole: boolean;
  };
  const { user: currentUser } = useAuth();
  const fetcher = useFetcher();
  const createUserFetcher = useFetcher();
  const revalidator = useRevalidator();
  const [message, setMessage] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createUserForm, setCreateUserForm] = useState({
    email: '',
    password: '',
    fullName: '',
    roles: [] as string[]
  });
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [optimisticUserStates, setOptimisticUserStates] = useState<Record<string, { disabled?: boolean; roles?: string[]; deleted?: boolean }>>({});
  const [isRevalidating, setIsRevalidating] = useState(false);

  // Handle fetcher results
  useEffect(() => {
    if (fetcher.data) {
      if (!fetcher.data.success) {
        setMessage(fetcher.data.error || "Operation failed");
        // Revert optimistic update on error
        setOptimisticUserStates(prev => {
          if (updatingUserId) {
            const { [updatingUserId]: removed, ...rest } = prev;
            return rest;
          }
          return prev;
        });
      } else if (fetcher.data.success && fetcher.data.message?.includes("deleted")) {
        // For successful deletion, keep optimistic state until revalidation completes
        if (!isRevalidating) {
          setIsRevalidating(true);
          revalidator.revalidate();
        }
      }
      setUpdatingUserId(null); // Clear updating state
    }
  }, [fetcher.data, updatingUserId, revalidator]);

  // Clear updating state when fetcher becomes idle
  useEffect(() => {
    if (fetcher.state === "idle") {
      setUpdatingUserId(null);
    }
  }, [fetcher.state]);

  // Clear revalidating flag and optimistic states when revalidator is done
  useEffect(() => {
    if (revalidator.state === "idle" && isRevalidating) {
      setIsRevalidating(false);
      setOptimisticUserStates({});
    }
  }, [revalidator.state, isRevalidating]);

  // Handle create user results
  useEffect(() => {
    if (createUserFetcher.data) {
      if (createUserFetcher.data.success) {
        setIsCreateDialogOpen(false);
        setCreateUserForm({ email: '', password: '', fullName: '', roles: [] });
        // Refresh data without full page reload
        revalidator.revalidate();
      } else {
        setMessage(createUserFetcher.data.error || "Failed to create user");
      }
    }
  }, [createUserFetcher.data]);

  const handleRoleChange = (userId: string, roles: string[]) => {
    if (!hasServiceRole) {
      setMessage("Service role not configured. Please add VITE_SUPABASE_SERVICE_ROLE_KEY to your environment variables.");
      return;
    }

    setUpdatingUserId(userId);
    // Optimistically update roles
    setOptimisticUserStates(prev => ({
      ...prev,
      [userId]: { ...prev[userId], roles }
    }));

    fetcher.submit(
      {
        action: "updateRoles",
        userId,
        roles: JSON.stringify(roles)
      },
      { method: "post" }
    );
  };

  const toggleRole = (userId: string, role: string, currentRoles: string[]) => {
    const hasRole = currentRoles.includes(role);
    let newRoles: string[];

    if (hasRole) {
      newRoles = currentRoles.filter(r => r !== role);
      // Ensure at least 'user' role remains
      if (newRoles.length === 0) {
        newRoles = ['user'];
      }
    } else {
      newRoles = [...currentRoles, role];
    }

    handleRoleChange(userId, newRoles);
  };

  const handleUserStatusChange = (userId: string, isEnabled: boolean) => {
    if (!hasServiceRole) {
      setMessage("Service role not configured. Please add VITE_SUPABASE_SERVICE_ROLE_KEY to your environment variables.");
      return;
    }

    const action = isEnabled ? "enableUser" : "disableUser";
    setUpdatingUserId(userId);

    // Optimistically update status
    setOptimisticUserStates(prev => ({
      ...prev,
      [userId]: { ...prev[userId], disabled: !isEnabled }
    }));

    fetcher.submit(
      {
        action,
        userId
      },
      { method: "post" }
    );
  };

  const handleDeleteUser = (userId: string) => {
    if (!hasServiceRole) {
      setMessage("Service role not configured. Please add VITE_SUPABASE_SERVICE_ROLE_KEY to your environment variables.");
      return;
    }

    setUpdatingUserId(userId);

    // Optimistically remove user from list
    setOptimisticUserStates(prev => ({
      ...prev,
      [userId]: { ...prev[userId], deleted: true }
    }));

    fetcher.submit(
      {
        action: "deleteUser",
        userId
      },
      { method: "post" }
    );
  };


  const handleCreateUser = () => {
    if (!createUserForm.email || !createUserForm.password) {
      setMessage("Email and password are required");
      return;
    }

    createUserFetcher.submit(
      {
        action: "createUser",
        email: createUserForm.email,
        password: createUserForm.password,
        fullName: createUserForm.fullName,
        roles: JSON.stringify(createUserForm.roles)
      },
      { method: "post" }
    );
  };

  const handleCreateRoleToggle = (role: string) => {
    setCreateUserForm(prev => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role]
    }));
  };

  const getDisplayName = (user: UserData) => {
    return user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      "Anonymous User";
  };

  const getUserRoles = (user: UserData) => {
    // Use optimistic state if available, otherwise use server data
    const optimisticState = optimisticUserStates[user.id];
    if (optimisticState?.roles) {
      return optimisticState.roles;
    }
    return user.app_metadata?.roles || ['user'];
  };

  const isUserDisabledOptimistic = (user: UserData) => {
    // Use optimistic state if available, otherwise use server data
    const optimisticState = optimisticUserStates[user.id];
    if (optimisticState?.disabled !== undefined) {
      return optimisticState.disabled;
    }
    return user.banned_until && new Date(user.banned_until) > new Date();
  };

  // Set initial message based on configuration status
  useEffect(() => {
    if (error && !message) {
      setMessage(error);
    }
  }, [error, message]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage user roles and permissions. All users have the User role by default. Assign additional Admin or Editor roles as needed.
              </CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button disabled={!hasServiceRole || createUserFetcher.state === "submitting"}>
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                  <DialogDescription>
                    Add a new user to the system. They will receive login credentials via email.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={createUserForm.email}
                      onChange={(e) => setCreateUserForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="user@example.com"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={createUserForm.password}
                      onChange={(e) => setCreateUserForm(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter password"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={createUserForm.fullName}
                      onChange={(e) => setCreateUserForm(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Additional Roles</Label>
                    <div className="flex gap-3 flex-wrap">
                      {ASSIGNABLE_ROLES.map((role) => (
                        <div key={role} className="flex items-center space-x-2">
                          <Checkbox
                            id={`create-${role}`}
                            checked={createUserForm.roles.includes(role)}
                            onCheckedChange={() => handleCreateRoleToggle(role)}
                          />
                          <label
                            htmlFor={`create-${role}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                          >
                            {role}
                          </label>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      User role is automatically assigned to all users.
                    </p>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateUser}
                    disabled={createUserFetcher.state === "submitting"}
                  >
                    {createUserFetcher.state === "submitting" ? "Creating..." : "Create User"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {message && (
            <div className={`mb-4 p-3 rounded border break-words overflow-wrap-anywhere ${hasServiceRole
              ? message.includes("success")
                ? "bg-green-100 text-green-800 border-green-300"
                : "bg-red-100 text-red-800 border-red-300"
              : "bg-yellow-100 text-yellow-800 border-yellow-300"
              }`}>
              {!hasServiceRole && <strong>Configuration Required:</strong>}
              <span className="block sm:inline">{message}</span>
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Display Name</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Enabled</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.filter(user => !optimisticUserStates[user.id]?.deleted).map((user) => {
                const currentRoles = getUserRoles(user);
                const isDisabled = isUserDisabledOptimistic(user);
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>{getDisplayName(user)}</TableCell>

                    <TableCell>
                      <div className="flex gap-3 flex-wrap">
                        {ASSIGNABLE_ROLES.map((role) => {
                          const isCurrentUserAdminRole = user.id === currentUser?.id && role === 'admin' && currentRoles.includes('admin');
                          return (
                            <div key={role} className="flex items-center space-x-2" title={isCurrentUserAdminRole ? "You cannot remove your own admin role to prevent system lockout." : ""}>
                              <Checkbox
                                id={`${user.id}-${role}`}
                                checked={currentRoles.includes(role)}
                                onCheckedChange={() => toggleRole(user.id, role, currentRoles)}
                                disabled={!hasServiceRole || updatingUserId === user.id || isCurrentUserAdminRole}
                              />
                              <label
                                htmlFor={`${user.id}-${role}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                              >
                                {role}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={!isUserDisabledOptimistic(user)}
                        onCheckedChange={(checked) => handleUserStatusChange(user.id, checked)}
                        disabled={!hasServiceRole || updatingUserId === user.id || user.id === currentUser?.id}
                        checkedIcon={<UserRoundCheckIcon className="size-4 text-green-900" />}
                        uncheckedIcon={<UserRoundMinusIcon className="size-4 text-red-900" />}
                      />
                      {isDisabled && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 ml-2"
                              disabled={!hasServiceRole || updatingUserId === user.id}
                              title="Delete user permanently"
                            >
                              <UserRoundXIcon className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete User</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to permanently delete the user "{user.email}"? This action cannot be undone and will remove all user data from the system.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteUser(user.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete User
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </TableCell>
                    <TableCell className="w-32">
                      {updatingUserId === user.id ? (
                        <div className="flex items-center w-full">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                          <span className="text-sm">Updating...</span>
                        </div>
                      ) : !hasServiceRole ? (
                        <span className="text-sm text-gray-500">Service role required</span>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Badge variant={isUserDisabledOptimistic(user) ? "destructive" : "default"}>
                            {isUserDisabledOptimistic(user) ? "Disabled" : "Active"}
                          </Badge>
                          {user.id === currentUser?.id && (
                            <span className="text-xs text-gray-500" title="You cannot disable your own account">
                              (You)
                            </span>
                          )}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {(!users || users.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              <p>No users found.</p>
              <p className="text-xs mt-2">
                Debug: users={users ? 'array' : 'null'}, length={users?.length || 0}, hasServiceRole={hasServiceRole ? 'true' : 'false'}
              </p>
            </div>
          )}

          <div className="mt-4 pt-4 border-t">
            {hasServiceRole ? (
              <div className="flex justify-between items-center">
                <p className="text-sm text-green-600">
                  ✅ User management is fully operational
                </p>
                <Button
                  onClick={() => revalidator.revalidate()}
                  variant="outline"
                  disabled={fetcher.state === "submitting" || revalidator.state === "loading"}
                >
                  {revalidator.state === "loading" ? "Refreshing..." : "Refresh Users"}
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-yellow-800 font-medium">
                  🔧 Configuration Required
                </p>
                <p className="text-sm text-gray-600">
                  Add <code className="bg-gray-100 px-1 rounded">VITE_SUPABASE_SERVICE_ROLE_KEY</code> to your environment variables to enable full user management.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}