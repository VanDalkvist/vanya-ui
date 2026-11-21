import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ScrollRegion, SectionToolbar, WorkspaceActionBar, WorkspaceEmptyState, WorkspaceSplit, InspectDrawer } from "../src/index";

describe("Workspace primitives", () => {
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

  it("keeps the Farm count and controls semantic", () => {
    const click = vi.fn();
    render(<SectionToolbar title="Полка проектов" count={4} total={17} actions={<button onClick={click}>Обновить</button>}/>);
    expect(screen.getByRole("heading", {name:"Полка проектов",level:2})).toBeInTheDocument();
    expect(screen.getByLabelText("Показано 4 из 17")).toBeInTheDocument();
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

  it("distinguishes a calm empty state from clickable decoration", () => {
    render(<WorkspaceEmptyState title="Стол чист" description="Пока нет активных проектов." action={<button>Добавить</button>}/>);
    expect(screen.getByRole("heading",{name:"Стол чист"})).toBeInTheDocument();
    expect(screen.getByRole("button",{name:"Добавить"})).toBeInTheDocument();
  });
});
