import { expect, test, type Page, type TestInfo } from "@playwright/test";
import axe from "axe-core";

const tags = ["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa"];
const controls = ["#segments","#range","#actions","#compact-filter-toolbar","#media-catalogue","#composition-stable-geometry",".showcase-header"];

async function scan(page: Page, info: TestInfo, name: string, scope: string[]) {
  // Use the pinned local npm package: no CDN, credentials, production bundle or extra service.
  await page.addScriptTag({content:axe.source});
  const result = await page.evaluate(async ({scope,tags}) =>
    window.axe.run(scope,{runOnly:{type:"tag",values:tags}}),{scope,tags});
  const receipt = {
    version:result.testEngine.version, scope, passes:result.passes.length,
    violations:result.violations.map(rule=>({id:rule.id,impact:rule.impact,nodes:rule.nodes.map(node=>({target:node.target,summary:node.failureSummary}))})),
    incomplete:result.incomplete.map(rule=>({id:rule.id,nodes:rule.nodes.map(node=>({target:node.target,summary:node.failureSummary}))})),
  };
  await info.attach(name+".json",{body:JSON.stringify(receipt,null,2),contentType:"application/json"});
  expect(receipt.passes,"scan must actually evaluate rules").toBeGreaterThan(0);
  expect(receipt.violations,JSON.stringify(receipt.violations,null,2)).toEqual([]);
  // Incomplete rules are deliberately retained for human evaluation, not counted as passed.
}

for(const theme of ["light","dark"] as const) {
  test("axe WCAG A/AA controls and open overlays / "+theme,async({page},info)=>{
    await page.setViewportSize({width:1440,height:900});
    await page.addInitScript(mode=>localStorage.setItem("vanya_theme",mode),theme);
    await page.emulateMedia({reducedMotion:"reduce"});
    await page.goto("/#segments");
    await page.evaluate(async()=>{await document.fonts.ready});
    await expect(page.locator("html")).toHaveAttribute("data-theme",theme);
    await scan(page,info,"controls",controls);
    const toggle=page.getByRole("button",{name:/Тема оформления:/}).first();
    await toggle.focus();
    await toggle.press("ArrowDown");
    await expect(page.getByRole("menu",{name:"Тема оформления"})).toBeVisible();
    await scan(page,info,"open-menu",[".showcase-header"]);
    await page.keyboard.press("Escape");
    await expect(toggle).toBeFocused();
    const opener=page.locator("#inspector").getByRole("button",{name:"Открыть InspectDrawer"});
    await opener.focus();
    await opener.press("Enter");
    await expect(page.getByRole("dialog")).toBeVisible();
    await scan(page,info,"open-drawer",["dialog[open]"]);
    await page.keyboard.press("Escape");
    await expect(opener).toBeFocused();
  });
}

test("axe oracle detects a missing accessible name",async({page},info)=>{
  await page.goto("/#range");
  const slider=page.locator("#range").getByRole("slider");
  await slider.evaluate(el=>el.removeAttribute("aria-label"));
  await page.addScriptTag({content:axe.source});
  const violations=await page.evaluate(async()=> (await window.axe.run(["#range"],{runOnly:["aria-input-field-name","label"]})).violations.map(v=>v.id));
  await info.attach("negative-control.json",{body:JSON.stringify(violations),contentType:"application/json"});
  expect(violations.some(id=>id==="aria-input-field-name"||id==="label")).toBe(true);
});
