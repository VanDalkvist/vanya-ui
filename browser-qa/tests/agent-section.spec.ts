import { expect,test } from "@playwright/test";

for (const width of [320,390,1024,1440]) for (const theme of ["light","dark"] as const) {
 test("agent section is usable at "+width+" / "+theme,async({page},info)=>{
  await page.setViewportSize({width,height:844});
  await page.addInitScript(mode=>localStorage.setItem("vanya_theme",mode),theme);
  await page.goto("/#agents");
  await page.evaluate(async()=>{await document.fonts.ready});
  const section=page.getByRole("region",{name:"Агентам",exact:true});
  await expect(section).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-theme",theme);
  await expect(page.locator('.showcase-nav a[aria-current="location"]')).toHaveText("Агентам");
  expect(await section.evaluate(el=>{
   const r=el.getBoundingClientRect();
   return r.left>=-1&&r.right<=innerWidth+1&&document.documentElement.scrollWidth<=innerWidth+1&&el.scrollWidth<=el.clientWidth+1;
  })).toBe(true);
  await expect(section.getByRole("button",{name:"Скопировать промпт"})).toBeEnabled();
  await page.screenshot({path:info.outputPath("agents.png"),animations:"disabled"});
 });
}

test("agent menu navigation, clipboard and document links",async({page,context})=>{
 await context.grantPermissions(["clipboard-read","clipboard-write"]);
 await page.goto("/");
 const menu=page.getByRole("navigation",{name:"Навигация"});
 await menu.getByRole("link",{name:"Агентам",exact:true}).click();
 await expect(page).toHaveURL(/#agents$/);
 const section=page.getByRole("region",{name:"Агентам",exact:true});
 const prompt=await section.locator("pre").innerText();
 const copy=section.getByRole("button",{name:"Скопировать промпт"});
 await copy.focus();await copy.press("Enter");
 await expect(copy).toHaveAttribute("data-action-state","success");
 expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe(prompt);
 for(const href of await section.getByRole("link").evaluateAll(links=>links.map(link=>(link as HTMLAnchorElement).href))){
  const response=await page.request.get(href);
  expect(response.ok(),href).toBe(true);
  expect(await response.text(),href).not.toContain('<div id="root">');
 }
 await page.goBack();await expect(page).toHaveURL(/\/$/);
 await page.goForward();await expect(page).toHaveURL(/#agents$/);
});

test("clipboard rejection gives truthful fallback",async({page})=>{
 await page.addInitScript(()=>Object.defineProperty(navigator,"clipboard",{configurable:true,value:{writeText:()=>Promise.reject(new Error("denied"))}}));
 await page.goto("/#agents");
 const copy=page.getByRole("button",{name:"Скопировать промпт"});
 await copy.click();
 await expect(copy).toHaveAttribute("data-action-state","error");
 await expect(page.getByText("Выдели текст и скопируй вручную.")).toBeVisible();
});
