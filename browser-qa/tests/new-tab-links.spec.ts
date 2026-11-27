import {expect,test} from "@playwright/test";
for(const [route,label] of [["/","Правила навигации"],["/agents/","Quickstart"]] as const){
 test("diagonal link opens a real tab and preserves the original "+route,async({page})=>{
  await page.goto(route);
  const original=page.url();
  const links=page.locator("a[href]").filter({has:page.locator(".lucide-arrow-up-right")});
  const marked=await links.evaluateAll(nodes=>nodes.map(a=>({target:a.getAttribute("target"),rel:a.getAttribute("rel"),href:a.getAttribute("href")})));
  expect(marked.length).toBeGreaterThan(0);
  for(const a of marked){expect(a.target,a.href||"").toBe("_blank");expect(a.rel?.split(/\s+/)).toEqual(expect.arrayContaining(["noopener","noreferrer"]));}
  const link=page.getByRole("link",{name:label,exact:true}).first();
  const destination=await link.evaluate(a=>(a as HTMLAnchorElement).href);
  const [tab]=await Promise.all([page.waitForEvent("popup"),link.click()]);
  try{await expect(tab).toHaveURL(destination);expect(page.url()).toBe(original);}
  finally{await tab.close();}
 });
}

for(const theme of ["light","dark"] as const){
 test("reference links and utilities show hover without moving arrow or neighbor "+theme,async({page})=>{
  await page.addInitScript(mode=>localStorage.setItem("vanya_theme",mode),theme);
  await page.goto("/#composition-principle");
  const links=page.locator("#composition-principle .guide-links a"),first=links.first(),second=links.last();
  await expect(links).toHaveCount(2);
  await first.scrollIntoViewIfNeeded();await page.mouse.move(0,0);
  const color=await first.evaluate(e=>getComputedStyle(e).color);
  const a=await first.boundingBox(),b=await second.boundingBox(),arrow=await first.locator(".ui-new-tab-marker").boundingBox();
  expect(a).not.toBeNull();expect(b).not.toBeNull();expect(arrow).not.toBeNull();
  if(Math.abs(a!.y-b!.y)<5)expect(b!.x-arrow!.x-arrow!.width).toBeGreaterThan(8);
  const gap=await first.locator(".ui-new-tab-marker").evaluate(e=>parseFloat(getComputedStyle(e).marginInlineStart));
  expect(gap).toBeGreaterThan(0);expect(gap).toBeLessThanOrEqual(6);
  await first.hover();await expect.poll(()=>first.evaluate(e=>getComputedStyle(e).color)).not.toBe(color);
  expect(await first.boundingBox()).toEqual(a);expect(await second.boundingBox()).toEqual(b);
  const utility=page.locator(".showcase-author-link");
  await page.mouse.move(0,0);const rest=await utility.evaluate(e=>getComputedStyle(e).color);
  await utility.hover();await expect.poll(()=>utility.evaluate(e=>getComputedStyle(e).color)).not.toBe(rest);
  await page.keyboard.press("Tab");await page.keyboard.press("Shift+Tab");
  await expect(utility).toBeFocused();await expect(utility).toHaveCSS("outline-width","2px");
 });
}
test("form field border is quiet at rest and status follows the common leading axis",async({page})=>{
 await page.goto("/#quiet-editor");
 const section=page.locator("#quiet-editor"),input=section.getByLabel("Название"),select=section.getByRole("combobox",{name:"Жанр"});
 const status=section.locator("output"),actions=section.locator(".demo-quiet-actions");
 const box=await input.boundingBox(),a=await actions.boundingBox(),s=await status.boundingBox();
 expect(Math.abs(box!.x-a!.x)).toBeLessThan(2);expect(Math.abs(a!.x-s!.x)).toBeLessThan(2);
 await page.mouse.move(0,0);
 const border=await input.evaluate(e=>getComputedStyle(e).borderBottomColor);
 expect(await select.evaluate(e=>getComputedStyle(e).borderBottomColor)).toBe(border);
 await input.hover();await expect.poll(()=>input.evaluate(e=>getComputedStyle(e).borderBottomColor)).not.toBe(border);
 await input.fill("");await section.getByRole("button",{name:"Сохранить"}).click();
 await expect(input).toHaveAttribute("aria-invalid","true");await expect(input).toBeFocused();
 expect((await input.boundingBox())!.height).toBe(box!.height);
});

test("confirmation result stays grouped below its action and follows real state",async({page})=>{
 await page.goto("/#quiet-confirmation");
 const section=page.locator("#quiet-confirmation"),actions=section.locator(".demo-quiet-actions"),status=section.locator("output");
 await expect(status).toHaveText("Ожидает подтверждения");
 const a=await actions.boundingBox(),s=await status.boundingBox();
 expect(Math.abs(a!.x-s!.x)).toBeLessThan(2);
 expect(s!.y).toBeGreaterThanOrEqual(a!.y+a!.height);
 await section.getByRole("button",{name:"Подтвердить",exact:true}).click();
 await expect(status).toHaveText("Пример подтверждён");
 await section.getByRole("button",{name:"Отменить подтверждение"}).click();
 await expect(status).toHaveText("Ожидает подтверждения");
});
