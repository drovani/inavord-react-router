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
    EquipmentMutationSchema,
    EquipmentRecord,
} from "@/data/equipment.zod";
import type { Mission } from "@/data/mission.zod";
import { generateSlug } from "@/lib/utils";
import { useNavigate, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import { type UseFormReturn } from "react-hook-form";
import { z } from "zod";
import CampaignSourcesField from "./CampaignSourcesField";
import CraftingField from "./CraftingField";
import EquipmentImage from "./EquipmentImage";
import StatsField from "./StatsField";

type EquipmentFormProps = {
    form: UseFormReturn<EquipmentMutation>;
    existingStats: string[];
    existingItems: EquipmentRecord[];
    missions: Mission[];
};

// Helper function to append data to FormData based on Zod schema
function appendToFormData(
    formData: FormData,
    data: unknown,
    schema: z.ZodSchema,
    prefix: string = ""
) {
    if (schema instanceof z.ZodObject) {
        const obj = data as Record<string, unknown>;
        Object.entries(schema.shape).forEach(([key, value]) => {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            appendToFormData(formData, obj[key], value as z.ZodSchema, fullKey);
        });
    } else if (schema instanceof z.ZodArray) {
        const arr = data as unknown[];
        arr?.forEach((item) => {
            formData.append(`${prefix}[]`, item as string);
        });
    } else if (
        schema instanceof z.ZodOptional ||
        schema instanceof z.ZodNullable
    ) {
        if (data !== undefined && data !== null) {
            appendToFormData(formData, data, schema.unwrap(), prefix);
        }
    } else if (data !== undefined && data !== null) {
        // Handle primitive values
        if (typeof data === "object") {
            formData.append(prefix, JSON.stringify(data));
        } else {
            formData.append(prefix, String(data));
        }
    }
}

export default function EquipmentForm({
    form,
    existingStats,
    existingItems,
    missions,
}: EquipmentFormProps) {
    const navigate = useNavigate();
    const submit = useSubmit();

    const [previewSlug, setPreviewSlug] = useState(
        form.getValues("name") ? generateSlug(form.getValues("name")) : ""
    );

    useEffect(() => {
        const subscription = form.watch((value, { name }) => {
            if (name === "name" && value.name) {
                setPreviewSlug(generateSlug(value.name));
            }
        });
        return () => subscription.unsubscribe();
    }, [form]);

    const onSubmit = (data: EquipmentMutation) => {
        const formData = new FormData();
        appendToFormData(formData, data, EquipmentMutationSchema);
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
                                quality: form.watch("quality"),
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
                                    value={field.value}
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
                                        value={[field.value]}
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
