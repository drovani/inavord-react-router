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

import EquipmentForm from "@/components/EquipmentForm";
import {
    getAllEquipment,
    getAllMissions,
    getEquipmentBySlug,
    updateEquipment,
} from "@/data";
import {
    EquipmentMutationSchema,
    type EquipmentMutation,
} from "@/data/equipment.zod";
import { ZodError } from "zod";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [{ title: `Edit ${data?.equipment.name}` }];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
    invariant(params.slug, "Missing equipment slug param.");
    const equipment = await getEquipmentBySlug(params.slug);
    if (!equipment) {
        throw new Response(null, {
            status: 404,
            statusText: `Equipment with slug ${params.slug} not found.`,
        });
    }

    const [allMissions, existingItems] = await Promise.all([
        getAllMissions(),
        getAllEquipment(),
    ]);

    const existingStats = [
        ...new Set(existingItems.flatMap((ae) => Object.keys(ae.stats || {}))),
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
            crafting: formData.get("crafting")
                ? JSON.parse(formData.get("crafting") as string)
                : undefined,
        });

        const updatedEquipment = await updateEquipment(params.slug, validated);
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
