// Report transport only. Playwright remains the comparison oracle.
import { readFileSync, existsSync } from "node:fs";
import { join, basename } from "node:path";
import { createHash } from "node:crypto";
import { chromium } from "@playwright/test";
import { visualContexts } from "./visual-baseline.mjs";

const baseline=process.env.VANYA_UI_VISUAL_BASELINE_DIR;
const evidence=process.env.VANYA_UI_EVIDENCE_DIR;
const manifest=JSON.parse(readFileSync(join(baseline,"manifest.json"),"utf8"));
const report=JSON.parse(readFileSync(join(evidence,"results.json"),"utf8"));
const results=[];
function walk(suite){
 for(const spec of suite.specs??[]) for(const test of spec.tests??[]) results.push(...test.results);
 for(const child of suite.suites??[]) walk(child);
}
for(const suite of report.suites) walk(suite);
const receipts=new Map(),actuals=new Map();
for(const result of results){
 const stdout=(result.stdout??[]).map(x=>x.text??"").join("");
 for(const line of stdout.split("\n")){
  if(!line.startsWith("VISUAL_SCENE "))continue;
  const r=JSON.parse(line.slice("VISUAL_SCENE ".length));
  if(r.mode!=="compare")continue;
  const key=r.scene+"-"+r.theme+"-"+r.width;
  if(receipts.has(key))throw Error("Duplicate visual scene "+key);
  receipts.set(key,r.status);
 }
 for(const a of result.attachments??[]){
  if(!a.path)continue;
  const file=basename(a.path);
  if(file.endsWith("-actual.png"))actuals.set(file.slice(0,-11),a.path);
 }
}
const contexts=visualContexts.map(c=>({...c,key:c.theme+"-"+c.width}));
const requested=process.env.VANYA_UI_VISUAL_REVIEW_CONTEXTS?.split(",");
if(requested&&(new Set(requested).size!==requested.length||requested.some(key=>!contexts.some(c=>c.key===key))))throw Error("Invalid explicit review contexts");
const selected=contexts.filter(c=>!requested||requested.includes(c.key));
const expectedKeys=new Set(selected.flatMap(({key,scenes})=>scenes.map(scene=>scene+"-"+key)));
if([...receipts.keys()].some(key=>!expectedKeys.has(key)))throw Error("Unexpected comparison scope");
const missing=[],different=[];
for(const {theme,width,scenes} of selected)for(const scene of scenes){
 const key=scene+"-"+theme+"-"+width;
 const status=receipts.get(key);
 if(!status||!manifest.images[key+".png"]||(status==="different"&&!existsSync(actuals.get(key)??"")))missing.push(key);
 if(status==="different")different.push(key);
}
console.log("VISUAL_REPORT "+JSON.stringify({expected:expectedKeys.size,completed:receipts.size,matched:[...receipts.values()].filter(x=>x==="matched").length,different:different.length,missing:missing.length}));
for(const key of missing)console.log("VISUAL_MISSING "+key);
// Optional bounded transport of original PNGs for detailed human review.
// Selected scenes must belong to the native comparison scope and have actual differences.
const detailKeys=process.env.VANYA_UI_VISUAL_DETAIL_KEYS?.split(",");
if(detailKeys){
 if(!detailKeys.length||new Set(detailKeys).size!==detailKeys.length||detailKeys.some(key=>!expectedKeys.has(key)))throw Error("Invalid visual detail keys");
 if(missing.length)throw Error("Incomplete comparison evidence");
 for(const key of detailKeys){
  if(receipts.get(key)!=="different"){
   console.log("VISUAL_DETAIL_MATCHED "+key);
   continue;
  }
  for(const [side,path] of [["before",join(baseline,key+".png")],["after",actuals.get(key)]]){
   const png=readFileSync(path);
   const encoded=png.toString("base64");
   const chunks=encoded.match(/.{1,1000}/g);
   const sha=createHash("sha256").update(png).digest("hex");
   console.log("VISUAL_DETAIL_BEGIN "+key+" "+side+" "+chunks.length+" "+sha+" "+png.length);
   for(let i=0;i<chunks.length;i++)console.log("VISUAL_DETAIL "+key+" "+side+" "+i+" "+chunks[i]);
   console.log("VISUAL_DETAIL_END "+key+" "+side);
  }
 }
 process.exit(0);
}
const data=path=>"data:image/png;base64,"+readFileSync(path).toString("base64");
const browser=await chromium.launch({channel:"chromium",headless:true});
try{
 const page=await browser.newPage({viewport:{width:1360,height:900}});
 for(const {theme,width,key:context,scenes} of selected){
  const thumb=width>=1024?206:116;
  const columns=width>=1024?3:4;
  const cards=scenes.map(scene=>{
   const key=scene+"-"+context, status=receipts.get(key);
   const before=join(baseline,key+".png");
   const after=status==="different"?actuals.get(key):status==="matched"?before:undefined;
   return '<article><b>'+scene+' · '+(status==="matched"?"matched · reference only":status??"missing")+'</b><div><img src="'+data(before)+'">'+(after&&existsSync(after)?'<img src="'+data(after)+'">':'<span>missing</span>')+'</div></article>';
  }).join("");
  await page.setContent('<html><head><style>body{margin:12px;background:white;color:#202020;font:12px Arial,sans-serif}h2{font-size:17px}main{display:grid;grid-template-columns:repeat('+columns+',max-content);gap:9px}article{border:1px solid #ccc;padding:5px}b{display:block;margin-bottom:4px}article div{display:flex;gap:3px}img{display:block;width:'+thumb+'px;height:auto;align-self:start}span{width:'+thumb+'px}</style></head><body><h2>'+context+' — baseline left / candidate right (matched uses reference)</h2><main>'+cards+'</main></body></html>');
  await page.locator("img").evaluateAll(async images=>{await Promise.all(images.map(img=>img.decode()))});
  const jpeg=await page.screenshot({fullPage:true,type:"jpeg",quality:38});
  const encoded=jpeg.toString("base64"), chunks=encoded.match(/.{1,180}/g);
  const sha=createHash("sha256").update(jpeg).digest("hex");
  console.log("VISUAL_SHEET_BEGIN "+context+" "+chunks.length+" "+sha);
  for(let i=0;i<chunks.length;i++)console.log("VISUAL_SHEET "+context+" "+i+" "+chunks[i]);
  console.log("VISUAL_SHEET_END "+context);
 }
}finally{await browser.close()}
if(missing.length)throw Error("Incomplete comparison evidence");
