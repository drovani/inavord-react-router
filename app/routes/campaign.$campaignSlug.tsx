import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { CampaignChapters } from "~/constants";

export const loader = async ({ params }: LoaderFunctionArgs) => {
    invariant(params.campaignSlug, "Expected params.campaignSlug");
    const campaignChapter = CampaignChapters.find(cc => cc.slug === params.campaignSlug);

    if (!campaignChapter) {
        throw new Response(null, {
            status: 404,
            statusText: `Campaign Chapter with slug ${params.campaignSlug} not found.`
        })
    }

    return json({ campaignChapter })
}

export default function Campaign() {
    const { campaignChapter } = useLoaderData<typeof loader>();

    return (
        <div id={`campaign-${campaignChapter.slug}`}
            className="flex space-x-4 space-y-8 flex-col">
            <h2 className="text-2xl font-semibold">
                {campaignChapter.chapter}-{campaignChapter.level}: {campaignChapter.name}
            </h2>
            <div className="text-gray-800 italic">
                {campaignChapter.description}
            </div>
            <div>
                Energy cost: {campaignChapter.energy_cost}
            </div>
            <div>
                Hero soul stone: {
                    campaignChapter.hero ?
                        <span
                            className="underline decoration-dotted underline-offset-4 italic cursor-not-allowed">
                            {campaignChapter.hero}
                        </span>
                        : "(none)"
                }
            </div>
            {campaignChapter.gold && (
                <ul>
                    <li>
                        Gold: {campaignChapter.gold}
                    </li>
                    {campaignChapter.energy_cost && (
                        <li>Gold/Energy: {Math.round(campaignChapter.gold / campaignChapter.energy_cost * 100) / 100}</li>
                    )}
                </ul>
            )}
            {campaignChapter.hero_exp && (
                <ul>
                    <li>
                        Hero Exp: {campaignChapter.hero_exp}
                    </li>
                    {campaignChapter.energy_cost && (
                        <li>Hero Exp/Energy: {Math.round(campaignChapter.hero_exp / campaignChapter.energy_cost * 100) / 100}</li>
                    )}
                </ul>
            )}            {campaignChapter.hero_raid_exp && (
                <ul>
                    <li>
                        Hero Raid Exp: {campaignChapter.hero_raid_exp}
                    </li>
                    {campaignChapter.energy_cost && (
                        <li>Raid Exp/Energy: {Math.round(campaignChapter.hero_raid_exp / campaignChapter.energy_cost * 100) / 100}</li>
                    )}
                </ul>
            )}        </div>
    )
}