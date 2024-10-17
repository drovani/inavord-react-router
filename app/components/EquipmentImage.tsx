import { cva, type VariantProps } from "class-variance-authority";
import { EquipmentMutation } from "~/data";
import { cn } from "~/lib/utils";

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
    return (
        <div className={cn(imageVariants({ size }))}>
            <img
                alt={`${equipment.name} icon`}
                src={
                    equipment.slug
                        ? `/images/equipment/${equipment.slug}.png`
                        : undefined
                }
                className={cn(size == "xs" ? "p-0.5 rounded-sm" : "p-1 rounded-lg")}
            />
            <img
                alt={`${equipment.name} icon`}
                src={`/images/equipment/border-${
                    equipment.equipment_quality || "gray"
                }${isFragment ? "-fragment" : ""}.png`}
                className="absolute top-0 left-0 h-full w-full"
            />
        </div>
    );
}

interface Props extends VariantProps<typeof imageVariants> {
    equipment: {
        name: string;
        slug?: string;
        equipment_quality?: EquipmentMutation["equipment_quality"];
    };
    isFragment?: boolean;
}

export default EquipmentImage;
