import {
    Button,
    Checkbox,
    CheckboxGroup,
    Divider,
    Input,
    Link,
    Radio,
    RadioGroup,
} from "@nextui-org/react";
import { Form } from "@remix-run/react";
import { useState } from "react";
import slugify from "slugify";
import { CampaignChapter } from "~/constants";
import { EquipmentMutation, EquipmentRecord } from "~/data";
import ButtonBar from "./ButtonBar";
import EquipmentImage from "./EquipmentImage";
import SelectKeyValues from "./SelectKeyValues";

function EquipmentForm({ equipment, chapters, allStats, cancelHref }: Props) {
    const [forImageQuality, setForImageQuality] = useState(
        equipment.equipment_quality
    );
    const [dynamicSlug, setDynamicSlug] = useState<string | undefined>(
        equipment.slug
    );
    const [isFragment, setIsFragment] = useState<boolean>(false);

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
                    <Input
                        label="Name"
                        isRequired
                        labelPlacement="outside"
                        defaultValue={equipment.name}
                        name="name"
                        size="lg"
                        className="max-w-lg col-span-full"
                        onValueChange={onNameChange}
                    />
                    <RadioGroup
                        label="Quality"
                        defaultValue={equipment.equipment_quality}
                        onChange={(event) =>
                            setForImageQuality(event.target.value)
                        }
                        name="equipment_quality"
                    >
                        {["gray", "green", "blue", "purple", "orange"].map(
                            (quality, index) => (
                                <Radio
                                    key={`${quality}-${index}`}
                                    value={quality}
                                    className="capitalize"
                                >
                                    {quality}
                                </Radio>
                            )
                        )}
                    </RadioGroup>
                    <EquipmentImage
                        equipment={{
                            ...equipment,
                            slug: dynamicSlug,
                            equipment_quality: forImageQuality,
                        }}
                        isFragment={forImageQuality !== "gray" && isFragment}
                        aria-hidden="true"
                    />
                    <Checkbox
                        name="is_fragment"
                        isSelected={isFragment}
                        isIndeterminate={forImageQuality === "gray"}
                        onValueChange={setIsFragment}
                    >
                        Is fragment?
                    </Checkbox>
                    <Input
                        label="Required level"
                        isRequired
                        defaultValue={
                            equipment.level_required?.toString() || "1"
                        }
                        type="number"
                        name="level_required"
                        min={1}
                    />
                    <div className="col-span-2">
                        <h3>Bonus stats</h3>
                        <SelectKeyValues
                            entries={equipment.stats}
                            allKeys={allStats.sort()}
                            inputNamePrefix="stats"
                        ></SelectKeyValues>
                    </div>
                </section>
                <Divider />
                <section className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <h2 className="col-span-full">Buy, Sell, Gold, & Raid</h2>
                    <h3 className="col-span-full">Selling value</h3>
                    <Input
                        label="Gold"
                        defaultValue={equipment.level_required?.toString()}
                        name="sell.gold"
                        type="number"
                        min={0}
                    />
                    <Input
                        label="Guild activity points"
                        defaultValue={equipment.sell?.guild_activity_points?.toString()}
                        name="sell.guild_activity_points"
                        type="number"
                        min={0}
                    />
                    <h3 className="col-span-full">Market value</h3>
                    <Input
                        label="Gold"
                        defaultValue={equipment.gold_value?.toString()}
                        name="gold_value"
                        type="number"
                        min={0}
                    />
                </section>
                <Divider />
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
                            <CheckboxGroup
                                key={`${chapterHeader}-${index}`}
                                label={chapterHeader.name}
                                className="col-span-full sm:col-span-1"
                                defaultValue={equipment.chapters}
                            >
                                {levels.map((level, index) => (
                                    <Checkbox
                                        key={`${level}-${index}`}
                                        value={`${level.chapter}-${level.level}`}
                                        name="chapters"
                                    >
                                        {level.chapter}-{level.level}:{" "}
                                        {level.name}
                                    </Checkbox>
                                ))}
                            </CheckboxGroup>
                        );
                    })}
                </section>
            </div>
            <ButtonBar>
                <Button as={Link} href={cancelHref}>
                    Cancel
                </Button>
                <Button color="success" type="submit">
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
