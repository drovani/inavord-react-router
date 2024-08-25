export type CampaignChapter = {
    chapter: number;
    level: number;
    hero?: string;
    name: string;
    description?: string;
    energy_cost: number;
    slug: string;
    gold?: number;
    hero_exp?: number;
    hero_raid_exp?: number
}

export const CampaignChapters: CampaignChapter[] = [
    {
        chapter: 1,
        level: 1,
        hero: "Astaroth",
        name: "Rescuing a Friend",
        description: "The world of Dominion fell, but Galhad is finally free. He is ready to rise up against the forces of Archdemon. When the hero was captured, his true friend Astaroth was by his side. We must find him.",
        energy_cost: 6,
        slug: "rescuing-a-friend",
        gold: 523,
        hero_exp: 20,
        hero_raid_exp: 50
    },
    {
        chapter: 1,
        level: 2,
        name: "Glades of Silence",
        energy_cost: 6,
        slug: "glades-of-silence"
    }
]

export const equipment_data = [
    {
        "name": "Wooden Shield",
        "level_required": 1,
        "equipment_quality": "gray",
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
        "gold_value": 1000,
        "sell": {
            "gold": 200,
            "guild_activity_points": 2
        },
        "required_equipment": []
    },
    {
        "name": "Apprentice's Mantle",
        "level_required": 1,
        "equipment_quality": "gray",
        "stats": {
            "magic_attack": 25
        },
        "chapters": ["1-3", "2-4", "3-8", "4-11", "9-4", "9-12"],
        "gold_value": 1000,
        "sell": {
            "gold": 200,
            "guild_activity_points": 2
        },
        "required_equipment": []
    },
    {
        "name": "Wizard's Staff",
        "level_required": 4,
        "equipment_quality": "gray",
        "stats": {
            "intelligence": 7,
            "magic_attack": 50
        },
        "gold_value": 3400,
        "sell": {
            "gold": 680,
            "guild_activity_points": 6
        },
        "required_equipment": [
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