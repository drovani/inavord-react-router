import EquipmentForm from "@/components/EquipmentForm";
import {
    EquipmentMutationSchema,
    type EquipmentMutation,
} from "@/data/equipment.zod";
import { equipmentDAL } from "@/lib/equipment-dal";
import { missionDAL } from "@/lib/mission-dal";
import { zodResolver } from "@hookform/resolvers/zod";
import type {
    ActionFunctionArgs,
    LoaderFunctionArgs,
    MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useForm } from "react-hook-form";
import invariant from "tiny-invariant";
import { ZodError } from "zod";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [{ title: `Edit ${data?.equipment.name}` }];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
    invariant(params.slug, "Missing equipment slug param.");
    const equipment = await equipmentDAL.getEquipmentBySlug(params.slug);
    if (!equipment) {
        throw new Response(null, {
            status: 404,
            statusText: `Equipment with slug ${params.slug} not found.`,
        });
    }

    const [allMissions, existingItems] = await Promise.all([
        missionDAL.getAllMissions(),
        equipmentDAL.getAllEquipment(),
    ]);

    const existingStats = [
        ...new Set(
            existingItems.flatMap((ae) =>
                "stats" in ae ? Object.keys(ae.stats || {}) : []
            )
        ),
    ];

    return json({ existingItems, existingStats, allMissions, equipment });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
    invariant(params.slug, "Missing equipment slug param");

    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    try {
        // Validate with Zod
        const validated = EquipmentMutationSchema.parse({
            ...data,
            hero_level_required: Number(formData.get("hero_level_required")),
            buy_value: Number(formData.get("buy_value")),
            sell_value: Number(formData.get("sell_value")),
            guild_activity_points: Number(
                formData.get("guild_activity_points")
            ),
            stats: JSON.parse(formData.get("stats") as string),
            campaign_sources: formData.getAll("campaign_sources[]"),
            crafting:
                formData.has("crafting.gold_cost") &&
                formData.has("crafting.required_items")
                    ? {
                          gold_cost: Number(formData.get("crafting.gold_cost")),
                          required_items: JSON.parse(
                              formData.get("crafting.required_items") as string
                          ),
                      }
                    : undefined,
        });

        const updatedEquipment = await equipmentDAL.updateEquipment(
            params.slug,
            validated
        );
        //        const updatedEquipment = await updateEquipment(params.slug, validated);

        return redirect(`/equipment/${updatedEquipment.slug}`);
    } catch (error) {
        if (error instanceof ZodError) {
            return json({ errors: error.format() }, { status: 400 });
        }
        throw error;
    }
};

export default function EditEquipment() {
    const { allMissions, existingStats, existingItems, equipment } =
        useLoaderData<typeof loader>();

    const form = useForm<EquipmentMutation>({
        resolver: zodResolver(EquipmentMutationSchema),
        defaultValues: equipment,
    });

    return (
        <EquipmentForm
            form={form}
            existingStats={existingStats}
            existingItems={existingItems}
            missions={allMissions}
        />
    );
}
