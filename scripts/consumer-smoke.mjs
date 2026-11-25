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

// Verify the resolved direct dependency, not an arbitrary occurrence of the SHA.
export function assertConsumerLock(lock, manager, sha) {
  const url = "https://codeload.github.com/VanDalkvist/vanya-ui/tar.gz/" + sha;
  let requested, resolved;
  if(manager==="npm") {
    const parsed=JSON.parse(lock);
    requested=parsed.packages?.[""]?.dependencies?.["@vanya/ui"];
    resolved=parsed.packages?.["node_modules/@vanya/ui"]?.resolved;
  } else if(manager==="bun") {
    // bun.lock is JSONC; inspect the direct workspace and exact package tuple.
    const split=lock.indexOf('"packages":');
    if(split<0)throw new Error("Missing Bun package records");
    const workspace=lock.slice(0,split), packages=lock.slice(split);
    requested=workspace.match(/^[ \t]*"@vanya\/ui"\s*:\s*"([^"]+)"\s*,?\s*$/m)?.[1];
    resolved=packages.match(/^[ \t]*"@vanya\/ui"\s*:\s*\[\s*"([^"]+)"/m)?.[1];
    if(resolved?.startsWith("@vanya/ui@"))resolved=resolved.slice("@vanya/ui@".length);
  } else throw new Error("Unsupported consumer lock format");
  if(requested!==url||resolved!==url)throw new Error("Direct consumer dependency does not resolve to pinned SHA");
}

// Tailwind's inline theme aliases can be inlined away. Check a real brand token,
// shared interaction rule, and a utility emitted by the source scanner.
export function assertConsumerCss(css) {
  if(!css.includes(".ui-action-button")||!css.includes("--accent:")||!css.includes(".rounded-sm"))
    throw new Error("Expected shared CSS and generated utility missing");
}

function run(cwd, cmd, args) {
  const result=spawnSync(cmd,args,{cwd,encoding:"utf8",shell:process.platform==="win32",timeout:240000,maxBuffer:8*1024*1024});
  const output=(result.stdout??"")+(result.stderr??"");
  writeFileSync(join(cwd,cmd.replace(/[^a-zA-Z0-9-]/g,"")+"-"+args.join("-").replace(/[^a-zA-Z0-9-]/g,"")+".log"),output);
  if(result.stdout)process.stdout.write(result.stdout);
  if(result.stderr)process.stderr.write(result.stderr);
  if(result.error) throw result.error;
  if(result.status!==0) throw new Error(cmd+" "+args.join(" ")+" exited "+result.status);
  return (result.stdout??"").trim();
}

async function main() {
  const args=process.argv.slice(2);
  const sha=args[0];
  if(!sha||!/^[a-f0-9]{40}$/.test(sha)||args.slice(1).some(a=>!["--prepare-only","--harness","--browser"].includes(a))) {
    console.error("Usage: node scripts/consumer-smoke.mjs FULL_SHA [--prepare-only] [--harness] [--browser]");
    process.exitCode=2;return;
  }
  const prepare=args.includes("--prepare-only"), harness=args.includes("--harness"), browser=args.includes("--browser");
  if(browser&&!harness)throw Error("--browser requires --harness");
  const root=mkdtempSync(join(tmpdir(),"vanya-ui-consumer-"));
  console.log("Isolated fixture directory: "+root);
  const results=[];
  for(const row of matrix){
    const cwd=join(root,row.manager);
    mkdirSync(join(cwd,"src"),{recursive:true});
    const files=fixture(sha,row);
    if(browser&&row.manager==="npm"){
      files["src/App.tsx"]="import {ActionButton,SegmentedControl,WorkspaceSplit,SurfaceHeader,ThemeToggle,type SegmentItem} from \"@vanya/ui\";\nimport {useState} from \"react\";\nconst items: SegmentItem<\"a\"|\"b\">[]=[{id:\"a\",label:\"First\"},{id:\"b\",label:\"Second\"}];\nexport function App(){\n const [value,setValue]=useState<\"a\"|\"b\">(\"a\"),[count,setCount]=useState(0);\n return <main className=\"consumer-workspace\" data-testid=\"workspace\">\n  <SurfaceHeader headingLevel={2} title=\"Consumer workspace\" subtitle=\"Review and update projects\" actions={<ThemeToggle/>}/>\n  <WorkspaceSplit navigation={<section className=\"consumer-nav\" aria-label=\"Project filters\">\n   <SegmentedControl aria-label=\"Consumer filter\" items={items} value={value} onChange={setValue}/>\n   <p className=\"ui-type-body\" data-testid=\"filter-result\">{value===\"a\"?\"First project\":\"Second project\"}</p>\n  </section>} detail={<section className=\"consumer-detail\" aria-label=\"Project details\">\n   <h2 className=\"ui-type-heading\">Project details</h2>\n   <p className=\"ui-type-body\" data-testid=\"body-copy\">Review the current project and record an update.</p>\n   <ActionButton size=\"md\" variant=\"outline\" actionState={count?\"success\":\"idle\"} onClick={()=>setCount(n=>n+1)}>Consumer action</ActionButton>\n   <p className=\"ui-type-body\" data-testid=\"result\" aria-live=\"polite\">Updates: {count}</p>\n  </section>}/>\n </main>;\n}\n";
      files["src/style.css"]="@import \"@vanya/ui/tokens.css\";\n@source \"../node_modules/@vanya/ui/src\";\nbody { margin:0; background:var(--ground);color:var(--ink);font-family:var(--font-sans); }\n.consumer-workspace { width:100%;padding:var(--spacing-scene); }\n.consumer-nav,.consumer-detail {padding:var(--spacing-scene);min-width:0;}\n";
    }
    for(const [name,content] of Object.entries(files)) writeFileSync(join(cwd,name),content);
    const receipt={sha,manager:row.manager,react:row.react,checks:{},status:"NOT_RUN"};
    let phase="toolchain";
    try{
      if(!prepare){
        receipt.managerVersion=run(cwd,row.manager,["--version"]);
        receipt.nodeVersion=process.version;
        phase="install";
        run(cwd,row.manager,["install"]);
        // The generated lockfile must retain the requested immutable tarball reference.
        const lock=readFileSync(join(cwd,row.manager==="npm"?"package-lock.json":"bun.lock"),"utf8");
        assertConsumerLock(lock,row.manager,sha);
        if(harness){
          phase="cli-entrypoint";
          for(const name of ["vanya-arc-ui","vui"]){
            const executable=join(cwd,"node_modules/.bin",name);
            const help=run(cwd,executable,["--help"]);
            if(!help.includes("Contributor command:")||!help.includes("Consumer commands:"))throw Error("Missing CLI help for "+name);
            const sub=run(cwd,executable,["contribute","--help"]);
            if(!sub.includes("Usage: vui contribute"))throw Error("Missing subcommand help for "+name);
          }
          receipt.checks.cliEntrypoint="PASS";
        }
        const installed=JSON.parse(readFileSync(join(cwd,"node_modules","@vanya","ui","package.json"),"utf8"));
        if(installed.name!=="@vanya/ui")throw new Error("Wrong installed package");
        receipt.packageVersion=installed.version;
        receipt.checks.install="PASS";
        if(harness){
          phase="harness-adopt";
          run(cwd,process.execPath,[join(cwd,"node_modules/@vanya/ui/scripts/ui-pipeline.mjs"),"adopt","--project",cwd,"--sources","src"]);
          phase="harness-lint";run(cwd,row.manager,["run","lint:design"]);run(cwd,process.execPath,["--input-type=module","-e","import '@vanya/ui/lint'"]);receipt.checks.harnessLint="PASS";
          phase="harness-negative";
          const cssPath=join(cwd,"src/style.css"),before=readFileSync(cssPath,"utf8");
          try{
            writeFileSync(cssPath,before+"\n.probe { color: #f123ab; font-size: 19px; }\n");
            const bad=spawnSync(row.manager,["run","lint:design"],{cwd,encoding:"utf8",shell:process.platform==="win32",timeout:480000,maxBuffer:8*1024*1024});
            const output=(bad.stdout??"")+(bad.stderr??"");
            writeFileSync(join(cwd,"harness-negative.log"),output);
            if(bad.error||bad.status!==1||!output.includes("#f123ab")||!output.includes("new=2"))throw Error("Expected actual design violations to block package lint");
            receipt.checks.harnessNegative="PASS";
          }finally{writeFileSync(cssPath,before)}
        }
        phase="types";run(cwd,row.manager,["run","types"]);receipt.checks.types="PASS";
        phase="client";run(cwd,row.manager,["run","build"]);
        const css=readdirSync(join(cwd,"dist","assets")).filter(x=>x.endsWith(".css")).map(x=>readFileSync(join(cwd,"dist","assets",x),"utf8")).join("\n");
        assertConsumerCss(css);
        if(harness){
          phase="compiled-css";run(cwd,process.execPath,["--input-type=module","-e","import '@vanya/ui/check-built'"]);receipt.checks.compiledCss="PASS";
          const cssPath=join(cwd,"src/style.css"),before=readFileSync(cssPath,"utf8");
          try{
            phase="compiled-css-negative";writeFileSync(cssPath,"/* disconnected tokens */\n");
            run(cwd,row.manager,["run","build"]);
            const bad=spawnSync(process.execPath,["--input-type=module","-e","import '@vanya/ui/check-built'"],{cwd,encoding:"utf8",timeout:60000});
            if(bad.error||bad.status!==1||!/Missing compiled UI CSS|No compiled CSS found/.test((bad.stdout??"")+(bad.stderr??"")))throw Error("Disconnected token stylesheet must fail compiled CSS gate");
            receipt.checks.compiledCssNegative="PASS";
          }finally{writeFileSync(cssPath,before)}
          run(cwd,row.manager,["run","build"]);
        }
        receipt.checks.client="PASS";
        if(browser&&row.manager==="npm"){
          phase="browser-workspace";
          const {reviewConsumerWorkspace}=await import("../browser-qa/consumer-harness-browser.mjs");
          receipt.browser=await reviewConsumerWorkspace(cwd);receipt.checks.browserWorkspace="PASS";
        }
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
  console.log("Receipts and lockfiles retained at "+root+" (local only; review for private paths before sharing)");
  if(!prepare&&results.some(r=>r.status!=="PASS"))process.exitCode=1;
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)) await main();
