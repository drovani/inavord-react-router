import EquipmentForm from "@/components/EquipmentForm";
import { createEquipment, getAllEquipment } from "@/data";
import {
    EquipmentMutation,
    EquipmentMutationSchema,
} from "@/data/equipment.zod";
import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ZodError } from "zod";

export const meta: MetaFunction = () => {
    return [{ title: "Create new equipment" }];
};

export const loader = async () => {
    const allEquipment = await getAllEquipment();
    const allStats = [
        ...new Set(allEquipment.flatMap((ae) => Object.keys(ae.stats || {}))),
    ];
    return json({ allEquipment, allStats });
};

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    try {
        const validated = EquipmentMutationSchema.parse({
            ...data,
            hero_level_required: Number(data.hero_level_required),
            buy_value: Number(data.buy_value),
            sell_value: Number(data.sell_value),
            guild_activity_points: Number(data.guild_activity_points),
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

export default function EditEquipment() {
    const { allEquipment, allStats } = useLoaderData<typeof loader>();

    return (
        <section className="space-y-4">
            <h1>New Equipment</h1>
            <EquipmentForm
                initialData={
                    {
                        quality: "gray",
                        hero_level_required: 1,
                        buy_value: 0,
                        sell_value: 0,
                        guild_activity_points: 0,
                    } as EquipmentMutation
                }
                existingStats={allStats}
                existingItems={allEquipment}
            />
        </section>
    );
}
