import EquipmentImage from "@/components/EquipmentImage";
import { buttonVariants } from "@/components/ui/button";
import { getAllEquipment, getAllMissions, getMission } from "@/data";
import { EquipmentRecord } from "@/data/equipment.zod";
import { json, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { MapIcon } from "lucide-react";
import slugify from "slugify";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    if (!data) {
        return [{ title: "Mission not found" }];
    }
    return [{ title: `${data.mission.id}: ${data.mission.name}` }];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const missionId = params.missionId;

    if (!missionId) {
        throw new Response("Missing missionId parameter", { status: 400 });
    }

    // Find the mission
    const [missions, mission] = await Promise.all([
        getAllMissions(),
        getMission(missionId),
    ]);

    if (!mission) {
        throw new Response(`Mission ${missionId} not found`, { status: 404 });
    }

    // Get equipment that can be found in this mission
    const allEquipment = await getAllEquipment();
    const equipmentInMission = allEquipment.filter((equipment) =>
        equipment.campaign_sources?.includes(missionId)
    );

    // Get previous and next missions for navigation
    const missionIndex = missions.findIndex((m) => m.id === missionId);
    const previousMission =
        missionIndex > 0 ? missions[missionIndex - 1] : null;
    const nextMission =
        missionIndex < missions.length - 1 ? missions[missionIndex + 1] : null;

    return json({
        mission,
        equipmentInMission,
        previousMission,
        nextMission,
    });
};

export default function MissionDetails() {
    const { mission, equipmentInMission, previousMission, nextMission } =
        useLoaderData<typeof loader>();

    const getBossImageUrl = (bossName: string) => {
        return `/images/heroes/${slugify(bossName, {
            lower: true,
            strict: true,
        })}.webp`;
    };

    return (
        <div className="space-y-6">
            {/* Mission Header */}
            <div className="flex items-start gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <MapIcon className="h-6 w-6" />
                        <h2 className="text-2xl font-bold">
                            {mission.chapter}-{mission.mission_number}:{" "}
                            {mission.name}
                        </h2>
                    </div>
                    <p className="text-lg text-muted-foreground mt-1">
                        Chapter {mission.chapter}: {mission.chapter_title}
                    </p>
                </div>

                {mission.boss && (
                    <div className="text-center">
                        <div className="relative w-16 h-16 mx-auto">
                            <img
                                src={getBossImageUrl(mission.boss)}
                                alt={mission.boss}
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>
                        <p className="mt-1 text-sm font-medium">
                            Boss: {mission.boss}
                        </p>
                    </div>
                )}
            </div>

            {/* Equipment Found Here */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold">
                    Equipment Found in This Mission
                </h3>
                {equipmentInMission.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {equipmentInMission.map(
                            (equipment: EquipmentRecord) => (
                                <Link
                                    key={equipment.id}
                                    to={`/equipment/${equipment.slug}`}
                                    className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors"
                                >
                                    <EquipmentImage
                                        equipment={equipment}
                                        size="md"
                                    />
                                    <span className="text-sm text-center">
                                        {equipment.name}
                                    </span>
                                </Link>
                            )
                        )}
                    </div>
                ) : (
                    <p className="text-muted-foreground">
                        No equipment found in this mission.
                    </p>
                )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-4">
                {previousMission ? (
                    <Link
                        to={`/missions/${previousMission.id}`}
                        className={buttonVariants({ variant: "outline" })}
                    >
                        ← {previousMission.chapter}-
                        {previousMission.mission_number}
                    </Link>
                ) : (
                    <div />
                )}

                <Link
                    to="/missions"
                    className={buttonVariants({ variant: "secondary" })}
                >
                    All Missions
                </Link>

                {nextMission ? (
                    <Link
                        to={`/missions/${nextMission.id}`}
                        className={buttonVariants({ variant: "outline" })}
                    >
                        {nextMission.chapter}-{nextMission.mission_number} →
                    </Link>
                ) : (
                    <div />
                )}
            </div>
        </div>
    );
}
