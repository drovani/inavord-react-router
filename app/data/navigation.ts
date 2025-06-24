import {
  PresentationIcon,
  UsersIcon
} from "lucide-react";

interface NavigationItem {
  name: string;
  icon: React.ComponentType<any>;
  href?: string;
  children?: NavigationItem[];
  reloadDocument?: boolean;
  roles?: string[];
}

export const navigation: NavigationItem[] = [
  {
    name: "Admin Setup",
    icon: PresentationIcon,
    href: "/admin/setup",
    roles: ["admin"],
  },
  {
    name: "User Management",
    icon: UsersIcon,
    href: "/admin/users",
    roles: ["admin"],
  },
] as const;
