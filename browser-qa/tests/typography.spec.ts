import { expect, test, type Locator } from "@playwright/test";

async function trackingRatio(locator:Locator){
  return locator.evaluate(el=>{
    const style=getComputedStyle(el);
    return (parseFloat(style.letterSpacing)||0)/parseFloat(style.fontSize);
  });
}

for(const width of [320,390,1024,1440]) for(const theme of ["light","dark"] as const){
  test("bilingual type roles "+width+" / "+theme,async({page})=>{
    await page.setViewportSize({width,height:844});
    await page.addInitScript(mode=>localStorage.setItem("vanya_theme",mode),theme);
    await page.emulateMedia({reducedMotion:"reduce"});
    await page.goto("/#typography");
    await page.evaluate(async()=>{await document.fonts.ready;});
    await expect(page.locator("html")).toHaveAttribute("data-theme",theme);
    const scope=page.locator("#typography-tracking");
    const actions=scope.locator(".type-action-pair").nth(1).getByRole("button").or(scope.locator(".type-action-pair").nth(1).getByRole("link"));
    await expect(actions).toHaveCount(4);
    for(const control of await actions.all()){
      await expect(control).toBeVisible();
      expect(await trackingRatio(control)).toBeCloseTo(0,3);
      expect(await control.evaluate(el=>getComputedStyle(el).fontFamily)).toContain("Manrope");
      expect(await control.evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
    }
    const normal=scope.getByRole("button",{name:"Открыть проект"});
    expect(await trackingRatio(normal)).toBeCloseTo(0,3);
    expect(await normal.evaluate(el=>getComputedStyle(el).fontFamily)).toContain("Manrope");
    const meta=scope.locator(".ui-type-metadata");
    await expect(meta).toHaveCount(2);
    for(const item of await meta.all()){
      expect(await trackingRatio(item)).toBeCloseTo(.06,3);
      expect(await item.evaluate(el=>getComputedStyle(el).fontFamily)).toContain("JetBrains Mono");
    }
    const action=scope.getByRole("button",{name:"Подробнее"});
    await action.click();
    await expect(scope.getByRole("status")).toHaveText("Выбрано: Подробнее");
    await scope.getByRole("button",{name:"Details"}).click();
    await expect(scope.getByRole("status")).toHaveText("Выбрано: Details");
    await scope.getByRole("link",{name:"К чтению"}).click();
    await expect(page).toHaveURL(/#type-reading-title$/);
    await expect.poll(()=>page.locator("#type-reading-title").evaluate(el=>el.getBoundingClientRect().top>=document.querySelector(".showcase-header")!.getBoundingClientRect().bottom-1)).toBe(true);
    // Old tracking must fail the same computed-style oracle.
    await action.evaluate(el=>{(el as HTMLElement).style.letterSpacing=".16em"});
    expect(await trackingRatio(action)).not.toBeCloseTo(.03,3);
    await action.evaluate(el=>{(el as HTMLElement).style.letterSpacing=""});
    expect(await trackingRatio(action)).toBeCloseTo(.03,3);
    expect(await scope.evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
  });
}

// Verify actual painted glyphs (including Cyrillic and italic) via Chromium CDP.
test("Spectral paints Russian and English editorial text",async({page})=>{
  await page.goto("/#typography-editorial");
  await page.evaluate(async()=>{await document.fonts.ready;});
  const session=await page.context().newCDPSession(page);
  await session.send("DOM.enable"); await session.send("CSS.enable");
  const {root}=await session.send("DOM.getDocument");
  for(const lang of ["ru","en"]){
    for(const role of [".ui-type-editorial-heading",".ui-type-editorial-body","em"]){
      const selector='#typography-editorial article[lang="'+lang+'"] '+role;
      await expect(page.locator(selector).first()).toBeVisible();
      const {nodeId}=await session.send("DOM.querySelector",{nodeId:root.nodeId,selector});
      expect(nodeId).toBeGreaterThan(0);
      const {fonts}=await session.send("CSS.getPlatformFontsForNode",{nodeId});
      expect(fonts.some(font=>font.isCustomFont&&font.familyName.includes("Spectral")&&font.glyphCount>0)).toBe(true);
      expect(fonts.filter(font=>font.glyphCount>0).every(font=>font.familyName.includes("Spectral"))).toBe(true);
    }
  }
  // Fallback must be detected by the same painted-glyph criterion.
  const sample=page.locator('#typography-editorial article[lang="ru"] .ui-type-editorial-body').first();
  const {nodeId}=await session.send("DOM.querySelector",{nodeId:root.nodeId,selector:'#typography-editorial article[lang="ru"] .ui-type-editorial-body'});
  const hasSpectral=async()=> (await session.send("CSS.getPlatformFontsForNode",{nodeId})).fonts.some(font=>font.isCustomFont&&font.familyName.includes("Spectral")&&font.glyphCount>0);
  await sample.evaluate(el=>{(el as HTMLElement).style.fontFamily="monospace";});
  await expect.poll(hasSpectral).toBe(false);
  await sample.evaluate(el=>{(el as HTMLElement).style.fontFamily="";});
  await expect.poll(hasSpectral).toBe(true);
  await session.detach();
});
