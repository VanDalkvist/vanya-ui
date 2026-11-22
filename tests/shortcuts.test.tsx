import React from "react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
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

  it("opens real help from the corner dock and offers visible navigation and opt-out", () => {
    render(<Showcase/>);
    expect(screen.queryByRole("dialog",{name:"Горячие клавиши"})).not.toBeInTheDocument();
    const dock=screen.getByRole("button",{name:"Горячие клавиши"});
    expect(dock).toHaveClass("showcase-shortcut-dock");
    expect(document.querySelector(".showcase-header .showcase-shortcut-button")).not.toBeInTheDocument();
    fireEvent.click(dock);
    const dialog=screen.getByRole("dialog",{name:"Горячие клавиши"});
    expect(within(dialog).getByRole("link",{name:"Айдентика"})).toHaveAttribute("href","/#identity");
    expect(within(dialog).getByRole("checkbox",{name:/Быстрые переходы включены/})).toBeChecked();
    fireEvent.keyDown(dialog,{key:"Escape",code:"Escape"});
    expect(screen.queryByRole("dialog",{name:"Горячие клавиши"})).not.toBeInTheDocument();
  });

  it("places the keyboard help dock at bottom right, respecting the safe area", () => {
    const css=readFileSync(resolve(import.meta.dirname,"../src/showcase/showcase.css"),"utf8");
    const rule=css.split(".showcase-shortcut-dock { position:fixed;")[1]?.split("}")[0];
    expect(rule).toContain("right:max(18px,env(safe-area-inset-right))");
    expect(rule).toContain("bottom:max(18px,env(safe-area-inset-bottom))");
    expect(rule).not.toContain("left:");
    expect(css).toContain(".showcase-shortcut-dock:focus-visible");
  });

  it("has one keyboard-accessible GitHub icon link in the top navigation", () => {
    render(<Showcase/>);
    const header=document.querySelector(".showcase-header") as HTMLElement;
    const github=within(header).getByRole("link",{name:/GitHub — исходники Vanya UI/});
    expect(github).toHaveAttribute("href","https://github.com/VanDalkvist/vanya-ui");
    expect(github).toHaveAttribute("target","_blank");
    expect(github).toHaveAttribute("rel","noopener noreferrer");
    expect(github).toHaveClass("showcase-github");
    expect(within(header).queryByRole("button",{name:"Горячие клавиши"})).not.toBeInTheDocument();
  });

  it("opens help with ? and preserves the pointer entry after opt-out", () => {
    render(<Showcase/>);
    fireEvent.keyDown(window,{key:"?",code:"Slash",shiftKey:true});
    const dialog=screen.getByRole("dialog",{name:"Горячие клавиши"});
    expect(dialog).toBeInTheDocument();
    fireEvent.click(within(dialog).getByRole("checkbox",{name:/Быстрые переходы включены/}));
    fireEvent.click(within(dialog).getByRole("button",{name:"Закрыть инспектор"}));
    fireEvent.keyDown(window,{key:"?",code:"Slash",shiftKey:true});
    expect(screen.queryByRole("dialog",{name:"Горячие клавиши"})).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button",{name:"Горячие клавиши"}));
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
    fireEvent.click(screen.getByRole("button",{name:"Горячие клавиши"}));
    const dialog=screen.getByRole("dialog",{name:"Горячие клавиши"});
    fireEvent.click(within(dialog).getByRole("checkbox",{name:/Быстрые переходы включены/}));
    expect(window.localStorage.getItem(SHOWCASE_SHORTCUT_STORAGE)).toBe("off");
    fireEvent.click(within(dialog).getByRole("button",{name:"Закрыть инспектор"}));
    fireEvent.keyDown(window,{key:"g",code:"KeyG"});
    fireEvent.keyDown(window,{key:"i",code:"KeyI"});
    expect(window.location.hash).toBe("");
    // Help remains discoverable by its visible button after the opt-out.
    fireEvent.click(screen.getByRole("button",{name:"Горячие клавиши"}));
    expect(screen.getByRole("dialog",{name:"Горячие клавиши"})).toBeInTheDocument();
  });
});
