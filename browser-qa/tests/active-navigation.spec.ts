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
