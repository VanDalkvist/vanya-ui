import { expect, test } from "@playwright/test";

for (const theme of ["light","dark"] as const) {
  test("Quiet search exposes a real filtered catalogue and stable affordance / "+theme,async({page},info)=>{
    await page.setViewportSize({width:1440,height:900});
    await page.addInitScript(mode=>localStorage.setItem("vanya_theme",mode),theme);
    await page.goto("/#compact-filter-toolbar");
    await expect(page.locator("html")).toHaveAttribute("data-theme",theme);
    const section=page.locator("#compact-filter-toolbar");
    const input=section.getByRole("searchbox",{name:"Поиск по каталогу"});
    const results=section.getByRole("list",{name:"Результаты поиска"});
    const rows=results.getByRole("listitem");
    await expect(input).toBeVisible();
    await expect(rows).toHaveCount(3);
    await expect(rows).toHaveText(["Тихий берег","Маяк на холме","Следы в лесу"]);
    await input.fill("Маяк");
    await expect(rows).toHaveCount(1);
    await expect(rows.first()).toHaveText("Маяк на холме");
    await input.fill("zz-no-results");
    await expect(rows).toHaveCount(0);
    await expect(section.getByText("Ничего не найдено",{exact:true})).toBeVisible();
    await section.getByRole("button",{name:"Очистить поиск"}).click();
    await expect(input).toHaveValue("");
    await expect(input).toBeFocused();
    await expect(rows).toHaveCount(3);
    await expect(section.getByText("Ничего не найдено",{exact:true})).toBeHidden();

    await input.evaluate(el=>(el as HTMLInputElement).blur());
    await page.mouse.move(0,0);
    const resting=()=>input.evaluate(el=>{
      const s=getComputedStyle(el);
      const transparent="rgba(0, 0, 0, 0)";
      return {
        transparent:s.backgroundColor===transparent,
        hasVisibleBorder:["top","right","bottom","left"].some(edge=>{
          const width=parseFloat(s.getPropertyValue("border-"+edge+"-width"));
          const style=s.getPropertyValue("border-"+edge+"-style");
          const color=s.getPropertyValue("border-"+edge+"-color");
          return width>0&&style!=="none"&&style!=="hidden"&&color!==transparent;
        }),
        height:el.getBoundingClientRect().height,
      };
    });
    await expect.poll(resting).toEqual({transparent:true,hasVisibleBorder:false,height:40});
    await input.scrollIntoViewIfNeeded();
    const hit=()=>input.evaluate(el=>{
      const r=el.getBoundingClientRect();
      return [0.25,0.5,0.75].map(f=>document.elementFromPoint(r.left+r.width*f,r.top+r.height/2)===el);
    });
    await expect.poll(hit).toEqual([true,true,true]);
    // Negative control: a deliberate overlay must be caught by the same oracle.
    await input.evaluate(el=>{
      const r=el.getBoundingClientRect(), overlay=document.createElement("div");
      overlay.id="quiet-search-qa-overlay";
      Object.assign(overlay.style,{position:"fixed",left:r.left+"px",top:r.top+"px",width:r.width+"px",height:r.height+"px",zIndex:"2147483647",pointerEvents:"auto"});
      document.body.appendChild(overlay);
    });
    try { await expect.poll(hit).toEqual([false,false,false]); }
    finally { await page.locator("#quiet-search-qa-overlay").evaluate(el=>el.remove()); }
    await expect.poll(hit).toEqual([true,true,true]);
    await info.attach("quiet-search-rest",{body:await section.screenshot({animations:"disabled"}),contentType:"image/png"});
    await input.focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    await expect(input).toBeFocused();
    await expect(input).toHaveCSS("outline-style","solid");
    await expect(input).toHaveCSS("outline-width","2px");
    await expect.poll(async()=>input.evaluate(el=>el.getBoundingClientRect().height)).toBe(40);
    await info.attach("quiet-search-focus",{body:await section.screenshot({animations:"disabled"}),contentType:"image/png"});
  });
}
