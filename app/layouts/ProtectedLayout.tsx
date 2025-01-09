import { Outlet } from "react-router";
import { useAuth } from "~/contexts/AuthContext";
import { Button } from "../components/ui/button";

export default function ProtectedLayout({ roles = [] }: { roles?: string[] }) {
  const { isAuthenticated, user, signIn } = useAuth();
  const hasRole = roles.length === 0 || user?.roles.some((role) => roles?.includes(role));

  if (isAuthenticated && hasRole) {
    return <Outlet />;
  } else {
    return <Button onClick={signIn}>Sign in</Button>;
  }
}
