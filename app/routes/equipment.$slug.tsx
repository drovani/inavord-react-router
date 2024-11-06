import EquipmentImage from "@/components/EquipmentImage";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    getAllMissions,
    getEquipmentBySlug,
    getEquipmentThatRequires,
} from "@/data";
import type { EquipmentRecord } from "@/data/equipment.zod";
import type { Mission } from "@/data/mission.zod";
import { json, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { AlertCircle } from "lucide-react";
import invariant from "tiny-invariant";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [{ title: data?.equipment.name }];
};

interface LoaderData {
    equipment: EquipmentRecord;
    requiredEquipment: (EquipmentRecord | null)[];
    requiredFor: EquipmentRecord[];
    missionSources: Mission[];
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
    invariant(params.slug, "Missing equipment slug param");

    // Get main equipment details
    const equipment = await getEquipmentBySlug(params.slug);
    if (!equipment) {
        throw new Response(null, {
            status: 404,
            statusText: `Equipment with id ${params.equipmentId} not found.`,
        });
    }

    // Get required equipment details
    const requiredEquipmentPromises = equipment.crafting
        ? Object.keys(equipment.crafting.required_items).map(async (slug) => {
              return await getEquipmentBySlug(slug);
          })
        : [];

    // Get equipment that requires this item
    const requiredFor = (await getEquipmentThatRequires(equipment.name)) || [];

    // Get all missions and filter for sources
    const allMissions = await getAllMissions();
    const missionSources = equipment.campaign_sources
        ? equipment.campaign_sources
              .map((source) => allMissions.find((m) => m.id === source))
              .filter((m): m is Mission => m !== undefined)
              .sort((a, b) => {
                  const [aChapter, aMission] = a.id.split("-").map(Number);
                  const [bChapter, bMission] = b.id.split("-").map(Number);
                  return aChapter === bChapter
                      ? aMission - bMission
                      : aChapter - bChapter;
              })
        : [];

    // Wait for all required equipment details to be fetched
    const requiredEquipment = await Promise.all(requiredEquipmentPromises);

    return json<LoaderData>({
        equipment,
        requiredEquipment,
        requiredFor,
        missionSources,
    });
};

// Component to render either a valid equipment item or a placeholder
const EquipmentItem = ({
    item,
    quantity,
}: {
    item: EquipmentRecord | null;
    quantity: number;
}) => {
    if (!item) {
        return (
            <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                    <AlertCircle className="text-muted-foreground" />
                </div>
                <div className="text-center">
                    <div className="text-muted-foreground">Missing Item</div>
                    <div className="text-sm text-muted-foreground">
                        {quantity}x required
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Link
            to={`/equipment/${item.id}`}
            className="flex flex-col items-center gap-2 group"
        >
            <EquipmentImage equipment={item} size="md" />
            <div className="text-center">
                <div className="group-hover:underline">{item.name}</div>
                <div className="text-sm text-muted-foreground">
                    {quantity}x required
                </div>
            </div>
        </Link>
    );
};

export default function Equipment() {
    const { equipment, requiredEquipment, requiredFor, missionSources } =
        useLoaderData<LoaderData>();

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex items-start gap-6">
                <EquipmentImage equipment={equipment} size="lg" />
                <div className="space-y-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            {equipment.name}
                        </h1>
                        <p className="text-muted-foreground">
                            Required Level: {equipment.hero_level_required}
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <div className="text-sm space-y-2">
                            <div>Buy Value:</div>
                            <div className="flex items-center gap-2">
                                <img
                                    src="/images/gold.webp"
                                    alt="Gold"
                                    className="w-6 h-6"
                                />
                                <span>
                                    {equipment.buy_value.toLocaleString()}
                                </span>
                            </div>
                        </div>
                        <div className="text-sm space-y-2">
                            <div>Sell Value:</div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <img
                                        src="/images/gold.webp"
                                        alt="Gold"
                                        className="w-6 h-6"
                                    />
                                    <span>
                                        {equipment.sell_value.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <img
                                        src="/images/guild_activity_points.webp"
                                        alt="Guild Activity Points"
                                        className="w-6 h-6"
                                    />
                                    <span>
                                        {equipment.guild_activity_points}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            {equipment.stats && Object.entries(equipment.stats).length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {Object.entries(equipment.stats).map(
                            ([stat, value]) => (
                                <div
                                    key={stat}
                                    className="flex items-center gap-2"
                                >
                                    <span className="capitalize">{stat}:</span>
                                    <span className="font-semibold">
                                        {value}
                                    </span>
                                </div>
                            )
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Campaign Sources Section */}
            {missionSources.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Found in Campaign</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
                            {missionSources.map((mission) => (
                                <Link
                                    key={mission.id}
                                    to={`/missions/${mission.id}`}
                                    className="flex items-center gap-2 p-2 rounded-md hover:bg-accent"
                                >
                                    <Badge variant="outline">
                                        {mission.chapter}-
                                        {mission.mission_number}
                                    </Badge>
                                    <span>{mission.name}</span>
                                    {mission.boss && (
                                        <Badge
                                            variant="secondary"
                                            className="ml-auto"
                                        >
                                            {mission.boss}
                                        </Badge>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Crafting Requirements Section */}
            {requiredEquipment.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Crafting Requirements</CardTitle>
                        {equipment.crafting?.gold_cost && (
                            <CardDescription className="flex items-center gap-2">
                                <img
                                    src="/images/gold.webp"
                                    alt="Gold cost"
                                    className="w-6 h-6"
                                />
                                {equipment.crafting.gold_cost.toLocaleString()}{" "}
                                gold
                            </CardDescription>
                        )}
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap items-center gap-4">
                            {requiredEquipment.map((item, index) => (
                                <EquipmentItem
                                    key={item?.id || `missing-${index}`}
                                    item={item}
                                    quantity={
                                        equipment.crafting?.required_items[
                                            item?.id || ""
                                        ] || 0
                                    }
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Required For Section */}
            {requiredFor.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Required For</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {requiredFor.map((item) => (
                                <Link
                                    key={item.id}
                                    to={`/equipment/${item.id}`}
                                    className="flex items-center gap-2 group"
                                >
                                    <EquipmentImage
                                        equipment={item}
                                        size="sm"
                                    />
                                    <div>
                                        <div className="group-hover:underline">
                                            {item.name}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Requires{" "}
                                            {
                                                item.crafting?.required_items[
                                                    equipment.id
                                                ]
                                            }
                                            x
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
                <Link
                    to={`/equipment/${equipment.id}/edit`}
                    className={buttonVariants({ variant: "default" })}
                >
                    Edit
                </Link>
                <Form
                    action="destroy"
                    method="post"
                    onSubmit={(event) => {
                        const response = confirm(
                            `Please confirm you want to delete ${equipment.name}.`
                        );
                        if (!response) {
                            event.preventDefault();
                        }
                    }}
                >
                    <Button type="submit" variant="destructive">
                        Delete
                    </Button>
                </Form>
            </div>
        </div>
    );
}
