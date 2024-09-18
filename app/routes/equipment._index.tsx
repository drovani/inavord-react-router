import { Link } from "@nextui-org/react";
import { useLoaderData } from "@remix-run/react";
import EquipmentImage from "~/components/EquipmentImage";
import { getAllEquipment } from "../data";

export const loader = async () => {
    const equipments = await getAllEquipment();
    return { equipments };
};

export default function EquipmentIndex() {
    const { equipments } = useLoaderData<typeof loader>();

    return (
        <div>
            {equipments.length ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                    {equipments.map((equipment) => (
                        <div key={equipment.id} className="p-1">
                            <Link
                                href={`/equipment/${equipment.slug}`}
                                className="flex flex-col items-center text-center"
                            >
                                <EquipmentImage equipment={equipment} />
                                {equipment.name}
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No equipment found.</p>
            )}
        </div>
    );
}
