import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { VanyaArcMark, VanyaArcLockup, VANYA_ARC_MARK_PATH } from "../src";
import { IdentitySection } from "../src/showcase/IdentitySection";

describe("Vanya Arc identity",()=>{
 it("preserves the approved V-to-A double-crest contour",()=>{
  const { container }=render(<VanyaArcMark label="Символ Vanya Arc"/>);
  const svg=screen.getByRole("img",{name:"Символ Vanya Arc"});
  expect(svg.tagName.toLowerCase()).toBe("svg");
  expect(container.querySelector("path")).toHaveAttribute("d",VANYA_ARC_MARK_PATH);
  expect(container.querySelectorAll("linearGradient stop")).toHaveLength(4);
 });
 it("distinguishes the parent from UI without colouring the initial V and A",()=>{
  render(<><VanyaArcLockup/><VanyaArcLockup product="UI"/><VanyaArcLockup product="UI" monochrome/></>);
  expect(screen.getByRole("img",{name:"Vanya Arc"})).toBeInTheDocument();
  expect(screen.getAllByRole("img",{name:"Vanya Arc / UI"})).toHaveLength(2);
  expect(document.querySelectorAll(".vanya-arc-wordmark")).toHaveLength(3);
  expect(document.querySelectorAll(".vanya-arc-product")).toHaveLength(2);
  expect(document.querySelector('[data-monochrome="true"]')).toBeInTheDocument();
 });
 it("exposes product hierarchy, palette and a native Markdown link in the longread",()=>{
  render(<IdentitySection/>);
  expect(screen.getByRole("heading",{name:"Одна форма. Семейство продуктов."})).toBeInTheDocument();
  expect(document.querySelector("#identity")).toBeInTheDocument();
  expect(screen.getByRole("link",{name:/Правила и примеры для агентов/})).toHaveAttribute("href","/reference/identity.md");
  expect(screen.getByText("--accent")).toBeInTheDocument();
 });
});
