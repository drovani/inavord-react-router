import { getStore, type Store } from "@netlify/blobs";
import { HeroSchema, type HeroClass, type HeroFaction, type HeroRecord } from "~/data/hero.zod";
import heroData from "~/data/heroes.json";
import { generateSlug } from "~/lib/utils";

type HeroStringAndNumberFields = {
  [K in keyof HeroRecord]: HeroRecord[K] extends string | number ? K : never;
}[keyof HeroRecord];

class LocalHeroCache {
  private heroes: Map<string, HeroRecord> = new Map();
  private initialized: boolean = false;

  constructor() {
    this.initializeFromJson();
  }

  private initializeFromJson() {
    const records = heroData as HeroRecord[];
    records.forEach((record) => {
      const enrichedRecord = {
        ...record,
        slug: generateSlug(record.name),
      };
      this.heroes.set(enrichedRecord.slug, enrichedRecord);
    });
    this.initialized = true;
  }

  async getAll(): Promise<HeroRecord[]> {
    return Array.from(this.heroes.values()).sort((a, b) => a.order_rank - b.order_rank);
  }

  async get(slug: string): Promise<HeroRecord | null> {
    return this.heroes.get(slug) || null;
  }

  async set(slug: string, record: HeroRecord): Promise<void> {
    this.heroes.set(slug, record);
  }

  async delete(slug: string): Promise<void> {
    this.heroes.delete(slug);
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}

export class HeroDAL {
  private store: Store;
  private localCache: LocalHeroCache;
  private useLocalCache: boolean = false;

  constructor() {
    this.store = getStore({
      name: "heroes",
    });
    this.localCache = new LocalHeroCache();
  }

  private async isNetlifyStorageAccessible(): Promise<boolean> {
    try {
      await this.store.list();
      return true;
    } catch (error) {
      return false;
    }
  }

  private async initializeStorage(): Promise<void> {
    if (!this.localCache.isInitialized()) {
      throw new Error("Local cache initialization failed");
    }

    this.useLocalCache = !(await this.isNetlifyStorageAccessible());

    if (this.useLocalCache) {
      console.warn("Using local storage fallback. Changes will be temporary until Netlify storage is accessible.");
    }
  }

  private async syncToNetlify(): Promise<void> {
    if (!this.useLocalCache || !(await this.isNetlifyStorageAccessible())) {
      return;
    }

    console.log("Netlify storage is now accessible. Syncing local changes...");

    try {
      const localData = await this.localCache.getAll();

      for (const hero of localData) {
        await this.store.set(hero.slug, JSON.stringify(hero));
      }

      this.useLocalCache = false;
      console.log("Successfully synced local changes to Netlify storage");
    } catch (error) {
      console.error("Failed to sync to Netlify storage:", error);
      throw error;
    }
  }

  async getAllHeroes(slugs?: string[], sortby: HeroStringAndNumberFields = "name"): Promise<HeroRecord[]> {
    await this.initializeStorage();

    try {
      if (this.useLocalCache) {
        return await this.localCache.getAll();
      }

      const storeList = await this.store.list();
      const heroPromises = storeList.blobs.map(async (blob) => {
        if (slugs && !slugs.includes(blob.key)) return null;

        const data = await this.store.get(blob.key);
        if (!data) return null;
        return JSON.parse(data) as HeroRecord;
      });

      let heroes = (await Promise.all(heroPromises))
        .filter((item): item is HeroRecord => item !== null)
        .sort((a, b) => {
          const aVal = a[sortby];
          const bVal = b[sortby];
          return typeof aVal === "string" ? aVal.localeCompare(bVal as string) : (aVal as number) - (bVal as number);
        });

      return heroes;
    } catch (error) {
      console.error("Failed to get all heroes:", error);
      throw new Error("Failed to retrieve hero list");
    }
  }

  async getHero(slug: string): Promise<HeroRecord | null> {
    await this.initializeStorage();

    try {
      if (this.useLocalCache) {
        return await this.localCache.get(slug);
      }

      const data = await this.store.get(slug);
      if (!data) return null;

      return JSON.parse(data) as HeroRecord;
    } catch (error) {
      console.error(`Failed to get hero ${slug}:`, error);
      throw new Error(`Failed to retrieve hero ${slug}`);
    }
  }

  async createHero(hero: HeroRecord): Promise<HeroRecord> {
    await this.initializeStorage();

    try {
      const heroWithSlug = {
        ...hero,
        slug: generateSlug(hero.name),
      };
      const validated = HeroSchema.parse(heroWithSlug);

      const existing = await this.getHero(validated.slug);
      if (existing) {
        throw new Error(`Hero with slug ${validated.slug} already exists`);
      }

      if (this.useLocalCache) {
        await this.localCache.set(validated.slug, validated);
      } else {
        await this.store.set(validated.slug, JSON.stringify(validated));
      }

      if (this.useLocalCache) {
        await this.syncToNetlify().catch((error) => {
          console.warn("Failed to sync new hero to Netlify:", error);
        });
      }

      return validated;
    } catch (error) {
      console.error("Failed to create hero:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to create hero");
    }
  }

  async updateHero(slug: string, hero: HeroRecord): Promise<HeroRecord> {
    await this.initializeStorage();

    try {
      const heroWithSlug = {
        ...hero,
        slug: generateSlug(hero.name),
      };
      const validated = HeroSchema.parse(heroWithSlug);

      const existing = await this.getHero(slug);
      if (!existing) {
        throw new Error(`Hero with slug ${slug} not found`);
      }

      if (validated.slug !== slug) {
        throw new Error(`Cannot change hero slug from ${slug} to ${validated.slug}`);
      }

      if (this.useLocalCache) {
        await this.localCache.set(slug, validated);
      } else {
        await this.store.set(slug, JSON.stringify(validated));
      }

      if (this.useLocalCache) {
        await this.syncToNetlify().catch((error) => {
          console.warn("Failed to sync updated hero to Netlify:", error);
        });
      }

      return validated;
    } catch (error) {
      console.error(`Failed to update hero ${slug}:`, error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Failed to update hero ${slug}`);
    }
  }

  async deleteHero(slug: string): Promise<void> {
    await this.initializeStorage();

    try {
      const existing = await this.getHero(slug);
      if (!existing) {
        throw new Error(`Hero with slug ${slug} not found`);
      }

      if (this.useLocalCache) {
        await this.localCache.delete(slug);
      } else {
        await this.store.delete(slug);
      }

      if (this.useLocalCache) {
        await this.syncToNetlify().catch((error) => {
          console.warn("Failed to sync deletion to Netlify:", error);
        });
      }
    } catch (error) {
      console.error(`Failed to delete hero ${slug}:`, error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Failed to delete hero ${slug}`);
    }
  }

  async getHeroesByClass(heroClass: HeroClass): Promise<HeroRecord[]> {
    try {
      const allHeroes = await this.getAllHeroes();
      return allHeroes.filter((hero) => hero.class === heroClass);
    } catch (error) {
      console.error(`Failed to get heroes for class ${heroClass}:`, error);
      throw new Error(`Failed to get heroes for class ${heroClass}`);
    }
  }

  async getHeroesByFaction(faction: HeroFaction): Promise<HeroRecord[]> {
    try {
      const allHeroes = await this.getAllHeroes();
      return allHeroes.filter((hero) => hero.faction === faction);
    } catch (error) {
      console.error(`Failed to get heroes for faction ${faction}:`, error);
      throw new Error(`Failed to get heroes for faction ${faction}`);
    }
  }
}

export const heroDAL = new HeroDAL();
