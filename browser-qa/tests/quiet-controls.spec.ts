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
 await expect(section.getByRole("button",{name:"Сохранить"})).toBeDisabled();
 await expect(section.getByRole("button",{name:"Отменить",exact:true})).toBeDisabled();
 await expect(section.locator("output")).toHaveText("Нет изменений");
 await title.fill(" ");
 await expect(section.locator("output")).toHaveText("Есть несохранённые изменения");
 await section.getByRole("button",{name:"Сохранить"}).click();
 await expect(title).toHaveAttribute("aria-invalid","true");
 await expect(title).toBeFocused();
 await expect(section.getByText("Введите название",{exact:true})).toBeVisible();
 await title.fill("Новый документ");
 await section.getByRole("combobox",{name:"Жанр"}).selectOption("fantasy");
 await section.getByRole("button",{name:"Сохранить"}).click();
 await expect(section.locator("output")).toHaveText("Сохранено: Новый документ · Фантастика");
 await expect(section.getByRole("button",{name:"Сохранить"})).toBeDisabled();
 await title.fill("Несохранённое");
 await section.getByRole("button",{name:"Отменить",exact:true}).click();
 await expect(title).toHaveValue("Новый документ");
 await expect(section.getByRole("button",{name:"Отменить",exact:true})).toBeDisabled();
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
 await expect(toggle.locator('[data-current="true"]')).toHaveText("Выкл");
 await expect(toggle.locator('[data-current="true"]')).toBeVisible();
 await expect(toggle.locator('[data-current="false"]')).toBeHidden();
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

test("document fields align and keep geometry from edit through validation and save",async({page})=>{
 await page.goto("/#quiet-editor");
 const section=page.locator("#quiet-editor"),title=section.getByLabel("Название"),genre=section.getByRole("combobox",{name:"Жанр"}),save=section.getByRole("button",{name:"Сохранить"});
 const before=await genre.boundingBox(),saveBefore=await save.boundingBox();
 const style=()=>title.evaluate(el=>{const s=getComputedStyle(el);return {height:el.getBoundingClientRect().height,padding:s.paddingLeft,bottom:s.borderBottomWidth};});
 expect(await style()).toEqual({height:40,padding:"0px",bottom:"1px"});
 expect(await genre.evaluate(el=>getComputedStyle(el).borderBottomWidth)).toBe("1px");
 await title.fill("");await save.click();
 await expect(title).toHaveAttribute("aria-invalid","true");
 expect(await style()).toEqual({height:40,padding:"0px",bottom:"1px"});
 expect((await genre.boundingBox())!.y).toBeCloseTo(before!.y,0);
 expect((await save.boundingBox())!.y).toBeCloseTo(saveBefore!.y,0);
 await title.fill("Новое название");await save.click();
 expect((await genre.boundingBox())!.y).toBeCloseTo(before!.y,0);
 expect((await save.boundingBox())!.y).toBeCloseTo(saveBefore!.y,0);
});
test("selected states have a visible surface without underlining and retain keyboard focus",async({page})=>{
 await page.goto("/#quiet-actions");
 const toggle=page.locator("#quiet-actions").getByRole("button",{name:"Автообновление"});
 await toggle.click();
 await page.mouse.move(0,0);
 await expect(toggle).toHaveCSS("text-decoration-line","none");
 await expect.poll(()=>toggle.evaluate(el=>getComputedStyle(el).backgroundColor)).not.toBe("rgba(0, 0, 0, 0)");
 const selectedWidth=(await toggle.boundingBox())!.width;
 await toggle.click();await expect(toggle).toHaveAttribute("aria-pressed","false");
 expect((await toggle.boundingBox())!.width).toBeCloseTo(selectedWidth,0);
 await toggle.focus();await page.keyboard.press("Tab");await page.keyboard.press("Shift+Tab");
 await expect(toggle).toBeFocused();await expect(toggle).toHaveCSS("outline-width","2px");
 const segment=page.locator("#compact-filter-toolbar").getByRole("button",{name:"Все",exact:true});
 await expect(segment).toHaveCSS("text-decoration-line","none");
});
test("passive tags have no button surface",async({page})=>{
 await page.goto("/#tag");
 const tag=page.locator("#tag span.ui-tag").first();
 await expect(tag).toBeVisible();await expect(tag).toHaveCSS("background-color","rgba(0, 0, 0, 0)");
 await expect(tag).toHaveCSS("cursor","default");await expect(tag).not.toHaveAttribute("tabindex");
});

test("persistent selection has a distinct surface from adjacent hover",async({page})=>{
 await page.goto("/#compact-filter-toolbar");
 const section=page.locator("#compact-filter-toolbar"),selected=section.getByRole("button",{name:"Все",exact:true}),neighbor=section.getByRole("button",{name:"Мои",exact:true});
 await neighbor.scrollIntoViewIfNeeded();await page.mouse.move(0,0);
 const bg=async(el:typeof selected)=>el.evaluate(e=>getComputedStyle(e).backgroundColor);
 const rest=await bg(selected);
 await neighbor.hover();
 await expect.poll(()=>bg(neighbor)).not.toBe("rgba(0, 0, 0, 0)");
 await expect.poll(()=>bg(neighbor)).not.toBe(rest);
 await expect(selected).toHaveAttribute("aria-pressed","true");
 await expect(selected).toHaveCSS("text-decoration-line","none");
 await neighbor.click();
 await expect(section.getByRole("listitem")).toHaveText(["Тихий берег","Следы в лесу"]);
});
test("applied filters and ordinary properties use different semantic ink",async({page})=>{
 await page.goto("/#compact-filter-toolbar");
 const filter=page.locator("#compact-filter-toolbar .ui-filter-select");
 await filter.getByRole("button",{name:"Жанр Все"}).click();
 await page.getByRole("option",{name:"Драма",exact:true}).click();
 const property=page.locator("#quiet-inspector .ui-filter-select").first();
 const style=async(el:typeof filter)=>el.locator(".ui-filter-select-value").evaluate(e=>{const s=getComputedStyle(e);return {color:s.color,font:s.fontSize,line:s.lineHeight};});
 const f=await style(filter),p=await style(property);
 expect(f.color).not.toBe(p.color);expect(f.font).toBe(p.font);expect(f.line).toBe(p.line);
 await expect(page.locator("#compact-filter-toolbar").getByRole("listitem")).toHaveText(["Тихий берег"]);
});

test("chapter headers share typography and independent rules have no decorative gutter",async({page})=>{
 for(const width of [1440,1024,390,320]){
  await page.setViewportSize({width,height:900});
  await page.goto("/#principles");
  const headers=page.locator(".catalog > .chapter-header");
  await expect(headers).toHaveCount(8);
  const metrics=await headers.evaluateAll(nodes=>nodes.map(node=>{
   const title=node.querySelector("h2")!,intro=node.querySelector(".catalog-intro")!;
   const t=title.getBoundingClientRect(),p=intro.getBoundingClientRect(),s=getComputedStyle(title);
   return {font:s.fontSize,weight:s.fontWeight,leading:s.lineHeight,alignment:p.left-t.left,gap:p.top-t.bottom};
  }));
  for(const metric of metrics)expect(metric).toEqual(metrics[0]);
  const row=page.locator("#browser-navigation"),body=row.locator(":scope > div");
  await expect(page.locator(".guide-number,.guide-eyebrow")).toHaveCount(0);
  const a=await row.boundingBox(),b=await body.boundingBox();
  expect(a).not.toBeNull();expect(b).not.toBeNull();
  expect(Math.abs(b!.x-a!.x)).toBeLessThan(2);
  expect(await row.evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
 }
});
test("pointer-open selection has a check without a resting fill; keyboard movement is visible",async({page})=>{
 await page.goto("/#compact-filter-toolbar");
 const section=page.locator("#compact-filter-toolbar");
 await section.getByRole("button",{name:"Жанр Все"}).click();
 await page.getByRole("option",{name:"Драма",exact:true}).click();
 await section.getByRole("button",{name:"Жанр Драма"}).click();
 await page.mouse.move(0,0);
 const selected=page.getByRole("option",{name:"Драма",exact:true});
 const next=page.getByRole("option",{name:"Комедия",exact:true});
 await expect(selected).toHaveAttribute("aria-selected","true");
 await expect(selected.locator("svg")).toBeVisible();
 await expect(selected).not.toHaveAttribute("data-active","true");
 await expect(selected).toHaveCSS("background-color","rgba(0, 0, 0, 0)");
 const search=page.getByRole("searchbox",{name:"Поиск по вариантам: Жанр"});
 await search.press("ArrowDown");
 await expect(next).toHaveAttribute("data-active","true");
 await expect(next).not.toHaveCSS("background-color","rgba(0, 0, 0, 0)");
 await expect(selected).toHaveAttribute("aria-selected","true");
 await search.press("Enter");
 await expect(section.getByRole("button",{name:"Жанр Комедия"})).toBeFocused();
 await expect(section.getByRole("listitem")).toHaveText(["Маяк на холме"]);
});

test("all nine destinations are visible and reachable without a horizontal scroll strip",async({page})=>{
 for(const width of [1440,1200,1024,768,390,320]){
  await page.setViewportSize({width,height:900});
  await page.goto("/");
  const links=page.locator(".showcase-nav a");
  await expect(links).toHaveCount(9);
  const geometry=await links.evaluateAll(nodes=>nodes.map(el=>{
   const r=el.getBoundingClientRect();return {left:r.left,right:r.right,width:r.width};
  }));
  for(const r of geometry){expect(r.width).toBeGreaterThan(0);expect(r.left).toBeGreaterThanOrEqual(0);expect(r.right).toBeLessThanOrEqual(width+1);}
  await links.last().click();await expect(page).toHaveURL(/#agents$/);
  await expect(links.last()).toHaveAttribute("aria-current","location");
 }
});
