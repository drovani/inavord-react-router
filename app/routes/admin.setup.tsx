import { initializeEquipmentBlobs } from "@/lib/initialize-equipment-blobs";
import { json, type LoaderFunctionArgs } from "@remix-run/node";

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

        const result = await initializeEquipmentBlobs(options);

        return json({
            message: "Equipment blob initialization complete",
            mode,
            ...result,
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Unknown error";
        console.error("Setup failed:", message);

        return json(
            {
                message: "Equipment blob initialization failed",
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
