import { getStore, type Store } from "@netlify/blobs";
import { z, ZodError } from "zod";

export interface DataService<TRecord, TMutation> {
  getAll(ids?: string[]): Promise<TRecord[]>;
  getById(id: string): Promise<TRecord | null>;
  create(record: TMutation): Promise<TRecord | ZodError<TMutation>>;
  update(id: string, record: TMutation): Promise<TRecord | ZodError<TMutation>>;
  delete(id: string): Promise<void>;
  isInitialized(): boolean;
}

export const ChangeTrackedSchema = z.object({
  updatedOn: z.string().date(),
});
export interface IChangeTracked extends z.infer<typeof ChangeTrackedSchema> {}

export abstract class BaseDataService<TRecord extends IChangeTracked, TMutation>
  implements DataService<TRecord, TMutation>
{
  protected netlifyStore: Store;
  protected abstract mutationSchema: z.ZodType<TRecord, z.ZodTypeDef, TMutation>;
  protected recordName: string;

  protected localRecordsCache: Map<string, TRecord> = new Map();
  protected initializedLocalCache: boolean = false;
  protected useLocalCache: boolean = true;
  protected dirtyLocalRecords: Map<string, TRecord | undefined> = new Map();

  constructor(storeName: string, recordName: string) {
    this.netlifyStore = getStore({ name: storeName });
    this.initializeLocalCacheFromData();
    this.recordName = recordName;
  }

  protected abstract initializeLocalCacheFromData(): void;
  protected abstract getRecordId(record: TRecord | TMutation): string;
  protected abstract sortRecords(records: TRecord[]): TRecord[];

  protected async isNetlifyStorageAccessible(): Promise<boolean> {
    try {
      this.netlifyStore.list({ paginate: true });
      return true;
    } catch (error) {
      return false;
    }
  }

  protected async initializeLocalStorage(): Promise<void> {
    if (!this.initializedLocalCache) {
      throw new Error("Local cache was not initialized during class instantiation.");
    }

    this.useLocalCache = !(await this.isNetlifyStorageAccessible());

    if (this.useLocalCache) {
      console.warn(
        "Using local storage fallback at Netlify Storage is not currently accessible. Changes will be stored in local cache until Netlify storage is accessible."
      );
    }
  }

  protected async syncToNetlify(): Promise<void> {
    if (!this.useLocalCache || !(await this.isNetlifyStorageAccessible())) {
      return;
    }

    try {
      const localDirtyData = [...this.dirtyLocalRecords];

      for (const record of localDirtyData) {
        if (record[1] === undefined) {
          await this.netlifyStore.delete(record[0]);
        } else {
          await this.netlifyStore.set(record[0], JSON.stringify(record[1]));
        }
        this.dirtyLocalRecords.delete(record[0]);
      }

      if (this.dirtyLocalRecords.size === 0) {
        this.useLocalCache = false;
        console.log(`Successfully set all dirty local ${this.recordName} records to Netlify storage.`);
      } else {
        console.warn(
          `${this.dirtyLocalRecords.size} dirty local ${this.recordName} records not synced to Netlify storage.`
        );
      }
    } catch (error) {
      console.error(
        `Failed to sync ${this.dirtyLocalRecords.size} dirty local ${this.recordName} records to Netlfy storage`,
        error
      );
      throw error;
    }
  }

  async getAll(ids?: string[]): Promise<TRecord[]> {
    await this.initializeLocalStorage();

    try {
      if (this.useLocalCache) {
        if (ids) {
          const found: TRecord[] = [];
          this.localRecordsCache.forEach((value, key) => (ids.includes(key) ? found.push(value) : null));
          return this.sortRecords(found);
        } else {
          return [...this.localRecordsCache].map((item) => item[1]);
        }
      }
      const storeList = await this.netlifyStore.list();
      const recordPromises = storeList.blobs.map(async (blob) => {
        if (ids && !ids.includes(blob.key)) return null;

        const data = await this.netlifyStore.get(blob.key);
        if (!data) return null;
        return JSON.parse(data) as TRecord;
      });

      const results = await Promise.all(recordPromises);
      let records = results.filter((record): record is NonNullable<typeof record> => record !== null);

      if (ids) {
        records = records.filter((record) => ids.some((id) => id === this.getRecordId(record)));
      }

      return this.sortRecords(records);
    } catch (error) {
      console.error(`Failed to get all ${this.recordName} records:`, error);
      throw new Error(`Failed to retrieve ${this.recordName} records.`);
    }
  }

  async getById(id: string): Promise<TRecord | null> {
    await this.initializeLocalStorage();

    try {
      if (this.useLocalCache) {
        return this.localRecordsCache.get(id) || null;
      }

      const data = await this.netlifyStore.get(id);
      if (!data) return null;

      return JSON.parse(data) as TRecord;
    } catch (error) {
      console.error(`Failed to get ${this.recordName} ${id}:`, error);
      throw new Error(`Failed to retrieve ${this.recordName} ${id}`);
    }
  }

  async create(record: TMutation): Promise<TRecord | ZodError<TMutation>> {
    await this.initializeLocalStorage();

    try {
      const parseResults = this.mutationSchema.safeParse(record);
      if (!parseResults.success) {
        return parseResults.error;
      }

      const id = this.getRecordId(parseResults.data);
      const existing = await this.getById(id);

      if (existing) {
        throw new Error(`${this.recordName} record with id ${id} already exists.`);
      }

      if (this.useLocalCache) {
        this.localRecordsCache.set(id, parseResults.data);
        this.dirtyLocalRecords.set(id, parseResults.data);
        await this.syncToNetlify().catch((error) => {
          console.warn(`Failed to sync new ${this.recordName} record to Netlify:`, error);
        });
      } else {
        await this.netlifyStore.set(id, JSON.stringify(parseResults.data));
      }

      return parseResults.data;
    } catch (error) {
      console.error(`Failed to create ${this.recordName} record:`, error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Failed to create ${this.recordName} record.`);
    }
  }

  async update(id: string, mutation: TMutation): Promise<TRecord | ZodError<TMutation>> {
    await this.initializeLocalStorage();
    try {
      const parseResults = this.mutationSchema.safeParse(mutation);
      if (!parseResults.success) {
        return parseResults.error;
      }

      const newId = this.getRecordId(parseResults.data);

      if (newId !== id) {
        throw new Error(`Cannot change ${this.recordName} record ID from ${id} to ${newId}`);
      }

      const existing = await this.getById(id);
      if (!existing) {
        throw new Error(`${this.recordName} record with id ${id} not found.`);
      }

      if (this.useLocalCache) {
        this.localRecordsCache.set(id, parseResults.data);
        this.dirtyLocalRecords.set(id, parseResults.data);
        await this.syncToNetlify().catch((error) => {
          console.warn(`Failed to sync updated ${this.recordName} record to Netlify:`, error);
        });
      } else {
        await this.netlifyStore.set(id, JSON.stringify(parseResults.data));
      }

      return parseResults.data;
    } catch (error) {
      console.error(`Failed to update ${this.recordName} record ${id}:`, error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Failed to update ${this.recordName} record ${id}.`);
    }
  }

  async delete(id: string): Promise<void> {
    await this.initializeLocalStorage();

    try {
      const existing = await this.getById(id);
      if (!existing) {
        throw new Error(`${this.recordName} record with id ${id} not found.`);
      }

      if (this.useLocalCache) {
        this.localRecordsCache.delete(id);
        this.dirtyLocalRecords.set(id, undefined);
        await this.syncToNetlify().catch((error) => {
          console.warn(`Failed to delete ${this.recordName} record ${id} from Netlify:`, error);
        });
      } else {
        await this.netlifyStore.delete(id);
      }
    } catch (error) {
      console.error(`Failed to delete ${this.recordName} record ${id}:`, error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Failed to delete ${this.recordName} record ${id}.`);
    }
  }

  isInitialized(): boolean {
    return this.initializedLocalCache;
  }
}
