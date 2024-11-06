import { z } from "zod";

export const EQUIPMENT_QUALITIES = [
    "gray",
    "green",
    "blue",
    "purple",
    "orange",
] as const;

export const EquipmentMutationSchema = z.object({
    name: z.string(),
    quality: z.enum(EQUIPMENT_QUALITIES),
    stats: z
        .record(z.string(), z.number())
        .refine((stats) => Object.keys(stats).length > 0, {
            message: "At least one stat must be provided",
        }),
    hero_level_required: z.number().int().min(1).max(120),
    campaign_sources: z.array(z.string()).optional(),
    buy_value: z.number().int().min(0),
    sell_value: z.number().int().min(0),
    guild_activity_points: z.number().int().min(0),
    crafting: z
        .object({
            gold_cost: z.number().int().min(0),
            required_items: z
                .record(z.string(), z.number().int().min(1))
                .refine((items) => Object.keys(items).length > 0, {
                    message: "At least one required item must be provided",
                }),
        })
        .optional(),
});

export const EquipmentRecordSchema = EquipmentMutationSchema.extend({
    id: z.string().readonly(),
    slug: z.string().readonly(),
    created_at: z.string().datetime().readonly(),
});

export type EquipmentQuality = (typeof EQUIPMENT_QUALITIES)[number];
export type EquipmentMutation = z.infer<typeof EquipmentMutationSchema>;
export type EquipmentRecord = z.infer<typeof EquipmentRecordSchema>;
