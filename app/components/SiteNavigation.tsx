import {
  DropletIcon,
  FileJson2Icon,
  FileWarningIcon,
  LoaderCircleIcon,
  MapIcon,
  PresentationIcon,
  ShieldAlertIcon,
  ShieldIcon,
  ShieldPlusIcon,
  ShoppingBagIcon,
  SwordIcon,
  UsersIcon,
} from "lucide-react";
import { type MouseEventHandler } from "react";
import { Link, NavLink } from "react-router";
import { cn } from "~/lib/utils";

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
        name: "Force overwrite equipment records",
        href: "/admin/setup?mode=force&data=equipment",
        icon: ShieldAlertIcon,
      },
      {
        name: "Force update all records",
        href: "/admin/setup?mode=force",
        icon: FileWarningIcon,
      },
    ],
  },
];

function SiteNavigation({ onNavClick, className }: Props) {
  return (
    <nav className={`${className} grid items-start px-2 lg:px-4`}>
      {navigation.map((nav) => (
        <div key={nav.name}>
          {nav.href ? (
            <NavLink
              to={nav.href}
              onClick={onNavClick}
              className={({ isPending, isActive }) =>
                cn(
                  "-mx-2 flex items-center gap-4 rounded-xl px-3 py-2 grow group transition-all duration-100 hover:bg-default-50 hover:text-foreground",
                  isPending ? "animate-pulse" : "",
                  isActive ? "bg-muted text-foreground" : "text-muted-foreground"
                )
              }
            >
              {({ isPending, isActive }) => (
                <>
                  <nav.icon
                    size={20}
                    className={cn(
                      "h-5 w-5 group-hover:scale-105",
                      isActive ? "stroke-2" : "stroke-1 group-hover:stroke-2"
                    )}
                  />
                  <div className="grow">
                    {nav.name}
                    {isPending && <LoaderCircleIcon size={20} className="animate-spin h-5 w-5 inline ml-2" />}
                  </div>
                  {isActive &&
                    nav.children?.map((subnav) => (
                      <Link
                        to={subnav.href}
                        key={subnav.name}
                        title={subnav.name}
                        className="flex-none hover:scale-125 transition-all duration-100 hover:text-success hover:font-semibold"
                        reloadDocument={subnav.reloadDocument}
                      >
                        <subnav.icon size={20} className="h-5 w-5" strokeWidth={1} />
                      </Link>
                    ))}
                </>
              )}
            </NavLink>
          ) : (
            <div className="-mx-2 flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground/50 cursor-default">
              <nav.icon size={20} strokeWidth={1} className="h-5 w-5" />
              {nav.name}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}

interface Props {
  className?: string;
  onNavClick?: MouseEventHandler<HTMLAnchorElement>;
}

export default SiteNavigation;
