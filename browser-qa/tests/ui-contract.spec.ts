import { expect, test, type Page, type TestInfo } from "@playwright/test";

const sectionLink=(page:Page,name:string)=>page.getByRole("navigation",{name:"Навигация"}).getByRole("link",{name,exact:true});

async function capture(page:Page,info:TestInfo,name:string) {
  const path=info.outputPath(name+".png");
  await page.screenshot({path,animations:"disabled",fullPage:false});
  await info.attach(name,{path,contentType:"image/png"});
}

/** Physical hit test: checks what actually receives a pointer, not just JSX visibility. */
/** Sample the actual pointer target at multiple points, including the right edge of the
 * hero slider where the old floating shortcut dock obscured it. This MUST fail for
 * any covering element even if the slider remains visible in the accessibility tree. */
type HitSample={fraction:number;onScreen:boolean;interactable:boolean;covering:string|null;rect:{x:number;y:number;width:number;height:number}};

/** A direct browser geometry probe, not a CSS string check or visibility matcher. */
async function probeHitTargets(locator:ReturnType<Page["locator"]>,fractions:number[],scroll=true):Promise<HitSample[]> {
  if(scroll)await locator.scrollIntoViewIfNeeded();
  return locator.evaluate((target:Element,parts:number[])=>{
    const rect=target.getBoundingClientRect();
    return parts.map(fraction=>{
      const x=rect.left+rect.width*fraction;
      const y=rect.top+rect.height/2;
      const onScreen=x>=0&&y>=0&&x<innerWidth&&y<innerHeight;
      const top=onScreen?document.elementFromPoint(x,y):null;
      return {fraction,onScreen,interactable:!!top&&(target===top||target.contains(top)),
        covering:top?.tagName.toLowerCase()||null,
        rect:{x:rect.x,y:rect.y,width:rect.width,height:rect.height}};
    });
  },fractions);
}

async function assertUnobstructed(locator:ReturnType<Page["locator"]>,fractions=[0.5],scroll=true) {
  const samples=await probeHitTargets(locator,fractions,scroll);
  for(const sample of samples){
    expect(sample.onScreen,JSON.stringify(sample)).toBe(true);
    expect(sample.interactable,JSON.stringify(sample)).toBe(true);
  }
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
      // Capture the ORIGINAL viewport before scrollIntoViewIfNeeded can move the target.
      await capture(page,info,"hero-initial-"+size.name+"-"+theme);
      const isInitiallyVisible=await slider.evaluate(el=>{
        const r=el.getBoundingClientRect();
        return r.top>=0&&r.bottom<=innerHeight&&r.left>=0&&r.right<=innerWidth;
      });
      if(isInitiallyVisible)await assertUnobstructed(slider,[0.15,0.5,0.85],false);
      await assertUnobstructed(slider,[0.15,0.5,0.85]);
      const before=Number(await slider.inputValue());
      // Assert the control changes what the user actually sees on the wave.
      // A slider whose value updates but whose downstream geometry stays frozen
      // is a hollow success for this interactive showcase.
      const movingEvent=page.locator('.scene .timeline-event[aria-label="NavLinks Ссылки и навигация"]');
      await expect(movingEvent).toHaveCount(1);
      const beforeX=await movingEvent.evaluate(el=>getComputedStyle(el).getPropertyValue("--event-x"));
      await slider.focus();
      await slider.press("ArrowRight");
      expect(Number(await slider.inputValue())).toBeGreaterThan(before);
      await expect.poll(async()=>movingEvent.evaluate(el=>getComputedStyle(el).getPropertyValue("--event-x"))).not.toBe(beforeX);
      const afterKeyboard=Number(await slider.inputValue());
      const box=await slider.boundingBox();
      expect(box).not.toBeNull();
      await slider.click({position:{x:box!.width*0.85,y:box!.height/2}});
      await expect.poll(async()=>Number(await slider.inputValue())).toBeGreaterThan(afterKeyboard);
      await capture(page,info,"hero-control-"+size.name+"-"+theme);
    });
  }
}

test("01b falsification: a right-side blocker is detected by the SAME hit-test oracle",async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await page.goto("/");
  const slider=page.getByRole("slider",{name:"Расстояние между событиями"});
  await assertUnobstructed(slider,[0.15,0.5,0.85]);
  const rect=await slider.boundingBox();
  expect(rect).not.toBeNull();
  // Mutation probe: deliberately recreate the original category of bug at the
  // right edge without altering the application code or saving a golden image.
  await page.evaluate(({x,y,width,height})=>{
    const blocker=document.createElement("div");
    blocker.id="test-right-edge-blocker";
    Object.assign(blocker.style,{position:"fixed",left:`${x+width*0.72}px`,
      top:`${y}px`,width:`${width*0.28}px`,height:`${height}px`,
      zIndex:"2147483647",pointerEvents:"auto",background:"transparent"});
    document.body.appendChild(blocker);
  },rect!);
  const obstructed=await probeHitTargets(slider,[0.15,0.5,0.85],false);
  expect(obstructed[0].interactable).toBe(true); // not a blanket false
  expect(obstructed[1].interactable).toBe(true);
  expect(obstructed[2].interactable).toBe(false); // right-side collision detected
  await page.locator("#test-right-edge-blocker").evaluate(el=>el.remove());
  await assertUnobstructed(slider,[0.15,0.5,0.85],false);
});

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
  // A real scroll without clicking any link must update the current section.
  await page.locator("#writing").evaluate(el=>el.scrollIntoView({block:"start"}));
  await expect(sectionLink(page,"Тексты")).toHaveAttribute("aria-current","location");
  await expect(page.locator('.showcase-nav a[aria-current="location"]')).toHaveCount(1);
  await page.locator("#workspace").evaluate(el=>el.scrollIntoView({block:"start"}));
  await expect(sectionLink(page,"Рабочие поверхности")).toHaveAttribute("aria-current","location");
  // The workspace is nested inside #catalog. Returning to a later catalogue
  // section should activate the parent, not leave the old workspace selected.
  await page.locator("#energy").evaluate(el=>el.scrollIntoView({block:"start"}));
  await expect(sectionLink(page,"Компоненты")).toHaveAttribute("aria-current","location");
  await expect(page.locator('.showcase-nav a[aria-current="location"]')).toHaveCount(1);
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
  await expect(page.getByRole("link",{name:/Перейти к компонентам/})).toBeFocused();
  await toggle.click();
  await menu.getByRole("menuitemradio",{name:"Тёмная"}).press("Shift+Tab");
  await expect(menu).toHaveCount(0);
  await expect(page.getByRole("link",{name:/GitHub — исходники Vanya UI/}).first()).toBeFocused();
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
  await explore.press("Tab");
  await expect(panel).toBeFocused(); // keyboard actually reaches visible panel content
  await read.focus();
  await read.press("End");
  await expect(explore).toBeFocused();
  await explore.press("Home");
  await expect(read).toHaveAttribute("aria-selected","true");
  await expect(section.getByRole("tabpanel",{name:"Чтение"})).toContainText("Текст романа");
  await capture(page,info,"filter-versus-tabs");
});

test("05 drawer opens and closes without obscuring its trigger permanently",async({page},info)=>{
  await page.goto("/#workspace");
  const trigger=page.locator("#workspace").getByRole("button",{name:"Открыть детали"});
  await assertUnobstructed(trigger);
  await trigger.click();
  const dialog=page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("Описание проекта");
  await expect(dialog).toContainText("Здесь можно разместить описание");
  await capture(page,info,"drawer-open");
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused(); // drawer restores the real opener, not just closes
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
  await right.evaluate(el=>{el.scrollTop=el.scrollHeight;});
  const rightPos=await right.evaluate(el=>el.scrollTop);
  expect(rightPos).toBeGreaterThan(0);
  expect(await left.evaluate(el=>el.scrollTop)).toBe(leftPos);
  await left.evaluate(el=>{el.scrollTop=0;});
  expect(await right.evaluate(el=>el.scrollTop)).toBe(rightPos);
  await capture(page,info,"independent-scroll-owners");
});

test("07 pressed feedback and real counter outcome are distinct from mere hover",async({page},info)=>{
  await page.goto("/#interaction-states");
  const group=page.locator("#interaction-states");
  // Use a stable selector: the successful result adds an accessible status to the
  // button's name, so re-querying by its OLD name would be a false test failure.
  const action=group.locator('button[data-action-state]').first();
  const output=group.locator('output[role="status"]');
  await expect(output).toHaveText("Нажми, чтобы увидеть подтверждение");
  await expect(action).toHaveAttribute("data-action-state","idle");
  await assertUnobstructed(action);
  await action.hover();
  const hover=await action.evaluate(el=>getComputedStyle(el).backgroundColor);
  const r=await action.boundingBox();
  expect(r).not.toBeNull();
  await page.mouse.move(r!.x+r!.width/2,r!.y+r!.height/2);
  await page.mouse.down();
  // Outline buttons really DO change their background on :active; use polling
  // to avoid reading a mid-transition hover frame.
  await expect.poll(async()=>action.evaluate(el=>getComputedStyle(el).backgroundColor)).not.toBe(hover);
  await page.mouse.up();
  await expect(output).toHaveText("Нажатие принято · 1");
  await expect(action).toHaveAttribute("data-action-state","success");
  await action.click();
  await expect(output).toHaveText("Нажатие принято · 2");
  await capture(page,info,"pressed-and-result");
});

test("07b pending must not turn into success without a deliberate result",async({page},info)=>{
  await page.goto("/#action-feedback");
  const group=page.locator("#action-feedback");
  const action=group.locator('button[data-action-state]').first();
  const output=group.locator('output[role="status"]');
  await expect(output).toHaveText("Действие ещё не запускали.");
  await action.click();
  await expect(action).toHaveAttribute("data-action-state","pending");
  await expect(action).toHaveAttribute("aria-disabled","true");
  await expect(output).toHaveText("Приложение выполняет действие; повторный клик заблокирован.");
  await expect(output).not.toContainText("выполнено");
  await group.getByRole("button",{name:"Вернуть ошибку"}).click();
  await expect(action).toHaveAttribute("data-action-state","error");
  await expect(output).toHaveText("Тестовый результат: ошибка. Можно повторить.");
  await group.getByRole("button",{name:"Сбросить"}).click();
  await expect(action).toHaveAttribute("data-action-state","idle");
  await expect(output).toHaveText("Действие ещё не запускали.");
  await action.click();
  await group.getByRole("button",{name:"Подтвердить успех"}).click();
  await expect(output).toHaveText("Тестовый результат: выполнено.");
  await expect(action).toHaveAttribute("data-action-state","success");
  await capture(page,info,"pending-explicit-result");
});

test("08 shortcuts and 200% CSS zoom approximation leave core controls reachable",async({page},info)=>{
  await page.setViewportSize({width:390,height:844});
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.goto("/");
  expect(await page.evaluate(()=>matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(true);
  await page.evaluate(()=>{document.documentElement.style.zoom="2";});
  const slider=page.getByRole("slider",{name:"Расстояние между событиями"});
  await assertUnobstructed(slider);
  await page.evaluate(()=>(document.activeElement as HTMLElement)?.blur());
  await page.keyboard.press("Shift+/");
  await expect(page.getByRole("dialog",{name:"Горячие клавиши"})).toBeVisible();
  await capture(page,info,"reduced-motion-css-zoom");
  // CSS zoom is an approximation: manual 200% browser zoom remains in the acceptance checklist.
});
