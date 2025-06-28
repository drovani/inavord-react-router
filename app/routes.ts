import { index, layout, prefix, route, type RouteConfig } from "@react-router/dev/routes";
import log from "loglevel";
log.enableAll();

export default [
  index("./routes/views/public/index.tsx"),
  route("auth/confirm", "./routes/views/auth/confirm.tsx"),
  route("auth/error", "./routes/views/auth/error.tsx"),
  route("login", "./routes/views/auth/login.tsx"),
  route("logout", "./routes/views/public/logout.tsx"),
  route("forgot-password", "./routes/views/auth/forgot-password.tsx"),
  route("update-password", "./routes/views/auth/update-password.tsx"),
  route("sign-up", "./routes/views/auth/sign-up.tsx"),
  route("api/admin/users", "./routes/resources/api/admin/users.tsx"),
  ...prefix("admin", [
    layout("./layouts/ProtectedAdminLayout.tsx", [
      route("setup", "./routes/views/admin/setup.tsx"),
      route("users", "./routes/views/admin/users.tsx"),
      route("test-coverage", "./routes/views/admin/test-coverage.tsx"),
      route("/*", "./routes/views/admin/index.tsx"),
    ]),
  ]),
  layout("./layouts/ProtectedUserLayout.tsx", [
    route("account", "./routes/views/account/index.tsx", [index("./routes/views/account/profile.tsx")]),
  ]),
  route("protected", "./routes/views/public/protected.tsx"),
] satisfies RouteConfig;
