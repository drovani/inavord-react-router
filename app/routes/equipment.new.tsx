import EquipmentForm from "@/components/EquipmentForm";
import {
    EquipmentMutation,
    EquipmentMutationSchema,
} from "@/data/equipment.zod";
import { equipmentDAL } from "@/lib/equipment-dal";
import { missionDAL } from "@/lib/mission-dal";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useForm } from "react-hook-form";
import { ZodError } from "zod";

export const meta: MetaFunction = () => {
    return [{ title: "Create new equipment" }];
};

export async function loader() {
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

    return { existingItems, existingStats, allMissions };
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const data = JSON.parse(formData.get("equipment") as string);

    console.debug(data);

    try {
        const validated = EquipmentMutationSchema.parse(data);

        const newEquipment = await equipmentDAL.createEquipment(validated);

        return redirect(`/equipment/${newEquipment.slug}`);
    } catch (error) {
        if (error instanceof ZodError) {
            return data({ errors: error.format() }, { status: 400 });
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
