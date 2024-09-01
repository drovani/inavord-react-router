import { Link } from "@remix-run/react";

const navigation = [
    { name: "Heroes" },
    { name: "Titans" },
    { name: "Equipment", href: "/equipment" },
    { name: "Campaign", href: "/campaign" },
    { name: "Merchant" },
    { name: "Hydras" },
];

export default function Index() {
    return (
        <section>
            <h2>
                Welcome to another{" "}
                <a
                    href="https://rovani.net"
                    target="_blank"
                    rel="noreferrer"
                    className="underline decoration-dotted underline-offset-2"
                >
                    Rovani.net
                </a>{" "}
                project
            </h2>
            <div className="ml-10 flex flex-col items-baseline space-x-4">
                {navigation.map((nav) =>
                    nav.href ? (
                        <Link
                            key={nav.name}
                            to={nav.href}
                            className="text-gray-950 hover:decoration-solid hover:decoration-2 underline decoration-dotted underline-offset-2 rounded-md px-3 py-2 text-sm font-medium"
                        >
                            {nav.name}
                        </Link>
                    ) : (
                        <span
                            key={nav.name}
                            className="text-gray-950 rounded-md px-3 py-2 text-sm font-medium cursor-default"
                            title={`${nav.name} not yet implemented.`}
                        >
                            {nav.name}
                        </span>
                    )
                )}
            </div>
        </section>
    );
}
