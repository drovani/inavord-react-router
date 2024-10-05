import { Input } from "@nextui-org/react";

function SelectKeyValues({ entries = {}, allKeys, inputNamePrefix }: Props) {
    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {allKeys.map((key, index) => (
                <Input
                    key={`${key}-${index}`}
                    label={key}
                    type="number"
                    classNames={{
                        label: "capitalize",
                    }}
                    min={1}
                    defaultValue={entries[key]?.toString()}
                    name={`${inputNamePrefix}.${key}`}
                />
            ))}
        </div>
    );
}

interface Props {
    entries?: { [key: string]: number };
    allKeys: string[];
    inputNamePrefix: string;
}

export default SelectKeyValues;
