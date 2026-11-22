import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { SegmentedControl, ThemeToggle } from "../src";
import { visibleSection } from "../src/showcase/useActiveShowcaseSection";
import { Showcase } from "../src/showcase/Showcase";

afterEach(() => {
  cleanup();
  window.localStorage.removeItem("vanya_theme");
  window.history.replaceState(null, "", "/");
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("#13: filters must not claim tab semantics; real tabs must follow APG", () => {
  it("defaults to a labelled filter group with ordinary buttons and pressed state", () => {
    const change = vi.fn();
    render(<SegmentedControl aria-label="Период" value="week" onChange={change}
      items={[{id:"week",label:"Неделя"},{id:"month",label:"Месяц"}]}/>);
    expect(screen.getByRole("group",{name:"Период"})).toBeInTheDocument();
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
    expect(screen.getByRole("button",{name:"Неделя"})).toHaveAttribute("aria-pressed","true");
    fireEvent.click(screen.getByRole("button",{name:"Месяц"}));
    expect(change).toHaveBeenCalledWith("month");
  });

  it("connects every real tab to its panel and roves focus, skipping disabled tabs", () => {
    const items = [
      {id:"reading",label:"Чтение",tabId:"t-reading",panelId:"p-reading"},
      {id:"missing",label:"Недоступно",tabId:"t-missing",panelId:"p-missing",disabled:true},
      {id:"atlas",label:"Атлас",tabId:"t-atlas",panelId:"p-atlas"},
    ];
    function Example() {
      const [selected,setSelected]=React.useState("reading");
      return <>
        <SegmentedControl semantics="tabs" aria-label="Виды главы" items={items} value={selected} onChange={setSelected}/>
        {items.map(item=><div key={item.id} role="tabpanel" tabIndex={0} id={item.panelId}
          aria-labelledby={item.tabId} hidden={selected!==item.id}>{item.label} — данные</div>)}
      </>;
    }
    render(<Example/>);
    const reading=screen.getByRole("tab",{name:"Чтение"});
    const atlas=screen.getByRole("tab",{name:"Атлас"});
    const disabled=screen.getByRole("tab",{name:"Недоступно"});
    expect(reading).toHaveAttribute("id","t-reading");
    expect(reading).toHaveAttribute("aria-controls","p-reading");
    expect(reading).toHaveAttribute("tabindex","0");
    expect(atlas).toHaveAttribute("tabindex","-1");
    expect(disabled).toBeDisabled();
    reading.focus();
    fireEvent.keyDown(reading,{key:"ArrowRight"});
    expect(atlas).toHaveFocus();
    expect(atlas).toHaveAttribute("aria-selected","true");
    expect(atlas).toHaveAttribute("tabindex","0");
    expect(reading).toHaveAttribute("tabindex","-1");
    expect(screen.getByRole("tabpanel",{name:"Атлас"})).toBeInTheDocument();
    fireEvent.keyDown(atlas,{key:"Home"});
    expect(reading).toHaveFocus();
    expect(reading).toHaveAttribute("aria-selected","true");
    fireEvent.keyDown(reading,{key:"End"});
    expect(atlas).toHaveFocus();
    fireEvent.keyDown(atlas,{key:"ArrowRight"});
    expect(reading).toHaveFocus(); // wraps
    fireEvent.keyDown(reading,{key:"ArrowLeft"});
    expect(atlas).toHaveFocus(); // wraps backwards
  });

  it("does not invent a reachable tab when all options are unavailable", () => {
    render(<SegmentedControl semantics="tabs" value="a" onChange={()=>{}} disabled
      items={[{id:"a",label:"A",tabId:"tab-a",panelId:"panel-a"}]}/>);
    expect(screen.getByRole("tab",{name:"A"})).toHaveAttribute("tabindex","-1");
  });
});

describe("#14: ThemeToggle menu keyboard contract",()=>{
  it("opens on arrows, keeps menu rows outside Tab order and supports Home/End/Escape",()=>{
    render(<><button type="button">До</button><ThemeToggle/><button type="button">После</button></>);
    const trigger=screen.getByRole("button",{name:/Тема оформления:/});
    fireEvent.keyDown(trigger,{key:"ArrowDown"});
    const menu=screen.getByRole("menu",{name:"Тема оформления"});
    const options=within(menu).getAllByRole("menuitemradio");
    expect(options).toHaveLength(3);
    for(const option of options)expect(option).toHaveAttribute("tabindex","-1");
    expect(options[0]).toHaveFocus();
    fireEvent.keyDown(menu,{key:"End"});
    expect(options[2]).toHaveFocus();
    fireEvent.keyDown(menu,{key:"Home"});
    expect(options[0]).toHaveFocus();
    fireEvent.keyDown(menu,{key:"ArrowUp"});
    expect(options[2]).toHaveFocus();
    fireEvent.keyDown(menu,{key:"Escape"});
    expect(screen.queryByRole("menu")).toBeNull();
    expect(trigger).toHaveFocus();
  });

  it("Tab and Shift+Tab leave the menu to real adjacent controls, no focus trap",()=>{
    render(<><button type="button">До</button><ThemeToggle/><button type="button">После</button></>);
    const trigger=screen.getByRole("button",{name:/Тема оформления:/});
    fireEvent.click(trigger);
    fireEvent.keyDown(screen.getByRole("menu"),{key:"Tab"});
    expect(screen.queryByRole("menu")).toBeNull();
    expect(screen.getByRole("button",{name:"После"})).toHaveFocus();
    fireEvent.click(trigger);
    fireEvent.keyDown(screen.getByRole("menu"),{key:"Tab",shiftKey:true});
    expect(screen.queryByRole("menu")).toBeNull();
    expect(screen.getByRole("button",{name:"До"})).toHaveFocus();
  });

  it("closes on focus leaving and retains proper checked value after selection",()=>{
    render(<><ThemeToggle/><button type="button">Дальше</button></>);
    const trigger=screen.getByRole("button",{name:/Тема оформления:/});
    fireEvent.click(trigger);
    fireEvent.click(within(screen.getByRole("menu")).getByRole("menuitemradio",{name:"Тёмная"}));
    expect(screen.queryByRole("menu")).toBeNull();
    expect(trigger).toHaveFocus();
    fireEvent.click(trigger);
    expect(within(screen.getByRole("menu")).getByRole("menuitemradio",{name:"Тёмная"})).toHaveAttribute("aria-checked","true");
    fireEvent.blur(within(screen.getByRole("menu")).getByRole("menuitemradio",{name:"Тёмная"}),
      {relatedTarget:screen.getByRole("button",{name:"Дальше"})});
    expect(screen.queryByRole("menu")).toBeNull();
  });
});

describe("#15: current section reflects viewport/history, not last clicked item",()=>{
  it("chooses the last passed section under the real sticky-header threshold",()=>{
    const {container}=render(<>
      <section id="composition"/>
      <section id="identity"/>
      <section id="typography"/>
    </>);
    const sections=Array.from(container.querySelectorAll("section"));
    const tops=[-800,60,480];
    sections.forEach((el,index)=>{
      Object.defineProperty(el,"getBoundingClientRect",{configurable:true,value:()=>({top:tops[index],bottom:tops[index]+550})});
    });
    expect(visibleSection(["composition","identity","typography"],70)).toBe("identity");
    expect(visibleSection(["composition","identity","typography"],0)).toBe("composition");
    expect(visibleSection(["composition","identity","typography"],600)).toBe("typography");
  });

  it("returns to the parent catalogue after the nested workspace block ends",()=>{
    render(<section id="catalog"><section id="workspace"/><p>Продолжение каталога</p></section>);
    const catalogue=document.getElementById("catalog")!;
    const workspace=document.getElementById("workspace")!;
    Object.defineProperty(catalogue,"getBoundingClientRect",{configurable:true,
      value:()=>({top:-1000,bottom:1800})});
    let end=220;
    Object.defineProperty(workspace,"getBoundingClientRect",{configurable:true,
      value:()=>({top:-200,bottom:end})});
    expect(visibleSection(["catalog","workspace"],70)).toBe("workspace");
    end=80;
    expect(visibleSection(["catalog","workspace"],70)).toBe("catalog");
  });

  it("handles deep links with the semantic current location, including history events",()=>{
    // Suppress RAF geometry in jsdom (all rectangles are zero); test geometry separately above.
    vi.stubGlobal("requestAnimationFrame", vi.fn(()=>1));
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    render(<Showcase/>);
    window.history.replaceState(null,"","/#identity");
    fireEvent(window,new Event("hashchange"));
    expect(screen.getByRole("link",{name:"Айдентика"})).toHaveAttribute("aria-current","location");
    expect(screen.getByRole("link",{name:"Композиция"})).not.toHaveAttribute("aria-current");
    window.history.replaceState(null,"","/#writing");
    fireEvent(window,new Event("popstate"));
    expect(screen.getByRole("link",{name:"Тексты"})).toHaveAttribute("aria-current","location");
  });
});
