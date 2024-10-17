import { Link, useLocation } from "@remix-run/react";
import {
    DropletIcon,
    FileJson2Icon,
    MapIcon,
    ShieldIcon,
    ShieldPlusIcon,
    ShoppingBagIcon,
    SwordIcon,
    UsersIcon
} from "lucide-react";
import { MouseEventHandler, useCallback } from "react";
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
            },
        ],
    },
    { name: "Campaign", icon: MapIcon, href: "/campaign" },
    { name: "Merchant", icon: ShoppingBagIcon },
    { name: "Hydras", icon: DropletIcon },
];

function SiteNavigation({ onNavClick, className }: Props) {
    const location = useLocation();
    const isCurrentNavItem = useCallback(
        (nav: { href?: string }) => {
            return nav?.href ? location.pathname.startsWith(nav.href) : false;
        },
        [location.pathname]
    );
    return (
        <nav className={`${className} grid items-start px-2 lg:px-4`}>
            {navigation.map((nav) => (
                <div key={nav.name}>
                    {nav.href ? (
                        <div
                            key={nav.name}
                            className={cn(
                                "-mx-2 flex items-center gap-4 rounded-xl px-3 py-2 hover:bg-default-50 hover:text-foreground",
                                isCurrentNavItem(nav)
                                    ? "bg-muted text-foreground"
                                    : "text-muted-foreground"
                            )}
                        >
                            <Link
                                to={nav.href}
                                onClick={onNavClick}
                                className="flex gap-4 grow group transition-all duration-100"
                            >
                                <nav.icon
                                    size={20}
                                    className={cn(
                                        "h-5 w-5 group-hover:scale-105",
                                        isCurrentNavItem(nav)
                                            ? "stroke-2"
                                            : "stroke-1 group-hover:stroke-2"
                                    )}
                                />
                                {nav.name}
                            </Link>
                            {isCurrentNavItem(nav) &&
                                nav.children?.map((subnav) => (
                                    <Link
                                        to={subnav.href}
                                        key={subnav.name}
                                        title={subnav.name}
                                        className="flex-none hover:scale-125 transition-all duration-100 hover:text-success hover:font-semibold"
                                    >
                                        <subnav.icon
                                            size={20}
                                            className="h-5 w-5"
                                            strokeWidth={1}
                                        />
                                    </Link>
                                ))}
                        </div>
                    ) : (
                        <div className="-mx-2 flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground/50 cursor-default">
                            <nav.icon
                                size={20}
                                strokeWidth={isCurrentNavItem(nav) ? 2 : 1}
                                className="h-5 w-5"
                            />
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
