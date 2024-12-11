import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import {
    DropletIcon,
    FileJson2Icon,
    FileWarningIcon,
    LoaderCircle,
    MapIcon,
    MoreHorizontalIcon,
    PresentationIcon,
    ShieldAlertIcon,
    ShieldIcon,
    ShieldPlusIcon,
    ShoppingBagIcon,
    SwordIcon,
    UsersIcon
} from "lucide-react";
import type React from "react";
import { Link, NavLink } from "react-router";
import { cn } from "~/lib/utils";
import { SiteSwitcher } from "./SiteSwitcher";
import { SiteUser } from "./SiteUser";
import { DropdownMenuContent } from "./ui/dropdown-menu";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar,
} from "./ui/sidebar";
const navigation = [
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
    ],
  },
];
export function SiteSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isMobile } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SiteSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Hero Wars Helper Tools</SidebarGroupLabel>
          <SidebarMenu>
            {navigation.map((item) => (
              <SidebarMenuItem key={item.name} className="">
                <SidebarMenuButton asChild>
                  {item.href ? (
                    <NavLink to={item.href} viewTransition>
                      {({ isPending, isActive }) => (
                        <>
                          <item.icon className={cn("inline", isActive && "fill-green-300")} />
                          <span>{item.name}</span>
                          {isPending && <LoaderCircle className="animate-spin" />}
                        </>
                      )}
                    </NavLink>
                  ) : (
                    <div className="flex gap-2 items-center opacity-50 cursor-default" title="Coming soon">
                      <item.icon className="inline" />
                      <span>{item.name}</span>
                    </div>
                  )}
                </SidebarMenuButton>
                {item.children && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover>
                        <MoreHorizontalIcon />
                        <span className="sr-only">More</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-48 rounded-lg p-2"
                      side={isMobile ? "bottom" : "right"}
                      align={isMobile ? "end" : "start"}
                    >
                      {item.children.map((subnav) => (
                        <DropdownMenuItem key={subnav.name}>
                          <Link
                            to={subnav.href}
                            className="flex gap-2 items-center text-sm"
                            reloadDocument={subnav.reloadDocument || false}
                            viewTransition
                          >
                            <subnav.icon className="text-muted-foreground w-8" />
                            <span>{subnav.name}</span>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SiteUser user={{ name: "Aerynlore", email: "lore.family@gmail.com", avatar: "aurora", fallback: "AL" }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
