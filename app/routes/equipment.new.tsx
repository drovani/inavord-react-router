import { Field, Label, Radio, RadioGroup } from "@headlessui/react";
import { Button } from "@nextui-org/react";
import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import ButtonBar from "~/components/ButtonBar";
import { CampaignChapters } from "~/constants";
import { createEquipmentFromFormData, EquipmentMutation } from "~/data";

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

    return json({ chapters: chapters_full });
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
    const { chapters } = useLoaderData<typeof loader>();

    return (
        <Form id="equipment-form" method="post" autoComplete="off">
            <div className="space-y-12">
                <section className="border-b border-gray-900/10 pb-12">
                    <h1 className="text-4xl font-semibold leading-7 text-gray-900">
                        Equipment Creator
                    </h1>
                    <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
                        <div>
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
                                        placeholder="New item"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="equipment_quality"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Quality
                            </label>
                            <div className="mt-2">
                                <RadioGroup
                                    name="equipment_quality"
                                    aria-label="Equipment quality"
                                >
                                    {[
                                        "gray",
                                        "green",
                                        "blue",
                                        "purple",
                                        "orange",
                                    ].map((quality) => (
                                        <Field
                                            className="flex items-center gap-x-3"
                                            key={quality}
                                        >
                                            <Radio
                                                value={quality}
                                                className="group flex size-5 items-center justify-center rounded-full border-2 data-[checked]:bg-indigo-600 bg-white"
                                            >
                                                <span className="invisible size-2 rounded-full bg-white group-data-[checked]:visible" />
                                            </Radio>
                                            <Label className="capitalize">
                                                {quality}
                                            </Label>
                                        </Field>
                                    ))}
                                </RadioGroup>
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="level_required"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Required level
                            </label>
                            <div className="mt-2">
                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                    <input
                                        id="level_required"
                                        name="level_required"
                                        type="number"
                                        placeholder="1"
                                        min={1}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-2xl font-semibold leading-7 text-gray-900">
                        Buy, Sell, Gold, & Raid
                    </h2>
                    <h3 className="mt-10 text-lg leading-10 text-gray-900">
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
                                />
                            </div>
                        </div>
                    </div>
                    <h3 className="mt-5 text-lg leading-10 text-gray-900">
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
                                />
                            </div>
                        </div>
                    </div>
                </section>
                <section>
                    <h2 className="text-2xl font-semibold leading-7 text-gray-900">
                        Found in
                    </h2>
                    <div className="grid sm:grid-cols-2 space-y-4">
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
                </section>
            </div>
            <ButtonBar>
                <Button as={Link} to={`/equipment`}>
                    Cancel
                </Button>
                <Button type="submit" color="primary">
                    Save
                </Button>
            </ButtonBar>
        </Form>
    );
}
