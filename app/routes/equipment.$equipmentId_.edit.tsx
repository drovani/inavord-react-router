import { Button } from "@headlessui/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getEquipment, updateEquipment } from "~/data";

export const loader = async ({ params }: LoaderFunctionArgs) => {
    invariant(params.equipmentId, "Missing equipmentId param.");
    const equipment = await getEquipment(params.equipmentId);
    if (!equipment) {
        throw new Response(null, {
            status: 404,
            statusText: `Equipment with id ${params.equipmentId} not found.`
        })
    }

    return json({ equipment });
}

export const action = async ({ params, request }: ActionFunctionArgs) => {
    invariant(params.equipmentId, "Missing equipmentId param.");
    const formData = await request.formData();

    const updates = Object.fromEntries(formData);

    invariant(updates.name, "Missing required field 'name'.");

    const record = await updateEquipment(params.equipmentId, updates);
    return redirect(`/equipment/${record.id}`)
}

export default function EditEquipment() {
    const { equipment } = useLoaderData<typeof loader>();

    return (
        <Form key={equipment.id} id="equipment-form" method="post">
            <label>
                <span>Name</span>
                <input
                    defaultValue={equipment.name}
                    aria-label="Equipment name"
                    name="name"
                    type="text"
                    placeholder="Equipment name"
                    required={true}
                />
            </label>
            <label>
                <span>Required level</span>
                <input
                    defaultValue={equipment.level_required}
                    aria-label="Required character level"
                    name="level_required"
                    type="number"
                    min={1}
                    max={120}
                    step={1}
                />
            </label>
            <label>
                <span>Purchase cost (gold)</span>
                <input
                    defaultValue={equipment.buy}
                    aria-label="Purchase cost in gold"
                    name="buy"
                    type="number"
                />
            </label>
            <p>
                <Button type="submit">Save</Button>
                <Button type="button">Cancel</Button>
            </p>
        </Form>
    )
}