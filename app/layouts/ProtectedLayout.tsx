import { Outlet } from "react-router";
import { useNetlifyAuth } from "~/hooks/useNetlifyAuth";
import { Button } from "../components/ui/button";

export default function ProtectedLayout({ roles = [] }: { roles?: string[] }) {
  const { isAuthenticated, user, authenticate } = useNetlifyAuth();
  const hasRole = roles.length === 0 || user?.app_metadata.roles.some((role) => roles?.includes(role));

  if (isAuthenticated && hasRole) {
    return <Outlet />;
  } else {
    return <Button onClick={() => authenticate((_) => window.location.reload())}>Sign in</Button>;
  }
}
