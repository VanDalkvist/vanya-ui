import {expect,test} from "@playwright/test";

const mode=process.env.VANYA_UI_VISUAL_MODE;
const expected=process.env.VANYA_UI_EXPECT_VERSION;
const chapters=["identity","typography","writing","principles","catalog","workspace","setup","agents","composition-principle","compact-filter-toolbar","quiet-editor","quiet-confirmation"] as const;
test.skip(!mode,"Visual baseline/compare must be explicitly requested");
for(const theme of ["light","dark"] as const)for(const width of [1440,1024,390,320]){
 test("Composition visual matrix "+theme+" "+width,async({page,browser},info)=>{
  test.setTimeout(180_000);
  expect(["baseline","compare"]).toContain(mode);
  expect(expected,"Set the exact intended package version").toBeTruthy();
  expect(process.env.VANYA_UI_EVIDENCE_SHA,"Set the exact served source SHA").toMatch(/^[a-f0-9]{40}$/);
  expect(info.config.updateSnapshots,"Explicit snapshot policy").toBe(mode==="baseline"?"all":"none");
  await page.setViewportSize({width,height:900});
  await page.emulateMedia({reducedMotion:"reduce",colorScheme:theme});
  await page.addInitScript(value=>localStorage.setItem("vanya_theme",value),theme);
  await info.attach("environment",{body:JSON.stringify({mode,version:expected,sha:process.env.VANYA_UI_EVIDENCE_SHA,browser:browser.version(),platform:process.platform,width,theme}),contentType:"application/json"});
  for(const anchor of chapters){
   await page.goto("/#"+anchor);
   await expect(page.locator("html")).toHaveAttribute("data-theme",theme);
   const marker=page.locator("header.showcase-header [data-ui-version]");
   await expect(marker).toHaveAttribute("data-ui-version",expected!);
   await page.evaluate(()=>document.fonts.ready);
   await expect(page.locator("#"+anchor)).toBeVisible();
   await page.locator("#"+anchor).scrollIntoViewIfNeeded();
   // Use deterministic anchor top rather than a prior test's scroll history.
   await page.locator("#"+anchor).evaluate(e=>e.scrollIntoView({block:"start",behavior:"instant"}));
   await page.mouse.move(0,0);
   await expect(page).toHaveScreenshot(anchor+"-"+theme+"-"+width+".png",{
    animations:"disabled",caret:"hide",scale:"css",mask:[marker],maxDiffPixels:0,
   });
  }
 });
}
