import { z } from "zod";

export const HeroSchema = z.object({
  name: z.string(),
  slug: z.string(),
  class: z.enum(["tank", "warrior", "mage", "support", "control", "marksman", "healer"]),
  faction: z.enum(["nature", "chaos", "honor", "eternity", "mystery", "progress"]),
  main_stat: z.enum(["strength", "agility", "intelligence"]),
  attack_type: z.array(z.enum(["physical", "magic", "pure"])),
  stone_source: z.array(
    z.enum([
      "Arena Shop",
      "Campaign",
      "Heroic Chest",
      "Outland Shop",
      "Special Events",
      "Dungeon Shop",
      "Guild War Shop",
      "Grand Arena Shop",
      "Tower Shop",
      "Town Shop",
      "Highwayman Shop",
      "Hydra Shop",
      "Soul Shop",
    ])
  ),
  order_rank: z.number().positive(),
  artifacts: z
    .object({
      weapon: z.object({
        name: z.string(),
        team_buff: z.array(
          z.enum([
            "armor",
            "dodge",
            "physical attack",
            "magic attack",
            "magic defense",
            "armor penetration",
            "crit hit chance",
            "magic penetration",
          ])
        ),
      }),
      book: z.enum([
        "Alchemist's Folio",
        "Book of Illusions",
        "Defender's Covenant",
        "Manuscript of the Void",
        "Tome of Arcane Knowledge",
        "Warrior's Code",
      ]),
      ring: z.never(),
    })
    .optional(),
});

export type HeroRecord = z.infer<typeof HeroSchema>;
export type HeroClass = HeroRecord["class"];
export type HeroFaction = HeroRecord["faction"];
export type HeroMainStat = HeroRecord["main_stat"];
export type HeroAttackType = HeroRecord["attack_type"][number];
export type HeroStoneSource = HeroRecord["stone_source"][number];

export const BOOK_STATS: Record<string, string[]> = {
  "Alchemist's Folio": ["armor penetration", "physical attack"],
  "Book of Illusions": ["dodge", "health"],
  "Defender's Covenant": ["armor", "magic defense"],
  "Manuscript of the Void": ["magic attack", "magic penetration"],
  "Tome of Arcane Knowledge": ["magic attack", "health"],
  "Warrior's Code": ["physical attack", "crit hit chance"],
} as const;
