import { Input } from "./ui/input";
import { Label } from "./ui/label";

function SelectKeyValues({ entries = {}, allKeys, inputNamePrefix }: Props) {
    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {allKeys.map((key, index) => (
                <Label className="capitalize" key={`${key}-${index}`}>
                    {key}
                    <Input
                        type="number"
                        min={1}
                        defaultValue={entries[key]}
                        id={`${inputNamePrefix}.${key}`}
                    />
                </Label>
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
