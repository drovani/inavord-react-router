import { createReadableStreamFromReadable } from "@react-router/node";
import { Readable } from "node:stream";
import { type EquipmentRecord } from "~/data/equipment.zod";
import EquipmentDataService from "~/services/EquipmentDataService";
import type { Route } from "./+types/equipment[.json]";

function removeEmptyArrays<T>(_: string, value: T): T | undefined {
  // Check if value is an array and it's empty
  if (Array.isArray(value) && value.length === 0) {
    return undefined; // This will exclude the property
  }
  return value;
}

// Ensure dates are in ISO format when stringifying
function formatEquipmentForExport(equipment: EquipmentRecord[]): EquipmentRecord[] {
  return equipment.map((item) => ({
    ...item,
    updatedOn: new Date(item.updatedOn).toISOString(),
  }));
}

export async function loader(_: Route.LoaderArgs) {
  const equipment = await EquipmentDataService.getAll();
  const formattedEquipment = formatEquipmentForExport(equipment);

  const file = createReadableStreamFromReadable(
    Readable.from(JSON.stringify(formattedEquipment, removeEmptyArrays, 2))
  );

  return new Response(file, {
    headers: {
      "Content-Disposition": 'attachment; filename="equipment.json"',
      "Content-Type": "application/json",
    },
  });
}
