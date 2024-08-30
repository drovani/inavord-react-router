import { Button } from "@headlessui/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import EquipmentImage from "~/components/EquipmentImage";
import { CampaignChapters } from "~/constants";

import { EquipmentRecord, getEquipment, updateEquipment } from "~/data";

export const loader = async ({ params }: LoaderFunctionArgs) => {
    invariant(params.equipmentId, "Missing equipmentId param.");
    const equipment = await getEquipment(params.equipmentId);
    if (!equipment) {
        throw new Response(null, {
            status: 404,
            statusText: `Equipment with id ${params.equipmentId} not found.`,
        });
    }
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

    return json({ equipment, chapters: chapters_full });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
    invariant(params.equipmentId, "Missing equipmentId param.");
    const formData = await request.formData();

    const updates = {
        ...Object.fromEntries(formData),
        chapters: formData.getAll("chapters"),
    } as EquipmentRecord;

    invariant(updates.name, "Missing required field 'name'.");

    const record = await updateEquipment(params.equipmentId, updates);
    return redirect(`/equipment/${record.id}`);
};

export default function EditEquipment() {
    const { equipment, chapters } = useLoaderData<typeof loader>();

    return (
        <Form
            key={equipment.id}
            id="equipment-form"
            method="post"
            autoComplete="off"
        >
            <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                    <h1 className="text-4xl font-semibold leading-7 text-gray-900">
                        Equipment Editor
                    </h1>
                    <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-4">
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Equipment name
                            </label>
                            <div className="mt-2">
                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="New Item"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        defaultValue={equipment.name}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-span-full">
                            <label
                                htmlFor="image"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Image
                            </label>
                            <div className="mt-2 flex items-center gap-x-3">
                                <EquipmentImage
                                    equipment={equipment}
                                    className="h-12 w-12"
                                    aria-hidden="true"
                                />
                                <Button
                                    type="button"
                                    className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                >
                                    Change
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">
                        Buy, Sell, Gold, & Raid
                    </h2>
                    <h3 className="mt-10 text-base leading-10 text-gray-900">
                        Selling value
                    </h3>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-2">
                            <label
                                htmlFor="sell_gold"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Gold
                            </label>
                            <div className="mt-2">
                                <input
                                    id="sell_gold"
                                    name="sell.gold"
                                    type="number"
                                    min={0}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    defaultValue={equipment.sell?.gold}
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label
                                htmlFor="sell_guild_activity_points"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Guild activity points
                            </label>
                            <div className="mt-2">
                                <input
                                    id="sell_guild_activity_points"
                                    name="sell.guild_activity_points"
                                    type="number"
                                    min={0}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    defaultValue={
                                        equipment.sell?.guild_activity_points
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    <h3 className="mt-5 text-base leading-10 text-gray-900">
                        Market value
                    </h3>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-4">
                            <label
                                htmlFor="gold_value"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Gold
                            </label>
                            <div className="mt-2">
                                <input
                                    id="gold_value"
                                    name="gold_value"
                                    type="number"
                                    min={0}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    defaultValue={equipment.gold_value}
                                />
                            </div>
                        </div>
                    </div>
                    <h3 className="mt-5 text-base leading-10 text-gray-900">
                        Found in
                    </h3>
                    <div className="grid grid-cols-2">
                        {Array.from({ length: 13 }, (v, k) => ({
                            name: `Chapter ${k + 1}`,
                            chapter: k + 1,
                        })).map((chapterHeader) => {
                            const levels = chapters.filter(
                                (c) => c.chapter === chapterHeader.chapter
                            );
                            return (
                                <fieldset key={chapterHeader.chapter}>
                                    <legend>{chapterHeader.name}</legend>
                                    {levels.map((level) => (
                                        <label
                                            className="flex items-center space-x-2 cursor-pointer"
                                            key={level.slug}
                                        >
                                            <input
                                                id={`chapters.${level.chapter}-${level.level}`}
                                                name={`chapters`}
                                                value={`${level.chapter}-${level.level}`}
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                defaultChecked={
                                                    !!equipment.chapters?.find(
                                                        (c) =>
                                                            c ===
                                                            `${level.chapter}-${level.level}`
                                                    )
                                                }
                                            />
                                            <span className="inline-block">
                                                {level.chapter}-{level.level}:{" "}
                                                {level.name}
                                            </span>
                                        </label>
                                    ))}
                                </fieldset>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
                <Button
                    type="button"
                    className="text-sm font-semibold leading-6 text-gray-900"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Save
                </Button>
            </div>
        </Form>
    );
}
