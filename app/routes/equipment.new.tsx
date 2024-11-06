import EquipmentForm from "@/components/EquipmentForm";
import { createEquipment, getAllEquipment, getAllMissions } from "@/data";
import {
    EquipmentMutation,
    EquipmentMutationSchema,
} from "@/data/equipment.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useForm } from "react-hook-form";
import { ZodError } from "zod";

export const meta: MetaFunction = () => {
    return [{ title: "Create new equipment" }];
};

export async function loader() {
    const [allMissions, existingItems] = await Promise.all([
        getAllMissions(),
        getAllEquipment(),
    ]);

    const existingStats = [
        ...new Set(existingItems.flatMap((ae) => Object.keys(ae.stats || {}))),
    ];

    return json({ existingItems, existingStats, allMissions });
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    try {
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

        const newEquipment = await createEquipment(validated);

        return redirect(`/equipment/${newEquipment.slug}`);
    } catch (error) {
        if (error instanceof ZodError) {
            return json({ errors: error.format() }, { status: 400 });
        }
        throw error;
    }
}

export default function NewEquipment() {
    const { allMissions, existingStats, existingItems } =
        useLoaderData<typeof loader>();
    const form = useForm<EquipmentMutation>({
        resolver: zodResolver(EquipmentMutationSchema),
        defaultValues: {
            quality: "gray",
            hero_level_required: 1,
            buy_value: 0,
            sell_value: 0,
            guild_activity_points: 0,
        },
    });
    return (
        <section className="space-y-4">
            <h1>New Equipment</h1>
            <EquipmentForm
                form={form}
                missions={allMissions}
                existingStats={existingStats}
                existingItems={existingItems}
            />
        </section>
    );
}
