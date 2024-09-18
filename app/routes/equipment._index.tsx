import { Card, CardFooter, Image, Link } from "@nextui-org/react";
import { useLoaderData } from "@remix-run/react";
import { useCallback } from "react";
import { getAllEquipment } from "../data";

export const loader = async () => {
    const equipments = await getAllEquipment();
    return { equipments };
};

export default function EquipmentIndex() {
    const { equipments } = useLoaderData<typeof loader>();
    const bgColor = useCallback((equipment_quality: string | undefined) => {
        switch (equipment_quality) {
            case "gray":
                return "bg-gray-100/80";
            case "green":
                return "bg-green-300/80";
            case "blue":
                return "bg-blue-300/80";
            case "purple":
                return "bg-purple-300/80";
            case "orange":
                return "bg-orange-300/80";
            default:
                return "bg-white/80";
        }
    }, []);

    return (
        <div>
            {equipments.length ? (
                <div className="gap-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5">
                    {equipments.map((equipment) => (
                        <Link
                            href={`/equipment/${equipment.slug}`}
                            key={equipment.slug}
                        >
                            <Card
                                key={equipment.slug}
                                shadow="sm"
                                classNames={{
                                    footer: `absolute ${bgColor(
                                        equipment.equipment_quality
                                    )} bottom-0 z-10`,
                                }}
                                isPressable
                                isHoverable
                            >
                                <CardFooter>
                                    <p className="text-black text-base font-semibold text-left">
                                        {equipment.name}
                                    </p>
                                </CardFooter>
                                <Image
                                    removeWrapper
                                    className="z-0 w-full h-full object-cover"
                                    src={`/images/equipment/${equipment.slug}.png`}
                                />
                            </Card>
                        </Link>
                    ))}
                </div>
            ) : (
                <p>No equipment found.</p>
            )}
        </div>
    );
}
