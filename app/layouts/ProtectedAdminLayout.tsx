import ProtectedLayout from "~/layouts/ProtectedLayout";

export default function ProtectedAdminLayout() {
  return ProtectedLayout({ roles: ["admin"] });
}
