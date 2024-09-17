import { LinksFunction, MetaFunction } from "@remix-run/node";
import {
    Link,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from "@remix-run/react";

import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import logo_image from "./images/hero-wars-alliance-logo.webp";
import styles from "./tailwind.css?url";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export const meta: MetaFunction = () => {
    return [
        { title: "Hero Wars Helper: Heroes" },
        {
            name: "description",
            content: "A helper app for Hero Wars: Alliance mobile game",
        },
    ];
};

const navigation = [
    { name: "Heroes", current: false },
    { name: "Titans", urrent: false },
    { name: "Equipment", href: "/equipment", current: false },
    { name: "Campaign", href: "/campaign", current: false },
    { name: "Merchant", current: false },
    { name: "Hydras", current: false },
];

export default function App() {
    return (
        <html lang="en" className="h-full bg-gray-100">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <Meta />
                <Links />
            </head>
            <body className="h-full">
                <div className="min-h-full">
                    <Disclosure as="nav" className="bg-gray-800">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="flex h-16 items-center justify-between">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <Link to={"/"}>
                                            <img
                                                alt="Hero Wars Helper"
                                                src={logo_image}
                                                className="h-16 w-16"
                                            />
                                        </Link>
                                    </div>
                                    <div className="hidden md:block">
                                        <div className="ml-10 flex items-baseline space-x-4">
                                            {navigation.map((nav) =>
                                                nav.href ? (
                                                    <Link
                                                        key={nav.name}
                                                        to={nav.href}
                                                        aria-current={
                                                            nav.current
                                                                ? "page"
                                                                : undefined
                                                        }
                                                        className={classNames(
                                                            nav.current
                                                                ? "bg-gray-900 text-white"
                                                                : "text-gray-300 hover:bg-gray-700 hover:text-white",
                                                            "rounded-md px-3 py-2 text-sm font-medium"
                                                        )}
                                                    >
                                                        {nav.name}
                                                    </Link>
                                                ) : (
                                                    <span
                                                        key={nav.name}
                                                        className="text-gray-300 rounded-md px-3 py-2 text-sm font-medium cursor-default"
                                                        title={`${nav.name} not yet implemented.`}
                                                    >
                                                        {nav.name}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="-mr-2 flex md:hidden">
                                    {/* Mobile menu button */}
                                    <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                        <span className="absolute -inset-0.5" />
                                        <span className="sr-only">
                                            Open main menu
                                        </span>
                                        <Bars3Icon
                                            aria-hidden="true"
                                            className="block h-6 w-6 group-data-[open]:hidden"
                                        />
                                        <XMarkIcon
                                            aria-hidden="true"
                                            className="hidden h-6 w-6 group-data-[open]:block"
                                        />
                                    </DisclosureButton>
                                </div>
                            </div>
                        </div>

                        <DisclosurePanel className="md:hidden">
                            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                                {navigation.map((equipment) => (
                                    <DisclosureButton
                                        key={equipment.name}
                                        as="a"
                                        href={equipment.href}
                                        aria-current={
                                            equipment.current
                                                ? "page"
                                                : undefined
                                        }
                                        className={classNames(
                                            equipment.current
                                                ? "bg-gray-900 text-white"
                                                : "text-gray-300 hover:bg-gray-700 hover:text-white",
                                            "block rounded-md px-3 py-2 text-base font-medium"
                                        )}
                                    >
                                        {equipment.name}
                                    </DisclosureButton>
                                ))}
                            </div>
                        </DisclosurePanel>
                    </Disclosure>
                    <header className="bg-white shadow">
                        <div className="mx-auto px-4 py-6 sm:px-6 lg:px-8">
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                                Hero Wars Helper
                            </h1>
                        </div>
                    </header>
                    <main>
                        <div className="container mx-auto min-h-screen">
                            <Outlet />
                        </div>
                    </main>
                </div>
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}
