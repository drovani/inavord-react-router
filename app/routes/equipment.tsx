import {
    Button,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from "@headlessui/react";
import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline";
import { Form, Link, Outlet, redirect, useLoaderData } from "@remix-run/react";
import EquipmentImage from "~/components/EquipmentImage";
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

    return (
        <div className="flex flex-row">
            <Disclosure defaultOpen={true}>
                <DisclosureButton className="group flex items-start pt-3 bg-gray-700 text-white h-screen ">
                    <ChevronDoubleRightIcon className="w-5 group-data-[open]:rotate-180" />
                </DisclosureButton>
                <DisclosurePanel>
                    <div className="bg-gray-700 text-white pr-1 basis-1/3 lg:basis-1/3 xl:basis-1/4 h-screen">
                        <div className=" border-b-white border-b-2 flex pt-1">
                            <div></div>
                            <h2 className="text-2xl font-bold flex-auto">
                                Equipment
                            </h2>
                            <Form id="new-equipment" method="post">
                                <Button
                                    className="border-blue-400 border-2 rounded-md px-2 shadow-sm bg-blue-100 text-blue-950"
                                    type="submit"
                                >
                                    New
                                </Button>
                            </Form>
                        </div>
                        <div className="flex p-2 gap-3 place-items-center">
                            <Form id="search-form" role="search">
                                <input
                                    id="q"
                                    aria-label="Search contacts"
                                    placeholder="Search"
                                    type="search"
                                    name="q"
                                    className="text-gray-950 h-7 rounded-sm"
                                />
                                <div
                                    id="search-spinner"
                                    aria-hidden
                                    hidden={true}
                                />
                            </Form>
                        </div>
                        {equipments.length ? (
                            <ul>
                                {equipments.map((equipment) => (
                                    <li
                                        key={equipment.name}
                                        className="text-lg pl-6 -indent-6"
                                    >
                                        <Link
                                            to={`/equipment/${equipment.slug}`}
                                        >
                                            <EquipmentImage
                                                equipment={equipment}
                                                className="hidden md:inline h-5 w-5 mr-1"
                                            />
                                            {equipment.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No equipment found</p>
                        )}
                    </div>
                </DisclosurePanel>
            </Disclosure>
            <div className="py-4 sm:py-6 lg:py-8 pl-4">
                <Outlet />
            </div>
        </div>
    );
}
