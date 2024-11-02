import { getAllMissions } from "@/data";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { Readable } from "node:stream";

export async function loader() {
    const missions = await getAllMissions();
    const file = createReadableStreamFromReadable(
        Readable.from(JSON.stringify(missions))
    );

    return new Response(file, {
        headers: {
            "Content-Disposition": 'attachment; filename="missions.json"',
            "Content-Type": "application/json",
        },
    });
}
