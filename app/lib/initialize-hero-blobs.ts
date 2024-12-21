import { getStore } from "@netlify/blobs";
import type { HeroRecord } from "~/data/hero.zod";
import heroData from "~/data/heroes.json";
import { generateSlug } from "~/lib/utils";

interface InitializationOptions {
  skipExisting?: boolean;
  failIfExists?: boolean;
  forceUpdate?: boolean;
}

interface InitializationResult {
  success: number;
  skipped: number;
  errors: number;
  total: number;
  existingCount: number;
  details: string[];
}

export async function initializeHeroBlobs(options: InitializationOptions = {}): Promise<InitializationResult> {
  const { skipExisting = true, failIfExists = false, forceUpdate = false } = options;
  const details: string[] = [];

  try {
    details.push("Starting hero blob initialization...");

    const store = getStore({ name: "heroes" });

    const existingKeys = await store.list();
    const existingCount = existingKeys.blobs.length;

    if (existingCount > 0) {
      details.push(`Found ${existingCount} existing heroes`);

      if (failIfExists) {
        throw new Error("Existing hero data found. Aborting initialization.");
      }
    }

    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    for (const hero of heroData as HeroRecord[]) {
      try {
        const slug = generateSlug(hero.name);
        const heroWithSlug = { ...hero, slug };

        const exists = Boolean(await store.get(slug));

        if (exists && !forceUpdate) {
          if (skipExisting) {
            details.push(`⤍ Skipping existing hero: ${hero.name}`);
            skippedCount++;
            continue;
          } else {
            throw new Error("Hero already exists and skipExisting is false");
          }
        }

        await store.set(slug, JSON.stringify(heroWithSlug));

        const action = exists ? "Updated" : "Stored";
        details.push(`✓ Successfully ${action.toLowerCase()} ${hero.name}`);
        successCount++;
      } catch (error) {
        console.error(`✗ Failed to handle ${hero.name}:`, error);
        errorCount++;
      }
    }

    details.push("Initialization complete:");
    details.push(`✓ Successfully stored ${successCount} heroes`);
    details.push(`⤍ Skipped ${skippedCount} existing heroes`);
    if (errorCount > 0) {
      details.push(`✗ Failed to store ${errorCount} heroes`);
    }

    return {
      success: successCount,
      skipped: skippedCount,
      errors: errorCount,
      total: heroData.length,
      existingCount,
      details,
    };
  } catch (error) {
    console.error("Fatal error during initialization:", error);
    throw error;
  }
}
