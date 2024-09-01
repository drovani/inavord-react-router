import { EquipmentRecord } from "~/data";

function EquipmentImage({ equipment, className }: Props) {
    if (!equipment) return <div></div>;

    return (
        <img
            alt={`${equipment.name} icon`}
            src={`/images/equipment/${equipment.slug}.png`}
            className={`rounded-3xl ${className}`}
        />
    );
}

interface Props {
    equipment: EquipmentRecord;
    className?: string;
}

export default EquipmentImage;
