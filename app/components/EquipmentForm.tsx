import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSubmit } from "@remix-run/react";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import {
    EQUIPMENT_QUALITIES,
    EquipmentMutationSchema,
    type EquipmentMutation,
    type EquipmentRecord,
} from "~/data/equipment.zod";
import CampaignSourcesField from "./CampaignSourcesField";
import StatsField from "./StatsField";
import { Slider } from "./ui/slider";

type Props = {
    initialData?: EquipmentRecord | EquipmentMutation;
    existingStats: string[];
};

export default function EquipmentForm({ initialData, existingStats }: Props) {
    const submit = useSubmit();
    const navigate = useNavigate();
    const form = useForm<EquipmentMutation>({
        resolver: zodResolver(EquipmentMutationSchema),
        defaultValues: initialData,
    });

    const onSubmit = (data: EquipmentMutation) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value.toString());
        });

        submit(formData, { method: "post" });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

                <CampaignSourcesField form={form} />

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
