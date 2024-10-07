import { Image } from "@nextui-org/react";
import { EquipmentMutation } from "~/data";

const dimensions: { [key: string]: { width: string; height: string } } = {
    "x-small": { width: "w-6", height: "h-6" },
    xs: { width: "w-6", height: "h-6" },
    small: { width: "w-8", height: "h-8" },
    sm: { width: "w-8", height: "h-8" },
    medium: { width: "w-16", height: "h-16" },
    md: { width: "w-16", height: "h-16" },
    large: { width: "w-24", height: "h-24" },
    lg: { width: "w-24", height: "h-24" },
};
function EquipmentImage({
    equipment,
    size = "large",
    isFragment = false,
}: Props) {
    return (
        <div
            className={`relative ${dimensions[size].width} ${dimensions[size].height}`}
        >
            <Image
                alt={`${equipment.name} icon`}
                src={
                    equipment.slug
                        ? `/images/equipment/${equipment.slug}.png`
                        : undefined
                }
                className="p-1"
                removeWrapper
            />
            <Image
                alt={`${equipment.name} icon`}
                src={`/images/equipment/border-${
                    equipment.equipment_quality || "gray"
                }${isFragment ? "-fragment" : ""}.png`}
                className="absolute top-0 left-0 h-full w-full"
                removeWrapper
            />
        </div>
    );
}

interface Props {
    equipment: {
        name: string;
        slug?: string;
        equipment_quality?: EquipmentMutation["equipment_quality"];
    };
    size?: "x-small" | "xs" | "small" | "sm" | "medium" | "md" | "large" | "lg";
    isFragment?: boolean;
}

export default EquipmentImage;
