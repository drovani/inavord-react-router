import netlifyIdentity, { type User } from "netlify-identity-widget";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

interface AuthContextType {
  user: {
    id: string;
    email: string;
    fullName?: string;
    roles: string[];
  } | null;
  isAuthenticated: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Initialize Netlify Identity
netlifyIdentity.on("init", (_user) => {
  if (process.env.NODE_ENV === "development") {
    console.log("Netlify Identity initialized");
  }
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => netlifyIdentity.currentUser() ?? null);

  // Set up Netlify Identity event listeners
  useEffect(() => {
    netlifyIdentity.on("login", (user) => setUser(user));
    netlifyIdentity.on("logout", () => setUser(null));
    netlifyIdentity.on("error", (err) => console.error("Netlify Identity Error:", err));

    // Initialize the widget
    netlifyIdentity.init();

    return () => {
      netlifyIdentity.off("login");
      netlifyIdentity.off("logout");
      netlifyIdentity.off("error");
    };
  }, []);

  // Transform Netlify user data into our simplified user object
  const transformedUser = useMemo(() => {
    if (!user) return null;

    return {
      id: user.id,
      email: user.email || "anonymousshroom@example.com",
      name: user.user_metadata?.full_name || "Anonymous Shroom",
      roles: user.app_metadata?.roles || [],
      fallback:
        user?.user_metadata?.full_name
          ?.split(" ")
          .map((n) => n[0])
          .join("") || "AS",
      avatar: user.user_metadata?.avatar_url || "/images/heroes/mushy-and-shroom.png",
    };
  }, [user]);

  // Authentication methods
  const signIn = useCallback(async () => {
    netlifyIdentity.open("login");
    return new Promise<void>((resolve) => {
      netlifyIdentity.on("login", () => {
        netlifyIdentity.close();
        window.location.reload();
        resolve();
      });
    });
  }, []);

  const signOut = useCallback(async () => {
    netlifyIdentity.logout();
    return new Promise<void>((resolve) => {
      netlifyIdentity.on("logout", () => {
        window.location.reload();
        resolve();
      });
    });
  }, []);

  const value = useMemo(
    () => ({
      user: transformedUser,
      isAuthenticated: !!user,
      signIn,
      signOut,
    }),
    [transformedUser, user, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
