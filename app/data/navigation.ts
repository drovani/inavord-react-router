import {
  DropletIcon,
  FileJson2Icon,
  MapIcon,
  PresentationIcon,
  ShieldIcon,
  ShoppingBagIcon,
  SwordIcon,
  UsersIcon
} from "lucide-react";

export const navigation = [
  {
    name: "Heroes",
    icon: UsersIcon,
    href: "/heroes",
    children: [
      {
        name: "Export as JSON",
        href: "/heroes.json",
        icon: FileJson2Icon,
        reloadDocument: true,
      },
    ],
  },
  { name: "Titans", icon: SwordIcon, href: "/titans" },
  {
    name: "Equipment",
    icon: ShieldIcon,
    href: "/equipment",
    children: [
      {
        name: "Export as JSON",
        href: "/equipment.json",
        icon: FileJson2Icon,
        reloadDocument: true,
      },
    ],
  },
  {
    name: "Missions",
    icon: MapIcon,
    href: "/missions",
    children: [
      {
        name: "Export as JSON",
        href: "/missions.json",
        icon: FileJson2Icon,
        reloadDocument: true,
      },
    ],
  },
  { name: "Merchant", icon: ShoppingBagIcon },
  { name: "Hydras", icon: DropletIcon },
  {
    name: "Admin Setup",
    icon: PresentationIcon,
    href: "/admin/setup",
    roles: ["admin"],
  },
] as const;
