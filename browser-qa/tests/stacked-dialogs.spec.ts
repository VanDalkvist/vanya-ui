import {test, expect} from "@playwright/test";
import {execFileSync} from "node:child_process";
import {mkdtemp, rm} from "node:fs/promises";
import {tmpdir} from "node:os";
import {join, resolve} from "node:path";

let directory: string;
let bundle: string;
test.beforeAll(async () => {
  directory = await mkdtemp(join(tmpdir(), "ui-stacked-dialogs-"));
  bundle = join(directory, "fixture.js");
  execFileSync("bun", ["build", resolve(import.meta.dirname, "../fixtures/stacked-dialogs.tsx"),
    "--target=browser", "--format=iife", "--outfile=" + bundle], {timeout: 15000});
});
test.afterAll(async () => {
  if (directory) await rm(directory, {recursive: true, force: true});
});

for (const outerFirst of [false, true]) {
  test("native stacked dialogs preserve focus and lock; outer removed first=" + outerFirst, async ({page}) => {
    await page.goto("/");
    await page.addScriptTag({path: bundle});
    await page.evaluate(() => { document.body.style.overflow = "auto"; });
    const scope = page.locator("#qa-stacked-dialogs");
    const opener = scope.getByRole("button", {name: "Открыть внешний QA диалог"});
    const outer = scope.locator("dialog").filter({hasText: "Внешний QA диалог"});
    const inner = scope.locator("dialog").filter({hasText: "Внутренний QA диалог"});
    const openInner = outer.getByRole("button", {name: "Открыть внутренний QA диалог"});
    const closeInner = inner.getByRole("button", {name: "Закрыть окно"});
    const overflow = () => page.evaluate(() => document.body.style.overflow);

    await opener.click();
    await expect(outer).toBeVisible();
    await expect(outer.getByRole("button", {name: "Закрыть инспектор"})).toBeFocused();
    await expect.poll(overflow).toBe("hidden");

    await openInner.click();
    await expect(inner).toBeVisible();
    await expect(scope.locator("dialog[open]")).toHaveCount(2);
    await expect(closeInner).toBeFocused();
    await expect.poll(overflow).toBe("hidden");

    // A real top-layer modal prevents focus from escaping to its inert opener.
    await openInner.evaluate(el => (el as HTMLElement).focus());
    await expect(closeInner).toBeFocused();

    if (outerFirst) {
      // Caller-driven unmount, because the lower dialog cannot receive user input.
      await page.evaluate(() => window.dispatchEvent(new Event("qa:remove-outer-dialog")));
      await expect(outer).toHaveCount(0);
      await expect(inner).toBeVisible();
      await expect(closeInner).toBeFocused();
    } else {
      await page.keyboard.press("Escape");
      await expect(inner).toHaveCount(0);
      await expect(outer).toBeVisible();
      await expect(openInner).toBeFocused();
    }
    await expect(scope.locator("dialog[open]")).toHaveCount(1);
    await expect.poll(overflow).toBe("hidden");

    await page.keyboard.press("Escape");
    await expect(scope.locator("dialog")).toHaveCount(0);
    await expect(opener).toBeFocused();
    await expect.poll(overflow).toBe("auto");

    // Reopen after full cleanup: no stale stack entry should retain the lock.
    await opener.click();
    await expect(outer).toBeVisible();
    await expect.poll(overflow).toBe("hidden");
    await outer.getByRole("button", {name: "Закрыть инспектор"}).click();
    await expect(scope.locator("dialog")).toHaveCount(0);
    await expect(opener).toBeFocused();
    await expect.poll(overflow).toBe("auto");
  });
}
