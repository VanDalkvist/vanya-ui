import {expect,test} from "@playwright/test";
import {readFileSync} from "node:fs";
const version=JSON.parse(readFileSync(new URL("../../package.json",import.meta.url),"utf8")).version;

test("quiet catalogue facets change actual rows",async({page})=>{
 await page.goto("/#compact-filter-toolbar");
 const section=page.locator("#compact-filter-toolbar"),rows=section.getByRole("list",{name:"Результаты поиска"}).getByRole("listitem");
 await section.getByRole("button",{name:"Мои",exact:true}).click();
 await expect(rows).toHaveText(["Тихий берег","Следы в лесу"]);
 await section.getByRole("button",{name:"Жанр Все"}).click();
 await page.getByRole("option",{name:"Фантастика"}).click();
 await expect(rows).toHaveText(["Следы в лесу"]);
 await section.getByRole("button",{name:"Жанр Фантастика"}).click();
 await page.getByRole("searchbox",{name:"Поиск по вариантам: Жанр"}).press("Escape");
 await expect(section.getByRole("button",{name:"Жанр Фантастика"})).toBeFocused();
});
test("quiet document validation, save and cancel have visible outcomes",async({page})=>{
 await page.goto("/#quiet-editor");
 const section=page.locator("#quiet-editor"),title=section.getByLabel("Название");
 await title.fill(" ");
 await section.getByRole("button",{name:"Сохранить"}).click();
 await expect(title).toHaveAttribute("aria-invalid","true");
 await expect(section.getByText("Введите название",{exact:true})).toBeVisible();
 await title.fill("Новый документ");
 await section.getByRole("combobox",{name:"Жанр"}).selectOption("fantasy");
 await section.getByRole("button",{name:"Сохранить"}).click();
 await expect(section.locator("output")).toHaveText("Сохранено: Новый документ · Фантастика");
 await title.fill("Несохранённое");
 await section.getByRole("button",{name:"Отменить",exact:true}).click();
 await expect(title).toHaveValue("Новый документ");
});
test("inspector applies property edits immediately and confirmation is reversible",async({page})=>{
 await page.goto("/#quiet-inspector");
 const inspector=page.locator("#quiet-inspector");
 await inspector.getByRole("button",{name:"Статус В работе"}).click();
 await page.getByRole("option",{name:"Завершено",exact:true}).click();
 await expect(inspector.locator("output")).toHaveText("Документ: Завершено · Обычный");
 await inspector.getByRole("button",{name:"Приоритет Обычный"}).click();
 await page.getByRole("option",{name:"Высокий",exact:true}).click();
 await expect(inspector.locator("output")).toHaveText("Документ: Завершено · Высокий");
 const confirmation=page.locator("#quiet-confirmation");
 await confirmation.getByRole("button",{name:"Подтвердить",exact:true}).click();
 await expect(confirmation.locator("output")).toHaveText("Пример подтверждён");
 await confirmation.getByRole("button",{name:"Отменить подтверждение"}).click();
 await expect(confirmation.locator("output")).toHaveText("Ожидает подтверждения");
});
test("ordinary action and persistent toggle report actual state",async({page})=>{
 await page.clock.install();
 await page.goto("/#quiet-actions");
 const section=page.locator("#quiet-actions"),toggle=section.getByRole("button",{name:"Автообновление"});
 await section.getByRole("button",{name:"Обновить",exact:true}).click();
 await expect(section.getByRole("status")).toHaveText("Обновлений: 1");
 await expect(toggle).toHaveAttribute("aria-pressed","false");
 await toggle.click();
 await expect(toggle).toHaveAttribute("aria-pressed","true");
 await page.clock.runFor(5000);
 await expect(section.getByRole("status")).toHaveText("Обновлений: 2");
 await toggle.click();
 await page.clock.runFor(10000);
 await expect(section.getByRole("status")).toHaveText("Обновлений: 2");
 await expect(toggle).toHaveAttribute("aria-pressed","false");
 await expect(toggle).toContainText("Выкл");
});
for(const width of [1440,1024,390,320]) for(const theme of ["light","dark"] as const){
 test("both headers expose exact version without overlap "+width+" "+theme,async({page})=>{
  await page.setViewportSize({width,height:900});
  await page.addInitScript(mode=>localStorage.setItem("vanya_theme",mode),theme);
  for(const [route,selector] of [["/",".showcase-header"],["/agents/",".agent-page-header"]] as const){
   await page.goto(route);
   await expect(page.locator("html")).toHaveAttribute("data-theme",theme);
   const header=page.locator(selector),label=header.locator("[data-ui-version]");
   await expect(label).toHaveText("v"+version);
   await expect(label).toBeVisible();
   const b=await label.boundingBox();expect(b).not.toBeNull();expect(b!.x).toBeGreaterThanOrEqual(0);expect(b!.x+b!.width).toBeLessThanOrEqual(width);
   expect(await label.evaluate(el=>el.tabIndex)).toBe(-1);
   const geometry=await label.evaluate(el=>{
    const r=el.getBoundingClientRect(),parent=el.parentElement!,header=parent.parentElement!;
    const others=[...parent.children,...header.children].filter(n=>n!==el&&n!==parent);
    const overlaps=others.filter(n=>{const b=n.getBoundingClientRect();return Math.min(r.right,b.right)-Math.max(r.left,b.left)>1&&Math.min(r.bottom,b.bottom)-Math.max(r.top,b.top)>1;});
    return {last:parent.lastElementChild===el,overlaps:overlaps.length};
   });
   expect(geometry).toEqual({last:true,overlaps:0});
   await expect(label).toHaveAttribute("data-ui-version",version);
  }
 });
}
test("version is rendered before hydration",async({browser,baseURL})=>{
 const ctx=await browser.newContext({javaScriptEnabled:false,baseURL});
 try{const page=await ctx.newPage();for(const route of ["/","/agents/"]){
  await page.goto(route);await expect(page.locator("header [data-ui-version]")).toHaveText("v"+version);
 }}finally{await ctx.close();}
});
test("command geometry and hover stay stable while execution is pending",async({page})=>{
 await page.goto("/#action-feedback");
 const section=page.locator("#action-feedback"),button=section.getByRole("button",{name:/Отправить тестовое действие/});
 const neighbor=section.getByRole("button",{name:"Подтвердить успех"});
 await button.scrollIntoViewIfNeeded();
 await page.mouse.move(0,0);
 const before=await button.boundingBox(),next=await neighbor.boundingBox();
 const rest=await button.evaluate(el=>getComputedStyle(el).backgroundColor);
 await button.click();
 await expect(button).toHaveAttribute("aria-disabled","true");
 await button.hover();
 await expect.poll(()=>button.evaluate(el=>getComputedStyle(el).backgroundColor)).toBe(rest);
 expect((await button.boundingBox())!.width).toBeCloseTo(before!.width,0);
 expect((await neighbor.boundingBox())!.x).toBeCloseTo(next!.x,0);
 await neighbor.click();
 await expect(button).toHaveAttribute("data-action-state","success");
 expect((await button.boundingBox())!.width).toBeCloseTo(before!.width,0);
});
test("selected toggle retains ink through hover and press; pressed fill wins",async({page})=>{
 await page.goto("/#quiet-actions");
 const toggle=page.locator("#quiet-actions").getByRole("button",{name:"Автообновление"});
 await toggle.click();
 await expect(toggle).toHaveAttribute("aria-pressed","true");
 await page.mouse.move(0,0);
 const color=await toggle.evaluate(el=>getComputedStyle(el).color);
 await toggle.hover();
 await expect.poll(()=>toggle.evaluate(el=>getComputedStyle(el).color)).toBe(color);
 const hover=await toggle.evaluate(el=>getComputedStyle(el).backgroundColor);
 await page.mouse.down();
 try{
  await expect.poll(()=>toggle.evaluate(el=>getComputedStyle(el).backgroundColor)).not.toBe(hover);
  await expect.poll(()=>toggle.evaluate(el=>getComputedStyle(el).color)).toBe(color);
 }finally{await page.mouse.up();}
});
test("selected theme remains distinguishable in forced colors",async({page})=>{
 await page.emulateMedia({forcedColors:"active"});
 await page.goto("/#theme");
 const group=page.locator("#theme").getByRole("group",{name:"Переключение темы оформления"});
 const selected=group.locator('[aria-pressed="true"]'),unselected=group.locator('[aria-pressed="false"]').first();
 const color=await selected.evaluate(el=>getComputedStyle(el).borderBottomColor);
 expect(color).not.toBe(await unselected.evaluate(el=>getComputedStyle(el).borderBottomColor));
});
