import { defineConfig } from "vitest/config";
import tailwindcss from "@tailwindcss/vite";
import { readFileSync } from "node:fs";
import type { Plugin } from "vite";

// Vite preview does not interpret Cloudflare _headers. Mirror the asset MIME
// rules from that canonical file so real popup navigation decodes UTF-8.
function staticAssetHeaders(): Plugin {
  return {
    name: "vanya-static-asset-headers",
    configurePreviewServer(server) {
      const source = readFileSync(new URL("./public/_headers", import.meta.url), "utf8");
      const types = new Map([...source.matchAll(/^\/\*\.(\w+)\s*\r?\n\s+Content-Type:\s*([^\r\n]+)/gm)].map(match => [match[1], match[2].trim()]));
      server.middlewares.use((req, res, next) => {
        const pathname = (req.url ?? "").split("?")[0];
        const extension = pathname.match(/\.(\w+)$/)?.[1];
        const type = extension && types.get(extension);
        if (type) res.setHeader("Content-Type", type);
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [tailwindcss(), staticAssetHeaders()],
  build: { license: { fileName: "licenses.txt" }, rolldownOptions: { input: { main: "index.html", showcase: "showcase.html", navigation: "guidelines/navigation/index.html", agents: "agents/index.html" } } },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/setup.ts",
    include: ["tests/**/*.{test,spec}.{ts,tsx}"],
  },
});
