import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import { deleteEquipment } from "../data";

export const action = async ({ params }: ActionFunctionArgs) => {
    invariant(params.equipmentId, "Expected params.equipmentId");
    await deleteEquipment(params.equipmentId);
    return redirect("/equipment");
};
