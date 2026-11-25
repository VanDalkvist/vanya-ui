import {test, expect} from "@playwright/test";
import {execFileSync} from "node:child_process";
import {mkdtemp, rm} from "node:fs/promises";
import {tmpdir} from "node:os";
import {join, resolve} from "node:path";

let directory: string;
let bundle: string;
test.beforeAll(async () => {
  directory = await mkdtemp(join(tmpdir(), "ui-dynamic-tabs-"));
  bundle = join(directory, "fixture.js");
  execFileSync("bun", ["build", resolve(import.meta.dirname, "../fixtures/dynamic-tabs.tsx"), "--target=browser", "--format=iife", "--outfile=" + bundle], {timeout: 15000});
});
test.afterAll(async () => { if (directory) await rm(directory, {recursive: true, force: true}); });

for (const action of ["Disable Alpha", "Remove Alpha"]) {
  test("real React tabs reconcile selected item after " + action, async ({page}) => {
    await page.goto("/#segments");
    await page.addScriptTag({path: bundle});
    const scope = page.getByRole("region", {name: "Dynamic tabs QA"});
    await expect(scope.getByRole("tab", {name: "Alpha"})).toHaveAttribute("aria-selected", "true");
    await expect(scope.getByRole("tabpanel", {name: "Alpha"})).toHaveText("Alpha content");
    await scope.getByRole("button", {name: action}).click();
    const beta = scope.getByRole("tab", {name: "Beta"});
    await expect(beta).toHaveAttribute("aria-selected", "true");
    await expect(scope.getByRole("tabpanel", {name: "Beta"})).toHaveText("Beta content");
    await expect(scope.locator("#qa-panel-a")).toHaveCount(0);
    await beta.focus();
    await beta.press("Tab");
    await expect(scope.getByRole("tabpanel", {name: "Beta"})).toBeFocused();
    if (action === "Disable Alpha") await expect(scope.getByRole("tab", {name: "Alpha"})).toBeDisabled();
    else await expect(scope.getByRole("tab", {name: "Alpha"})).toHaveCount(0);
  });
}
