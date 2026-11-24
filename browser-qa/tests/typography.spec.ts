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
    const mono=scope.locator('[data-variant="mono"]');
    await expect(mono).toHaveCount(4);
    for(const control of await mono.all()){
      await expect(control).toBeVisible();
      expect(await trackingRatio(control)).toBeCloseTo(.03,3);
      expect(await control.evaluate(el=>getComputedStyle(el).fontFamily)).toContain("JetBrains Mono");
      expect(await control.evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
    }
    const normal=scope.getByRole("button",{name:"Открыть проект"});
    expect(await trackingRatio(normal)).toBeCloseTo(0,3);
    expect(await normal.evaluate(el=>getComputedStyle(el).fontFamily)).toContain("Manrope");
    const meta=scope.locator(".ui-type-metadata");
    await expect(meta).toHaveCount(2);
    for(const item of await meta.all())expect(await trackingRatio(item)).toBeCloseTo(.06,3);
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
