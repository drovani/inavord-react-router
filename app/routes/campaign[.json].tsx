import { json } from "@remix-run/node";
import { CampaignChapters } from "~/constants";

export async function loader() {
    return json(CampaignChapters);
}
