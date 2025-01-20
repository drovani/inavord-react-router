//components/hero-form/GlyphsField.tsx
import { type UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import type { HeroMutation, HeroRecord } from "~/data/hero.zod";
import { Stats, type HeroStat } from "~/data/ReadonlyArrays";
import { generateSlug } from "~/lib/utils";

interface GlyphsFieldProps {
  form: UseFormReturn<HeroMutation>;
  hero: HeroRecord;
}

function StatDisplay({ stat }: { stat: string }) {
  return (
    <div className="flex items-center gap-2">
      <img src={`/images/stats/${generateSlug(stat)}.png`} alt={stat} className="w-6 h-6" />
      <span className="capitalize">{stat}</span>
    </div>
  );
}

export default function GlyphsField({ form, hero }: GlyphsFieldProps) {
  const glyphs = form.watch("glyphs") || [];

  const mainStats = ["strength", "agility", "intelligence"];
  const availableStats = [...Stats].sort((l, r) => l.localeCompare(r));

  // Initialize glyphs if empty with empty slots and main stat as last glyph
  if (glyphs.length === 0) {
    form.setValue("glyphs", [undefined, undefined, undefined, undefined, hero.main_stat]);
  }

  const updateGlyph = (index: number, stat: HeroStat) => {
    const newGlyphs = [...glyphs];
    newGlyphs[index] = stat;
    form.setValue("glyphs", newGlyphs);
  };

  // Helper to disable already selected stats except for the current index
  const isStatDisabled = (stat: HeroStat, currentIndex: number) => {
    if (mainStats.includes(stat)) return true; // Main stats are disabled
    return glyphs.some((glyph, idx) => glyph === stat && idx !== currentIndex);
  };

  return (
    <FormField
      control={form.control}
      name="glyphs"
      render={() => (
        <FormItem className="space-y-4">
          <FormLabel className="text-lg font-semibold">Glyphs</FormLabel>
          <div className="space-y-2 rounded-lg border p-4">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 md:grid-cols-5">
              {glyphs.map((glyph, index) => (
                <div key={index} className="space-y-2">
                  <FormLabel className="text-sm text-muted-foreground">Glyph {index + 1}</FormLabel>
                  {index === 4 ? (
                    <div className="h-10 px-3 py-2 border rounded-md bg-muted flex items-center gap-2">
                      <img
                        src={`/images/stats/${generateSlug(hero.main_stat)}.png`}
                        alt={hero.main_stat}
                        className="w-6 h-6"
                      />
                      <span className="capitalize">{hero.main_stat}</span>
                    </div>
                  ) : (
                    <Select value={glyph || undefined} onValueChange={(value) => updateGlyph(index, value as HeroStat)}>
                      <SelectTrigger>
                        {glyph ? <StatDisplay stat={glyph} /> : <SelectValue placeholder="Select stat" />}
                      </SelectTrigger>
                      <SelectContent>
                        {availableStats.map((stat) => (
                          <SelectItem key={stat} value={stat} disabled={isStatDisabled(stat, index)}>
                            <StatDisplay stat={stat} />
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              ))}
            </div>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
