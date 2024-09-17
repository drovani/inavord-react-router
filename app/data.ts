import slugify from "slugify";
import invariant from "tiny-invariant";
import equipment_data from "../data/equipment.json";

const equipment_quality_order = ["gray", "green", "blue", "purple", "orange"];

export type Errors<TMutation> = {
    [key in keyof TMutation]: string | undefined;
};
export type MutationResult<TMutation, TRecord> =
    | {
          errors: Errors<TMutation>;
          mutation: TMutation;
      }
    | {
          record: TRecord;
      };

export type EquipmentMutation = {
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
        const createdAt = new Date().toUTCString();
        const newEquipment = { id: slug, slug, createdAt, name, ...values };
        mockEquipment.records[slug] = newEquipment;
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
export async function createEquipmentFromFormData(
    formData: FormData
): Promise<MutationResult<EquipmentMutation, EquipmentRecord>> {
    let mutation: EquipmentMutation = {};
    try {
        mutation = {
            chapters: formData.getAll("chapters").map((g) => g.toString()),
            equipment_quality: formData.get("equipment_quality")?.toString(),
            gold_value: Number.parseInt(
                formData.get("gold_value")?.toString() || "0"
            ),
            level_required: Number.parseInt(
                formData.get("level_required")?.toString() || "1"
            ),
            name: formData.get("name")?.toString(),
            // required_equipment: formData
            //     .getAll("required_equipment")
            //     .map((g) => g.toString()),
            sell: {
                gold: Number.parseInt(
                    formData.get("sell.gold")?.toString() || "0"
                ),
                guild_activity_points: Number.parseInt(
                    formData.get("sell.guild_activity_points")?.toString() ||
                        "0"
                ),
            },
            // stats: formData.getAll("stats").map((g) => {
            //     const [key, value] = g.toString().split(":", 2);
            //     return { [key]: Number.parseInt(value) };
            // }),
        };
        const record = await createEquipment(mutation);
        return { record };
    } catch (error) {
        return {
            errors: {
                name: (error as Error).message,
            },
            mutation,
        };
    }
}

export async function updateEquipment(id: string, updates: EquipmentMutation) {
    const equipment = await mockEquipment.get(id);
    if (!equipment) {
        throw new Error(`No equipment found for ${id}`);
    }
    updates.slug = updates.name
        ? slugify(updates.name, { lower: true })
        : equipment.slug;
    await mockEquipment.set(id, { ...equipment, ...updates });
    return equipment;
}
export async function deleteEquipment(id: string) {
    mockEquipment.destroy(id);
}

equipment_data.forEach((equipment: EquipmentMutation) => {
    mockEquipment.create(equipment);
});
