import { createReadableStreamFromReadable } from "@react-router/node";
import { Readable } from "node:stream";
import MissionDataService from "~/services/MissionDataService";
import type { Route } from "./+types/missions[.json]";

export async function loader(_: Route.LoaderArgs) {
  const missions = await MissionDataService.getAll();
  const file = createReadableStreamFromReadable(Readable.from(JSON.stringify(missions)));

  return new Response(file, {
    headers: {
      "Content-Disposition": 'attachment; filename="missions.json"',
      "Content-Type": "application/json",
    },
  });
}
