import { Link } from "@nextui-org/react";

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
            <h2 className="text-large">
                Welcome to another{" "}
                <Link isExternal href="https://rovani.net" size="lg">
                    Rovani.net
                </Link>{" "}
                project
            </h2>
            <div className="ml-10 flex flex-col items-baseline space-x-4">
                {navigation.map((nav) => (
                    <Link
                        key={nav.name}
                        href={nav.href}
                        isDisabled={!nav.href}
                        color="foreground"
                        underline={nav.href ? "always" : "none"}
                        title={
                            nav.href
                                ? undefined
                                : `${nav.name} not yet implemented.`
                        }
                    >
                        {nav.name}
                    </Link>
                ))}
            </div>
        </section>
    );
}
