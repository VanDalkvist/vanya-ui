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

  it("requests one controlled recovery when the selected tab is disabled or removed",()=>{
    const items = [
      {id:"a",label:"A",tabId:"tab-a",panelId:"panel-a"},
      {id:"b",label:"B",tabId:"tab-b",panelId:"panel-b"},
      {id:"c",label:"C",tabId:"tab-c",panelId:"panel-c"},
    ];
    const change=vi.fn();
    const view=render(<SegmentedControl semantics="tabs" items={items} value="a" onChange={change}/>);
    expect(change).not.toHaveBeenCalled();
    const unavailable=items.map(item=>({...item,disabled:item.id==="a"}));
    view.rerender(<SegmentedControl semantics="tabs" items={unavailable} value="a" onChange={change}/>);
    expect(change).toHaveBeenCalledExactlyOnceWith("b");
    expect(screen.getByRole("tab",{name:"A"})).toHaveAttribute("aria-selected","true");
    expect(screen.getByRole("tab",{name:"B"})).toHaveAttribute("aria-selected","false");
    view.rerender(<SegmentedControl semantics="tabs" items={[...unavailable]} value="a" onChange={v=>change(v)}/>);
    expect(change).toHaveBeenCalledTimes(1);
    view.rerender(<SegmentedControl semantics="tabs" items={items.slice(1)} value="b" onChange={change}/>);
    expect(screen.getByRole("tab",{name:"B"})).toHaveAttribute("aria-selected","true");
    view.rerender(<SegmentedControl semantics="tabs" items={items.slice(2)} value="b" onChange={change}/>);
    expect(change).toHaveBeenLastCalledWith("c");
    expect(screen.getByRole("tab",{name:"C"})).toHaveAttribute("aria-selected","false");
    expect(screen.getByRole("tab",{name:"C"})).toHaveAttribute("tabindex","0");
    view.rerender(<SegmentedControl semantics="tabs" items={[{...items[2],disabled:true}]} value="b" onChange={change}/>);
    expect(change).toHaveBeenCalledTimes(2);
  });

  it("reconciles the visible panel and selected tab after the owner accepts recovery",()=>{
    const all=[
      {id:"a",label:"A",tabId:"tab-a",panelId:"panel-a"},
      {id:"b",label:"B",tabId:"tab-b",panelId:"panel-b"},
      {id:"c",label:"C",tabId:"tab-c",panelId:"panel-c"},
    ];
    function Host({mode}:{mode:"initial"|"disabled"|"removed"}){
      const [value,setValue]=React.useState("a");
      const items=mode==="removed"?all.slice(2):all.map(i=>({...i,disabled:mode==="disabled"&&i.id==="a"}));
      return <><SegmentedControl semantics="tabs" aria-label="Views" value={value} items={items} onChange={setValue}/>
        {items.map(i=><div key={i.id} role="tabpanel" id={i.panelId} aria-labelledby={i.tabId} hidden={i.id!==value}>{i.label} content</div>)}</>;
    }
    const view=render(<Host mode="initial"/>);
    const selected=(label:string)=>{
      const tab=screen.getByRole("tab",{name:label});
      expect(tab).toHaveAttribute("aria-selected","true");
      expect(tab).toHaveAttribute("tabindex","0");
      const panel=screen.getByRole("tabpanel",{name:label});
      expect(panel).toHaveTextContent(label+" content");
      expect(tab.getAttribute("aria-controls")).toBe(panel.id);
      expect(screen.getAllByRole("tabpanel")).toHaveLength(1);
      expect(screen.getAllByRole("tab").filter(t=>t.getAttribute("aria-selected")==="true")).toHaveLength(1);
    };
    selected("A");
    view.rerender(<Host mode="disabled"/>); selected("B");
    view.rerender(<Host mode="removed"/>); selected("C");
  });

  it("does not request automatic filter changes or changes while the group is disabled",()=>{
    const change=vi.fn();
    const items=[{id:"b",label:"B",tabId:"tab-b",panelId:"panel-b"}];
    const view=render(<SegmentedControl items={items} value="a" onChange={change}/>);
    view.rerender(<SegmentedControl semantics="tabs" disabled items={items} value="a" onChange={change}/>);
    expect(change).not.toHaveBeenCalled();
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

  it("Tab and Shift+Tab close the menu and delegate traversal to the browser",()=>{
    render(<><button type="button">До</button><ThemeToggle/><button type="button">После</button></>);
    const trigger=screen.getByRole("button",{name:/Тема оформления:/});
    fireEvent.click(trigger);
    expect(fireEvent.keyDown(screen.getByRole("menu"),{key:"Tab"})).toBe(true);
    expect(screen.queryByRole("menu")).toBeNull();
    expect(trigger).toHaveFocus();
    fireEvent.click(trigger);
    expect(fireEvent.keyDown(screen.getByRole("menu"),{key:"Tab",shiftKey:true})).toBe(true);
    expect(screen.queryByRole("menu")).toBeNull();
    expect(trigger).toHaveFocus();
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

  it("selects a fragment aligned to its computed mobile scroll margin",()=>{
    render(<><section id="previous"/><section id="target" style={{scrollMarginTop:"160px"}}/></>);
    const previous=document.getElementById("previous")!;
    const target=document.getElementById("target")!;
    Object.defineProperty(previous,"getBoundingClientRect",{configurable:true,value:()=>({top:-500,bottom:160})});
    Object.defineProperty(target,"getBoundingClientRect",{configurable:true,value:()=>({top:160,bottom:900})});
    expect(visibleSection(["previous","target"],82)).toBe("target");
  });

  it("selects the last visible section at the clamped document end",()=>{
    render(<><section id="previous"/><section id="target"/></>);
    const previous=document.getElementById("previous")!;
    const target=document.getElementById("target")!;
    Object.defineProperty(previous,"getBoundingClientRect",{configurable:true,value:()=>({top:-800,bottom:170})});
    Object.defineProperty(target,"getBoundingClientRect",{configurable:true,value:()=>({top:170,bottom:540})});
    const old=Object.getOwnPropertyDescriptor(document.documentElement,"scrollHeight");
    try {
      Object.defineProperty(document.documentElement,"scrollHeight",{configurable:true,value:2000});
      vi.stubGlobal("innerHeight",844); vi.stubGlobal("scrollY",1156);
      expect(visibleSection(["previous","target"],89)).toBe("target");
    } finally {
      if(old)Object.defineProperty(document.documentElement,"scrollHeight",old);
      else Reflect.deleteProperty(document.documentElement,"scrollHeight");
    }
  });

  it("renders catalog, workspace and setup as consecutive sibling sections",()=>{
    const {container}=render(<Showcase/>);
    const catalog=container.querySelector("#catalog")!;
    const workspace=container.querySelector("#workspace")!;
    const setup=container.querySelector("#setup")!;
    expect(catalog.contains(workspace)).toBe(false);
    expect(catalog.nextElementSibling).toBe(workspace);
    expect(workspace.nextElementSibling).toBe(setup);
    for(const id of ["energy","spider","pulse","voice","inspector","digest"]){
      expect(catalog.querySelector("#"+id)).not.toBeNull();
      expect(workspace.querySelector("#"+id)).toBeNull();
    }
    for(const id of ["workspace-overview","workspace-split","scroll-region","section-toolbar",
      "composition-reading-inspector","workspace-context-header","sticky-context",
      "workspace-action-bar","workspace-empty-state"]){
      expect(workspace.querySelector("#"+id)).not.toBeNull();
      expect(catalog.querySelector("#"+id)).toBeNull();
    }
    expect(document.querySelectorAll("#workspace")).toHaveLength(1);
  });

  it("advances catalog → workspace → setup without reselecting catalog",()=>{
    render(<><section id="catalog"/><section id="workspace"/><section id="setup"/></>);
    const ids=["catalog","workspace","setup"] as const;
    const elements=ids.map(id=>document.getElementById(id)!);
    let bounds:[number,number][]=[[-700,180],[180,1100],[1100,1800]];
    elements.forEach((el,i)=>Object.defineProperty(el,"getBoundingClientRect",{
      configurable:true,value:()=>({top:bounds[i][0],bottom:bounds[i][1]})
    }));
    expect(visibleSection(ids,70)).toBe("catalog");
    bounds=[[-900,-100],[-100,900],[900,1800]];
    expect(visibleSection(ids,70)).toBe("workspace");
    bounds=[[-1600,-1000],[-1000,-120],[-120,900]];
    expect(visibleSection(ids,70)).toBe("setup");
  });

  it("handles deep links with the semantic current location, including history events",()=>{
    // Suppress RAF geometry in jsdom (all rectangles are zero); test geometry separately above.
    vi.stubGlobal("requestAnimationFrame", vi.fn(()=>1));
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    render(<Showcase/>);
    window.history.replaceState(null,"","/#identity");
    fireEvent(window,new Event("hashchange"));
    expect(screen.getByRole("link",{name:"Айдентика"})).toHaveAttribute("aria-current","location");
    expect(screen.getByRole("link",{name:"Обзор"})).not.toHaveAttribute("aria-current");
    window.history.replaceState(null,"","/#writing");
    fireEvent(window,new Event("popstate"));
    expect(screen.getByRole("link",{name:"Тексты"})).toHaveAttribute("aria-current","location");
  });
});
