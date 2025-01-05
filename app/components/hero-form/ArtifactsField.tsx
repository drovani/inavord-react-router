import { useState } from "react";
import { type UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { BOOK_STATS, Stats, type HeroMutation, type HeroRecord } from "~/data/hero.zod";
import { generateSlug } from "~/lib/utils";

interface ArtifactsFieldProps {
  form: UseFormReturn<HeroMutation>;
  hero: HeroRecord;
}

function StatDisplay({ stat, prefix }: { stat: string; prefix?: string }) {
  return (
    <div className="flex items-center gap-1 text-nowrap">
      <img src={`/images/stats/${generateSlug(stat)}.png`} alt={stat} className="w-6 h-6" />
      {prefix && <span>{prefix}</span>}
      <span className="capitalize">{stat}</span>
    </div>
  );
}

export default function ArtifactsField({ form, hero }: ArtifactsFieldProps) {
  const artifacts = form.watch("artifacts");
  const availableStats = [...Stats].sort((a, b) => a.localeCompare(b));
  const availableBooks = Object.keys(BOOK_STATS).sort();
  const mainStats = ["strength", "agility", "intelligence"];

  // Initialize artifacts if empty
  if (!artifacts) {
    form.setValue("artifacts", {
      weapon: {
        name: "Weapon Name",
        team_buff: ["armor"],
      },
      book: Object.keys(BOOK_STATS)[0] as keyof typeof BOOK_STATS,
      ring: null,
    });
  }

  // Get the second buff value for UI display, returning "none" if not present
  const [buff2Selection, setBuff2Selection] = useState<string>(() => {
    const buffs = form.getValues("artifacts.weapon.team_buff");
    return buffs?.length > 1 ? buffs[1] : "none";
  });

  return (
    <FormField
      control={form.control}
      name="artifacts"
      render={() => (
        <FormItem className="space-y-4">
          <FormLabel className="text-lg font-semibold">Hero Artifacts</FormLabel>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Weapon Card */}
            <Card>
              <CardHeader>
                <CardTitle>
                  <FormField
                    control={form.control}
                    name="artifacts.weapon.name"
                    render={({ field }) => (
                      <div className="flex flex-col items-center">
                        <img
                          src={`/images/heroes/artifacts/${generateSlug(artifacts?.weapon.name || "weapon")}.png`}
                          alt={artifacts?.weapon.name || "Weapon"}
                          className="size-16 object-contain"
                        />
                        <Input {...field} placeholder="Weapon Name" className="mt-1 font-normal" />
                      </div>
                    )}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center gap-4">
                  <div className="flex-1 space-y-4">
                    <div>
                      <FormLabel className="text-sm">Team Buff 1</FormLabel>
                      <FormField
                        control={form.control}
                        name="artifacts.weapon.team_buff.0"
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                              {field.value ? (
                                <StatDisplay stat={field.value} />
                              ) : (
                                <SelectValue placeholder="Select stat" />
                              )}
                            </SelectTrigger>
                            <SelectContent>
                              {availableStats.map((stat) => (
                                <SelectItem key={stat} value={stat}>
                                  <StatDisplay stat={stat} />
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    <div>
                      <FormLabel className="text-sm">Team Buff 2</FormLabel>
                      <FormField
                        control={form.control}
                        name="artifacts.weapon.team_buff.1"
                        render={({ field }) => (
                          <Select
                            value={buff2Selection}
                            onValueChange={(newValue) => {
                              setBuff2Selection(newValue);
                              if (newValue === "none") {
                                const currentBuff = form.getValues("artifacts.weapon.team_buff");
                                form.setValue("artifacts.weapon.team_buff", [currentBuff[0]]);
                              } else {
                                field.onChange(newValue);
                              }
                            }}
                          >
                            <SelectTrigger>
                              {buff2Selection !== "none" ? (
                                <StatDisplay stat={buff2Selection} />
                              ) : (
                                <span className="text-muted-foreground">None</span>
                              )}
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">
                                <span className="text-muted-foreground">None</span>
                              </SelectItem>
                              {availableStats.map((stat) => (
                                <SelectItem
                                  key={stat}
                                  value={stat}
                                  disabled={stat === form.watch("artifacts.weapon.team_buff.0")}
                                >
                                  <StatDisplay stat={stat} />
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Book Card */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex flex-col items-center gap-2">
                  <img
                    src={`/images/heroes/artifacts/${generateSlug(artifacts?.book || "book")}.png`}
                    alt={artifacts?.book || "Book"}
                    className="size-16 object-contain"
                  />
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="artifacts.book"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            {field.value && <span className="capitalize">{field.value}</span>}
                          </SelectTrigger>
                          <SelectContent>
                            {availableBooks.map((book) => (
                              <SelectItem key={book} value={book}>
                                <span className="capitalize">{book}</span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {artifacts?.book && BOOK_STATS[artifacts.book].map((stat) => <StatDisplay key={stat} stat={stat} />)}
                </div>
              </CardContent>
            </Card>

            {/* Ring Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center gap-2">
                  <div className="relative w-16 h-16 shrink-0">
                    <img
                      src={`/images/heroes/artifacts/ring-of-${hero.main_stat}.png`}
                      alt={`Ring of ${hero.main_stat}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <Select value={hero.main_stat}>
                      <SelectTrigger>
                        <StatDisplay stat={hero.main_stat} prefix="Ring of" />
                      </SelectTrigger>
                      <SelectContent>
                        {mainStats.map((stat) => (
                          <SelectItem key={stat} value={stat} disabled={stat !== hero.main_stat}>
                            <StatDisplay stat={stat} prefix="Ring of" />
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
