import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import type { EquipmentMutation, EquipmentRecord } from "@/data/equipment.zod";
import { PlusCircleIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { type UseFormReturn } from "react-hook-form";

interface CraftingFieldProps {
    form: UseFormReturn<EquipmentMutation>;
    existingItems: EquipmentRecord[];
    disabled?: boolean;
}

export default function CraftingField({
    form,
    existingItems,
    disabled = false,
}: CraftingFieldProps) {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const craftingData = form.watch("crafting");
    const requiredItems = craftingData?.required_items || {};
    const hasRequirements =
        craftingData &&
        (craftingData.gold_cost > 0 || Object.keys(requiredItems).length > 0);

    // Helper function to find the item details by slug
    const getItemBySlug = (slug: string) => {
        return existingItems.find((item) => item.slug === slug);
    };

    // Filter items based on search input
    const filteredItems = existingItems
        .filter(
            (item) =>
                item.name.toLowerCase().includes(inputValue.toLowerCase()) &&
                !requiredItems[item.slug]
        )
        .sort((a, b) => a.name.localeCompare(b.name));

    const onSelectItem = (item: EquipmentRecord) => {
        const newCrafting = {
            gold_cost: craftingData?.gold_cost || 0,
            required_items: {
                ...requiredItems,
                [item.slug]: 1,
            },
        };
        form.setValue("crafting", newCrafting);
        setOpen(false);
        setInputValue("");
    };

    const removeItem = (slug: string) => {
        const newRequiredItems = { ...requiredItems };
        delete newRequiredItems[slug];
        const newCrafting = {
            gold_cost: craftingData?.gold_cost || 0,
            required_items: newRequiredItems,
        };
        form.setValue("crafting", newCrafting);
    };

    const updateQuantity = (slug: string, quantity: number) => {
        const newCrafting = {
            gold_cost: craftingData?.gold_cost || 0,
            required_items: {
                ...requiredItems,
                [slug]: quantity,
            },
        };
        form.setValue("crafting", newCrafting);
    };

    const getQualityColor = (quality: string) => {
        switch (quality) {
            case "gray":
                return "bg-gray-100 text-gray-800";
            case "green":
                return "bg-green-100 text-green-800";
            case "blue":
                return "bg-blue-100 text-blue-800";
            case "purple":
                return "bg-purple-100 text-purple-800";
            case "orange":
                return "bg-orange-100 text-orange-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    // Get selected items details for hover card
    const selectedItemsDetails = Object.entries(requiredItems)
        .map(([slug, quantity]) => {
            const item = getItemBySlug(slug);
            return item ? { ...item, quantity } : null;
        })
        .filter(
            (item): item is EquipmentRecord & { quantity: number } =>
                item !== null
        );

    return (
        <div className="pt-6">
            <Accordion type="single" collapsible>
                <AccordionItem
                    value="crafting"
                    className="border rounded-md px-4"
                >
                    <AccordionTrigger
                        disabled={disabled}
                        className="disabled:opacity-70"
                    >
                        <div className="flex items-center gap-2 text-base">
                            <span>
                                Crafting Requirements
                            </span>
                            <div className="flex items-center gap-2">
                                {hasRequirements ? (
                                    <>
                                        {craftingData.gold_cost > 0 && (
                                            <Badge
                                                variant="secondary"
                                                className="flex items-center gap-1"
                                            >
                                                <img
                                                    src="/images/gold.webp"
                                                    alt="Gold"
                                                    className="w-4 h-4"
                                                />
                                                {craftingData.gold_cost.toLocaleString()}
                                            </Badge>
                                        )}
                                        {Object.keys(requiredItems).length >
                                            0 && (
                                            <HoverCard openDelay={200}>
                                                <HoverCardTrigger>
                                                    <Badge variant="secondary">
                                                        {
                                                            Object.keys(
                                                                requiredItems
                                                            ).length
                                                        }{" "}
                                                        {Object.keys(
                                                            requiredItems
                                                        ).length === 1
                                                            ? "item"
                                                            : "items"}
                                                    </Badge>
                                                </HoverCardTrigger>
                                                <HoverCardContent className="w-64">
                                                    <div className="space-y-2">
                                                        <h4 className="text-sm font-semibold">
                                                            Required Items:
                                                        </h4>
                                                        <div className="space-y-1">
                                                            {selectedItemsDetails.map(
                                                                (item) => (
                                                                    <div
                                                                        key={
                                                                            item.slug
                                                                        }
                                                                        className="flex items-center gap-2 text-sm"
                                                                    >
                                                                        <Badge
                                                                            variant="secondary"
                                                                            className={`${getQualityColor(
                                                                                item.quality
                                                                            )}`}
                                                                        >
                                                                            {
                                                                                item.quantity
                                                                            }
                                                                            x
                                                                        </Badge>
                                                                        <span>
                                                                            {
                                                                                item.name
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                </HoverCardContent>
                                            </HoverCard>
                                        )}
                                    </>
                                ) : (
                                    <Badge
                                        variant="secondary"
                                        className="text-muted-foreground"
                                    >
                                        None
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pb-6">
                        <div className="space-y-6">
                            {/* Gold Cost */}
                            <FormField
                                control={form.control}
                                name="crafting.gold_cost"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Gold Cost</FormLabel>
                                        <FormControl>
                                            <div className="relative max-w-sm">
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    value={field.value || 0}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            Number(
                                                                e.target.value
                                                            )
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

                            {/* Required Items */}
                            <FormField
                                control={form.control}
                                name="crafting.required_items"
                                render={() => (
                                    <FormItem className="space-y-4">
                                        <FormLabel>Required Items</FormLabel>
                                        <div className="space-y-4 max-w-sm">
                                            {/* Existing items */}
                                            {Object.entries(requiredItems).map(
                                                ([slug, quantity]) => {
                                                    const item =
                                                        getItemBySlug(slug);
                                                    if (!item) return null;

                                                    return (
                                                        <div
                                                            key={slug}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <Badge
                                                                variant="secondary"
                                                                className={`w-40 justify-start font-normal truncate px-3 py-1.5 ${getQualityColor(
                                                                    item.quality
                                                                )}`}
                                                            >
                                                                {item.name}
                                                            </Badge>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    value={
                                                                        quantity
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        updateQuantity(
                                                                            slug,
                                                                            Number(
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        )
                                                                    }
                                                                    className="w-20"
                                                                    min={1}
                                                                />
                                                            </FormControl>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() =>
                                                                    removeItem(
                                                                        slug
                                                                    )
                                                                }
                                                            >
                                                                <XIcon className="size-4" />
                                                            </Button>
                                                        </div>
                                                    );
                                                }
                                            )}

                                            {/* Item selection */}
                                            <Popover
                                                open={open}
                                                onOpenChange={setOpen}
                                            >
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        className="w-full"
                                                    >
                                                        <PlusCircleIcon className="size-4 mr-2" />
                                                        Add Required Item
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    className="w-64"
                                                    align="start"
                                                >
                                                    <div className="space-y-2 p-2">
                                                        <Input
                                                            placeholder="Search items..."
                                                            value={inputValue}
                                                            onChange={(e) =>
                                                                setInputValue(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                        <div className="max-h-64 overflow-y-auto space-y-1">
                                                            {filteredItems.length >
                                                            0 ? (
                                                                filteredItems.map(
                                                                    (item) => (
                                                                        <Button
                                                                            key={
                                                                                item.slug
                                                                            }
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="w-full justify-start font-normal"
                                                                            onClick={() =>
                                                                                onSelectItem(
                                                                                    item
                                                                                )
                                                                            }
                                                                        >
                                                                            <Badge
                                                                                variant="secondary"
                                                                                className={`mr-2 px-3 py-1.5 ${getQualityColor(
                                                                                    item.quality
                                                                                )}`}
                                                                            >
                                                                                {
                                                                                    item.name
                                                                                }
                                                                            </Badge>
                                                                        </Button>
                                                                    )
                                                                )
                                                            ) : (
                                                                <div className="text-sm text-muted-foreground p-2 text-center">
                                                                    {inputValue
                                                                        ? "No items found"
                                                                        : "Start typing to search items"}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
