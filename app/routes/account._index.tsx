import { useAuth } from "~/contexts/AuthContext";
import type { Route } from "./+types/account._index";

export const loader = async (_: Route.LoaderArgs) => {
  return {};
};

export const action = async (_: Route.ActionArgs) => {
  return {};
};

export const meta = (_: Route.MetaArgs) => {
  return [{ title: "Account" }];
};

export default function AccountIndex({ loaderData }: Route.ComponentProps) {
  const { user } = useAuth();

  return (
    <div>
      <h1>{user?.name}</h1>
      <h2>{user?.email}</h2>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
