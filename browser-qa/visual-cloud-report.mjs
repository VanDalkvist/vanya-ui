// Report transport only. Playwright remains the comparison oracle.
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { chromium } from "@playwright/test";
import { collectVisualEvidence } from "./visual-report-evidence.mjs";

const baseline=process.env.VANYA_UI_VISUAL_BASELINE_DIR;
const evidence=process.env.VANYA_UI_EVIDENCE_DIR;
const manifest=JSON.parse(readFileSync(join(baseline,"manifest.json"),"utf8"));
const report=JSON.parse(readFileSync(join(evidence,"results.json"),"utf8"));
const requested=process.env.VANYA_UI_VISUAL_REVIEW_CONTEXTS?.split(",");
const {selected,expectedKeys,receipts,actuals,different}=collectVisualEvidence({report,manifest,baseline,evidence,requested});
console.log("VISUAL_REPORT "+JSON.stringify({expected:expectedKeys.size,completed:receipts.size,matched:[...receipts.values()].filter(x=>x==="matched").length,different:different.length,missing:0}));
// Optional bounded transport of original PNGs for detailed human review.
// Selected scenes must belong to the native comparison scope and have actual differences.
const detailKeys=process.env.VANYA_UI_VISUAL_DETAIL_KEYS?.split(",");
if(detailKeys){
 if(!detailKeys.length||new Set(detailKeys).size!==detailKeys.length||detailKeys.some(key=>!expectedKeys.has(key)))throw Error("Invalid visual detail keys");
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
   const after=status==="different"?actuals.get(key):undefined;
   return '<article><b>'+scene+' · '+(status==="matched"?"matched · reference only":status??"missing")+'</b><div><img src="'+data(before)+'">'+(after&&existsSync(after)?'<img src="'+data(after)+'">':'<span>Reference only</span>')+'</div></article>';
  }).join("");
  await page.setContent('<html><head><style>body{margin:12px;background:white;color:#202020;font:12px Arial,sans-serif}h2{font-size:17px}main{display:grid;grid-template-columns:repeat('+columns+',max-content);gap:9px}article{border:1px solid #ccc;padding:5px}b{display:block;margin-bottom:4px}article div{display:flex;gap:3px}img{display:block;width:'+thumb+'px;height:auto;align-self:start}span{width:'+thumb+'px}</style></head><body><h2>'+context+' — baseline left / candidate right (matched: reference only)</h2><main>'+cards+'</main></body></html>');
  await page.locator("img").evaluateAll(async images=>{await Promise.all(images.map(img=>img.decode()))});
  const jpeg=await page.screenshot({fullPage:true,type:"jpeg",quality:38});
  const encoded=jpeg.toString("base64"), chunks=encoded.match(/.{1,180}/g);
  const sha=createHash("sha256").update(jpeg).digest("hex");
  console.log("VISUAL_SHEET_BEGIN "+context+" "+chunks.length+" "+sha);
  for(let i=0;i<chunks.length;i++)console.log("VISUAL_SHEET "+context+" "+i+" "+chunks[i]);
  console.log("VISUAL_SHEET_END "+context);
 }
}finally{await browser.close()}
