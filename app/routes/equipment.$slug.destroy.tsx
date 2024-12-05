import { equipmentDAL } from "@/lib/equipment-dal";
import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import invariant from "tiny-invariant";

export const action = async ({ params }: ActionFunctionArgs) => {
    invariant(params.slug, "Expected params.equipmentId");

    await equipmentDAL.deleteEquipment(params.slug);
    //await deleteEquipment(params.slug);

    return redirect("/equipment");
};
