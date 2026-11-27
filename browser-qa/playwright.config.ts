import { defineConfig } from "@playwright/test";
import { resolve } from "node:path";

const remote = process.env.VANYA_UI_QA_URL;
const url = remote || "http://127.0.0.1:4173";
const evidenceDir=resolve(process.env.VANYA_UI_EVIDENCE_DIR || resolve(import.meta.dirname,"artifacts"));
const baselineDir=process.env.VANYA_UI_VISUAL_BASELINE_DIR;
if(process.env.VANYA_UI_VISUAL_MODE&&!baselineDir)throw Error("Set VANYA_UI_VISUAL_BASELINE_DIR to an explicit stable baseline directory");

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  expect: { timeout: 8_000 },
  retries: 0,
  workers: 1,
  outputDir: resolve(evidenceDir,"test-results"),
  ...(baselineDir?{snapshotPathTemplate:resolve(baselineDir,"{arg}{ext}")}:{}),
  reporter: [["list"], ["html", { outputFolder: resolve(evidenceDir,"report"), open: "never" }], ["json", { outputFile: resolve(evidenceDir,"results.json") }]],
  use: {
    baseURL: url,
    browserName: "chromium",
    channel: "chromium",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "off",
    locale: "ru-RU",
  },
  webServer: remote ? undefined : {
    command: "bun run build && bun run preview",
    cwd: resolve(import.meta.dirname, ".."),
    url,
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
