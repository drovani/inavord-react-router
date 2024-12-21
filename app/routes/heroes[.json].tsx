import { createReadableStreamFromReadable } from "@react-router/node";
import { Readable } from "node:stream";
import { heroDAL } from "~/lib/hero-dal";
import type { Route } from "./+types/heroes[.json]";

function removeEmptyArrays<T>(_: string, value: T): T | undefined {
  // Check if value is an array and it's empty
  if (Array.isArray(value) && value.length === 0) {
    return undefined; // This will exclude the property
  }
  return value;
}

export async function loader(_: Route.LoaderArgs) {
  const heroes = await heroDAL.getAllHeroes();

  const file = createReadableStreamFromReadable(Readable.from(JSON.stringify(heroes, removeEmptyArrays, 2)));

  return new Response(file, {
    headers: {
      "Content-Disposition": 'attachment; filename="heroes.json"',
      "Content-Type": "application/json",
    },
  });
}
