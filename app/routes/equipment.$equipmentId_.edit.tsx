import type {
    ActionFunctionArgs,
    LoaderFunctionArgs,
    MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import EquipmentForm from "~/components/EquipmentForm";

import { getAllEquipment, getEquipment, updateEquipment } from "~/data";
import { EquipmentRecord } from "~/data/equipment.zod";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [{ title: data?.equipment.name }];
};
export const loader = async ({ params }: LoaderFunctionArgs) => {
    invariant(params.equipmentId, "Missing equipmentId param.");
    const equipment = await getEquipment(params.equipmentId);
    if (!equipment) {
        throw new Response(null, {
            status: 404,
            statusText: `Equipment with id ${params.equipmentId} not found.`,
        });
    }

    const allEquipment = await getAllEquipment();
    const allStats = [
        ...new Set(allEquipment.flatMap((ae) => Object.keys(ae.stats || {}))),
    ];

    return json({ equipment, allStats });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
    invariant(params.equipmentId, "Missing equipmentId param.");
    const formData = await request.formData();

    const updates = {
        ...Object.fromEntries(formData),
        campaign_sources: formData.getAll("campaign_sources"),
    } as EquipmentRecord;

    invariant(updates.name, "Missing required field 'name'.");

    const record = await updateEquipment(params.equipmentId, updates);
    return redirect(`/equipment/${record.slug}`);
};

export default function EditEquipment() {
    const { equipment, chapters, allStats } = useLoaderData<typeof loader>();

    return (
        <EquipmentForm
            equipment={equipment}
            chapters={chapters}
            allStats={allStats}
            cancelHref={`/equipment/${equipment.slug}`}
        />
    );
}
