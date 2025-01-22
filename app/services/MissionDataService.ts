import { MissionMutationSchema, type MissionMutation, type MissionRecord } from "~/data/mission.zod";
import missionJson from "~/data/missions.json";
import { BaseDataService } from "./BaseDataService";

class MissionDataService extends BaseDataService<MissionRecord, MissionMutation> {
  protected mutationSchema = MissionMutationSchema;

  constructor() {
    super("missions", "Mission", missionJson as MissionRecord[]);
  }

  protected getRecordId(record: MissionRecord | MissionMutation): string {
    if ("id" in record) {
      return record.id;
    } else {
      return this.mutationSchema.parse(record).id;
    }
  }

  protected sortRecords(records: MissionRecord[]): MissionRecord[] {
    return records.sort((a, b) => {
      const [aChapter, aMission] = a.id.split("-").map(Number);
      const [bChapter, bMission] = b.id.split("-").map(Number);
      return aChapter === bChapter ? aMission - bMission : aChapter - bChapter;
    });
  }

  async getMissionsByBoss(boss: string): Promise<MissionRecord[]> {
    return (await this.getAll()).filter((mission) => mission.boss === boss);
  }
}
export default new MissionDataService();
