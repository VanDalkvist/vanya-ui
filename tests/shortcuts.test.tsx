import React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { ShortcutKeys } from "../src";
import { Showcase } from "../src/showcase/Showcase";
import { SHOWCASE_SHORTCUT_STORAGE } from "../src/showcase/shortcut-spec";

afterEach(() => {
  cleanup();
  window.location.hash = "";
  window.localStorage.removeItem(SHOWCASE_SHORTCUT_STORAGE);
});

describe("shortcut notation and keyboard UX", () => {
  it("distinguishes two-key sequences from chords for screen readers", () => {
    const { container }=render(<>
      <ShortcutKeys keys={["G","I"]} />
      <ShortcutKeys keys={["⌘","K"]} mode="combo"/>
    </>);
    expect(screen.getByText("G, затем I")).toBeInTheDocument();
    expect(screen.getByText("⌘ плюс K")).toBeInTheDocument();
    expect(container.querySelectorAll("kbd")).toHaveLength(4);
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(2);
  });

  it("opens help contextually from Principles and has no floating overlay", () => {
    render(<Showcase/>);
    expect(screen.queryByRole("dialog",{name:"Горячие клавиши"})).not.toBeInTheDocument();
    expect(document.querySelector(".showcase-shortcut-dock")).not.toBeInTheDocument();
    expect(screen.getByRole("slider",{name:"Расстояние между событиями"})).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button",{name:"Настроить горячие клавиши"}));
    const dialog=screen.getByRole("dialog",{name:"Горячие клавиши"});
    expect(within(dialog).getByRole("link",{name:"Айдентика"})).toHaveAttribute("href","/#identity");
    expect(within(dialog).getByRole("checkbox",{name:/Быстрые переходы включены/})).toBeChecked();
    fireEvent.keyDown(dialog,{key:"Escape",code:"Escape"});
    expect(screen.queryByRole("dialog",{name:"Горячие клавиши"})).not.toBeInTheDocument();
  });

  it("keeps the distance control and contextual settings reachable without a floating element", () => {
    const {container}=render(<Showcase/>);
    expect(container.querySelector(".showcase-shortcut-dock")).toBeNull();
    expect(screen.queryByRole("button",{name:"Горячие клавиши"})).not.toBeInTheDocument();
    expect(screen.getByRole("slider",{name:"Расстояние между событиями"})).toBeInTheDocument();
    expect(screen.getByRole("button",{name:"Настроить горячие клавиши"})).toBeInTheDocument();
  });

  it("has one keyboard-accessible GitHub icon link in the top navigation", () => {
    render(<Showcase/>);
    const header=document.querySelector(".showcase-header") as HTMLElement;
    const github=within(header).getByRole("link",{name:/GitHub — исходники Vanya UI/});
    expect(github).toHaveAttribute("href","https://github.com/VanDalkvist/vanya-ui");
    expect(github).toHaveAttribute("target","_blank");
    expect(github).toHaveAttribute("rel","noopener noreferrer");
    expect(github).toHaveClass("showcase-github");
    const mark=github.querySelector("svg");
    expect(mark).toHaveAttribute("fill","none");
    expect(mark).toHaveAttribute("stroke","currentColor");
    expect(mark).toHaveAttribute("aria-hidden","true");
    expect(mark?.querySelector("path")?.getAttribute("d")).toContain("M9 19c-5 1.5");
    expect(within(header).queryByRole("button",{name:"Горячие клавиши"})).not.toBeInTheDocument();
    const author=within(header).getByRole("link",{name:/Автор: Ваня Афанасов/});
    expect(author).toHaveAttribute("href","https://vanya-arc.dev/");
    expect(author).toHaveAttribute("rel",expect.stringContaining("author"));
    expect(author).toHaveAttribute("target","_blank");
    expect(author).toHaveClass("showcase-author-link");
    expect(author).toHaveTextContent("Ваня Афанасов");
  });

  it("opens help with ? and retains contextual access after opting out", () => {
    render(<Showcase/>);
    fireEvent.keyDown(window,{key:"?",code:"Slash",shiftKey:true});
    const dialog=screen.getByRole("dialog",{name:"Горячие клавиши"});
    expect(dialog).toBeInTheDocument();
    fireEvent.click(within(dialog).getByRole("checkbox",{name:/Быстрые переходы включены/}));
    fireEvent.click(within(dialog).getByRole("button",{name:"Закрыть инспектор"}));
    fireEvent.keyDown(window,{key:"?",code:"Slash",shiftKey:true});
    expect(screen.queryByRole("dialog",{name:"Горячие клавиши"})).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button",{name:"Настроить горячие клавиши"}));
    expect(screen.getByRole("dialog",{name:"Горячие клавиши"})).toBeInTheDocument();
  });

  it("uses a real URL fragment for G → I and preserves normal browser shortcuts", () => {
    render(<Showcase/>);
    fireEvent.keyDown(window,{key:"g",code:"KeyG",metaKey:true});
    fireEvent.keyDown(window,{key:"i",code:"KeyI"});
    expect(window.location.hash).toBe("");
    fireEvent.keyDown(window,{key:"g",code:"KeyG"});
    expect(screen.getByText("выберите раздел")).toHaveTextContent("выберите раздел");
    fireEvent.keyDown(window,{key:"i",code:"KeyI"});
    expect(window.location.hash).toBe("#identity");
    expect(document.activeElement).toHaveAttribute("id","identity");
    expect(screen.queryByText("выберите раздел")).not.toBeInTheDocument();
  });

  it("does not capture shortcuts in inputs and can cancel a pending sequence", () => {
    render(<Showcase/>);
    const slider=screen.getByRole("slider",{name:"Расстояние между событиями"});
    fireEvent.keyDown(slider,{key:"g",code:"KeyG"});
    fireEvent.keyDown(slider,{key:"i",code:"KeyI"});
    expect(window.location.hash).toBe("");
    fireEvent.keyDown(window,{key:"g",code:"KeyG"});
    expect(screen.getByText("выберите раздел")).toBeInTheDocument();
    fireEvent.keyDown(window,{key:"Escape",code:"Escape"});
    expect(screen.queryByText("выберите раздел")).not.toBeInTheDocument();
    fireEvent.keyDown(window,{key:"i",code:"KeyI"});
    expect(window.location.hash).toBe("");
  });

  it("navigates to typography and writing by native URL anchors", () => {
    render(<Showcase/>);
    fireEvent.keyDown(window,{key:"g",code:"KeyG"});
    fireEvent.keyDown(window,{key:"t",code:"KeyT"});
    expect(window.location.hash).toBe("#typography");
    expect(document.activeElement).toHaveAttribute("id","typography");
    fireEvent.keyDown(window,{key:"g",code:"KeyG"});
    fireEvent.keyDown(window,{key:"x",code:"KeyX"});
    expect(window.location.hash).toBe("#writing");
  });

  it("persists the optional character-shortcut opt-out", () => {
    render(<Showcase/>);
    fireEvent.click(screen.getByRole("button",{name:"Настроить горячие клавиши"}));
    const dialog=screen.getByRole("dialog",{name:"Горячие клавиши"});
    fireEvent.click(within(dialog).getByRole("checkbox",{name:/Быстрые переходы включены/}));
    expect(window.localStorage.getItem(SHOWCASE_SHORTCUT_STORAGE)).toBe("off");
    fireEvent.click(within(dialog).getByRole("button",{name:"Закрыть инспектор"}));
    fireEvent.keyDown(window,{key:"g",code:"KeyG"});
    fireEvent.keyDown(window,{key:"i",code:"KeyI"});
    expect(window.location.hash).toBe("");
    // Contextual settings remain reachable even after disabling character shortcuts.
    fireEvent.click(screen.getByRole("button",{name:"Настроить горячие клавиши"}));
    expect(screen.getByRole("dialog",{name:"Горячие клавиши"})).toBeInTheDocument();
  });
});
