import { createRequestListener } from "@mjackson/node-fetch-server";
import express from "express";
import log from "loglevel";

const PORT = Number.parseInt(process.env.PORT || "3000");
const HOST = process.env.HOST || (process.env.CODESPACES ? "0.0.0.0" : "localhost");

const app = express();
app.disable("x-powered-by");

log.info("Starting development server");
const viteDevServer = await import("vite").then((vite) =>
  vite.createServer({
    server: { 
      middlewareMode: true,
      host: HOST,
    },
  })
);
app.use(viteDevServer.middlewares);
app.use(async (req, res, next) => {
  try {
    return await createRequestListener(async (request) => {
      const source = await viteDevServer.ssrLoadModule("./server/app.ts");
      return await source.default(request, {
        // TODO: Mock any required netlify functions context
      });
    })(req, res);
  } catch (error) {
    if (typeof error === "object" && error instanceof Error) {
      viteDevServer.ssrFixStacktrace(error);
    }
    next(error);
  }
});

app.listen(PORT, HOST, () => {
  const url = process.env.CODESPACES 
    ? `https://${process.env.CODESPACE_NAME}-${PORT}.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`
    : `http://${HOST}:${PORT}`;
  log.info(`Server is running on ${url}`);
});
