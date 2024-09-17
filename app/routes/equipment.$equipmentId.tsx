import { PlusIcon } from "@heroicons/react/24/solid";
import { json, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import React from "react";
import invariant from "tiny-invariant";
import ButtonBar from "~/components/ButtonBar";
import DeleteButton from "~/components/DeleteButton";
import EditButton from "~/components/EditButton";
import EquipmentImage from "~/components/EquipmentImage";
import { CampaignChapters } from "~/constants";
import {
    EquipmentRecord,
    getEquipment,
    getEquipmentByName,
    getEquipmentThatRequires,
} from "~/data";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [{ title: data?.equipment.name }];
};
export const loader = async ({ params }: LoaderFunctionArgs) => {
    invariant(params.equipmentId, "Expected params.equipmentId");
    const equipment = await getEquipment(params.equipmentId);

    if (!equipment) {
        throw new Response(null, {
            status: 404,
            statusText: `Equipment with id ${params.equipmentId} not found.`,
        });
    }

    const required_equipment =
        equipment.required_equipment?.map(async (item) => {
            const foundItem = await getEquipmentByName(item.name);

            return { ...item, ...foundItem };
        }) || [];

    const required_for = (await getEquipmentThatRequires(equipment.name)) || [];
    const found_in_chapters = CampaignChapters.filter((cc) =>
        equipment.chapters?.find((c) => c === `${cc.chapter}-${cc.level}`)
    );

    return json({
        equipment,
        required_equipment: await Promise.all(required_equipment),
        required_for,
        found_in_chapters,
    });
};

export default function Equipment() {
    const { equipment, required_equipment, required_for, found_in_chapters } =
        useLoaderData<typeof loader>();

    return (
        <div
            id={`equipment-${equipment.slug}`}
            className="flex space-x-4 flex-col"
        >
            <div className="flex space-x-4">
                <EquipmentImage equipment={equipment} />
                <div>
                    <h2 className="text-2xl font-bold">{equipment.name}</h2>
                    <div>Required level: {equipment.level_required}</div>
                    <div>Value: {equipment.gold_value} gold</div>
                    <div>
                        Sell:
                        <ul className="ml-8 -mt-6">
                            <li>{equipment.sell?.gold} gold</li>
                            <li>
                                {equipment.sell?.guild_activity_points} guild
                                activity points
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div>
                <h3 className="text-xl font-semibold">Found in:</h3>
                {equipment.chapters?.length ? (
                    <>
                        {equipment.chapters?.map((chptr) => {
                            const chapterDetails = found_in_chapters.find(
                                (f) => chptr === `${f.chapter}-${f.level}`
                            );
                            return (
                                <div key={chptr}>
                                    {chapterDetails ? (
                                        <Link
                                            to={`/campaign/${chapterDetails?.slug}`}
                                        >
                                            {`${chapterDetails?.chapter}-${chapterDetails?.level}: `}
                                            <span className="underline underline-offset-2 decoration-solid decoration-slate-300 hover:decoration-slate-900">
                                                {chapterDetails?.name}
                                            </span>
                                        </Link>
                                    ) : (
                                        chptr
                                    )}
                                </div>
                            );
                        })}
                    </>
                ) : (
                    <div>Data not available</div>
                )}
            </div>
            <div>
                <h3 className="text-xl font-semibold">Required items:</h3>
                {required_equipment?.length ? (
                    <div className={`grid grid-cols-1 sm:grid-cols-5`}>
                        {required_equipment.map((equip, index) => (
                            <React.Fragment key={index}>
                                {!!index && (
                                    <PlusIcon
                                        height={48}
                                        className="mx-auto self-center"
                                    />
                                )}
                                <div className="grid grid-cols-1">
                                    {equip.id && (
                                        <Link
                                            to={`/equipment/${equip.id}`}
                                            className="self-end mx-auto"
                                        >
                                            <EquipmentImage
                                                equipment={
                                                    equip as EquipmentRecord
                                                }
                                                size="md"
                                            />
                                        </Link>
                                    )}
                                    <span className="self-start mx-auto">
                                        {equip.quantity}x {equip.name}
                                    </span>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                ) : (
                    <div>No requirements</div>
                )}
            </div>
            <div>
                <h3 className="text-xl font-semibold">Required for</h3>
                {required_for?.length ? (
                    <div className="">
                        {required_for.map((equip) => {
                            const qty_needed = equip.required_equipment?.find(
                                (re) => re.name === equipment.name
                            )?.quantity;
                            return (
                                <div key={equip.id}>
                                    <Link
                                        to={`/equipment/${equip.id}`}
                                        className="flex flex-row items-center text-center space-x-1 space-y-1"
                                    >
                                        <EquipmentImage
                                            equipment={equip as EquipmentRecord}
                                            size="xs"
                                        />
                                        <span>
                                            {equip.name} (x{qty_needed})
                                        </span>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div>Not required for any other equipment</div>
                )}
            </div>
            <ButtonBar>
                <Form action="edit">
                    <EditButton>Edit</EditButton>
                </Form>
                <Form
                    action="destroy"
                    method="post"
                    onSubmit={(event) => {
                        const response = confirm(
                            `Please confirm you want to delete ${equipment.name} record.`
                        );
                        if (!response) {
                            event.preventDefault();
                        }
                    }}
                >
                    <DeleteButton>Delete</DeleteButton>
                </Form>
            </ButtonBar>
        </div>
    );
}
