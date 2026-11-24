import { expect, test, type Locator } from "@playwright/test";

type Rect = { x: number; y: number; width: number; height: number };
type Anchor = { name: string; locator: Locator; protectHeight: boolean };

async function geometry(anchors: Anchor[]) {
  return Promise.all(anchors.map(async ({name, locator, protectHeight}) => ({
    name, protectHeight,
    rect: await locator.evaluate(el => {
      const r = el.getBoundingClientRect();
      return { x: r.x + window.scrollX, y: r.y + window.scrollY, width: r.width, height: r.height };
    }),
  })));
}

function largestShift(before: Awaited<ReturnType<typeof geometry>>, after: Awaited<ReturnType<typeof geometry>>) {
  return Math.max(...before.flatMap((anchor, i) => {
    const keys: (keyof Rect)[] = anchor.protectHeight ? ["x", "y", "width", "height"] : ["x", "y", "width"];
    return keys.map(key => Math.abs(anchor.rect[key] - after[i].rect[key]));
  }));
}

const sizes = [{width:1440,height:900},{width:1024,height:768},{width:390,height:844},{width:320,height:568}];

for (const size of sizes) for (const theme of ["light", "dark"] as const) {
  test("stable workspace geometry " + size.width + " / " + theme, async ({page}, info) => {
    await page.setViewportSize(size);
    await page.addInitScript(mode => localStorage.setItem("vanya_theme", mode), theme);
    await page.emulateMedia({reducedMotion:"reduce"});
    await page.goto("/#composition-stable-geometry");
    await page.evaluate(async () => { await document.fonts.ready; });
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    const section = page.locator("#composition-stable-geometry");
    const controls = section.getByRole("group", {name:"Состояние примера"});
    const plot = section.locator(".stable-geometry-plot");
    const series = plot.locator("polyline");
    const results = section.getByRole("region", {name:"Проекты"});
    const help = section.getByRole("link", {name:"Правила стабильного интерфейса"});
    const anchors: Anchor[] = [
      {name:"controls",locator:controls,protectHeight:true},
      {name:"plot",locator:plot,protectHeight:true},
      {name:"help",locator:help,protectHeight:true},
      {name:"list",locator:results,protectHeight:size.width>640},
      ...await Promise.all(["empty","one","many","loading","partial","error"].map(async id => ({
        name:id,locator:controls.locator('button[data-segment-id="'+id+'"]'),protectHeight:true,
      }))),
    ];
    const pick = async (id: string, keyboard = false) => {
      const button = controls.locator('button[data-segment-id="'+id+'"]');
      await button.scrollIntoViewIfNeeded();
      if (keyboard) { await button.focus(); await button.press("Space"); await expect(button).toBeFocused(); }
      else await button.click();
      await expect(button).toHaveAttribute("aria-pressed","true");
    };
    await expect(results.getByRole("listitem")).toHaveCount(12);
    // Independent expected data, not derived from the rendered initial state.
    const manyPoints = "24,86 70,62 116,74 162,38 208,58 254,22 300,54";
    const matchesSeries = async (points: string, count: number) =>
      await series.count()===1 && await series.getAttribute("points")===points &&
      await plot.locator("circle").count()===count;
    const assertSeries = async (points: string, count: number) => {
      await expect.poll(()=>matchesSeries(points,count)).toBe(true);
      await expect(series).toBeVisible();
    };
    await assertSeries(manyPoints,7);
    const before = await geometry(anchors);
    const controlsEncloseButtons = () => controls.evaluate(el => {
      const outer = el.getBoundingClientRect();
      return Array.from(el.querySelectorAll("button")).every(button => {
        const r = button.getBoundingClientRect();
        return r.left >= outer.left - 1 && r.right <= outer.right + 1 &&
          r.top >= outer.top - 1 && r.bottom <= outer.bottom + 1;
      });
    });
    const assertStable = async () => {
      await expect.poll(async () => largestShift(before, await geometry(anchors))).toBeLessThanOrEqual(1);
      expect(await section.evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
      expect(await controlsEncloseButtons(), "all selector rows must fit inside the visible group").toBe(true);
    };
    await assertStable();

    await pick("empty");
    await expect(results.getByText("Нет проектов",{exact:true})).toBeVisible();
    await expect(results.getByRole("listitem")).toHaveCount(0);
    await assertSeries("24,102 70,102 116,102 162,102 208,102 254,102 300,102",7);
    await assertStable();
    await pick("one", true);
    await expect(results.getByRole("listitem")).toHaveCount(1);
    await assertSeries("24,98 70,94 116,98 162,90 208,94 254,98 300,86",7);
    await assertStable();
    await pick("loading");
    await expect(plot.getByText("График загружается")).toBeVisible();
    await expect(results.getByRole("region",{name:"Загрузка результатов"})).toHaveAttribute("aria-busy","true");
    await expect(results.getByRole("listitem")).toHaveCount(0);
    await expect(series).toHaveCount(0);
    await assertStable();
    await pick("partial");
    await expect(results.getByRole("listitem")).toHaveCount(6);
    await expect(results.getByText("Доступно 6 из 12 проектов. Данных за последние 3 дня нет.")).toBeVisible();
    await assertSeries("24,86 70,62 116,74 162,38",4);
    await expect(results.getByRole("region",{name:"Загрузка результатов"})).toHaveCount(0);
    await assertStable();
    await pick("error");
    await expect(results.getByText("Не удалось загрузить проекты")).toBeVisible();
    await expect(results.getByRole("listitem")).toHaveCount(0);
    await expect(series).toHaveCount(0);
    await assertStable();
    await plot.scrollIntoViewIfNeeded();
    await info.attach("geometry-error", {body:await page.screenshot({animations:"disabled"}),contentType:"image/png"});
    await pick("many");
    await expect(results.getByRole("listitem")).toHaveCount(12);
    await assertSeries(manyPoints,7);
    await assertStable();
    await expect(results.getByText("Исследование длинных пользовательских сценариев и рабочих пространств")).toHaveCount(1);
    const details = section.locator(".stable-geometry-details");
    // Disclosure can move downstream content on mobile; protect only unaffected controls, plot and help.
    const fixed = anchors.filter(anchor => anchor.name !== "list");
    const fixedBefore = await geometry(fixed);
    await details.locator("summary").click();
    await expect(details).toHaveAttribute("open","");
    await expect(details.getByText("Действия по дням (1–7):",{exact:false})).toBeVisible();
    await expect.poll(async () => largestShift(fixedBefore,await geometry(fixed))).toBeLessThanOrEqual(1);
    await details.locator("summary").click();
    await assertStable();
    await plot.scrollIntoViewIfNeeded();
    await info.attach("geometry-many", {body:await page.screenshot({animations:"disabled"}),contentType:"image/png"});

    // Negative control: the same oracle must detect a deliberate layout regression.
    if (size.width===1440 && theme==="light") {
      // A present but frozen chart must fail the same data oracle.
      await series.evaluate(el=>el.setAttribute("points","24,102 70,102 116,102 162,102 208,102 254,102 300,102"));
      expect(await matchesSeries(manyPoints,7)).toBe(false);
      await series.evaluate((el,points)=>el.setAttribute("points",points),manyPoints);
      await assertSeries(manyPoints,7);
      await plot.evaluate(el => { (el as HTMLElement).style.marginTop="12px"; });
      expect(largestShift(before,await geometry(anchors))).toBeGreaterThan(1);
      await plot.evaluate(el => { (el as HTMLElement).style.marginTop=""; });
      await assertStable();
      // Reproduce the observed two-row selector overflowing its single-row token height.
      await controls.evaluate(el => { (el as HTMLElement).style.height="var(--ui-height)"; });
      expect(await controlsEncloseButtons()).toBe(false);
      await controls.evaluate(el => { (el as HTMLElement).style.height=""; });
      await assertStable();
    }
  });
}
