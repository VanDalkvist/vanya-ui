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

  it("opens real help from the header and offers visible navigation and opt-out", () => {
    render(<Showcase/>);
    fireEvent.click(screen.getByRole("button",{name:"Горячие клавиши"}));
    const dialog=screen.getByRole("dialog",{name:"Горячие клавиши"});
    expect(within(dialog).getByRole("link",{name:"Айдентика"})).toHaveAttribute("href","/#identity");
    expect(within(dialog).getByRole("checkbox",{name:/Быстрые переходы включены/})).toBeChecked();
    fireEvent.keyDown(dialog,{key:"Escape",code:"Escape"});
    expect(screen.queryByRole("dialog",{name:"Горячие клавиши"})).not.toBeInTheDocument();
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
