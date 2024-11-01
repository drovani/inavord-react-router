import EquipmentImage from "@/components/EquipmentImage";
import { Button, buttonVariants } from "@/components/ui/button";
import { CampaignChapters } from "@/constants";
import {
    getEquipment,
    getEquipmentByName,
    getEquipmentThatRequires,
} from "@/data";
import { EquipmentRecord } from "@/data/equipment.zod";
import { json, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { PlusIcon } from "lucide-react";
import React from "react";
import invariant from "tiny-invariant";

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

    const required_equipment = equipment.crafting
        ? Object.entries(equipment.crafting?.required_items).map(
              async (item) => {
                  const foundItem = await getEquipmentByName(item[0]);
                  return { ...foundItem };
              }
          )
        : [];

    const required_for = (await getEquipmentThatRequires(equipment.name)) || [];
    const found_in_chapters = CampaignChapters.filter((cc) =>
        equipment.campaign_sources?.find(
            (c) => c === `${cc.chapter}-${cc.level}`
        )
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
                    <div>Required level: {equipment.hero_level_required}</div>
                    <div>Value: {equipment.buy_value} gold</div>
                    <div>
                        Sell:
                        <ul className="ml-8 -mt-6">
                            <li>{equipment.sell_value} gold</li>
                            <li>
                                {equipment.guild_activity_points} guild activity
                                points
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div>
                <h3 className="text-xl font-semibold">Found in:</h3>
                {equipment.campaign_sources?.length ? (
                    <>
                        {equipment.campaign_sources?.map((chptr) => {
                            const chapterDetails = found_in_chapters.find(
                                (f) => chptr === `${f.chapter}-${f.level}`
                            );
                            return (
                                <div key={chptr}>
                                    {chapterDetails ? (
                                        <Link
                                            to={`/missions/${chapterDetails?.slug}`}
                                            className="text-foreground hover:decoration-solid hover:decoration-slate-900"
                                        >
                                            {`${chapterDetails?.chapter}-${chapterDetails?.level}: `}
                                            <span className="ml-1 underline underline-offset-2 decoration-solid decoration-slate-300 hover:decoration-slate-900">
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
                    <div className={`grid grid-cols-3 sm:grid-cols-5`}>
                        {required_equipment.map((equip, index) => (
                            <React.Fragment key={index}>
                                {!!index && (
                                    <PlusIcon className="mx-auto self-center" />
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
                                        {
                                            equipment.crafting?.required_items[
                                                equip.id || "default"
                                            ]
                                        }
                                        x {equip.name}
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
                            const qty_needed =
                                equip.crafting?.required_items[equipment.id];
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
            <Link
                to={`/equipment/${equipment.slug}/edit`}
                className={buttonVariants({ variant: "default" })}
            >
                Edit
            </Link>
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
                <Button type="submit" variant={"destructive"}>
                    Delete
                </Button>
            </Form>
        </div>
    );
}
