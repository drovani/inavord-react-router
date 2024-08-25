import slugify from "slugify";
import invariant from "tiny-invariant";
import { equipment_data } from "./constants";

const equipment_quality_order = ["gray", "green", "blue", "purple", "orange"];

type EquipmentMutation = {
    id?: string;
    name?: string;
    level_required?: number;
    equipment_quality?: string;
    stats?: { [key: string]: number | undefined };
    chapters?: string[];
    gold_value?: number;
    sell?: {
        gold?: number;
        guild_activity_points?: number;
        [key: string]: number | undefined;
    };
    required_equipment?: { name: string; quantity: number }[];
    slug?: string;
};

export type EquipmentRecord = EquipmentMutation & {
    id: string;
    name: string;
    slug: string;
    createdAt: string;
};

const mockEquipment = {
    records: {} as Record<string, EquipmentRecord>,
    async getAll(): Promise<EquipmentRecord[]> {
        return Object.keys(mockEquipment.records)
            .map((key) => mockEquipment.records[key])
            .sort(
                (a, b) =>
                    equipment_quality_order.indexOf(
                        a.equipment_quality || "default"
                    ) -
                        equipment_quality_order.indexOf(
                            b.equipment_quality || "default"
                        ) || a.name.localeCompare(b.name)
            );
    },
    async get(id: string): Promise<EquipmentRecord | null> {
        return mockEquipment.records[id] || null;
    },
    async create(values: EquipmentMutation): Promise<EquipmentRecord> {
        const name = values.name || "New item";
        const slug =
            values.slug || slugify(name, { lower: true, strict: true });
        const id = values.id || slug;
        const createdAt = new Date().toUTCString();
        const newEquipment = { id, slug, createdAt, name, ...values };
        mockEquipment.records[id] = newEquipment;
        return newEquipment;
    },
    async set(id: string, values: EquipmentMutation): Promise<EquipmentRecord> {
        const equipment = await mockEquipment.get(id);
        invariant(equipment, `No equipment found for ${id}`);
        const updatedEquipment = { ...equipment, ...values };
        mockEquipment.records[id] = updatedEquipment;
        return updatedEquipment;
    },
    destroy(id: string): null {
        delete mockEquipment.records[id];
        return null;
    },
};

export async function getAllEquipment() {
    return mockEquipment.getAll();
}
export async function getEquipment(id: string | undefined) {
    if (id) return mockEquipment.get(id);
    else return null;
}
export async function getEquipmentByName(name: string | undefined) {
    if (name)
        return (await mockEquipment.getAll()).find(
            (equip) => equip.name === name
        );
    else return null;
}

export async function getEquipmentThatRequires(name: string | undefined) {
    if (name)
        return (await mockEquipment.getAll()).filter((equip) =>
            equip.required_equipment?.find((re) => re.name === name)
        );
    else return null;
}

export async function createEquipment(values: EquipmentMutation) {
    return mockEquipment.create(values);
}

export async function updateEquipment(id: string, updates: EquipmentMutation) {
    const equipment = await mockEquipment.get(id);
    if (!equipment) {
        throw new Error(`No equipment found for ${id}`);
    }
    await mockEquipment.set(id, { ...equipment, ...updates });
    return equipment;
}
export async function deleteEquipment(id: string) {
    mockEquipment.destroy(id);
}

equipment_data.forEach((equipment: EquipmentMutation) => {
    mockEquipment.create(equipment);
});
