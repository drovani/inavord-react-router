import { adminUserOperations } from "~/lib/supabase/admin";
import { createClient } from "~/lib/supabase/client";

export async function loader({ request }: { request: Request }) {
  try {
    // Verify the user is authenticated and has admin role
    const { supabase } = createClient(request);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { 
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
    }

    // Check if user has admin role
    const userMetadata = user.app_metadata || {};
    const userRoles = userMetadata.roles || ['user'];
    
    if (!userRoles.includes('admin')) {
      return new Response(JSON.stringify({ error: "Forbidden - Admin access required" }), { 
      status: 403,
      headers: { "Content-Type": "application/json" }
    });
    }

    // Fetch all users
    const users = await adminUserOperations.getAllUsers();
    
    return new Response(JSON.stringify({ 
      success: true, 
      users: users.map(user => ({
        id: user.id,
        email: user.email,
        user_metadata: user.user_metadata,
        app_metadata: user.app_metadata,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        banned_until: (user as any).banned_until
      }))
    }), {
      headers: { "Content-Type": "application/json" }
    });
    
  } catch (error) {
    console.error('Admin users API error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Internal server error" 
    }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function action({ request }: { request: Request }) {
  try {
    // Verify the user is authenticated and has admin role
    const { supabase } = createClient(request);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { 
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
    }

    // Check if user has admin role
    const userMetadata = user.app_metadata || {};
    const userRoles = userMetadata.roles || ['user'];
    
    if (!userRoles.includes('admin')) {
      return new Response(JSON.stringify({ error: "Forbidden - Admin access required" }), { 
      status: 403,
      headers: { "Content-Type": "application/json" }
    });
    }

    const formData = await request.formData();
    const action = formData.get("action") as string;
    const userId = formData.get("userId") as string;

    if (!action || !userId) {
      return new Response(JSON.stringify({ error: "Missing required parameters" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    switch (action) {
      case "updateRoles": {
        const rolesString = formData.get("roles") as string;
        if (!rolesString) {
          return new Response(JSON.stringify({ error: "Missing roles parameter" }), { 
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }
        
        const roles = JSON.parse(rolesString);
        if (!Array.isArray(roles)) {
          return new Response(JSON.stringify({ error: "Roles must be an array" }), { 
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }

        const updatedUser = await adminUserOperations.updateUserRoles(userId, roles);
        
        return new Response(JSON.stringify({ 
          success: true, 
          message: "User roles updated successfully",
          user: {
            id: updatedUser.id,
            email: updatedUser.email,
            user_metadata: updatedUser.user_metadata,
            app_metadata: updatedUser.app_metadata
          }
        }), {
          headers: { "Content-Type": "application/json" }
        });
      }

      case "disableUser": {
        // Prevent admin from disabling themselves
        if (userId === user.id) {
          return new Response(JSON.stringify({ error: "You cannot disable your own account" }), { 
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }

        const updatedUser = await adminUserOperations.disableUser(userId);
        
        return new Response(JSON.stringify({ 
          success: true, 
          message: "User disabled successfully",
          user: {
            id: updatedUser.id,
            email: updatedUser.email,
            banned_until: (updatedUser as any).banned_until
          }
        }), {
          headers: { "Content-Type": "application/json" }
        });
      }

      case "enableUser": {
        const updatedUser = await adminUserOperations.enableUser(userId);
        
        return new Response(JSON.stringify({ 
          success: true, 
          message: "User enabled successfully",
          user: {
            id: updatedUser.id,
            email: updatedUser.email,
            banned_until: (updatedUser as any).banned_until
          }
        }), {
          headers: { "Content-Type": "application/json" }
        });
      }

      default:
        return new Response(JSON.stringify({ error: "Invalid action" }), { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
    }
    
  } catch (error) {
    console.error('Admin users action error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Internal server error" 
    }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}