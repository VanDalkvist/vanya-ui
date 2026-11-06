import { defineConfig } from "cf/config";

export default defineConfig({
  worker: {
    name: "vanya-ui",
    compatibilityDate: "2026-11-06",
    workersDev: false,
    domains: ["ui.vanya-arc.dev"],
    assets: { htmlHandling: "none" },
  },
});
