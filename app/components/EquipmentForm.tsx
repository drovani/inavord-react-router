import CampaignSourcesField from "@/components/CampaignSourcesField";
import CraftingField from "@/components/CraftingField";
import EquipmentImage from "@/components/EquipmentImage";
import StatsField from "@/components/StatsField";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import {
    EQUIPMENT_QUALITIES,
    type EquipmentMutation,
    type EquipmentRecord,
} from "@/data/equipment.zod";
import type { Mission } from "@/data/mission.zod";
import { useNavigate, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import slugify from "slugify";

type Props = {
    initialData?: EquipmentRecord | EquipmentMutation;
    existingStats: string[];
    existingItems: EquipmentRecord[];
    missions: Mission[];
};

export default function EquipmentForm({
    initialData,
    existingStats,
    existingItems,
    missions,
}: Props) {
    const submit = useSubmit();
    const navigate = useNavigate();
    const form = useForm<EquipmentMutation>({
        defaultValues: initialData,
    });

    const [previewSlug, setPreviewSlug] = useState(
        !initialData
            ? ""
            : "slug" in initialData
            ? initialData.slug
            : initialData.name
            ? slugify(initialData.name, { lower: true, strict: true })
            : ""
    );

    useEffect(() => {
        const name = form.watch("name");
        if (name) {
            const slug = slugify(name, {
                lower: true,
                strict: true,
            });
            setPreviewSlug(slug);
        } else {
            setPreviewSlug("");
        }
    }, [form.watch("name")]);

    const onSubmit = (data: EquipmentMutation) => {
        // Convert form data to FormData
        const formData = new FormData();

        // Handle all fields except campaign_sources
        Object.entries(data).forEach(([key, value]) => {
            if (key !== "campaign_sources") {
                formData.append(key, value.toString());
            }
        });

        // Handle campaign_sources array
        if (data.campaign_sources) {
            data.campaign_sources.forEach((source) => {
                formData.append("campaign_sources[]", source);
            });
        }

        submit(formData, { method: "post" });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="flex-1">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="md:pt-8">
                        <EquipmentImage
                            equipment={{
                                name: form.watch("name"),
                                slug: previewSlug,
                                equipment_quality: form.watch("quality"),
                            }}
                            size="lg"
                        />
                    </div>
                </div>

                <FormField
                    control={form.control}
                    name="quality"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormLabel>Quality</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex gap-4"
                                >
                                    {EQUIPMENT_QUALITIES.map((quality) => (
                                        <div
                                            key={quality}
                                            className="flex items-center space-x-2"
                                        >
                                            <RadioGroupItem
                                                value={quality}
                                                id={quality}
                                            />
                                            <Label
                                                htmlFor={quality}
                                                className="capitalize"
                                            >
                                                {quality}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="hero_level_required"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Hero Level Required</FormLabel>
                            <div className="flex gap-4 items-center">
                                <FormControl className="flex-1">
                                    <Slider
                                        min={1}
                                        max={120}
                                        step={1}
                                        value={[field.value || 1]}
                                        onValueChange={([value]) =>
                                            field.onChange(value)
                                        }
                                    />
                                </FormControl>
                                <FormControl className="w-20">
                                    <Input
                                        type="number"
                                        min={1}
                                        max={120}
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(+e.target.value)
                                        }
                                    />
                                </FormControl>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-4">
                    <FormField
                        control={form.control}
                        name="buy_value"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Buy Value</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(+e.target.value)
                                            }
                                            className="pl-10"
                                        />
                                        <img
                                            src="/images/gold.webp"
                                            alt="Gold"
                                            className="absolute left-1 top-1/2 -translate-y-1/2 w-8 h-8"
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4 md:col-span-2">
                        <FormField
                            control={form.control}
                            name="sell_value"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sell Value</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        +e.target.value
                                                    )
                                                }
                                                className="pl-10"
                                            />
                                            <img
                                                src="/images/gold.webp"
                                                alt="Gold"
                                                className="absolute left-1 top-1/2 -translate-y-1/2 w-8 h-8"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="guild_activity_points"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Guild Activity Points</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        +e.target.value
                                                    )
                                                }
                                                className="pl-10"
                                            />
                                            <img
                                                src="/images/guild_activity_points.webp"
                                                alt="Guild Activity Points"
                                                className="absolute left-1 top-1/2 -translate-y-1/2 w-7 h-7"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <StatsField form={form} existingStats={existingStats} />

                <CraftingField form={form} existingItems={existingItems} />

                <CampaignSourcesField form={form} missions={missions} />

                <div className="flex gap-4">
                    <Button type="submit">Save Equipment</Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
    );
}
