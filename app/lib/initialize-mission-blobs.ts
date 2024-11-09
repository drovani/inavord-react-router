import type { Mission } from "@/data/mission.zod";
import missionData from "@/data/missions.json";
import { getStore } from "@netlify/blobs";

interface InitializationOptions {
    /** If true, will skip items that already exist */
    skipExisting?: boolean;
    /** If true, will throw an error if any items exist */
    failIfExists?: boolean;
    /** If true, will force update all items regardless of existence */
    forceUpdate?: boolean;
}

interface InitializationResult {
    success: number;
    skipped: number;
    errors: number;
    total: number;
    existingCount: number;
}

export async function initializeMissionBlobs(
    options: InitializationOptions = {}
): Promise<InitializationResult> {
    const {
        skipExisting = true,
        failIfExists = false,
        forceUpdate = false,
    } = options;

    try {
        console.log("Starting mission blob initialization...");

        const store = getStore("missions");

        // Check for existing data by listing all keys
        const existingKeys = await store.list();
        const existingCount = existingKeys.blobs.length;

        if (existingCount > 0) {
            console.log(`Found ${existingCount} existing mission items`);

            if (failIfExists) {
                throw new Error(
                    "Existing mission data found. Aborting initialization."
                );
            }
        }

        let successCount = 0;
        let errorCount = 0;
        let skippedCount = 0;

        // Process each mission item
        for (const mission of missionData as Mission[]) {
            try {
                // Check if this specific item exists
                const exists = Boolean(await store.get(mission.id));

                if (exists && !forceUpdate) {
                    if (skipExisting) {
                        console.log(
                            `⤍ Skipping existing mission: ${mission.chapter}-${mission.mission_number} ${mission.name}`
                        );
                        skippedCount++;
                        continue;
                    } else {
                        throw new Error(
                            "Mission already exists and skipExisting is false"
                        );
                    }
                }

                // Store the mission data
                await store.set(mission.id, JSON.stringify(mission));

                const action = exists ? "Updated" : "Stored";
                console.log(
                    `✓ Successfully ${action.toLowerCase()} ${mission.chapter}-${mission.mission_number} ${mission.name}`
                );
                successCount++;
            } catch (error) {
                console.error(
                    `✗ Failed to handle ${mission.chapter}-${mission.mission_number} ${mission.name}:`,
                    error
                );
                errorCount++;
            }
        }

        console.log("\nInitialization complete:");
        console.log(`✓ Successfully stored ${successCount} mission items`);
        console.log(`⤍ Skipped ${skippedCount} existing items`);
        if (errorCount > 0) {
            console.log(`✗ Failed to store ${errorCount} mission items`);
        }

        return {
            success: successCount,
            skipped: skippedCount,
            errors: errorCount,
            total: missionData.length,
            existingCount,
        };
    } catch (error) {
        console.error("Fatal error during initialization:", error);
        throw error;
    }
}
