import { defineConfig } from "@playwright/test";
import { resolve } from "node:path";

const url = "http://127.0.0.1:4173";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  expect: { timeout: 8_000 },
  retries: 0,
  workers: 1,
  outputDir: "./artifacts/test-results",
  reporter: [["list"], ["html", { outputFolder: "./artifacts/report", open: "never" }]],
  use: {
    baseURL: url,
    browserName: "chromium",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "off",
    locale: "ru-RU",
  },
  webServer: {
    command: "bun run build && bun run preview",
    cwd: resolve(import.meta.dirname, ".."),
    url,
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
