import {expect,test} from "@playwright/test";

const routes=["/","/agents/"] as const;
const themes=["light","dark"] as const;
const ink=(a:Element)=>{
 const s=getComputedStyle(a);
 return [s.color,s.textDecorationLine,s.textDecorationColor,s.backgroundColor].join("|");
};
for(const route of routes)for(const theme of themes){
 test("every visible textual link retains its affordance "+route+" "+theme,async({page})=>{
  test.setTimeout(180_000);
  await page.setViewportSize({width:1440,height:900});
  await page.addInitScript(value=>localStorage.setItem("vanya_theme",value),theme);
  await page.goto(route);
  await expect(page.locator("html")).toHaveAttribute("data-theme",theme);
  await page.evaluate(()=>document.fonts.ready);
  const links=page.locator("a.ui-action-link:visible");
  const count=await links.count();
  expect(count).toBeGreaterThan(0);
  for(let i=0;i<count;i++){
   const link=links.nth(i);
   const href=await link.getAttribute("href");
   expect(href).toBeTruthy();
   const target=await link.getAttribute("target");
   await expect(link.locator(".ui-new-tab-marker"),href||"").toHaveCount(target==="_blank"?1:0);
   if(target==="_blank")expect((await link.getAttribute("rel"))?.split(/\s+/)).toEqual(expect.arrayContaining(["noopener","noreferrer"]));
   await link.scrollIntoViewIfNeeded();
   await page.mouse.move(0,0);
   await expect.poll(()=>link.evaluate(e=>e.matches(":hover"))).toBe(false);
   const before=await link.evaluate(ink),geometry=await link.boundingBox();
   await link.hover();
   await expect.poll(()=>link.evaluate(ink),{message:"Visible hover: "+href}).not.toBe(before);
   const after=await link.boundingBox();
   expect(after).not.toBeNull();expect(geometry).not.toBeNull();
   // Hover may scroll an obscured link into view; size must remain stable.
   expect(after!.width).toBeCloseTo(geometry!.width,0);
   expect(after!.height).toBeCloseTo(geometry!.height,0);
  }
 });
}
test("filter results and their explanatory note remain in the same vertical group",async({page})=>{
 await page.goto("/#compact-filter-toolbar");
 const section=page.locator("#compact-filter-toolbar");
 const results=section.getByRole("list",{name:"Результаты поиска"});
 const note=section.getByText("Данные примера вымышлены. Поиск и фильтры изменяют видимую коллекцию.",{exact:true});
 const bar=section.locator(".demo-compact-filter-strip");
 for(const width of [1440,1024,390,320]){
  await page.setViewportSize({width,height:900});
  await expect(results.getByRole("listitem")).toHaveCount(3);
  const a=await bar.boundingBox(),b=await results.boundingBox(),c=await note.boundingBox();
  expect(a&&b&&c).toBeTruthy();
  expect(Math.abs(a!.x-b!.x)).toBeLessThan(3);
  expect(Math.abs(b!.x-c!.x)).toBeLessThan(3);
  expect(c!.y).toBeGreaterThanOrEqual(b!.y+b!.height-1);
 }
 await section.getByRole("button",{name:"Мои",exact:true}).click();
 await expect(results.getByRole("listitem")).toHaveText(["Тихий берег","Следы в лесу"]);
});
test("guide and component examples align on the shared content axis",async({page})=>{
 for(const width of [1440,1024,390,320]){
  await page.setViewportSize({width,height:900});
  await page.goto("/#browser-navigation");
  const guide=page.locator("#browser-navigation"),catalog=page.locator("#compact-filter-toolbar");
  const boxes=await Promise.all([guide,catalog].map(async row=>({
   title:await row.locator("header").boundingBox(),
   body:await row.locator(":scope > .catalog-examples").boundingBox(),
  })));
  for(const b of boxes)expect(b.title&&b.body).toBeTruthy();
  expect(Math.abs(boxes[0].title!.x-boxes[1].title!.x)).toBeLessThan(2);
  expect(Math.abs(boxes[0].body!.x-boxes[1].body!.x)).toBeLessThan(2);
  if(width<=390)for(const b of boxes)expect(b.body!.y).toBeGreaterThanOrEqual(b.title!.y+b.title!.height);
  await expect(guide.getByRole("link",{name:"Правила навигации"})).toBeVisible();
 }
});

test("all chapters share a content axis and preserve named wide specimens",async({page})=>{
 for(const width of [1440,1024,390,320]){
  await page.setViewportSize({width,height:900});
  await page.goto("/");
  await page.evaluate(()=>document.fonts.ready);
  const chapters=["identity","typography","writing","principles","catalog","workspace","setup","agents"];
  const rows=page.locator(chapters.map(id=>"#"+id+" > .catalog-section").join(","));
  expect(await rows.count()).toBeGreaterThan(8);
  const geometry=await rows.evaluateAll(nodes=>nodes.map(row=>{
   const a=row.getBoundingClientRect(),h=row.querySelector(":scope > header")!.getBoundingClientRect(),b=row.querySelector(":scope > .catalog-examples")!.getBoundingClientRect();
   return {id:row.id,layout:row.getAttribute("data-layout"),left:a.left,right:a.right,headingX:h.left,headingBottom:h.bottom,bodyX:b.left,bodyRight:b.right,bodyY:b.top,overflow:row.scrollWidth>row.clientWidth+1};
  }));
  const reference=geometry.find(r=>r.id==="compact-filter-toolbar")!;
  for(const r of geometry){
   expect(Math.abs(r.headingX-reference.headingX),r.id).toBeLessThan(2);
   expect(r.bodyRight,r.id).toBeLessThanOrEqual(r.right+1);
   if(r.layout==="wide"||width<=390){
    expect(Math.abs(r.bodyX-r.left),r.id).toBeLessThan(2);
    expect(r.bodyY,r.id).toBeGreaterThanOrEqual(r.headingBottom-1);
   }else expect(Math.abs(r.bodyX-reference.bodyX),r.id).toBeLessThan(2);
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 }
});
test("native disclosure opens and closes by keyboard and preserves actual content",async({page})=>{
 await page.goto("/#disclosure");
 const details=page.locator("#disclosure details"),summary=details.locator("summary");
 const content=details.getByText("Здесь можно разместить пояснение, которое не нужно показывать сразу.");
 await expect(content).toBeHidden();await summary.focus();await page.keyboard.press("Enter");
 await expect(content).toBeVisible();await expect(summary).toBeFocused();
 // A real update to catalogue-owned React state must not reset the open disclosure.
 const card=page.locator("#event");
 await card.getByRole("button",{name:"Закрыть"}).click();
 await expect(card.getByRole("button",{name:"Показать EventCard снова"})).toBeVisible();
 await expect(content).toBeVisible();
 await card.getByRole("button",{name:"Показать EventCard снова"}).click();
 await expect(card.getByRole("button",{name:"Закрыть"})).toBeVisible();
 await expect(content).toBeVisible();
 await summary.focus();
 await page.keyboard.press("Space");await expect(content).toBeHidden();
});

for(const theme of themes)for(const width of [1440,390]){
 test("modal lifecycle preserves real focus and dismissal "+theme+" "+width,async({page})=>{
  await page.setViewportSize({width,height:900});
  await page.addInitScript(value=>localStorage.setItem("vanya_theme",value),theme);
  await page.goto("/");
  for(const specimen of [
   {id:"inspector",opener:"Открыть InspectDrawer",title:"Описание проекта",close:"Закрыть инспектор",content:"Здесь можно разместить описание, ссылки и другие подробности проекта."},
   {id:"digest",opener:"Открыть ReceiptDigestModal",title:"Пример итогов",close:"Закрыть окно",content:"Обновили примеры компонентов"},
  ]){
   const opener=page.locator("#"+specimen.id).getByRole("button",{name:specimen.opener});
   const priorOverflow=await page.evaluate(()=>document.body.style.overflow);
   for(const dismissal of ["escape","button","backdrop"]){
    if(dismissal==="backdrop"&&specimen.id==="inspector"&&width===390)continue;
    await opener.focus();
    await opener.press("Enter");
    const dialog=page.getByRole("dialog",{name:specimen.title});
    const close=dialog.getByRole("button",{name:specimen.close});
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(specimen.content,{exact:true})).toBeVisible();
    await expect(close).toBeFocused();
    await opener.evaluate(el=>el.focus());
    await expect(close).toBeFocused(); // native modal makes background inert
    await page.keyboard.press("Tab");
    expect(await dialog.evaluate(el=>el.contains(document.activeElement)||document.activeElement===document.body)).toBe(true);
    if(dismissal==="escape")await page.keyboard.press("Escape");
    else if(dismissal==="button")await close.click();
    else {
     const rect=await dialog.boundingBox();
     expect(rect).not.toBeNull();
     expect(rect!.x).toBeGreaterThan(4);
     await page.mouse.click(2,Math.min(20,rect!.y+10));
    }
    await expect(dialog).toHaveCount(0);
    await expect(opener).toBeFocused();
    expect(await page.evaluate(()=>document.body.style.overflow)).toBe(priorOverflow);
   }
  }
 });
}

for(const theme of themes)for(const width of [1440,1024,390,320]){
 test("workspace preserves readable layout and actual scroll ownership "+theme+" "+width,async({page})=>{
  await page.setViewportSize({width,height:900});
  await page.addInitScript(value=>localStorage.setItem("vanya_theme",value),theme);
  await page.goto("/#workspace-overview");
  await expect(page.locator("html")).toHaveAttribute("data-theme",theme);
  await page.evaluate(()=>document.fonts.ready);
  const specimen=page.locator("#workspace-overview");
  const list=specimen.getByRole("region",{name:"Список исследований"});
  const reader=specimen.getByRole("region",{name:"Читательская область"});
  const simple=page.locator("#workspace-split .ui-workspace-split");
  const bounds=async()=>({left:(await list.boundingBox())!,right:(await reader.boundingBox())!});
  await expect(list).toBeVisible();await expect(reader).toBeVisible();
  const {left,right}=await bounds();
  const a=(await simple.locator(".ui-workspace-split-navigation").boundingBox())!;
  const b=(await simple.locator(".ui-workspace-split-content").boundingBox())!;
  if(width>=1024){
   expect(right.x).toBeGreaterThanOrEqual(left.x+left.width-1);
   expect(Math.abs(right.y-left.y)).toBeLessThan(2);
   expect(right.width).toBeGreaterThan(240);
   expect(b.x).toBeGreaterThanOrEqual(a.x+a.width-1);
   await list.evaluate(el=>{el.scrollTop=el.scrollHeight;});
   const position=await list.evaluate(el=>el.scrollTop);
   expect(position).toBeGreaterThan(0);
   expect(await reader.evaluate(el=>el.scrollTop)).toBe(0);
   await reader.evaluate(el=>{el.scrollTop=el.scrollHeight;});
   expect(await reader.evaluate(el=>el.scrollTop)).toBeGreaterThan(0);
   expect(await list.evaluate(el=>el.scrollTop)).toBe(position);
  }else{
   expect(Math.abs(right.x-left.x)).toBeLessThan(2);
   expect(Math.abs(right.width-left.width)).toBeLessThan(2);
   expect(right.y).toBeGreaterThanOrEqual(left.y+left.height-1);
   expect(b.y).toBeGreaterThanOrEqual(a.y+a.height-1);
   for(const region of [list,reader]){
    const geometry=await region.evaluate(el=>({height:el.clientHeight,scroll:el.scrollHeight,overflow:getComputedStyle(el).overflowY}));
    expect(geometry.scroll).toBeLessThanOrEqual(geometry.height+1);
    expect(geometry.overflow).toBe("visible");
   }
   const lastItem=list.getByText("Материал 14 · состояние, графы и пайплайны",{exact:true});
   const lastFragment=reader.getByText(/Фрагмент 13\./);
   const before=await page.evaluate(()=>scrollY);
   await lastItem.scrollIntoViewIfNeeded();
   await expect(lastItem).toBeInViewport();
   await lastFragment.scrollIntoViewIfNeeded();
   await expect(lastFragment).toBeInViewport();
   expect(await page.evaluate(()=>scrollY)).toBeGreaterThan(before);
   expect(await list.evaluate(el=>el.scrollTop)).toBe(0);
   expect(await reader.evaluate(el=>el.scrollTop)).toBe(0);
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  const action=specimen.getByRole("button",{name:"Следующий этап"});
  await action.click();
  const dialog=page.getByRole("dialog",{name:"Описание проекта"});
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText("Здесь можно разместить описание, ссылки и другие подробности проекта.",{exact:true})).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(action).toBeFocused();
 });
}
