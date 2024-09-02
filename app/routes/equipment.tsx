import {
    Button,
    CloseButton,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from "@headlessui/react";
import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline";
import {
    Form,
    Link,
    Outlet,
    redirect,
    useLoaderData,
    useLocation,
} from "@remix-run/react";
import { createEquipment, getAllEquipment } from "../data";

export const loader = async () => {
    const equipments = await getAllEquipment();
    return { equipments };
};

export const action = async () => {
    const equipment = await createEquipment({ name: "New item" });
    return redirect(`/equipment/${equipment.id}/edit`);
};

export default function Equipment() {
    const { equipments } = useLoaderData<typeof loader>();
    const isIndex = useLocation().pathname.endsWith("/equipment");

    return (
        <div className="flex flex-row">
            <Disclosure defaultOpen={isIndex}>
                <DisclosureButton className="group flex flex-col items-start pt-3 bg-gray-700 text-white h-screen">
                    <ChevronDoubleRightIcon className="w-8 group-data-[open]:rotate-180" />
                    <div className="rotate-90 w-8 pl-1 text-3xl font-bold">
                        Equipment
                    </div>
                </DisclosureButton>
                <DisclosurePanel className="bg-gray-700 text-white pr-1 basis-3/4 lg:basis-1/3 xl:basis-1/4 h-screen">
                    <div className="border-0 md:border-b-2 border-b-white flex py-1 space-x-3">
                        <Form id="search-form" role="search">
                            <input
                                id="q"
                                aria-label="Search contacts"
                                placeholder="Search"
                                type="search"
                                name="q"
                                className="text-gray-950 h-7 rounded-sm w-48"
                            />
                        </Form>
                        <Form id="new-equipment" method="post">
                            <Button
                                className="border-blue-400 border-2 rounded-md px-2 shadow-sm bg-blue-100 text-blue-950"
                                type="submit"
                            >
                                New
                            </Button>
                        </Form>
                    </div>
                    {equipments.length ? (
                        <div className="flex flex-col items-start">
                            {equipments.map((equipment) => (
                                <CloseButton
                                    key={equipment.slug}
                                    as={Link}
                                    to={`/equipment/${equipment.slug}`}
                                    preventScrollReset={false}
                                >
                                    {equipment.name}
                                </CloseButton>
                            ))}
                        </div>
                    ) : (
                        <p>No equipment found</p>
                    )}
                </DisclosurePanel>
            </Disclosure>
            <div className="py-4 sm:py-6 lg:py-8 pl-4">
                <Outlet />
            </div>
        </div>
    );
}
