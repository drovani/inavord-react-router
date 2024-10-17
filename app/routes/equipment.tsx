import { Outlet } from "@remix-run/react";
import { getAllEquipment } from "../data";

export const loader = async () => {
    const equipments = await getAllEquipment();
    return { equipments };
};

export default function Equipment() {
    return <Outlet />;
}
