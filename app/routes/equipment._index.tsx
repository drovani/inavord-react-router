import { Link, useLoaderData } from "@remix-run/react";
import { type EquipmentRecord, getAllEquipment } from "../data";

const color_map: { [key: string]: { from: string; to: string } } = {
    gray: { from: "gray-300", to: "gray-900" },
    default: { from: "white", to: "black" },
};

export const loader = async () => {
    const equipments = await getAllEquipment();
    return { equipments };
};

const border_gradient = (equipment: EquipmentRecord) => {
    return color_map[equipment.equipment_quality || "default"];
};

export default function EquipmentIndex() {
    const { equipments } = useLoaderData<typeof loader>();

    return (
        <div>
            {equipments.length ? (
                <div>
                    {equipments.map((equipment) => (
                        <div key={equipment.id}>
                            <Link
                                to={`/equipment/${equipment.slug}`}
                                className="block"
                            >
                                <div
                                    className={`rounded-3xl w-24 h-24 p-1 bg-gradient-to-br from-${
                                        border_gradient(equipment).from
                                    } to-${border_gradient(equipment).to}`}
                                >
                                    <div className="overflow-hidden rounded-[calc(1.5rem-1px)] bg-white bg-clip-padding">
                                        <img
                                            alt={`${equipment.name} icon`}
                                            key={equipment.slug}
                                            src={`/images/equipment/${equipment.slug}.png`}
                                        />
                                    </div>
                                </div>
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
