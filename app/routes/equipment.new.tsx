import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { ZodError } from "zod";
import EquipmentForm from "~/components/EquipmentForm";
import { createEquipment } from "~/data";
import {
    EquipmentMutation,
    EquipmentMutationSchema,
} from "~/data/equipment.zod";

export const meta: MetaFunction = () => {
    return [{ title: "Create new equipment" }];
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
            />
        </section>
    );
}
