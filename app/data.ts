import slugify from "slugify";
import invariant from "tiny-invariant";
import {
    EQUIPMENT_QUALITIES,
    type EquipmentMutation,
    type EquipmentRecord,
} from "./data/equipment.zod";
import rawEquipmentJson from "./data/equipments.json";
import { Mission } from "./data/mission.zod";

const mockEquipment = {
    records: {} as Record<string, EquipmentRecord>,
    async getAll(): Promise<EquipmentRecord[]> {
        return Object.keys(mockEquipment.records)
            .map((key) => mockEquipment.records[key])
            .sort(
                (a, b) =>
                    EQUIPMENT_QUALITIES.indexOf(a.quality) -
                        EQUIPMENT_QUALITIES.indexOf(b.quality) ||
                    a.name.localeCompare(b.name)
            );
    },
    async get(id: string): Promise<EquipmentRecord | null> {
        return mockEquipment.records[id] || null;
    },
    async create(values: EquipmentMutation): Promise<EquipmentRecord> {
        const slug = slugify(values.name, { lower: true, strict: true });
        const created_at = new Date().toISOString();
        const newEquipment = { id: slug, slug, created_at, ...values };
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
export async function getEquipmentBySlug(slug: string | undefined) {
    if (slug)
        return (
            (await mockEquipment.getAll()).find(
                (equip) => equip.slug === slug
            ) || null
        );
    else return null;
}

export async function getEquipmentThatRequires(id: string | undefined) {
    if (id)
        return (await mockEquipment.getAll()).filter(
            (equip) => equip.crafting?.required_items[id] !== undefined
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
    equipment.slug = slugify(updates.name, { lower: true, strict: true });
    await mockEquipment.set(id, { ...equipment, ...updates });
    return equipment;
}
export async function deleteEquipment(id: string) {
    mockEquipment.destroy(id);
}

// Shut up and like it, Typescript!
const equipment_data = rawEquipmentJson as unknown as EquipmentRecord[];
equipment_data.forEach((equipment: EquipmentRecord) => {
    mockEquipment.create(equipment);
});

import missionData from "@/data/missions.json";

// Mission Data Access
export async function getAllMissions(): Promise<Mission[]> {
    return missionData;
}

export async function getMission(id: string): Promise<Mission | null> {
    const mission = missionData.find((mission) => mission.id === id);
    return mission || null;
}

export async function getMissionsByChapter(
    chapter: number
): Promise<Mission[]> {
    return missionData.filter((mission) => mission.chapter === chapter);
}

export async function getMissionsByBoss(bossName: string): Promise<Mission[]> {
    return missionData.filter((mission) => mission.boss === bossName);
}

export function groupMissionsByChapter(
    missions: Mission[]
): Record<number, Mission[]> {
    return missions.reduce((acc, mission) => {
        if (!acc[mission.chapter]) {
            acc[mission.chapter] = [];
        }
        acc[mission.chapter].push(mission);
        return acc;
    }, {} as Record<number, Mission[]>);
}

export function getChapterFromMission(missionId: string): number {
    const [chapter] = missionId.split("-").map(Number);
    return chapter;
}
