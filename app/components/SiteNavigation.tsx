import { Link, useLocation } from "@remix-run/react";
import {
    DropletIcon,
    MapIcon,
    ShieldIcon,
    ShoppingBagIcon,
    SwordIcon,
    UsersIcon,
} from "lucide-react";
import { MouseEventHandler, useCallback } from "react";
import { cn } from "~/lib/utils";

const navigation = [
    { name: "Heroes", icon: UsersIcon },
    { name: "Titans", icon: SwordIcon },
    { name: "Equipment", icon: ShieldIcon, href: "/equipment" },
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
        <nav
            className={`${className} grid items-start px-2 lg:px-4`}
        >
            {navigation.map((nav) => (
                <div key={nav.name}>
                    {nav.href ? (
                        <Link
                            key={nav.name}
                            to={nav.href}
                            className={cn(
                                "-mx-2 flex items-center gap-4 rounded-xl px-3 py-2 hover:bg-default-50 hover:text-foreground",
                                isCurrentNavItem(nav)
                                    ? "bg-muted text-foreground"
                                    : "text-muted-foreground"
                            )}
                            onClick={onNavClick}
                        >
                            <nav.icon
                                size={20}
                                strokeWidth={isCurrentNavItem(nav) ? 2 : 1}
                                className="h-5 w-5"
                            />
                            {nav.name}
                        </Link>
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
