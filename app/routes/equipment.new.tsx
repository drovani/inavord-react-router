import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import EquipmentForm from "~/components/EquipmentForm";
import { CampaignChapters } from "~/constants";
import {
    createEquipmentFromFormData,
    EquipmentMutation,
    getAllEquipment,
} from "~/data";

export const meta: MetaFunction<typeof loader> = () => {
    return [{ title: "Create new equipment" }];
};
export const loader = async () => {
    const chapters = CampaignChapters;
    const chapters_full = [];

    for (let ch = 1; ch <= 13; ch++) {
        const num_levels = ch === 1 ? 10 : 15;
        for (let lvl = 1; lvl <= num_levels; lvl++) {
            const chap = chapters.find(
                (c) => c.chapter === ch && c.level === lvl
            );
            chapters_full.push(
                chap || {
                    chapter: ch,
                    level: lvl,
                    name: "",
                    energy_cost: -1,
                    slug: `${ch}-${lvl}`,
                }
            );
        }
    }

    const allEquipment = await getAllEquipment();
    const allStats = [
        ...new Set(allEquipment.flatMap((ae) => Object.keys(ae.stats || {}))),
    ];

    return json({ chapters: chapters_full, allStats });
};

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();

    const results = await createEquipmentFromFormData(formData);

    if ("errors" in results) {
        const values = Object.fromEntries(formData) as EquipmentMutation;
        return json({ errors: results.errors, values });
    } else {
        return redirect(`/equipment/${results.record.slug}`);
    }
};

export default function EditEquipment() {
    const { chapters, allStats } = useLoaderData<typeof loader>();

    return (
        <EquipmentForm
            equipment={{
                equipment_quality: "gray",
            }}
            chapters={chapters}
            allStats={allStats}
            cancelHref="/equipment"
        />
    );
}
