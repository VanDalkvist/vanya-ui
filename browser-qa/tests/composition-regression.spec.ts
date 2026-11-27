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
