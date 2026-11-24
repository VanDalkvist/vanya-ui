#!/usr/bin/env node
// Manual networked release check. Creates isolated consumers; never edits a real app.
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const matrix = [
  { manager: "npm", react: "18.3.1", reactTypes: "18.3.18", domTypes: "18.3.5" },
  { manager: "bun", react: "19.0.0", reactTypes: "19.0.8", domTypes: "19.0.3" },
];

export function fixture(sha, row) {
  if (!/^[a-f0-9]{40}$/.test(sha)) throw new Error("Use the exact 40-character commit SHA");
  const manifest = {
    name: "vanya-ui-consumer-smoke", private: true, type: "module",
    scripts: { types: "tsc --noEmit", build: "vite build", ssr: "vite build --ssr src/entry-server.tsx --outDir dist-ssr" },
    dependencies: {
      "@vanya/ui": "https://codeload.github.com/VanDalkvist/vanya-ui/tar.gz/" + sha,
      react: row.react, "react-dom": row.react,
    },
    devDependencies: {
      "@types/react": row.reactTypes, "@types/react-dom": row.domTypes,
      "@tailwindcss/vite": "4.3.3", tailwindcss: "4.3.3",
      typescript: "5.9.3", vite: "8.3.6",
    },
  };
  return {
    "package.json": JSON.stringify(manifest, null, 2) + "\n",
    "tsconfig.json": JSON.stringify({compilerOptions:{target:"ES2022",lib:["ES2022","DOM","DOM.Iterable"],module:"ESNext",moduleResolution:"bundler",jsx:"react-jsx",strict:true,skipLibCheck:true,noEmit:true},include:["src"]},null,2)+"\n",
    "index.html": '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Consumer smoke</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>',
    "vite.config.mjs": 'import {defineConfig} from "vite";\nimport tailwindcss from "@tailwindcss/vite";\nexport default defineConfig({plugins:[tailwindcss()],ssr:{noExternal:["@vanya/ui","@vanya/brand"]}});\n',
    "src/style.css": '@import "@vanya/ui/tokens.css";\n@source "../node_modules/@vanya/ui/src";\n',
    "src/App.tsx": 'import {ActionButton,SegmentedControl,type SegmentItem} from "@vanya/ui";\nimport {useState} from "react";\nconst items: SegmentItem<"a"|"b">[]=[{id:"a",label:"First"},{id:"b",label:"Second"}];\nexport function App(){const [value,setValue]=useState<"a"|"b">("a");return <main><ActionButton variant="outline">Consumer action</ActionButton><SegmentedControl aria-label="Consumer filter" items={items} value={value} onChange={setValue}/></main>}\n',
    "src/main.tsx": 'import {createRoot} from "react-dom/client";\nimport {App} from "./App";\nimport "./style.css";\ncreateRoot(document.getElementById("root")!).render(<App/>);\n',
    "src/entry-server.tsx": 'import {renderToString} from "react-dom/server";\nimport {App} from "./App";\nexport const html=renderToString(<App/>);\n',
  };
}

function run(cwd, cmd, args) {
  const result=spawnSync(cmd,args,{cwd,stdio:"inherit",shell:process.platform==="win32",timeout:240000});
  if(result.error) throw result.error;
  if(result.status!==0) throw new Error(cmd+" "+args.join(" ")+" exited "+result.status);
}

async function main() {
  const args=process.argv.slice(2);
  const sha=args[0];
  if(!sha||!/^[a-f0-9]{40}$/.test(sha)||args.slice(1).some(a=>a!=="--prepare-only")) {
    console.error("Usage: node scripts/consumer-smoke.mjs FULL_SHA [--prepare-only]");
    process.exitCode=2;return;
  }
  const prepare=args.includes("--prepare-only");
  const root=mkdtempSync(join(tmpdir(),"vanya-ui-consumer-"));
  console.log("Isolated fixture directory: "+root);
  const results=[];
  for(const row of matrix){
    const cwd=join(root,row.manager);
    mkdirSync(join(cwd,"src"),{recursive:true});
    for(const [name,content] of Object.entries(fixture(sha,row))) writeFileSync(join(cwd,name),content);
    const receipt={sha,manager:row.manager,react:row.react,checks:{},status:"NOT_RUN"};
    let phase="toolchain";
    try{
      if(!prepare){
        run(cwd,row.manager,["--version"]);
        phase="install";
        run(cwd,row.manager,["install"]);
        // The generated lockfile must retain the requested immutable tarball reference.
        const lock=readFileSync(join(cwd,row.manager==="npm"?"package-lock.json":"bun.lock"),"utf8");
        if(!lock.includes(sha))throw new Error("Pinned SHA missing from consumer lockfile");
        receipt.checks.install="PASS";
        phase="types";run(cwd,row.manager,["run","types"]);receipt.checks.types="PASS";
        phase="client";run(cwd,row.manager,["run","build"]);
        const css=readdirSync(join(cwd,"dist","assets")).filter(x=>x.endsWith(".css")).map(x=>readFileSync(join(cwd,"dist","assets",x),"utf8")).join("\n");
        if(!css.includes(".ui-action-button")||!css.includes("--color-accent")||!css.includes(".rounded-sm"))throw new Error("Expected shared CSS and generated utility missing");
        receipt.checks.client="PASS";
        phase="ssr";run(cwd,row.manager,["run","ssr"]);
        const entry=readdirSync(join(cwd,"dist-ssr")).find(x=>/^entry-server\.(js|mjs)$/.test(x));
        if(!entry)throw new Error("Missing SSR entry");
        const {html}=await import(pathToFileURL(join(cwd,"dist-ssr",entry)).href);
        if(typeof html!=="string"||!html.includes("Consumer action")||!html.includes('aria-pressed="true"')||!html.includes('role="group"'))throw new Error("Unexpected SSR markup");
        receipt.checks.ssr="PASS";
        receipt.status="PASS";
      }
    }catch(error){
      receipt.status=error?.code==="ENOENT"?"BLOCKED":"FAIL";
      receipt.failedPhase=phase;receipt.error=String(error.message??error);
    }
    results.push(receipt);
    writeFileSync(join(root,"receipt.json"),JSON.stringify(results,null,2)+"\n");
    console.log(JSON.stringify(receipt));
  }
  console.log("Receipts and lockfiles retained at "+root);
  if(!prepare&&results.some(r=>r.status!=="PASS"))process.exitCode=1;
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)) await main();
