import { getAllEquipment } from "@/data";
import { json } from "@remix-run/node";

export async function loader() {
    const equipment = await getAllEquipment();
    return json(equipment);
}
