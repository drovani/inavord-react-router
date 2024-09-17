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
    hero_raid_exp?: number;
};

export const CampaignChapters: CampaignChapter[] = [
    {
        chapter: 1,
        level: 1,
        hero: "Astaroth",
        name: "Rescuing a Friend",
        description:
            "The world of Dominion fell, but Galhad is finally free. He is ready to rise up against the forces of Archdemon. When the hero was captured, his true friend Astaroth was by his side. We must find him.",
        energy_cost: 6,
        slug: "rescuing-a-friend",
        gold: 523,
        hero_exp: 20,
        hero_raid_exp: 50,
    },
    {
        chapter: 1,
        level: 2,
        name: "Glades of Silence",
        energy_cost: 6,
        slug: "glades-of-silence",
    },
];
