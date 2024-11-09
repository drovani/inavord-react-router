import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import { equipmentDAL } from "@/lib/equipment-dal";

export const action = async ({ params }: ActionFunctionArgs) => {
    invariant(params.slug, "Expected params.equipmentId");

    await equipmentDAL.deleteEquipment(params.slug);
    //await deleteEquipment(params.slug);

    return redirect("/equipment");
};
