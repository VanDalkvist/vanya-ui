import React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { ShortcutKeys } from "../src";
import { Showcase } from "../src/showcase/Showcase";

afterEach(() => {
  cleanup();
  window.location.hash = "";
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

  it("does not install unused global letter navigation and retains normal native links", () => {
    render(<Showcase/>);
    const header=document.querySelector(".showcase-header") as HTMLElement;
    const nav=within(header).getByRole("navigation",{name:"Навигация"});
    expect(within(nav).getAllByRole("link")).toHaveLength(9);
    expect(within(nav).getByRole("link",{name:"Айдентика"})).toHaveAttribute("href","/#identity");
    expect(within(nav).getByRole("link",{name:"Агентам"})).toHaveAttribute("href","/#agents");
    fireEvent.keyDown(window,{key:"g",code:"KeyG"});
    fireEvent.keyDown(window,{key:"i",code:"KeyI"});
    fireEvent.keyDown(window,{key:"?",code:"Slash",shiftKey:true});
    expect(window.location.hash).toBe("");
    expect(screen.queryByRole("dialog",{name:"Горячие клавиши"})).not.toBeInTheDocument();
    expect(document.querySelector(".shortcut-pending,.showcase-shortcut-dock")).toBeNull();
    expect(screen.getByRole("slider",{name:"Расстояние между событиями"})).toBeInTheDocument();
    expect(document.querySelector("#keyboard-shortcuts a[href='/reference/keyboard-shortcuts.md']")).toBeInTheDocument();
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

});
