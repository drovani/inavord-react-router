import { Link } from "@nextui-org/react";
import SiteNavigation from "~/components/SiteNavigation";

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
                <SiteNavigation className="md:hidden" />
            </div>
        </section>
    );
}
