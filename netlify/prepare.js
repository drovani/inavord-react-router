import { cp, mkdir, rm } from "node:fs/promises";

await rm(".netlify/functions-internal", { recursive: true }).catch(() => {});
await mkdir(".netlify/functions-internal", { recursive: true });
await cp("build/server/", ".netlify/functions-internal/handler", {
  recursive: true,
});

// .netlify/functions-internal
