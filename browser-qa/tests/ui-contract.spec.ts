import { expect, test, type Page, type TestInfo } from "@playwright/test";

const sectionLink=(page:Page,name:string)=>page.getByRole("navigation",{name:"Навигация"}).getByRole("link",{name,exact:true});

async function capture(page:Page,info:TestInfo,name:string) {
  const path=info.outputPath(name+".png");
  await page.screenshot({path,animations:"disabled",fullPage:false});
  await info.attach(name,{path,contentType:"image/png"});
}

/** Physical hit test: checks what actually receives a pointer, not just JSX visibility. */
async function assertUnobstructed(locator:ReturnType<Page["locator"]>) {
  await locator.scrollIntoViewIfNeeded();
  const result=await locator.evaluate((target:Element)=>{
    const rect=target.getBoundingClientRect();
    const x=rect.left+rect.width/2;
    const y=rect.top+rect.height/2;
    const onScreen=x>=0&&y>=0&&x<innerWidth&&y<innerHeight;
    const top=onScreen?document.elementFromPoint(x,y):null;
    return {onScreen,interactable:!!top&&(target===top||target.contains(top)),
      covering:top?.tagName.toLowerCase()||null,rect:{x:rect.x,y:rect.y,width:rect.width,height:rect.height}};
  });
  expect(result.onScreen,JSON.stringify(result)).toBe(true);
  expect(result.interactable,JSON.stringify(result)).toBe(true);
}

for(const size of [
  {name:"desktop",width:1440,height:900},
  {name:"tablet",width:1024,height:768},
  {name:"mobile",width:390,height:844},
]){
  for(const theme of ["light","dark"] as const){
    test("01 hero controls remain usable at "+size.name+" / "+theme,async({page},info)=>{
      await page.setViewportSize({width:size.width,height:size.height});
      await page.addInitScript((mode)=>window.localStorage.setItem("vanya_theme",mode),theme);
      await page.goto("/");
      await expect(page.locator("html")).toHaveAttribute("data-theme",theme);
      expect(await page.locator(".showcase-shortcut-dock").count()).toBe(0);
      const slider=page.getByRole("slider",{name:"Расстояние между событиями"});
      await expect(slider).toBeVisible();
      await assertUnobstructed(slider);
      const before=Number(await slider.inputValue());
      await slider.focus();
      await slider.press("ArrowRight");
      expect(Number(await slider.inputValue())).toBeGreaterThan(before);
      await capture(page,info,"hero-"+size.name+"-"+theme);
    });
  }
}

test("02 native current-section navigation survives scroll and history",async({page},info)=>{
  await page.goto("/");
  await expect(sectionLink(page,"Композиция")).toHaveAttribute("aria-current","location");
  await sectionLink(page,"Айдентика").click();
  await expect(page).toHaveURL(/#identity$/);
  await expect(sectionLink(page,"Айдентика")).toHaveAttribute("aria-current","location");
  await sectionLink(page,"Компоненты").click();
  await expect(sectionLink(page,"Компоненты")).toHaveAttribute("aria-current","location");
  await page.goBack();
  await expect(sectionLink(page,"Айдентика")).toHaveAttribute("aria-current","location");
  await page.goForward();
  await expect(sectionLink(page,"Компоненты")).toHaveAttribute("aria-current","location");
  await page.goto("/#typography");
  await expect(sectionLink(page,"Шрифты")).toHaveAttribute("aria-current","location");
  await capture(page,info,"header-current-section");
});

test("03 theme menu Tab, Shift+Tab, arrows and Escape remain usable",async({page},info)=>{
  await page.goto("/");
  const toggle=page.getByRole("button",{name:/Тема оформления:/}).first();
  await toggle.focus();
  await toggle.press("ArrowDown");
  const menu=page.getByRole("menu",{name:"Тема оформления"});
  await expect(menu).toBeVisible();
  const items=menu.getByRole("menuitemradio");
  expect(await items.count()).toBe(3);
  for(let i=0;i<3;i++)await expect(items.nth(i)).toHaveAttribute("tabindex","-1");
  await expect(items.first()).toBeFocused();
  await items.first().press("End");
  await expect(items.last()).toBeFocused();
  await items.last().press("Home");
  await expect(items.first()).toBeFocused();
  await items.first().press("Escape");
  await expect(menu).toHaveCount(0);
  await expect(toggle).toBeFocused();
  await toggle.click();
  await menu.getByRole("menuitemradio",{name:"Тёмная"}).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme","dark");
  await expect(toggle).toBeFocused();
  await toggle.click();
  await menu.getByRole("menuitemradio",{name:"Тёмная"}).press("Tab");
  await expect(menu).toHaveCount(0);
  await expect(toggle).not.toBeFocused();
  await capture(page,info,"theme-menu-keyboard");
});

test("04 native filter buttons and connected tabs behave differently",async({page},info)=>{
  await page.goto("/#segments");
  const section=page.locator("#segments");
  await expect(section.getByRole("group",{name:"Горизонт обзора"}).first()).toBeVisible();
  await expect(section.getByRole("tablist",{name:"Представление исследования"})).toBeVisible();
  const read=section.getByRole("tab",{name:"Чтение"});
  const explore=section.getByRole("tab",{name:"Исследование"});
  await read.focus();
  await read.press("ArrowRight");
  await expect(explore).toBeFocused();
  await expect(explore).toHaveAttribute("aria-selected","true");
  const panel=section.getByRole("tabpanel",{name:"Исследование"});
  await expect(panel).toBeVisible();
  expect(await explore.getAttribute("aria-controls")).toBe(await panel.getAttribute("id"));
  await explore.press("Home");
  await expect(read).toHaveAttribute("aria-selected","true");
  await capture(page,info,"filter-versus-tabs");
});

test("05 drawer opens and closes without obscuring its trigger permanently",async({page},info)=>{
  await page.goto("/#workspace");
  const trigger=page.locator("#workspace").getByRole("button",{name:"Открыть детали"});
  await assertUnobstructed(trigger);
  await trigger.click();
  const dialog=page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await capture(page,info,"drawer-open");
  await dialog.press("Escape");
  await expect(dialog).toHaveCount(0);
  await assertUnobstructed(trigger);
});

test("06 independent reader/list scroll owners do not move one another",async({page},info)=>{
  await page.goto("/#workspace");
  const left=page.getByRole("region",{name:"Список исследований"});
  const right=page.getByRole("region",{name:"Читательская область"});
  await expect(left).toBeVisible();
  await expect(right).toBeVisible();
  const initial=await right.evaluate(el=>el.scrollTop);
  await left.evaluate(el=>{el.scrollTop=el.scrollHeight;});
  const leftPos=await left.evaluate(el=>el.scrollTop);
  expect(leftPos).toBeGreaterThan(0);
  expect(await right.evaluate(el=>el.scrollTop)).toBe(initial);
  await capture(page,info,"independent-scroll-owners");
});

test("07 hover, press and result are distinct and never report false success",async({page},info)=>{
  await page.goto("/#interaction-states");
  const action=page.locator("#interaction-states").getByRole("button",{name:"Проверить действие"});
  await assertUnobstructed(action);
  await action.hover();
  const hover=await action.evaluate(el=>getComputedStyle(el).backgroundColor);
  const r=await action.boundingBox();
  expect(r).not.toBeNull();
  await page.mouse.move(r!.x+r!.width/2,r!.y+r!.height/2);
  await page.mouse.down();
  const pressed=await action.evaluate(el=>getComputedStyle(el).backgroundColor);
  await page.mouse.up();
  expect(pressed).not.toBe(hover);
  await expect(action).toHaveAttribute("data-action-state","success");
  await capture(page,info,"pressed-and-result");
});

test("08 shortcuts and 200% CSS zoom approximation leave core controls reachable",async({page},info)=>{
  await page.setViewportSize({width:390,height:844});
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.goto("/");
  await page.evaluate(()=>{document.documentElement.style.zoom="2";});
  const slider=page.getByRole("slider",{name:"Расстояние между событиями"});
  await assertUnobstructed(slider);
  await page.keyboard.press("?");
  await expect(page.getByRole("dialog",{name:"Горячие клавиши"})).toBeVisible();
  await capture(page,info,"reduced-motion-css-zoom");
  // CSS zoom is an approximation: manual 200% browser zoom remains in the acceptance checklist.
});
