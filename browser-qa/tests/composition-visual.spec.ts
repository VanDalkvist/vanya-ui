import {expect,test} from "@playwright/test";
import {release} from "node:os";
import {visualContexts, recordCapture, verifyEnvironment} from "../visual-baseline.mjs";

const mode=process.env.VANYA_UI_VISUAL_MODE;
const expected=process.env.VANYA_UI_EXPECT_VERSION;
test.skip(!mode,"Visual baseline/compare must be explicitly requested");
for(const {theme,width,scenes} of visualContexts){
 test("Composition visual matrix "+theme+" "+width,async({page,browser},info)=>{
  test.setTimeout(300_000);
  expect(["baseline","compare"]).toContain(mode);
  expect(expected,"Set the exact intended package version").toBeTruthy();
  expect(process.env.VANYA_UI_EVIDENCE_SHA,"Set the exact served source SHA").toMatch(/^[a-f0-9]{40}$/);
  expect(info.config.updateSnapshots,"Explicit snapshot policy").toBe(mode==="baseline"?"all":"none");
  await page.setViewportSize({width,height:900});
  await page.emulateMedia({reducedMotion:"reduce",colorScheme:theme as "light"|"dark"});
  await page.addInitScript(value=>localStorage.setItem("vanya_theme",value),theme);
  await info.attach("environment",{body:JSON.stringify({mode,version:expected,sha:process.env.VANYA_UI_EVIDENCE_SHA,browser:browser.version(),platform:process.platform,width,theme}),contentType:"application/json"});
  let environment: Record<string,unknown>|undefined;
  for(const scene of scenes){
   const opened=scene==="inspector-open"?{anchor:"inspector",button:"Открыть InspectDrawer",close:"Закрыть инспектор",content:"Здесь можно разместить описание, ссылки и другие подробности проекта."}:scene==="digest-open"?{anchor:"digest",button:"Открыть ReceiptDigestModal",close:"Закрыть окно",content:"Обновили примеры компонентов"}:null;
   const anchor=opened?.anchor??scene;
   await page.goto(scene==="agent-page"?"/agents/":scene==="hero"?"/":"/#"+anchor);
   await expect(page.locator("html")).toHaveAttribute("data-theme",theme);
   const marker=page.locator(scene==="agent-page"?"header.agent-page-header [data-ui-version]":"header.showcase-header [data-ui-version]");
   await expect(marker).toHaveAttribute("data-ui-version",expected!);
   await page.evaluate(()=>document.fonts.ready);
   if(!environment){
    environment={browser:browser.version(),platform:process.platform,arch:process.arch,os:release(),fonts:await page.evaluate(()=>Array.from(document.fonts).map(f=>[f.family,f.style,f.weight,f.status].join(":")).sort())};
    verifyEnvironment(process.env,theme,width,environment);
    await info.attach("browser-environment",{body:JSON.stringify(environment),contentType:"application/json"});
   }
   if(scene==="hero"){
    await expect(page.getByRole("heading",{name:"Готовые компоненты для рабочих интерфейсов."})).toBeVisible();
    await expect(page.locator(".scene-wave")).toHaveAttribute("data-wave-ready","true");
    await expect(page.locator(".scene-wave")).toHaveCSS("visibility","visible");
   }else if(scene==="agent-page"){
    await expect(page).toHaveURL(/\/agents\/$/);
    await expect(page.getByRole("heading",{level:1,name:"Дизайн-система для агентов"})).toBeVisible();
   }else{
    await expect(page.locator("#"+anchor)).toBeVisible();
    await page.locator("#"+anchor).scrollIntoViewIfNeeded();
    await page.locator("#"+anchor).evaluate(e=>e.scrollIntoView({block:"start",behavior:"instant"}));
   }
   if(opened){
    await page.locator("#"+anchor).getByRole("button",{name:opened.button,exact:true}).click();
    await expect(page.getByText(opened.content,{exact:true})).toBeVisible();
   }
   await page.mouse.move(0,0);
   const errorsBefore=info.errors.length;
   const screenshotExpect=mode==="baseline"?expect(page):expect.soft(page);
   await screenshotExpect.toHaveScreenshot(scene+"-"+theme+"-"+width+".png",{
    animations:"disabled",caret:"hide",scale:"css",mask:[marker],maxDiffPixels:0,
   });
   console.log("VISUAL_SCENE "+JSON.stringify({scene,theme,width,mode,status:info.errors.length===errorsBefore?"matched":"different"}));
   if(opened){
    await page.getByRole("button",{name:opened.close,exact:true}).click();
    await expect(page.getByText(opened.content,{exact:true})).toHaveCount(0);
   }
  }
  if(mode==="baseline"&&environment)recordCapture(process.env,theme,width,environment);
 });
}
