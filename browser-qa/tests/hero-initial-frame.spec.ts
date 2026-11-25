import { expect, test, type Locator } from "@playwright/test";

async function geometry(wave: Locator) {
  return wave.evaluate(el => {
    const rect = el.getBoundingClientRect();
    const [, , width, height] = (el.getAttribute("viewBox") || "").split(/\s+/).map(Number);
    const wrapper = el.closest(".scene-wave")!;
    return {
      visible: getComputedStyle(wrapper).visibility === "visible" && Number(getComputedStyle(wrapper).opacity) > 0,
      matches: rect.width > 0 && rect.height > 0 && Math.abs(width - rect.width) <= .5 && Math.abs(height - rect.height) <= .5,
      width: rect.width, height: rect.height, viewBox: el.getAttribute("viewBox"),
      path: el.querySelector(".wave-past")?.getAttribute("d"),
    };
  });
}

for (const width of [1440, 390]) test("cold hero shows measured wave only at " + width, async ({ page }, info) => {
  await page.setViewportSize({ width, height: 900 });
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route("**/assets/*.js", async route => { await gate; await route.continue(); });
  try {
    await page.goto("/", { waitUntil: "commit" });
    const wrapper = page.locator(".scene-wave");
    const wave = wrapper.locator("svg.scene-background");
    await expect(wave).toHaveAttribute("viewBox", "0 0 1200 400");
    await expect(wrapper).toHaveCSS("visibility", "hidden");
    await expect(page.getByRole("heading", {name:"Готовые компоненты для рабочих интерфейсов."})).toBeVisible();
    const provisional = await geometry(wave);
    expect(provisional.width).toBeGreaterThan(0);
    expect(provisional.height).toBeGreaterThan(0);
    expect(provisional.matches).toBe(false);
    expect(provisional.visible).toBe(false);
    await page.screenshot({path:info.outputPath("prerender-reserved.png"),animations:"disabled"});
    // Falsification: the same oracle identifies the bad frame if it is exposed.
    await wrapper.evaluate(el => el.setAttribute("data-wave-ready","true"));
    const bad = await geometry(wave);
    expect(bad.visible && !bad.matches).toBe(true);
    await wrapper.evaluate(el => el.setAttribute("data-wave-ready","false"));
    // Observe actual rendered frames across script delivery and hydration.
    await page.evaluate(() => {
      const samples: {matches:boolean; path:string|null; box:string|null}[] = [];
      Object.assign(window,{__initialWaveFrames:samples});
      const sample = () => {
        const svg = document.querySelector("svg.scene-background");
        const holder = svg?.closest(".scene-wave");
        if (svg && holder && getComputedStyle(holder).visibility==="visible" && Number(getComputedStyle(holder).opacity)>0) {
          const rect=svg.getBoundingClientRect(), box=svg.getAttribute("viewBox");
          const [,,w,h]=(box||"").split(/\s+/).map(Number);
          samples.push({matches:Math.abs(w-rect.width)<=.5 && Math.abs(h-rect.height)<=.5,path:svg.querySelector(".wave-past")?.getAttribute("d")??null,box});
        }
        if(samples.length<8) requestAnimationFrame(sample);
      };
      requestAnimationFrame(sample);
    });
    release();
    await expect(wrapper).toHaveAttribute("data-wave-ready","true", {timeout:20000});
    await expect(wrapper).toHaveCSS("visibility","visible");
    await expect.poll(()=>page.evaluate(()=>((window as unknown as {__initialWaveFrames:unknown[]}).__initialWaveFrames??[]).length)).toBe(8);
    const frames=await page.evaluate(()=>(window as unknown as {__initialWaveFrames:{matches:boolean;path:string|null;box:string|null}[]}).__initialWaveFrames);
    expect(frames.every(f=>f.matches&&f.path&&f.path===frames[0].path&&f.box===frames[0].box)).toBe(true);
    const initial=await geometry(wave);
    expect(initial.visible && initial.matches).toBe(true);
    await page.screenshot({path:info.outputPath("first-measured-wave.png"),animations:"disabled"});
    const event=wave.locator('.timeline-event[aria-label="NavLinks Ссылки и навигация"]');
    const position=()=>event.evaluate(el=>el.getBoundingClientRect().x);
    const before=await position();
    const slider=page.getByRole("slider",{name:"Расстояние между событиями"});
    await slider.focus(); await slider.press("ArrowRight");
    await expect.poll(async()=>Math.abs(await position()-before)).toBeGreaterThan(1);
  } finally { release(); }
});

test("no-script prerender retains the wave and readable hero",async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:1440,height:900}});
  try {
    const page=await context.newPage();
    await page.goto("http://127.0.0.1:4173/");
    await expect(page.locator(".scene-wave")).toHaveCSS("visibility","visible");
    await expect(page.locator(".scene-wave svg.scene-background")).toHaveAttribute("viewBox","0 0 1200 400");
    await expect(page.getByRole("heading",{name:"Готовые компоненты для рабочих интерфейсов."})).toBeVisible();
  } finally { await context.close(); }
});
