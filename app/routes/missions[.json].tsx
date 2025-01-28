import { createReadableStreamFromReadable } from "@react-router/node";
import { Readable } from "node:stream";
import MissionDataService from "~/services/MissionDataService";
import type { Route } from "./+types/missions[.json]";

export async function loader(_: Route.LoaderArgs) {
  const missionsJson = await MissionDataService.getAllAsJson();

  const file = createReadableStreamFromReadable(Readable.from(missionsJson));

  return new Response(file, {
    headers: {
      "Content-Disposition": 'attachment; filename="missions.json"',
      "Content-Type": "application/json",
      "Cache-Control": "no-store, must-revalidate",
      Pragma: "no-cache",
    },
  });
}
