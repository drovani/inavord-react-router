import { initializeEquipmentBlobs } from "@/lib/initialize-equipment-blobs";
import { initializeMissionBlobs } from "@/lib/initialize-mission-blobs";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
    try {
        const url = new URL(request.url);
        const mode = url.searchParams.get("mode");

        // Set initialization options based on mode
        const options = {
            skipExisting: mode !== "force",
            failIfExists: mode === "safe",
            forceUpdate: mode === "force",
        };

        const resultE = await initializeEquipmentBlobs(options);
        const resultM = await initializeMissionBlobs(options);

        return json({
            message: "Equipment blob initialization complete",
            mode,
            results: { equipment: { ...resultE }, mission: { ...resultM } },
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Unknown error";
        console.error("Setup failed:", message);

        return json(
            {
                message: "Blob initialization failed",
                error: message,
            },
            {
                status:
                    error instanceof Error &&
                    error.message.includes("Existing equipment")
                        ? 409
                        : 500,
            }
        );
    }
}

export default function AdminSetp() {
    const results = useLoaderData<typeof loader>();

    return (
        <div>
            <pre>
                {JSON.stringify(results, null, '\t')}
            </pre>
        </div>
    )
}
