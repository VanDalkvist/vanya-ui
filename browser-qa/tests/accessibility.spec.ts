import { expect, test, type Page, type TestInfo } from "@playwright/test";
import axe from "axe-core";

const tags = ["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa"];
const controls = ["#segments","#range","#actions","#compact-filter-toolbar","#media-catalogue","#craft-card","#composition-stable-geometry",".showcase-header"];

async function scan(page: Page, info: TestInfo, name: string, scope: string[]) {
  // Use the pinned local npm package: no CDN, credentials, production bundle or extra service.
  await page.addScriptTag({content:axe.source});
  for(const selector of scope){
    await expect(page.locator(selector), "scan scope must exist: "+selector).toHaveCount(1);
    await expect(page.locator(selector)).toBeVisible();
  }
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
    const selectedFill = await page.getByRole("menuitemradio", {checked: true}).evaluate(node => getComputedStyle(node).backgroundColor);
    expect(selectedFill).not.toBe("rgba(0, 0, 0, 0)");
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

for (const theme of ["light", "dark"] as const) {
  test("SVG text contrast and forced-colors keyboard focus / " + theme, async ({page}, info) => {
    await page.addInitScript(mode => localStorage.setItem("vanya_theme", mode), theme);
    await page.goto("/#composition-stable-geometry");
    const contrast = await page.locator("#composition-stable-geometry svg text").evaluateAll(nodes => {
      const probe = document.createElement("span");
      probe.style.color = "var(--ground)";
      document.body.append(probe);
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 1;
      const context = canvas.getContext("2d")!;
      const luminance = (color: string) => {
        context.clearRect(0, 0, 1, 1);
        context.fillStyle = color;
        context.fillRect(0, 0, 1, 1);
        const channels = Array.from(context.getImageData(0, 0, 1, 1).data).slice(0, 3).map(value => {
          const linear = value / 255;
          return linear <= .04045 ? linear / 12.92 : ((linear + .055) / 1.055) ** 2.4;
        });
        return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
      };
      const background = luminance(getComputedStyle(probe).color);
      probe.remove();
      return nodes.map(node => {
        const foreground = luminance(getComputedStyle(node).fill);
        return { text: node.textContent, ratio: (Math.max(foreground, background) + .05) / (Math.min(foreground, background) + .05) };
      });
    });
    expect(contrast.length).toBeGreaterThan(0);
    for (const sample of contrast) expect(sample.ratio, JSON.stringify(sample)).toBeGreaterThanOrEqual(4.5);
    await info.attach("svg-contrast.json", {body: JSON.stringify(contrast), contentType: "application/json"});
    await page.emulateMedia({forcedColors: "active", reducedMotion: "reduce"});
    expect(await page.evaluate(() => matchMedia("(forced-colors: active)").matches)).toBe(true);
    const systemText = await page.locator("#composition-stable-geometry svg text").evaluateAll(nodes => {
      const probe = document.createElement("span");
      probe.style.color = "CanvasText";
      document.body.append(probe);
      const expected = getComputedStyle(probe).color;
      probe.remove();
      return nodes.every(node => getComputedStyle(node).fill === expected);
    });
    expect(systemText, "SVG labels must use the system text color in forced colors").toBe(true);
    const trigger = page.getByRole("button", {name: /Тема оформления:/}).first();
    await trigger.focus();
    await trigger.press("ArrowDown");
    const selected = page.getByRole("menuitemradio").first();
    await expect(selected).toBeFocused();
    const focus = await selected.evaluate(node => {
      const style = getComputedStyle(node);
      return {visible: node.matches(":focus-visible"), width: parseFloat(style.outlineWidth), style: style.outlineStyle};
    });
    expect(focus.visible).toBe(true);
    expect(focus.width).toBeGreaterThan(0);
    expect(focus.style).not.toBe("none");
    await page.screenshot({path: info.outputPath("forced-colors-" + theme + ".png")});
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
  });
}

test("axe oracle detects a missing accessible name",async({page},info)=>{
  await page.goto("/#range");
  const slider=page.locator("#range").getByRole("slider");
  await expect(slider).toHaveCount(1);
  await page.addScriptTag({content:axe.source});
  const scanRange=()=>page.evaluate(async()=> (await window.axe.run(["#range"],{runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa"]}})).violations.flatMap(v=>v.nodes.map(n=>({id:v.id,target:n.target}))));
  const isMissingName=(v:{id:string,target:unknown[]})=>["aria-input-field-name","label"].includes(v.id)&&JSON.stringify(v.target).includes("input");
  const before=await scanRange();
  expect(before.some(isMissingName)).toBe(false);
  const name=await slider.getAttribute("aria-label");
  expect(name).toBeTruthy();
  await slider.evaluate(el=>el.removeAttribute("aria-label"));
  const red=await scanRange();
  expect(red.some(isMissingName)).toBe(true);
  await slider.evaluate((el,label)=>el.setAttribute("aria-label",label!),name);
  const after=await scanRange();
  expect(after.some(isMissingName)).toBe(false);
  await info.attach("negative-control.json",{body:JSON.stringify({before,red,after}),contentType:"application/json"});
});
