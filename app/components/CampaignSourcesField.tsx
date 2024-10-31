import { Checkbox } from "@/components/ui/checkbox";
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Label } from "@/components/ui/label";
import type { EquipmentMutation } from "@/data/equipment.zod";
import { type UseFormReturn } from "react-hook-form";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "./ui/accordion";
import { Badge } from "./ui/badge";

const CAMPAIGN_CHAPTERS = [
    { chapter: 1, missions: 10 },
    ...Array(12)
        .fill({ missions: 15 })
        .map((_, i) => ({ chapter: i + 2, missions: 15 })),
];

const generateMissionOptions = () => {
    return CAMPAIGN_CHAPTERS.map(({ chapter, missions }) => ({
        chapter,
        missions: Array.from({ length: missions }, (_, i) => ({
            value: `${chapter}-${i + 1}`,
            label: `${chapter}-${i + 1}`,
            name: `Mission ${i + 1} of Chapter ${chapter}`,
        })),
    }));
};

interface CampaignSourcesFieldProps {
    form: UseFormReturn<EquipmentMutation>;
}

export default function CampaignSourcesField({
    form,
}: CampaignSourcesFieldProps) {
    const selectedMissions = form.watch("campaign_sources") || [];

    const getChapterSelectedMissions = (chapter: number) => {
        return selectedMissions
            .filter((mission) => mission.startsWith(`${chapter}-`))
            .sort((a, b) => {
                const aNum = parseInt(a.split("-")[1]);
                const bNum = parseInt(b.split("-")[1]);
                return aNum - bNum;
            });
    };
    function pluralize(count: number, singular: string, plural: string) {
        return count === 1 ? singular : plural;
    }
    return (
        <div className="pt-6">
            <Accordion type="single" collapsible>
                <AccordionItem
                    value="campaign-sources"
                    className="border rounded-md px-4"
                >
                    <AccordionTrigger>
                        <HoverCard openDelay={200}>
                            <HoverCardTrigger>
                                <div className="flex items-center gap-2 text-base">
                                    Campaign Sources
                                    {form.watch("campaign_sources")?.length >
                                        0 && (
                                        <Badge variant="secondary">
                                            {
                                                form.watch("campaign_sources")
                                                    ?.length
                                            }{" "}
                                            {pluralize(
                                                form.watch("campaign_sources")
                                                    ?.length || 0,
                                                "mission",
                                                "missions"
                                            )}
                                        </Badge>
                                    )}
                                </div>
                            </HoverCardTrigger>
                            <HoverCardContent align="start" className="w-fit">
                                {form.watch("campaign_sources")?.length > 0 ? (
                                    <div className="flex flex-col gap-1">
                                        <p className="text-sm font-medium">
                                            Selected missions:
                                        </p>
                                        <div className="flex flex-wrap gap-1">
                                            {form
                                                .watch("campaign_sources")
                                                ?.map((mission) => (
                                                    <Badge
                                                        key={mission}
                                                        variant="secondary"
                                                    >
                                                        {mission}
                                                    </Badge>
                                                ))}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        No missions selected
                                    </p>
                                )}
                            </HoverCardContent>
                        </HoverCard>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pb-0">
                        <FormField
                            control={form.control}
                            name="campaign_sources"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div>
                                            {/* Mobile View: Accordion */}
                                            <Accordion
                                                type="single"
                                                collapsible
                                                className="md:hidden"
                                            >
                                                {generateMissionOptions().map(
                                                    ({ chapter, missions }) => {
                                                        const selectedChapterMissions =
                                                            getChapterSelectedMissions(
                                                                chapter
                                                            );
                                                        return (
                                                            <AccordionItem
                                                                key={chapter}
                                                                value={`chapter-${chapter}`}
                                                            >
                                                                <AccordionTrigger className="hover:no-underline">
                                                                    <div className="flex-1 flex items-center justify-between">
                                                                        <span className="hover:underline text-base">
                                                                            Chapter{" "}
                                                                            {
                                                                                chapter
                                                                            }
                                                                        </span>
                                                                        {selectedChapterMissions.length >
                                                                            0 && (
                                                                            <div className="flex flex-wrap gap-1 mr-4">
                                                                                {selectedChapterMissions.map(
                                                                                    (
                                                                                        mission
                                                                                    ) => (
                                                                                        <Badge
                                                                                            key={
                                                                                                mission
                                                                                            }
                                                                                            variant="secondary"
                                                                                            className="text-xs pointer-events-none"
                                                                                        >
                                                                                            {
                                                                                                mission
                                                                                            }
                                                                                        </Badge>
                                                                                    )
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </AccordionTrigger>
                                                                <AccordionContent>
                                                                    <div className="grid grid-cols-1 gap-2 pt-2">
                                                                        {missions.map(
                                                                            ({
                                                                                value,
                                                                                label,
                                                                                name,
                                                                            }) => (
                                                                                <div
                                                                                    key={
                                                                                        value
                                                                                    }
                                                                                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent"
                                                                                >
                                                                                    <Checkbox
                                                                                        id={`mobile-${value}`}
                                                                                        checked={field.value?.includes(
                                                                                            value
                                                                                        )}
                                                                                        onCheckedChange={(
                                                                                            checked
                                                                                        ) => {
                                                                                            const newValue =
                                                                                                checked
                                                                                                    ? [
                                                                                                          ...(field.value ||
                                                                                                              []),
                                                                                                          value,
                                                                                                      ]
                                                                                                    : (
                                                                                                          field.value ||
                                                                                                          []
                                                                                                      ).filter(
                                                                                                          (
                                                                                                              v
                                                                                                          ) =>
                                                                                                              v !==
                                                                                                              value
                                                                                                      );
                                                                                            field.onChange(
                                                                                                newValue
                                                                                            );
                                                                                        }}
                                                                                    />
                                                                                    <Label
                                                                                        htmlFor={`mobile-${value}`}
                                                                                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                                                    >
                                                                                        <span className="font-medium">
                                                                                            {
                                                                                                label
                                                                                            }
                                                                                        </span>
                                                                                        <span className="ml-2 text-muted-foreground">
                                                                                            {
                                                                                                name
                                                                                            }
                                                                                        </span>
                                                                                    </Label>
                                                                                </div>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                </AccordionContent>
                                                            </AccordionItem>
                                                        );
                                                    }
                                                )}
                                            </Accordion>

                                            {/* Desktop View: Regular Grid */}
                                            <div className="hidden md:block space-y-6">
                                                {generateMissionOptions().map(
                                                    ({ chapter, missions }) => {
                                                        const selectedChapterMissions =
                                                            getChapterSelectedMissions(
                                                                chapter
                                                            );
                                                        return (
                                                            <div
                                                                key={chapter}
                                                                className="space-y-2"
                                                            >
                                                                <div className="space-y-2">
                                                                    <h4 className="font-medium">
                                                                        Chapter{" "}
                                                                        {
                                                                            chapter
                                                                        }
                                                                    </h4>
                                                                    {selectedChapterMissions.length >
                                                                        0 && (
                                                                        <div className="flex flex-wrap gap-1">
                                                                            {selectedChapterMissions.map(
                                                                                (
                                                                                    mission
                                                                                ) => (
                                                                                    <Badge
                                                                                        key={
                                                                                            mission
                                                                                        }
                                                                                        variant="secondary"
                                                                                        className="text-xs"
                                                                                    >
                                                                                        {
                                                                                            mission
                                                                                        }
                                                                                    </Badge>
                                                                                )
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                                                                    {missions.map(
                                                                        ({
                                                                            value,
                                                                            label,
                                                                            name,
                                                                        }) => (
                                                                            <div
                                                                                key={
                                                                                    value
                                                                                }
                                                                                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent"
                                                                            >
                                                                                <Checkbox
                                                                                    id={`desktop-${value}`}
                                                                                    checked={field.value?.includes(
                                                                                        value
                                                                                    )}
                                                                                    onCheckedChange={(
                                                                                        checked
                                                                                    ) => {
                                                                                        const newValue =
                                                                                            checked
                                                                                                ? [
                                                                                                      ...(field.value ||
                                                                                                          []),
                                                                                                      value,
                                                                                                  ]
                                                                                                : (
                                                                                                      field.value ||
                                                                                                      []
                                                                                                  ).filter(
                                                                                                      (
                                                                                                          v
                                                                                                      ) =>
                                                                                                          v !==
                                                                                                          value
                                                                                                  );
                                                                                        field.onChange(
                                                                                            newValue
                                                                                        );
                                                                                    }}
                                                                                />
                                                                                <Label
                                                                                    htmlFor={`desktop-${value}`}
                                                                                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                                                >
                                                                                    <span className="font-medium">
                                                                                        {
                                                                                            label
                                                                                        }
                                                                                    </span>
                                                                                    <span className="ml-2 text-muted-foreground">
                                                                                        {
                                                                                            name
                                                                                        }
                                                                                    </span>
                                                                                </Label>
                                                                            </div>
                                                                        )
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
