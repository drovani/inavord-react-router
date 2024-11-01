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
import type { EquipmentMutation } from "@/data/equipment.zod";
import { type Mission, groupMissionsByChapter } from "@/data/mission.zod";
import { type UseFormReturn } from "react-hook-form";
import ChapterMissions from "./ChapterMissions";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "./ui/accordion";
import { Badge } from "./ui/badge";

interface CampaignSourcesFieldProps {
    form: UseFormReturn<EquipmentMutation>;
    missions: Mission[];
}

export default function CampaignSourcesField({
    form,
    missions,
}: CampaignSourcesFieldProps) {
    const selectedMissions = form.watch("campaign_sources") || [];

    function pluralize(count: number, singular: string, plural: string) {
        return count === 1 ? singular : plural;
    }

    const selectionDescription =
        selectedMissions.length === 0
            ? "No missions selected"
            : `${selectedMissions.length} ${pluralize(
                  selectedMissions.length,
                  "mission",
                  "missions"
              )} selected`;

    // Group missions by chapter
    const missionsByChapter = groupMissionsByChapter(missions);

    const handleMissionToggle = (missionId: string, checked: boolean) => {
        const currentValue = form.watch("campaign_sources") || [];
        const newValue = checked
            ? [...currentValue, missionId]
            : currentValue.filter((v) => v !== missionId);
        form.setValue("campaign_sources", newValue);
    };

    return (
        <div className="pt-6">
            <Accordion type="single" collapsible>
                <AccordionItem
                    value="campaign-sources"
                    className="border rounded-md px-4"
                >
                    <AccordionTrigger>
                        <HoverCard openDelay={200}>
                            <HoverCardTrigger asChild>
                                <div className="flex items-center gap-2 text-base">
                                    Campaign Sources
                                    <Badge
                                        variant="secondary"
                                        role="status"
                                        aria-live="polite"
                                        aria-atomic="true"
                                    >
                                        {selectionDescription}
                                    </Badge>
                                </div>
                            </HoverCardTrigger>
                            <HoverCardContent
                                align="start"
                                className="w-fit"
                                role="tooltip"
                            >
                                {selectedMissions.length > 0 ? (
                                    <div className="flex flex-col gap-1">
                                        <p className="text-sm font-medium">
                                            Selected missions:
                                        </p>
                                        <div
                                            className="flex flex-wrap gap-1"
                                            role="list"
                                        >
                                            {selectedMissions.map(
                                                (missionId) => (
                                                    <Badge
                                                        key={`selected-${missionId}`}
                                                        variant="secondary"
                                                        role="listitem"
                                                    >
                                                        {missionId}
                                                    </Badge>
                                                )
                                            )}
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
                            render={() => (
                                <FormItem
                                    role="group"
                                    aria-label="Campaign mission selection"
                                >
                                    <FormControl>
                                        <div className="space-y-6">
                                            {Object.entries(missionsByChapter)
                                                .sort(
                                                    ([a], [b]) =>
                                                        parseInt(a) -
                                                        parseInt(b)
                                                )
                                                .map(
                                                    ([
                                                        chapter,
                                                        chapterMissions,
                                                    ]) => (
                                                        <ChapterMissions
                                                            key={`chapter-${chapter}`}
                                                            chapter={chapter}
                                                            missions={
                                                                chapterMissions
                                                            }
                                                            selectedMissions={
                                                                selectedMissions
                                                            }
                                                            onMissionToggle={
                                                                handleMissionToggle
                                                            }
                                                        />
                                                    )
                                                )}
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
