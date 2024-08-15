import slugify from "slugify";
import invariant from "tiny-invariant";

const item_quality_order = ["gray", "green", "blue", "purple", "orange"]

type ItemMutation = {
    id?: string;
    name: string;
    level_required?: number;
    item_quality?: string;
    stats?: { [key: string]: number | undefined };
    chapters?: string[];
    buy?: number;
    sell?: { gold?: number, guild_activity_points?: number, [key: string]: number | undefined };
    required_items?: { name: string, quantity: number }[];
    slug?: string;
}

export type ItemRecord = ItemMutation & {
    id: string;
    slug: string;
    createdAt: string;
}


const mockItems = {
    records: {} as Record<string, ItemRecord>,
    async getAll(): Promise<ItemRecord[]> {
        return Object.keys(mockItems.records)
            .map((key) => mockItems.records[key])
            .sort((a, b) => (
                item_quality_order.indexOf(a.item_quality || 'default') - item_quality_order.indexOf(b.item_quality || 'default')
                || a.name.localeCompare(b.name)
            ))
    },
    async get(id: string): Promise<ItemRecord | null> {
        return mockItems.records[id] || null;
    },
    async create(values: ItemMutation): Promise<ItemRecord> {
        const slug = values.slug || slugify(values.name, { lower: true, strict: true });
        const id = values.id || slug;
        const createdAt = new Date().toUTCString();
        const newItem = { id, slug, createdAt, ...values };
        mockItems.records[id] = newItem;
        return newItem;
    },
    async set(id: string, values: ItemMutation): Promise<ItemRecord> {
        const item = await mockItems.get(id);
        invariant(item, `No item found for ${id}`);
        const updatedItem = { ...item, ...values };
        mockItems.records[id] = updatedItem;
        return updatedItem
    },
    destroy(id: string): null {
        delete mockItems.records[id];
        return null;
    }
}

export async function getItems() {
    return mockItems.getAll();
}
export async function getItem(id: string | undefined) {
    if (id)
        return mockItems.get(id);
    else return null;
}
export async function updateItem(id: string, updates: ItemMutation) {
    const item = await mockItems.get(id);
    if (!item) {
        throw new Error(`No item found for ${id}`);
    }
    await mockItems.set(id, { ...item, ...updates });
    return item;
}
export async function deleteItem(id: string) {
    mockItems.destroy(id);
}


const item_data = [
    {
        "name": "Wooden Shield",
        "level_required": 1,
        "item_quality": "gray",
        "stats": {
            "health": 200
        },
        "chapters": [
            "1-3",
            "2-3",
            "2-6",
            "9-2",
            "10-10"
        ],
        "buy": 1000,
        "sell": {
            "gold": 200,
            "guild_activity_points": 2
        },
        "required_items": []
    },
    {
        "name": "Apprentice's Mantle",
        "level_required": 1,
        "item_quality": "gray",
        "stats": {
            "magic_attack": 25
        },
        "chapters": ["1-3", "2-4", "3-8", "4-11", "9-4", "9-12"],
        "buy": 1000,
        "sell": {
            "gold": 200,
            "guild_activity_points": 2
        },
        "required_items": []
    },
    {
        "name": "Wizard's Staff",
        "level_required": 4,
        "item_quality": "gray",
        "stats": {
            "intelligence": 7,
            "magic_attack": 50
        },
        "buy": 3400,
        "sell": {
            "gold": 680,
            "guild_activity_points": 6
        },
        "required_items": [
            {
                "name": "Apprentice's Mantle",
                "quantity": 2
            },
            {
                "name": "Censer",
                "quantity": 1
            }
        ]
    }
];
item_data.forEach((item: ItemMutation) => {
    mockItems.create(item);
});