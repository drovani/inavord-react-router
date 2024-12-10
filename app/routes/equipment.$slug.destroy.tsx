import { redirect } from "react-router";
import invariant from "tiny-invariant";
import { equipmentDAL } from "~/lib/equipment-dal";
import type { Route } from "./+types/equipment.$slug.destroy";

export const action = async ({ params }: Route.ActionArgs) => {
    invariant(params.slug, "Expected params.equipmentId");

    await equipmentDAL.deleteEquipment(params.slug);

    return redirect("/equipment");
};
