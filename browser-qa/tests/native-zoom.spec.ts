import { chromium, expect, test } from "@playwright/test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

// Chrome's tab zoom changes layout and DPR; CSS zoom and pinch emulation do not prove it.
test("native 200% browser zoom preserves keyboard controls in both themes", async ({}, info) => {
  const profile = await mkdtemp(join(tmpdir(), "ui-zoom-"));
  const extension = resolve(import.meta.dirname, "../fixtures/zoom-extension");
  const context = await chromium.launchPersistentContext(profile, {
    channel: "chromium", headless: true, viewport: { width: 1440, height: 900 },
    args: ["--disable-extensions-except=" + extension, "--load-extension=" + extension],
  });
  try {
    const worker = context.serviceWorkers()[0] || await context.waitForEvent("serviceworker");
    const page = context.pages()[0] || await context.newPage();
    await page.bringToFront();
    await page.goto("http://127.0.0.1:4173/#compact-filter-toolbar");
    await page.evaluate(async () => { await document.fonts.ready; });
    const before = await page.evaluate(() => ({ width: innerWidth, dpr: devicePixelRatio }));
    const zoom = await worker.evaluate(`(async () => {
      const [tab] = await chrome.tabs.query({url: "http://127.0.0.1:4173/*"});
      if (!tab?.id) throw new Error("Missing local QA tab");
      await chrome.tabs.setZoom(tab.id, 2);
      return chrome.tabs.getZoom(tab.id);
    })()`);
    expect(zoom).toBe(2);
    await expect.poll(() => page.evaluate(() => innerWidth)).toBeLessThan(before.width * .6);
    expect(await page.evaluate(() => devicePixelRatio)).toBeCloseTo(before.dpr * 2, 1);
    for (const theme of ["light", "dark"]) {
      await page.evaluate(mode => { localStorage.setItem("vanya_theme", mode); }, theme);
      await page.reload();
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      const filter = page.getByRole("button", { name: "Жанр Все" });
      await filter.focus();
      await filter.press("ArrowDown");
      await expect(page.getByRole("searchbox", { name: "Поиск по вариантам: Жанр" })).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(filter).toBeFocused();
      const search = page.locator("#compact-filter-toolbar").getByRole("searchbox");
      await search.fill("тест");
      await expect(search).toHaveValue("тест");
      await page.evaluate(() => window.scrollTo({top: 0, behavior: "instant"}));
      await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
      await page.evaluate(async () => {
        await document.fonts.ready;
        await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      });
      await page.screenshot({ path: info.outputPath("native-200-" + theme + ".png"), animations: "disabled" });
    }
    await info.attach("native-zoom.json", { body: JSON.stringify({ zoom, before, after: await page.evaluate(() => ({ width: innerWidth, dpr: devicePixelRatio })) }), contentType: "application/json" });
  } finally {
    await context.close();
    await rm(profile, { recursive: true, force: true });
  }
});
