import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import config from "../cloudflare.config";

// cf --prebuilt accepts Build Output v0 without changing the Vite toolchain.
// Only this reproducible, gitignored deployment output is replaced.
const output = ".cloudflare/output/v0";
const worker = `${output}/workers/default`;
await rm(output, { recursive: true, force: true });
await mkdir(worker, { recursive: true });
await Promise.all([
  writeFile(`${output}/config.json`, JSON.stringify({ buildContext: { isPreview: false, mode: "production" } })),
  writeFile(`${worker}/worker.config.json`, JSON.stringify(config.worker)),
  cp("dist", `${worker}/assets`, { recursive: true }),
]);
