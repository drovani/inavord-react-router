import { z } from "zod";

export const EQUIPMENT_QUALITIES = [
    "gray",
    "green",
    "blue",
    "purple",
    "orange",
] as const;

// Base shared properties without readonly fields
const BaseEquipmentPropertiesSchema = z.object({
    name: z.string(),
    quality: z.enum(EQUIPMENT_QUALITIES),
    buy_value: z.number().int().min(0),
    sell_value: z.number().int().min(0),
    guild_activity_points: z.number().int().min(0),
    campaign_sources: z.array(z.string()).optional(),
});

// Full equipment specific properties
const FullEquipmentPropertiesSchema = BaseEquipmentPropertiesSchema.extend({
    type: z.literal("equipment").optional().default("equipment"),
    stats: z
        .record(z.string(), z.number())
        .refine((stats) => Object.keys(stats).length > 0, {
            message: "At least one stat must be provided",
        }),
    hero_level_required: z.number().int().min(1).max(120),
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

// Fragment specific properties
const FragmentPropertiesSchema = BaseEquipmentPropertiesSchema.extend({
    type: z.literal("fragment"),
    name: z.string().refine((name) => name.endsWith(" (Fragment)"), {
        message: "Fragment names must end with ' (Fragment)'",
    }),
}).strip();

// Schemas for stored records (including readonly fields)
const StoredMetadataSchema = z.object({
    slug: z.string(),
    created_at: z.string().datetime(),
});

// Schemas for mutations (creating/updating)
export const EquipmentMutationSchema = z
    .discriminatedUnion("type", [
        FullEquipmentPropertiesSchema,
        FragmentPropertiesSchema,
    ])
    .transform((data) => ({
        ...data,
        type: data.type || "equipment",
    }));

export const EquipmentSchema = z
    .discriminatedUnion("type", [
        FullEquipmentPropertiesSchema.merge(StoredMetadataSchema),
        FragmentPropertiesSchema.merge(StoredMetadataSchema),
    ])
    .transform((data) => ({
        ...data,
        type: data.type || "equipment",
    }));

// Type exports
export type EquipmentQuality = (typeof EQUIPMENT_QUALITIES)[number];
export type EquipmentMutation = z.infer<typeof EquipmentMutationSchema>;
export type EquipmentRecord = z.infer<typeof EquipmentSchema>;
export type BaseEquipmentProperties = z.infer<
    typeof BaseEquipmentPropertiesSchema
>;

// Type guard functions
export function isFragment(
    equipment: EquipmentRecord
): equipment is z.infer<
    typeof FragmentPropertiesSchema & typeof StoredMetadataSchema
> {
    return equipment.type === "fragment";
}

export function isFullEquipment(
    equipment: EquipmentRecord
): equipment is z.infer<
    typeof FullEquipmentPropertiesSchema & typeof StoredMetadataSchema
> {
    return !equipment.type || equipment.type === "equipment";
}
