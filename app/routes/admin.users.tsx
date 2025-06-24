import { useEffect, useState } from "react";
import { useAuth } from "~/contexts/AuthContext";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Checkbox } from "~/components/ui/checkbox";
import { Switch } from "~/components/ui/switch";
import { redirect, useFetcher, useLoaderData } from "react-router";
import { createClient } from "~/lib/supabase/client";
import { ASSIGNABLE_ROLES } from "~/lib/supabase/admin";

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
  
  if (action === "updateRoles") {
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
        error: 'Failed to update user roles' 
      };
    }
  }
  
  return { success: false, error: "Invalid action" };
};

export const meta = () => {
  return [{ title: "User Management - Admin" }];
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
  const [message, setMessage] = useState("");

  // Handle fetcher results
  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.success) {
        setMessage(fetcher.data.message || "Operation completed successfully");
      } else {
        setMessage(fetcher.data.error || "Operation failed");
      }
    }
  }, [fetcher.data]);

  const handleRoleChange = (userId: string, roles: string[]) => {
    if (!hasServiceRole) {
      setMessage("Service role not configured. Please add SUPABASE_SERVICE_ROLE_KEY to your environment variables.");
      return;
    }

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
      setMessage("Service role not configured. Please add SUPABASE_SERVICE_ROLE_KEY to your environment variables.");
      return;
    }

    const action = isEnabled ? "enableUser" : "disableUser";
    
    fetcher.submit(
      {
        action,
        userId
      },
      { method: "post" }
    );
  };

  const isUserDisabled = (user: UserData) => {
    return user.banned_until && new Date(user.banned_until) > new Date();
  };

  const getDisplayName = (user: UserData) => {
    return user.user_metadata?.full_name || 
           user.user_metadata?.name || 
           "Anonymous User";
  };

  const getUserRoles = (user: UserData) => {
    return user.app_metadata?.roles || ['user'];
  };

  // Set initial message based on configuration status
  useEffect(() => {
    if (error && !message) {
      setMessage(error);
    }
  }, [error, message]);

  // Debug logging
  useEffect(() => {
    console.log('Admin Users Debug:', {
      users,
      error,
      hasServiceRole,
      usersLength: users?.length || 0
    });
  }, [users, error, hasServiceRole]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            Manage user roles and permissions. All users have the User role by default. Assign additional Admin or Editor roles as needed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {message && (
            <div className={`mb-4 p-3 rounded border break-words overflow-wrap-anywhere ${
              hasServiceRole
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
                <TableHead>Status</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const currentRoles = getUserRoles(user);
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>{getDisplayName(user)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={!isUserDisabled(user)}
                          onCheckedChange={(checked) => handleUserStatusChange(user.id, checked)}
                          disabled={!hasServiceRole || fetcher.state === "submitting" || user.id === currentUser?.id}
                        />
                        <Badge variant={isUserDisabled(user) ? "destructive" : "default"}>
                          {isUserDisabled(user) ? "Disabled" : "Active"}
                        </Badge>
                        {user.id === currentUser?.id && (
                          <span className="text-xs text-gray-500" title="You cannot disable your own account">
                            (You)
                          </span>
                        )}
                      </div>
                    </TableCell>
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
                                disabled={!hasServiceRole || fetcher.state === "submitting" || isCurrentUserAdminRole}
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
                    <TableCell className="w-32">
                      {fetcher.state === "submitting" ? (
                        <div className="flex items-center w-full">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                          <span className="text-sm">Updating...</span>
                        </div>
                      ) : !hasServiceRole ? (
                        <span className="text-sm text-gray-500">Service role required</span>
                      ) : (
                        <span className="text-sm text-green-600">Ready</span>
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
                  onClick={() => window.location.reload()} 
                  variant="outline"
                  disabled={fetcher.state === "submitting"}
                >
                  Refresh Users
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-yellow-800 font-medium">
                  🔧 Configuration Required
                </p>
                <p className="text-sm text-gray-600">
                  Add <code className="bg-gray-100 px-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code> to your environment variables to enable full user management.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}