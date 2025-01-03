//components/hero-form/SkinsField.tsx
import { PlusCircleIcon, XIcon } from "lucide-react";
import { useRef } from "react";
import { type UseFormReturn } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "~/components/ui/select";
import { Stats, type HeroMutation, type HeroRecord } from "~/data/hero.zod";
import { generateSlug } from "~/lib/utils";

function StatDisplay({ stat }: { stat: string }) {
  return (
    <div className="flex items-center gap-2">
      <img src={`/images/stats/${generateSlug(stat)}.png`} alt={stat} className="w-6 h-6" />
      <span className="capitalize">{stat}</span>
    </div>
  );
}

interface SkinsFieldProps {
  form: UseFormReturn<HeroMutation>;
  hero: HeroRecord;
}

export default function SkinsField({ form, hero }: SkinsFieldProps) {
  const skins = form.watch("skins") || [];
  const inputRefs = useRef<Record<number, HTMLInputElement>>({});

  const theOtherMainStats = ["strength", "agility", "intelligence"].filter((stat) => stat !== hero.main_stat);
  const availableStats = Stats.map((stat) => ({ stat, disabled: theOtherMainStats.includes(stat) })).sort((l, r) =>
    l.stat.localeCompare(r.stat)
  );

  // Ensure default skin always exists
  if (skins.length === 0) {
    form.setValue("skins", [{ name: "Default Skin", stat: "health" }]);
  }

  const addSkin = () => {
    const newIndex = skins.length;
    form.setValue("skins", [...skins, { name: "", stat: "health" }]);
    // Use setTimeout to ensure the input element is rendered
    setTimeout(() => {
      inputRefs.current[newIndex]?.focus();
    }, 0);
  };

  const removeSkin = (index: number) => {
    if (index === 0) return; // Prevent removing default skin
    const newSkins = [...skins];
    newSkins.splice(index, 1);
    form.setValue("skins", newSkins);
  };

  const updateSkinName = (index: number, name: string) => {
    const newSkins = [...skins];
    newSkins[index] = { ...newSkins[index], name };
    form.setValue("skins", newSkins);
  };

  const updateSkinStat = (index: number, stat: (typeof Stats)[number]) => {
    const newSkins = [...skins];
    newSkins[index] = { ...newSkins[index], stat };
    form.setValue("skins", newSkins);
  };

  return (
    <FormField
      control={form.control}
      name="skins"
      render={() => (
        <FormItem className="space-y-4">
          <FormLabel className="text-lg font-semibold">Hero Skins</FormLabel>
          <div className="space-y-2 rounded-lg border p-4">
            <div className="grid grid-cols-[1fr_200px_40px] gap-4 items-center mb-4">
              <FormLabel className="text-sm text-muted-foreground">Name</FormLabel>
              <FormLabel className="text-sm text-muted-foreground">Stat Boost</FormLabel>
              <div /> {/* Spacer for action button column */}
            </div>
            <div className="space-y-2">
              {skins.map((skin, index) => (
                <div key={index} className="grid grid-cols-[1fr_200px_40px] gap-4 items-center">
                  {index === 0 ? (
                    <div className="font-medium">Default Skin</div>
                  ) : (
                    <Input
                      ref={(el) => {
                        if (el) inputRefs.current[index] = el;
                      }}
                      value={skin.name}
                      onChange={(e) => updateSkinName(index, e.target.value)}
                      placeholder="Enter skin name"
                    />
                  )}
                  <Select
                    value={skin.stat}
                    onValueChange={(value) => updateSkinStat(index, value as (typeof Stats)[number])}
                  >
                    <SelectTrigger>
                      <StatDisplay stat={skin.stat} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableStats.map((stat) => (
                        <SelectItem key={stat.stat} value={stat.stat} disabled={stat.disabled}>
                          <StatDisplay stat={stat.stat} />
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {index !== 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSkin(index)}
                      className="h-8 w-8"
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  )}
                  {index === 0 && <div />} {/* Empty space for consistent grid */}
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addSkin} className="w-full mt-4">
              <PlusCircleIcon className="mr-2 h-4 w-4" />
              Add Skin
            </Button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
