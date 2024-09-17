import { json } from "@remix-run/node";
import { getAllEquipment } from "~/data";

export async function loader() {
    const equipment = await getAllEquipment();
    return json(equipment);
}
