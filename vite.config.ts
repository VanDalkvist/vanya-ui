import { defineConfig } from "vitest/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  build: { license: { fileName: "licenses.txt" }, rolldownOptions: { input: { main: "index.html", showcase: "showcase.html", navigation: "guidelines/navigation/index.html" } } },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/setup.ts",
    include: ["tests/**/*.{test,spec}.{ts,tsx}"],
  },
});
