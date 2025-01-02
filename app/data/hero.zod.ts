// hero.zod.ts
import { z } from "zod";

export const Stats = [
  "intelligence",
  "agility",
  "strength",
  "health",
  "physical attack",
  "magic attack",
  "armor",
  "magic defense",
  "dodge",
  "magic penetration",
  "vampirism",
  "armor penetration",
] as const;

const WeaponTeamBuff = [
  "armor",
  "dodge",
  "physical attack",
  "magic attack",
  "magic defense",
  "armor penetration",
  "crit hit chance",
  "magic penetration",
] as const;

const BookOptions = [
  "Alchemist's Folio",
  "Book of Illusions",
  "Defender's Covenant",
  "Manuscript of the Void",
  "Tome of Arcane Knowledge",
  "Warrior's Code",
] as const;

export const HeroClass = ["tank", "warrior", "mage", "support", "control", "marksman", "healer"] as const;

export const HeroFaction = ["nature", "chaos", "honor", "eternity", "mystery", "progress"] as const;

export const MainStat = ["strength", "agility", "intelligence"] as const;

export const BOOK_STATS = {
  "Alchemist's Folio": ["armor penetration", "physical attack"],
  "Book of Illusions": ["dodge", "health"],
  "Defender's Covenant": ["armor", "magic defense"],
  "Manuscript of the Void": ["magic attack", "magic penetration"],
  "Tome of Arcane Knowledge": ["magic attack", "health"],
  "Warrior's Code": ["physical attack", "crit hit chance"],
} as const;

export const SkinSchema = z.object({
  name: z.string(),
  stat: z.enum(Stats),
  source: z.string().optional(),
});

export const ArtifactSchema = z.object({
  weapon: z.object({
    name: z.string(),
    team_buff: z.array(z.enum(WeaponTeamBuff)).min(1),
  }),
  book: z.enum(BookOptions),
  ring: z.null(),
});

// Quality levels for equipment upgrades
export const QualityLevels = [
  "white",
  "green",
  "green+1",
  "blue",
  "blue+1",
  "blue+2",
  "purple",
  "purple+1",
  "purple+2",
  "purple+3",
  "orange",
  "orange+1",
  "orange+2",
  "orange+3",
  "orange+4",
] as const;

// Equipment list for each quality level must have exactly 6 items
export const ItemsSchema = z.object({
  white: z.array(z.string()).length(6),
  green: z.array(z.string()).length(6),
  "green+1": z.array(z.string()).length(6),
  blue: z.array(z.string()).length(6),
  "blue+1": z.array(z.string()).length(6),
  "blue+2": z.array(z.string()).length(6),
  purple: z.array(z.string()).length(6),
  "purple+1": z.array(z.string()).length(6),
  "purple+2": z.array(z.string()).length(6),
  "purple+3": z.array(z.string()).length(6),
  orange: z.array(z.string()).length(6),
  "orange+1": z.array(z.string()).length(6),
  "orange+2": z.array(z.string()).length(6),
  "orange+3": z.array(z.string()).length(6),
  "orange+4": z.array(z.string()).length(6),
});

// Complete Hero Schema that includes all fields
export const HeroSchema = z.object({
  name: z.string(),
  slug: z.string(),
  class: z.enum(HeroClass),
  faction: z.enum(HeroFaction),
  main_stat: z.enum(MainStat),
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
  // Optional fields that can be edited
  artifacts: ArtifactSchema.optional(),
  skins: z.array(SkinSchema).min(1),
  items: ItemsSchema.optional(),
  glyphs: z.array(z.enum(Stats).optional()).length(5),
});

// The mutation schema for editable hero fields only
export const HeroMutationSchema = HeroSchema.pick({
  artifacts: true,
  skins: true,
  items: true,
  glyphs: true,
});

export type HeroRecord = z.infer<typeof HeroSchema>;
export type HeroMutation = z.infer<typeof HeroMutationSchema>;

// Export additional type helpers
export type HeroClass = (typeof HeroClass)[number];
export type HeroFaction = (typeof HeroFaction)[number];
export type HeroMainStat = (typeof MainStat)[number];
export type HeroQualityLevel = (typeof QualityLevels)[number];
export type HeroStat = (typeof Stats)[number];
export type WeaponTeamBuff = (typeof WeaponTeamBuff)[number];
export type BookOption = (typeof BookOptions)[number];
export type HeroSkin = z.infer<typeof SkinSchema>;
export type HeroArtifact = z.infer<typeof ArtifactSchema>;
