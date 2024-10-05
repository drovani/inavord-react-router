import { ArrowDownOnSquareIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Button, Link } from "@nextui-org/react";
import { Outlet } from "@remix-run/react";
import { getAllEquipment } from "../data";

export const loader = async () => {
    const equipments = await getAllEquipment();
    return { equipments };
};

export default function Equipment() {
    return (
        <div className="grid grid-cols-[max-content_1fr] bg-white">
            <div className="flex flex-col space-y-3 text-3xl font-bold bg-foreground pt-4 pl-1 text-background items-start">
                <Link
                    href="/equipment"
                    className="[writing-mode:vertical-lr] mb-auto text-white text-3xl font-bold"
                >
                    Equipment
                </Link>
                <Button
                    as={Link}
                    color="primary"
                    href="/equipment/new"
                    isIconOnly
                    size="sm"
                    radius="full"
                    title="Create new equipment"
                >
                    <PlusIcon />
                </Button>
                <Button
                    as={Link}
                    color="primary"
                    href="/equipment.json"
                    isIconOnly
                    size="sm"
                    radius="full"
                    variant="light"
                    title="Download JSON export"
                    download
                >
                    <ArrowDownOnSquareIcon />
                </Button>
            </div>
            <div className="py-4 sm:py-6 lg:py-8 pl-4">
                <Outlet />
            </div>
        </div>
    );
}
