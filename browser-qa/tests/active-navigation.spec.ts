import { expect, test } from "@playwright/test";

for (const width of [1440,1024,390,320]) {
  test("active navigation follows native fragments and clamped scroll at "+width, async ({page})=>{
    await page.setViewportSize({width,height:844});
    await page.emulateMedia({reducedMotion:"reduce"});
    await page.goto("/#typography");
    await page.evaluate(async()=>{await document.fonts.ready});
    const current=page.locator('.showcase-nav a[aria-current="location"]');
    await expect(current).toHaveText("Шрифты");
    const visibleInStrip = () => current.evaluate(el => {
      const strip = el.parentElement!.getBoundingClientRect(), link = el.getBoundingClientRect();
      return link.left >= strip.left - 1 && link.right <= strip.right + 1;
    });
    await expect.poll(visibleInStrip).toBe(true);
    for (const [id,label] of [["writing","Тексты"],["workspace","Рабочие поверхности"],["setup","Подключение"]]) {
      await page.locator("#"+id).evaluate(el=>el.scrollIntoView({block:"start",behavior:"instant"}));
      await expect(current).toHaveText(label);
      await expect(current).toHaveCount(1);
      await expect.poll(visibleInStrip).toBe(true);
    }
    await page.goto("/#identity");
    await expect(current).toHaveText("Айдентика");
    await page.goto("/#catalog");
    await expect(current).toHaveText("Компоненты");
    await page.goBack();
    await expect(current).toHaveText("Айдентика");
    await page.goForward();
    await expect(current).toHaveText("Компоненты");
  });
}

for (const width of [320,390,1024,1440]) test("header areas and measured clearance at "+width,async({page})=>{
  await page.setViewportSize({width,height:844}); await page.goto("/");
  await page.evaluate(async()=>{await document.fonts.ready});
  const header=page.locator(".showcase-header");
  await expect.poll(()=>header.evaluate(el=>Math.abs(Math.ceil(el.getBoundingClientRect().height)-parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--showcase-header-height"))))).toBeLessThanOrEqual(1);
  const separated=()=>header.evaluate(el=>{
    const rects=[".showcase-name",".showcase-nav",".showcase-utilities"].map(s=>el.querySelector(s)!.getBoundingClientRect());
    return rects.every((a,i)=>rects.slice(i+1).every(b=>a.right<=b.left+1||b.right<=a.left+1||a.bottom<=b.top+1||b.bottom<=a.top+1));
  });
  expect(await separated()).toBe(true);
  await page.evaluate(()=>{document.documentElement.style.fontSize="200%"});
  await expect.poll(()=>header.evaluate(el=>Math.abs(Math.ceil(el.getBoundingClientRect().height)-parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--showcase-header-height"))))).toBeLessThanOrEqual(1);
  expect(await separated()).toBe(true);
});
