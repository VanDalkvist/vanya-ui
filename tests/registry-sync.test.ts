import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe,expect,it } from "vitest";
const root=resolve(import.meta.dirname,"..");
describe("component registry is derived from public exports",()=>{
 it("includes each real exported component exactly once",()=>{
  const exported=readFileSync(resolve(root,"src/index.ts"),"utf8");
  const actual=readdirSync(resolve(root,"src/components")).filter(file=>file.endsWith(".tsx")&&exported.includes('./components/'+file.slice(0,-4)+'"')).map(file=>file.slice(0,-4)).sort();
  const registry=JSON.parse(readFileSync(resolve(root,"registry.json"),"utf8")).items.map((entry:{title:string})=>entry.title).sort();
  expect(registry).toEqual(actual);
  expect(registry.filter((name:string)=>name==="Disclosure")).toHaveLength(1);
  expect(registry).not.toContain("DisclosurePill");
  expect(registry).not.toContain("InspectorMeta");
  expect(exported).not.toMatch(/\b(?:DisclosurePill|InspectorMeta)\b/);
 });
});
