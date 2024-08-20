import { EquipmentRecord } from "~/data";

function EquipmentImage({ equipment, className }: EquipmentImageProps) {
    if (!equipment) return (<div></div>);

    return (<img
        alt={`${equipment.name} icon`}
        src={`/images/equipment/${equipment.slug}.png`}
        className={`rounded-sm ${className}`}
    />)
}

interface EquipmentImageProps {
    equipment: EquipmentRecord,
    className?: string
}

export default EquipmentImage;