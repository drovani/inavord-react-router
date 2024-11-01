import { z } from "zod";

// Mission schema
export const MissionSchema = z.object({
    id: z
        .string()
        .regex(
            /^\d+-\d+$/,
            "Mission ID must be in format 'chapter-mission' (e.g., '1-1')"
        ),

    chapter: z
        .number()
        .int("Chapter must be an integer")
        .positive("Chapter must be positive"),

    chapter_title: z.string().min(1, "Chapter title cannot be empty"),

    mission_number: z
        .number()
        .int("Mission number must be an integer")
        .positive("Mission number must be positive"),

    name: z.string().min(1, "Mission name cannot be empty"),

    boss: z.string().min(1, "Boss name cannot be empty").optional(),
});

export type Mission = z.infer<typeof MissionSchema>;

export function getChapterFromMission(missionId: string): number {
    const [chapter] = missionId.split("-").map(Number);
    return chapter;
}

export function groupMissionsByChapter(missions: Mission[]) {
    return missions.reduce((acc, mission) => {
        const chapter = mission.chapter;
        if (!acc[chapter]) {
            acc[chapter] = [];
        }
        acc[chapter].push(mission);
        return acc;
    }, {} as Record<number, Mission[]>);
}
