import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ScrollRegion, SectionToolbar, WorkspaceActionBar, WorkspaceEmptyState, WorkspaceSplit, InspectDrawer, ReceiptDigestModal, StickyContextBar, WorkspaceContextHeader, SurfaceHeader, WorkflowStrip, Disclosure, CostIndicator } from "../src/index";

describe("Workspace primitives", () => {

  it("does not misrepresent unknown costs as free or zero", () => {
    render(<>
      <CostIndicator label="Exa" usd={null} certainty="unknown"/>
      <CostIndicator label="Перевод" usd={0} certainty="free"/>
    </>);
    expect(screen.getByText("Стоимость неизвестна")).toBeInTheDocument();
    expect(screen.getByText("$0")).toBeInTheDocument();
  });
  it("supports the canonical large breadcrumb type scale without app-specific CSS",()=>{
    render(<WorkspaceContextHeader breadcrumbs={[{id:"home",label:"Мастерская",href:"/"},{id:"catalog",label:"Каталог модулей"}]} title="Каталог модулей" showTitle={false} breadcrumbSize="large"/>);
    const nav=screen.getByRole("navigation",{name:"Хлебные крошки"});
    expect(nav).toHaveAttribute("data-size","large");
    expect(nav.querySelectorAll("ol li")).toHaveLength(2);
    expect(screen.getByRole("link",{name:"Мастерская"})).toHaveAttribute("href","/");
  });
  it("preserves both ancestor links when the caller promotes document context",()=>{
    const breadcrumbs=[{id:"library",label:"Библиотека",href:"/#catalog"},{id:"workspace",label:"Рабочие поверхности",href:"/#workspace"}];
    const view=render(<WorkspaceContextHeader breadcrumbs={breadcrumbs} title="Документ" showTitle={false}/>);
    const first=screen.getByRole("link",{name:"Библиотека"}),second=screen.getByRole("link",{name:"Рабочие поверхности"});
    expect(first).toHaveAttribute("href","/#catalog");expect(second).toHaveAttribute("href","/#workspace");
    view.rerender(<WorkspaceContextHeader breadcrumbs={breadcrumbs} title="Документ" showTitle/>);
    expect(screen.getByRole("link",{name:"Библиотека"})).toBe(first);
    expect(screen.getByRole("link",{name:"Рабочие поверхности"})).toBe(second);
    expect(screen.getByText("Документ")).toBeVisible();
  });
  it("includes the contextual source action without changing real breadcrumbs",()=>{
    const onOpen=vi.fn();
    render(<WorkspaceContextHeader breadcrumbs={[{id:"library",label:"Библиотека",href:"/#catalog"}]}
      breadcrumbAccessory={<button onClick={onOpen}>Оригинал</button>}
      title="Исследование" showTitle={false}/>);
    expect(screen.getByRole("link",{name:"Библиотека"})).toHaveAttribute("href","/#catalog");
    expect(screen.getByRole("navigation",{name:"Хлебные крошки"}).querySelectorAll("ol li")).toHaveLength(1);
    fireEvent.click(screen.getByRole("button",{name:"Оригинал"}));expect(onOpen).toHaveBeenCalledOnce();
  });
  it("keeps a compact workflow and provenance details in the reader",()=>{
    render(<>
      <SurfaceHeader title="Агенты" eyebrow="Exa" collapseAnchor/>
      <WorkflowStrip label="Перевод" status="2/15" progress={{value:2,max:15}}/>
      <Disclosure summary="Происхождение">Получено из Exa</Disclosure>
    </>);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow","2");
    expect(screen.getByText("Происхождение").closest("details")).toBeInTheDocument();
  });

  it("does not duplicate the in-document heading until that heading scrolls away", () => {
    const nav=[{id:"stage",label:"Читать"}];
    const view=render(<WorkspaceContextHeader title="Только один заголовок" breadcrumbs={nav} showTitle={false}
      actions={<button>Извлечь</button>}/>);
    expect(screen.queryByText("Только один заголовок")).not.toBeInTheDocument();
    expect(screen.getByRole("navigation",{name:"Хлебные крошки"})).toBeInTheDocument();
    expect(screen.getByRole("button",{name:"Извлечь"})).toBeInTheDocument();
    view.rerender(<WorkspaceContextHeader title="Только один заголовок" breadcrumbs={nav} showTitle
      actions={<button>Извлечь</button>}/>);
    expect(screen.getByText("Только один заголовок")).toBeInTheDocument();
  });
  it("places accessible navigable breadcrumbs, title and action in one header slot", () => {
    const go=vi.fn(),execute=vi.fn();
    render(<WorkspaceContextHeader title="Агенты и долгие операции" breadcrumbs={[
      {id:"stage",label:"Читать",onSelect:go},
      {id:"topic",label:"Workflows"}
    ]} status="2 / 16" actions={<button onClick={execute}>Извлечь</button>}/>);
    expect(screen.getByRole("navigation",{name:"Хлебные крошки"})).toBeInTheDocument();
    expect(screen.getByRole("group",{name:"Текущий документ"})).toBeInTheDocument();
    expect(screen.getByTitle("Агенты и долгие операции")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button",{name:"Читать"}));expect(go).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole("button",{name:"Извлечь"}));expect(execute).toHaveBeenCalledOnce();
    expect(screen.getByText("2 / 16")).toBeInTheDocument();
  });

  it("keeps the compact context out of tab order until its reader requests it", () => {
    const action=vi.fn();
    const view=render(<StickyContextBar visible={false} title="Статья" actions={<button onClick={action}>Извлечь</button>}/>);
    expect(screen.queryByRole("button",{name:"Извлечь"})).not.toBeInTheDocument();
    expect(view.container.querySelector(".ui-sticky-context-anchor")).toHaveAttribute("data-visible","false");
    view.rerender(<StickyContextBar visible title="Статья" eyebrow="Исследование" status="2 / 5" actions={<button onClick={action}>Извлечь</button>}/>);
    expect(screen.getByRole("region",{name:"Контекст материала"})).toBeInTheDocument();
    expect(screen.getByText("Статья")).toBeInTheDocument();
    expect(screen.getByText("2 / 5")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button",{name:"Извлечь"}));
    expect(action).toHaveBeenCalledOnce();
  });

  it("gives each independent scroll region a name and keyboard entry point", () => {
    render(<ScrollRegion label="Исследования">Длинная статья</ScrollRegion>);
    const region = screen.getByRole("region", {name:"Исследования"});
    expect(region).toHaveAttribute("tabindex","0");
    expect(region).toHaveAttribute("data-axis","vertical");
    expect(region).toHaveAttribute("data-gutter","stable");
  });

  it("supports horizontal lists without inventing another page scroller", () => {
    render(<ScrollRegion label="Быстрый список" orientation="horizontal" stableGutter={false}>А</ScrollRegion>);
    const region = screen.getByRole("region", {name:"Быстрый список"});
    expect(region).toHaveAttribute("data-axis","horizontal");
    expect(region).toHaveAttribute("data-gutter","auto");
  });

  it("keeps the count and controls semantic", () => {
    const click = vi.fn();
    render(<SectionToolbar title="Полка проектов" count={4} total={17} actions={<button onClick={click}>Обновить</button>}/>);
    expect(screen.getByRole("heading", {name:"Полка проектов",level:2})).toBeInTheDocument();
    expect(screen.getByRole("status", { name: "Показано 4 из 17" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button",{name:"Обновить"}));
    expect(click).toHaveBeenCalledOnce();
  });

  it("exposes status and actions without making the footer a modal overlay", () => {
    const click=vi.fn();
    render(<WorkspaceActionBar status="Есть несохранённые изменения" actions={<button onClick={click}>Сохранить</button>}/>);
    const footer=screen.getByText("Есть несохранённые изменения").closest("footer");
    expect(footer).toHaveAttribute("data-placement","footer");
    fireEvent.click(screen.getByRole("button",{name:"Сохранить"}));
    expect(click).toHaveBeenCalledOnce();
  });

  it("composes sibling panes without nesting two vertical scroll regions", () => {
    render(<WorkspaceSplit compact="stack" navigation={<ScrollRegion label="Items">List</ScrollRegion>} detail={<ScrollRegion label="Document">Detail</ScrollRegion>}/>);
    const layout = screen.getByRole("region", {name:"Items"}).parentElement?.parentElement;
    expect(layout).toHaveClass("ui-workspace-split");
    expect(layout).toHaveAttribute("data-compact","stack");
    expect(screen.getByRole("region",{name:"Document"})).toBeInTheDocument();
  });

  it("holds inspector title and dismiss control outside its scrollable body", () => {
    const close = vi.fn();
    render(<InspectDrawer isOpen title="Детали" onClose={close}><p>Длинная запись</p></InspectDrawer>);
    const dialog = screen.getByRole("dialog");
    const body = screen.getByRole("region", {name:"Детали — содержимое"});
    expect(dialog.querySelector("header")?.parentElement).toBe(dialog);
    expect(body.parentElement).toBe(dialog);
    expect(body).toHaveAttribute("tabindex","0");
    fireEvent.click(screen.getByRole("button",{name:"Закрыть инспектор"}));
    expect(close).toHaveBeenCalledOnce();
  });

  for(const outerFirst of [true,false]){
    it("retains body lock and restores focus with two modals, outer first="+outerFirst,()=>{
      const original=document.body.style.overflow;
      document.body.style.overflow="auto";
      function Example({outer,inner}:{outer:boolean;inner:boolean}){
        return <><button>Исходное действие</button>
          <InspectDrawer isOpen={outer} title="Внешний" onClose={()=>{}}>Содержимое</InspectDrawer>
          <ReceiptDigestModal isOpen={inner} title="Внутренний" narrative="Итоги" receipts={[]} onClose={()=>{}}/>
        </>;
      }
      const view=render(<Example outer={false} inner={false}/>);
      const opener=screen.getByRole("button",{name:"Исходное действие"});
      try{
        opener.focus();view.rerender(<Example outer inner={false}/>);
        expect(screen.getByRole("button",{name:"Закрыть инспектор"})).toBeFocused();
        view.rerender(<Example outer inner/>);
        expect(document.body.style.overflow).toBe("hidden");
        expect(screen.getByRole("button",{name:"Закрыть окно"})).toBeFocused();
        view.rerender(<Example outer={!outerFirst} inner={outerFirst}/>);
        expect(document.body.style.overflow).toBe("hidden");
        expect(screen.getByRole("button",{name:outerFirst?"Закрыть окно":"Закрыть инспектор"})).toBeFocused();
        view.rerender(<Example outer={false} inner={false}/>);
        expect(document.body.style.overflow).toBe("auto");
        expect(opener).toBeFocused();
      }finally{view.unmount();document.body.style.overflow=original;}
    });
  }
  it("distinguishes a calm empty state from clickable decoration", () => {
    render(<WorkspaceEmptyState title="Стол чист" description="Пока нет активных проектов." action={<button>Добавить</button>}/>);
    expect(screen.getByRole("heading",{name:"Стол чист"})).toBeInTheDocument();
    expect(screen.getByRole("button",{name:"Добавить"})).toBeInTheDocument();
  });
});
