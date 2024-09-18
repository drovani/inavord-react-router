import {
    Link,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle,
} from "@nextui-org/react";
import { useLocation } from "@remix-run/react";
import { useCallback, useState } from "react";
import logo_image from "../images/hero-wars-alliance-logo.webp";

const navigation = [
    { name: "Heroes" },
    { name: "Titans" },
    { name: "Equipment", href: "/equipment" },
    { name: "Campaign", href: "/campaign" },
    { name: "Merchant" },
    { name: "Hydras" },
];

function HeaderAndNavigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const isCurrentNavItem = useCallback(
        (nav: { href?: string }) => {
            return nav?.href ? location.pathname.startsWith(nav.href) : false;
        },
        [location.pathname]
    );

    return (
        <header className="bg-white shadow">
            <Navbar
                isBordered
                onMenuOpenChange={setIsMenuOpen}
                isMenuOpen={isMenuOpen}
            >
                <NavbarContent>
                    <NavbarMenuToggle
                        aria-label={
                            isMenuOpen
                                ? "Close navigation menu"
                                : "Open navigation menu"
                        }
                        className="sm:hidden"
                    />
                    <NavbarBrand>
                        <Link
                            href={"/"}
                            className="flex items-center space-x-3"
                            color="foreground"
                        >
                            <img
                                alt="Hero Wars Helper"
                                src={logo_image}
                                className="h-16 w-16"
                                title="Not affiliated with Nexters Global LTD"
                            />
                            <h1 className="sm:hidden font-bold tracking-tight text-inherit">
                                Hero Wars Helper
                            </h1>
                        </Link>
                    </NavbarBrand>
                </NavbarContent>
                <NavbarContent className="hidden sm:flex gap-4" justify="start">
                    {navigation.map((nav) => (
                        <NavbarItem
                            key={nav.name}
                            isActive={isCurrentNavItem(nav)}
                        >
                            <Link
                                href={nav.href}
                                aria-current={nav.href ? "page" : undefined}
                                title={
                                    nav.href
                                        ? undefined
                                        : `${nav.name} not yet implemented.`
                                }
                                isDisabled={!nav.href}
                            >
                                {nav.name}
                            </Link>
                        </NavbarItem>
                    ))}
                </NavbarContent>
                <NavbarMenu>
                    {navigation.map((nav, index) => (
                        <NavbarMenuItem
                            key={`${nav.name}-${index}`}
                            isActive={!!nav.href}
                        >
                            <Link
                                onClick={() =>
                                    nav.href ? setIsMenuOpen(false) : null
                                }
                                key={nav.name}
                                href={nav.href}
                                aria-current={
                                    isCurrentNavItem(nav) ? "page" : undefined
                                }
                                className="w-full"
                                color={
                                    isCurrentNavItem(nav)
                                        ? "primary"
                                        : "foreground"
                                }
                            >
                                {nav.name}
                            </Link>
                        </NavbarMenuItem>
                    ))}
                </NavbarMenu>
            </Navbar>
        </header>
    );
}

export default HeaderAndNavigation;
