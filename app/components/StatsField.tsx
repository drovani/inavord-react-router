import { PlusCircleIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { type UseFormReturn } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import type { EquipmentMutation } from "~/data/equipment.zod";

interface StatsFieldProps {
  form: UseFormReturn<EquipmentMutation>;
  existingStats: string[];
}

export default function StatsField({ form, existingStats }: StatsFieldProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [lastAddedStat, setLastAddedStat] = useState<string | null>(null);
  const inputRefs = useRef<Record<string, HTMLInputElement>>({});

  const stats = form.watch('stats') || {};
  const uniqueStats = [...new Set(existingStats)]
    .sort()
    .filter(stat =>
      stat.includes(inputValue.toLowerCase()) &&
      !stats[stat]
    );

  const onAddStat = () => {
    const newStat = inputValue.toLowerCase().trim();
    if (newStat && !stats[newStat]) {
      form.setValue('stats', {
        ...stats,
        [newStat]: 0
      });
      setInputValue("");
      setOpen(false);
      setLastAddedStat(newStat);
    }
  };

  const onSelectStat = (stat: string) => {
    form.setValue('stats', {
      ...stats,
      [stat]: 0
    });
    setOpen(false);
    setLastAddedStat(stat);
  };

  const removeStat = (stat: string) => {
    const newStats = { ...stats };
    delete newStats[stat];
    form.setValue('stats', newStats);
  };

  // Focus the input when lastAddedStat changes
  useEffect(() => {
    if (lastAddedStat && inputRefs.current[lastAddedStat]) {
      inputRefs.current[lastAddedStat].focus();
      setLastAddedStat(null);
    }
  }, [lastAddedStat]);

  return (
    <FormField
      control={form.control}
      name="stats"
      render={() => (
        <FormItem className="space-y-4">
          <FormLabel>Stats</FormLabel>
          <div className="space-y-4 max-w-sm">
            {/* Existing stats */}
            {Object.entries(stats).map(([stat, value]) => (
              <div key={stat} className="flex items-center gap-2">
                <div className="w-40 capitalize">{stat}</div>
                <FormControl>
                  <Input
                    type="number"
                    value={value}
                    onChange={(e) => {
                      form.setValue('stats', {
                        ...stats,
                        [stat]: Number(e.target.value)
                      });
                    }}
                    ref={el => {
                      if (el) inputRefs.current[stat] = el;
                    }}
                    className="w-20"
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeStat(stat)}
                >
                  <XIcon className="size-4" />
                </Button>
              </div>
            ))}

            {/* Add new stat */}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <PlusCircleIcon className="size-4 mr-2" />
                  Add Stat
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64" align="start">
                <div className="space-y-2 p-2">
                  <Input
                    placeholder="Search or add new stat..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <div className="max-h-64 overflow-y-auto space-y-1">
                    {uniqueStats.map(stat => (
                      <Button
                        key={stat}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start font-normal capitalize"
                        onClick={() => onSelectStat(stat)}
                      >
                        {stat}
                      </Button>
                    ))}
                    {inputValue.trim() && !uniqueStats.includes(inputValue.toLowerCase()) && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full"
                        onClick={onAddStat}
                      >
                        Add "{inputValue}"
                      </Button>
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
  );
}