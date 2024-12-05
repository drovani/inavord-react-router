import { netlifyPlugin } from "@netlify/remix-edge-adapter/plugin";
import { vitePlugin as remix } from "react-router";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

declare module "react-router" {
    interface Future {
        v3_singleFetch: true;
    }
}
export default defineConfig({
    plugins: [
        remix({
            ignoredRouteFiles: ["**/*.css"],
            future: {
                v3_fetcherPersist: true,
                v3_lazyRouteDiscovery: true,
                v3_relativeSplatPath: true,
                v3_singleFetch: true,
                v3_throwAbortReason: true,
                v3_routeConfig: true,
                unstable_optimizeDeps: true
            },
        }),
        netlifyPlugin(),
        tsconfigPaths(),
    ],
});
