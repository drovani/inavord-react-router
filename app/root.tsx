import { LinksFunction, MetaFunction } from "@remix-run/node";
import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useHref,
    useNavigate,
} from "@remix-run/react";

import { NextUIProvider } from "@nextui-org/react";
import HeaderAndNavigation from "./components/HeaderAndNavigation";
import styles from "./tailwind.css?url";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export const meta: MetaFunction = () => {
    return [
        { title: "Hero Wars Helper: Heroes" },
        {
            name: "description",
            content: "A helper app for Hero Wars: Alliance mobile game",
        },
    ];
};

export default function App() {
    const navigate = useNavigate();

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
            <body>
                <NextUIProvider navigate={navigate} useHref={useHref}>
                    <div className="flex flex-col min-h-screen max-w-4xl mx-auto">
                        <HeaderAndNavigation />
                        <div className="grow">
                            <Outlet />
                        </div>
                    </div>
                    <ScrollRestoration />
                    <Scripts />
                </NextUIProvider>
            </body>
        </html>
    );
}
