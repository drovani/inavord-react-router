import { index, layout, prefix, route, type RouteConfig } from "@react-router/dev/routes";
import log from "loglevel";
log.enableAll();

export default [
  index("./routes/_index.tsx"),
  route("auth/confirm", "./routes/auth.confirm.tsx"),
  route("auth/error", "./routes/auth.error.tsx"),
  route("login", "./routes/login.tsx"),
  route("logout", "./routes/logout.tsx"),
  route("forgot-password", "./routes/forgot-password.tsx"),
  route("update-password", "./routes/update-password.tsx"),
  route("sign-up", "./routes/sign-up.tsx"),
  route("api/admin/users", "./routes/api.admin.users.tsx"),
  ...prefix("admin", [
    layout("./layouts/ProtectedAdminLayout.tsx", [
      route("setup", "./routes/admin.setup.tsx"),
      route("users", "./routes/admin.users.tsx"),
      route("test-coverage", "./routes/admin.test-coverage.tsx"),
      route("/*", "./routes/admin.tsx"),
    ]),
  ]),
  layout("./layouts/ProtectedUserLayout.tsx", [
    route("account", "./routes/account.tsx", [index("./routes/account._index.tsx")]),
  ]),
] satisfies RouteConfig;
