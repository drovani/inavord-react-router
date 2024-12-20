import {
    DropletIcon,
    FileJson2Icon,
    FileWarningIcon,
    MapIcon,
    PresentationIcon,
    ShieldAlertIcon,
    ShieldIcon,
    ShieldPlusIcon,
    ShoppingBagIcon,
    StoreIcon,
    SwordIcon,
    UsersIcon,
} from "lucide-react";

export const navigation = [
  { name: "Heroes", icon: UsersIcon },
  { name: "Titans", icon: SwordIcon },
  {
    name: "Equipment",
    icon: ShieldIcon,
    href: "/equipment",
    children: [
      {
        name: "Add new",
        href: "/equipment/new",
        icon: ShieldPlusIcon,
      },
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
    children: [
      {
        name: "Force reload equipment records",
        href: "/admin/setup?mode=force&data=equipment",
        icon: ShieldAlertIcon,
      },
      {
        name: "Force reload all records",
        href: "/admin/setup?mode=force",
        icon: FileWarningIcon,
      },
      {
        name: "Parse Store Data",
        href: "/admin/parse",
        icon: StoreIcon,
      },
    ],
  },
] as const;
