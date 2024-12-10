import { createReadableStreamFromReadable } from "@react-router/node";
import { Readable } from "node:stream";
import { missionDAL } from "~/lib/mission-dal";
import type { Route } from "./+types/missions[.json]";

export async function loader(_: Route.LoaderArgs) {
  const missions = await missionDAL.getAllMissions();
  const file = createReadableStreamFromReadable(Readable.from(JSON.stringify(missions)));

  return new Response(file, {
    headers: {
      "Content-Disposition": 'attachment; filename="missions.json"',
      "Content-Type": "application/json",
    },
  });
}
