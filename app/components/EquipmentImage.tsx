import { EquipmentMutation } from "@/data/equipment.zod";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { useState } from "react";

const imageVariants = cva("relative", {
    variants: {
        size: {
            default: "w-24 h-24",
            xs: "w-6 h-6",
            sm: "w-8 h-8",
            md: "w-16 h-16",
            lg: "w-24 h-24",
        },
    },
    defaultVariants: {
        size: "default",
    },
});

function EquipmentImage({
    equipment,
    size = "default",
    isFragment = false,
}: Props) {
    const [status, setStatus] = useState(equipment.slug ? "loading" : "error");

    return (
        <div className={cn(imageVariants({ size }))}>
            <img
                alt={`${equipment.name || "unknown"} icon`}
                src={`/images/equipment/${equipment.slug}.png`}
                className={cn(
                    status === "loaded" || status === "loading" ? "" : "hidden",
                    size == "xs" ? "p-0.5 rounded-sm" : "p-1 rounded-lg"
                )}
                onError={() => setStatus("error")}
                onLoad={() => setStatus("loaded")}
            />
            <img
                alt={`${equipment.name || "unknown"} icon border`}
                src={`/images/equipment/border-${
                    equipment.quality || "gray"
                }${isFragment ? "-fragment" : ""}.png`}
                className="absolute top-0 left-0 h-full w-full"
            />
        </div>
    );
}

interface Props extends VariantProps<typeof imageVariants> {
    equipment: {
        name?: string;
        slug?: string;
        quality?: EquipmentMutation["quality"];
    };
    isFragment?: boolean;
}

export default EquipmentImage;
