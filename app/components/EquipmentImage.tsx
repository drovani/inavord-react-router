import { useMemo } from "react";
import { EquipmentRecord } from "~/data";

const color_map: { [key: string]: { from: string; to: string } } = {
    gray: { from: "from-gray-200", to: "to-gray-600" },
    green: { from: "from-green-200", to: "to-green-600" },
    blue: { from: "from-blue-200", to: "to-blue-600" },
    purple: { from: "from-purple-200", to: "to-purple-600" },
    orange: { from: "from-orange-200", to: "to-orange-600" },
    default: { from: "from-white", to: "to-black" },
};
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
function EquipmentImage({ equipment, size = "large", className = "" }: Props) {
    const border_gradient = useMemo(() => {
        return color_map[equipment.equipment_quality || "default"];
    }, [equipment.equipment_quality]);

    if (!equipment) return <div></div>;

    return (
        <div
            className={`${dimensions[size].width} ${dimensions[size].height} ${
                size === "x-small" || size === "xs" ? "" : "p-1"
            } rounded-sm bg-gradient-to-b ${border_gradient.from} ${
                border_gradient.to
            } ${className}`}
        >
            <div className="h-full w-full rounded-sm">
                <img
                    alt={`${equipment.name} icon`}
                    src={`/images/equipment/${equipment.slug}.png`}
                    className={`rounded-sm`}
                />
            </div>
        </div>
    );
}

interface Props {
    equipment: EquipmentRecord;
    size?: "x-small" | "xs" | "small" | "sm" | "medium" | "md" | "large" | "lg";
    className?: string;
}

export default EquipmentImage;
