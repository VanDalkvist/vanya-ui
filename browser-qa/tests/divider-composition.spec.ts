import { expect, test, type Locator } from "@playwright/test";

async function edges(locator:Locator){
 return locator.evaluate(el=>{
  const s=getComputedStyle(el);
  const edge=(side:"top"|"bottom")=>s.getPropertyValue("border-"+side+"-style")!=="none"&&parseFloat(s.getPropertyValue("border-"+side+"-width"))>0;
  return {top:edge("top"),bottom:edge("bottom")};
 });
}
const open={top:false,bottom:false},internal={top:true,bottom:false};
for(const width of [320,390,1024,1440]) for(const theme of ["light","dark"]){
 test("single-owner content boundaries "+width+" "+theme,async({page})=>{
  await page.setViewportSize({width,height:844});
  await page.addInitScript(mode=>localStorage.setItem("vanya_theme",mode),theme);
  await page.goto("/#typography");
  await expect(page.locator("html")).toHaveAttribute("data-theme",theme);
  for(const selector of ["#typography-scale","#typography-tracking","#typography-editorial","#typography-reading","#writing-first-screen","#writing-rules","#writing-methods"]){
   expect(await edges(page.locator(selector)),selector).toEqual(internal);
  }
  for(const selector of ["#typography-scale .type-specimens","#typography-tracking .type-specimens",".type-editorial-pair",".type-reading-demo",".writing-example",".writing-skill-list",".demo-interaction-specimen"]){
   const group=page.locator(selector);
   await expect(group).toHaveCount(1);
   expect(await edges(group),selector).toEqual(open);
  }
  for(const selector of ["#typography-scale .type-specimens > .type-specimen","#typography-tracking .type-specimens > .type-specimen",".writing-skill-list > div"]){
   const rows=await page.locator(selector).all();
   expect(rows.length).toBeGreaterThan(1);
   for(const [i,row] of rows.entries())expect(await edges(row),selector+" row "+i).toEqual(i===0?open:internal);
  }
  const principles=page.locator(".writing-principles");
  expect(await edges(page.locator("#writing-rules"))).toEqual(internal);
  expect(await edges(principles)).toEqual(open);
  await expect(principles.locator("article")).toHaveCount(4);
  for(const article of await principles.locator("article").all())expect(await edges(article)).toEqual(open);
  const samples=await page.locator(".demo-interaction-sample").all();
  expect(samples.length).toBeGreaterThan(2);
  for(const [i,sample] of samples.entries())expect(await edges(sample)).toEqual(i<(width<=700?1:2)?open:internal);
  // Restore the previous competing outer edge and require the same oracle to reject it.
  const example=page.locator(".writing-example");
  await example.evaluate(el=>{(el as HTMLElement).style.borderBottom="1px solid var(--border)";});
  expect(await edges(example)).not.toEqual(open);
  await example.evaluate(el=>{(el as HTMLElement).style.borderBottom="";});
  expect(await edges(example)).toEqual(open);
  await expect(page.locator("#typography")).toContainText("Spectral");
  await expect(page.locator("#writing")).toContainText("Кнопки");
 });
}
