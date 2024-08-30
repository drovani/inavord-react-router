import { Button } from "@headlessui/react";
import { Form, Link, MetaFunction, Outlet, redirect, useLoaderData } from "@remix-run/react";
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

export const meta: MetaFunction = () => {
    return [{ title: "Hero Equipment" }];
};

export default function Equipment() {
    const { equipments } = useLoaderData<typeof loader>();

    return (
        <div className="flex flex-row">
            <div className="bg-gray-700 text-white px-1 basis-1/2 lg:basis-1/3 xl:basis-1/4 h-screen">
                <h2 className="text-2xl font-bold border-b-white border-b-2">
                    Equipment
                </h2>
                <div className="flex p-2 gap-3">
                    <Form id="search-form" role="search">
                        <input
                            id="q"
                            aria-label="Search contacts"
                            placeholder="Search"
                            type="search"
                            name="q"
                        />
                        <div id="search-spinner" aria-hidden hidden={true} />
                    </Form>
                    <Form id="new-equipment" method="post">
                        <Button type="submit">New</Button>
                    </Form>
                </div>
                {equipments.length ? (
                    <ul>
                        {equipments.map((equipment) => (
                            <li
                                key={equipment.name}
                                className="text-lg pl-6 -indent-6"
                            >
                                <Link to={`/equipment/${equipment.slug}`}>
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
            <div className="py-4 sm:py-6 lg:py-8 pl-4">
                <Outlet />
            </div>
        </div>
    );
}
