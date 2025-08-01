import { DatabaseZapIcon, UsersIcon, BarChart3Icon } from "lucide-react";

interface NavigationGroup {
  name: string;
  icon?: React.ComponentType<any>;
  items: NavigationItem[];
  roles?: string[];
}

interface NavigationItem {
  name: string;
  icon: React.ComponentType<any>;
  href?: string;
  children?: NavigationItem[];
  reloadDocument?: boolean;
}

export const navigation: NavigationGroup[] = [
  {
    name: "Administration",
    roles: ["admin"],
    items: [
      {
        name: "Data Setup",
        icon: DatabaseZapIcon,
        href: "/admin/setup",
      },
      {
        name: "User Management",
        icon: UsersIcon,
        href: "/admin/users",
      },
      {
        name: "Test Coverage",
        icon: BarChart3Icon,
        href: "/admin/test-coverage",
      },
    ],
  },
] as const;
