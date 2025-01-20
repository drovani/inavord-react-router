import type { z, ZodError } from "zod";
import { HeroMutationSchema, type HeroMutation, type HeroRecord } from "~/data/hero.zod";
import heroJson from "~/data/heroes.json";
import { BaseDataService } from "./BaseDataService";

class HeroDataService extends BaseDataService<HeroRecord, HeroMutation> {
  protected mutationSchema = HeroMutationSchema as unknown as z.ZodType<HeroRecord, z.ZodTypeDef, HeroMutation>;

  constructor() {
    super("heroes", "Hero", heroJson as HeroRecord[]);
  }

  protected getRecordId(record: HeroRecord | HeroMutation): string {
    if ("slug" in record) {
      return record.slug;
    } else {
      throw new Error("Cannot get record id from a HeroMutation");
    }
  }

  protected sortRecords(records: HeroRecord[]): HeroRecord[] {
    return records.sort((a, b) => a.name.localeCompare(b.name));
  }

  override async create(_: HeroMutation): Promise<HeroRecord | ZodError<HeroMutation>> {
    throw new Error("Cannot create new Hero record.");
  }

  async getHeroesUsingItem(slug: string): Promise<HeroRecord[]> {
    return await this.getAll().then((heroes) =>
      heroes.filter((h) => h.items && Object.values(h.items).flat().includes(slug))
    );
  }
}

export default new HeroDataService();
