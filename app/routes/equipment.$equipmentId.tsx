import { Button } from "@headlessui/react";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { useMemo } from "react";
import invariant from "tiny-invariant";
import EquipmentImage from "~/components/EquipmentImage";
import { EquipmentRecord, getEquipment, getEquipmentByName, getEquipmentThatRequires } from "~/data";

const color_map: { [key: string]: { from: string, to: string } } = {
    gray: { from: 'gray-300', to: 'gray-900' },
    default: { from: 'white', to: 'black' }
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
    invariant(params.equipmentId, "Expected params.equipmentId");
    const equipment = await getEquipment(params.equipmentId);

    if (!equipment) {
        throw new Response(null, {
            status: 404,
            statusText: `Equipment with id ${params.equipmentId} not found.`
        })
    }

    const required_equipment = equipment.required_equipment?.map(
        async (item) => {
            const foundItem = await getEquipmentByName(item.name);

            return { ...item, ...foundItem };
        }) || [];

    const required_for = await getEquipmentThatRequires(equipment.name) || [];

    return json({ equipment, required_equipment: await Promise.all(required_equipment), required_for });
}

export default function Equipment() {

    const { equipment, required_equipment, required_for } = useLoaderData<typeof loader>();

    const border_gradient = useMemo(() => {
        return color_map[equipment.equipment_quality || 'default']
    }, [equipment.equipment_quality])


    return (
        <div id={`equipment-${equipment.slug}`}
            className="flex space-x-4 flex-col lg:flex-row" >
            <div className="flex space-x-4">
                <div className={`rounded-3xl w-24 h-24 p-1 bg-gradient-to-br from-${border_gradient.from} to-${border_gradient.to}`}>
                    <div className="overflow-hidden rounded-[calc(1.5rem-1px)] bg-white bg-clip-padding">
                        <EquipmentImage equipment={equipment} />
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-bold">{equipment.name}</h2>
                    <div>Required level: {equipment.level_required}</div>
                    <div>Value: {equipment.gold_value} gold</div>
                    <div>Sell:
                        <ul className="ml-8 -mt-6">
                            <li>{equipment.sell?.gold} gold</li>
                            <li>{equipment.sell?.guild_activity_points} guild activity points</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div>
                <h3 className="text-xl font-semibold">Found in:</h3>
                {equipment.chapters?.length
                    ? (
                        <>
                            {equipment.chapters?.map((chptr) => {
                                return <div key={chptr}>{chptr}</div>
                            })}
                        </>
                    ) : (
                        <div>Data not available</div>
                    )}
            </div>
            <div>
                <h3 className="text-xl font-semibold">Required equipment</h3>
                {required_equipment?.length
                    ? (
                        <>
                            {required_equipment.map((equip) => {
                                if (equip.id) {
                                    return (<div key={equip.name}>
                                        <Link to={`/equipment/${equip.id}`}>
                                            {equip.quantity}x
                                            <EquipmentImage equipment={equip as EquipmentRecord} className="h-4 inline mx-1" />
                                            {equip.name}
                                        </Link>
                                    </div>)
                                } else {
                                    return (
                                        <div key={equip.name}>
                                            {equip.quantity}x {equip.name}
                                        </div>
                                    )
                                }
                            })}
                        </>
                    ) : (
                        <div>No requirements</div>
                    )}
            </div>
            <div>
                <h3 className="text-xl font-semibold">Required for</h3>
                {required_for?.length ? (
                    <>
                        {required_for.map((equip) => {
                            const qty_needed = equip.required_equipment?.find(re => re.name === equipment.name)?.quantity;
                            return (<div key={equip.id}>
                                <Link to={`/equipment/${equip.id}`}>
                                    <EquipmentImage equipment={equip as EquipmentRecord} className="h-4 inline mx-1" />
                                    {equip.name} (x{qty_needed})
                                </Link>
                            </div>)
                        })}
                    </>
                ) : (<div>Not required for any other equipment</div>)}
            </div>
            <div>
                <Form action="edit">
                    <Button type="submit">Edit</Button>
                </Form>
                <Form action="destroy"
                    method="post"
                    onSubmit={(event) => {
                        const response = confirm(`Please confirm you want to delete ${equipment.name} record.`);
                        if (!response) {
                            event.preventDefault();
                        }
                    }}>
                    <Button type="submit">Delete</Button>
                </Form>
            </div>
        </div>
    )
}