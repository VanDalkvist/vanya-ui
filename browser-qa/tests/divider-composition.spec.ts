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
  for(const selector of ["#typography-scale","#typography-tracking",".type-editorial-pair",".type-reading-demo",".writing-example",".writing-skill-list",".demo-interaction-specimen"]){
   const group=page.locator(selector);
   await expect(group).toHaveCount(1);
   expect(await edges(group)).toEqual(open);
  }
  for(const selector of ["#typography-scale > .type-specimen","#typography-tracking > .type-specimen",".writing-skill-list > div"]){
   const rows=await page.locator(selector).all();
   expect(rows.length).toBeGreaterThan(1);
   for(const [i,row] of rows.entries())expect(await edges(row)).toEqual(i===0?open:internal);
  }
  const principles=page.locator(".writing-principles");
  expect(await edges(principles)).toEqual(internal);
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
