import { Form, Link } from "@remix-run/react";
import { useState } from "react";
import slugify from "slugify";
import { CampaignChapter } from "~/constants";
import { EquipmentMutation, EquipmentRecord } from "~/data";
import ButtonBar from "./ButtonBar";
import EquipmentImage from "./EquipmentImage";
import SelectKeyValues from "./SelectKeyValues";
import { Button, buttonVariants } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Separator } from "./ui/separator";

function EquipmentForm({ equipment, chapters, allStats, cancelHref }: Props) {
    const [forImageQuality, setForImageQuality] = useState(
        equipment.equipment_quality
    );
    const [dynamicSlug, setDynamicSlug] = useState<string | undefined>(
        equipment.slug
    );
    const [isFragment, setIsFragment] = useState<boolean | "indeterminate">(
        false
    );

    const onNameChange = (value: string) => {
        setDynamicSlug(slugify(value, { lower: true, strict: true }));
    };

    return (
        <Form
            key={"id" in equipment ? equipment.id : "new"}
            id="equipment-form"
            method="post"
            autoComplete="off"
        >
            <div className="space-y-12">
                <h1>Equipment Editor</h1>
                <section className="grid grid-cols-2 gap-x-4 gap-y-8">
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            required
                            defaultValue={equipment.name}
                            id="name"
                            className="max-w-lg col-span-full"
                            onChange={(evnt) => onNameChange(evnt.target.value)}
                            autoComplete="off"
                        />
                    </div>
                    Quality
                    <RadioGroup
                        defaultValue={equipment.equipment_quality}
                        onValueChange={(value) =>
                            setForImageQuality(
                                value as EquipmentMutation["equipment_quality"]
                            )
                        }
                        name="equipment_quality"
                    >
                        {["gray", "green", "blue", "purple", "orange"].map(
                            (quality, index) => (
                                <Label key={`${quality}-${index}`}>
                                    <RadioGroupItem value={quality} />
                                    <span className="capitalize">
                                        {quality}
                                    </span>
                                </Label>
                            )
                        )}
                    </RadioGroup>
                    <EquipmentImage
                        equipment={{
                            ...equipment,
                            slug: dynamicSlug,
                            equipment_quality: forImageQuality,
                        }}
                        isFragment={
                            forImageQuality !== "gray" && isFragment === true
                        }
                        aria-hidden="true"
                    />
                    <Label
                        className={
                            forImageQuality === "gray"
                                ? "text-muted-foreground"
                                : ""
                        }
                    >
                        <Checkbox
                            name="is_fragment"
                            checked={isFragment}
                            disabled={forImageQuality === "gray"}
                            onCheckedChange={(state) => setIsFragment(state)}
                        />
                        Is fragment?
                    </Label>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="level_required">Required level</Label>
                        <Input
                            required
                            defaultValue={equipment.level_required || 1}
                            type="number"
                            id="level_required"
                            min={1}
                        />
                    </div>
                    <div className="col-span-2">
                        <h3>Bonus stats</h3>
                        <SelectKeyValues
                            entries={equipment.stats}
                            allKeys={allStats.sort()}
                            inputNamePrefix="stats"
                        ></SelectKeyValues>
                    </div>
                </section>
                <Separator />
                <section className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <h2 className="col-span-full">Buy, Sell, Gold, & Raid</h2>
                    <h3 className="col-span-full">Selling value</h3>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="sell.gold">Gold</Label>
                        <Input
                            defaultValue={equipment.sell?.gold}
                            id="sell.gold"
                            type="number"
                            min={0}
                        />
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="sell.guild_activity_points">
                            Guild activity points
                        </Label>
                        <Input
                            defaultValue={equipment.sell?.guild_activity_points}
                            id="sell.guild_activity_points"
                            type="number"
                            min={0}
                        />
                    </div>
                    <h3 className="col-span-full">Market value</h3>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="gold_value">Gold</Label>
                        <Input
                            defaultValue={equipment.gold_value}
                            id="gold_value"
                            type="number"
                            min={0}
                        />
                    </div>
                </section>
                <Separator />
                <section className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <h2 className="col-span-full">Found in</h2>
                    {Array.from({ length: 13 }, (v, k) => ({
                        name: `Chapter ${k + 1}`,
                        chapter: k + 1,
                    })).map((chapterHeader, index) => {
                        const levels = chapters.filter(
                            (c) => c.chapter === chapterHeader.chapter
                        );
                        return (
                            <div
                                key={`${chapterHeader}-${index}`}
                                className="col-span-full sm:col-span-1"
                                defaultValue={equipment.chapters}
                            >
                                <h3>{chapterHeader.name}</h3>
                                {levels.map((level, index) => (
                                    <div
                                        className="flex w-full items-center gap-1.5"
                                        key={`${level}-${index}`}
                                    >
                                        <Label>
                                            <Checkbox
                                                value={`${level.chapter}-${level.level}`}
                                                name="chapters"
                                                checked={equipment.chapters?.includes(
                                                    `${level.chapter}-${level.level}`
                                                )}
                                            />
                                            {level.chapter}-{level.level}:{" "}
                                            {level.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </section>
            </div>
            <ButtonBar>
                <Link
                    to={cancelHref}
                    className={buttonVariants({ variant: "secondary" })}
                >
                    Cancel
                </Link>
                <Button variant={"default"} type="submit">
                    Save
                </Button>
            </ButtonBar>
        </Form>
    );
}

interface Props {
    equipment: EquipmentRecord | EquipmentMutation;
    chapters: CampaignChapter[];
    allStats: string[];
    cancelHref: string;
}

export default EquipmentForm;
