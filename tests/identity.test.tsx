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
  expect(screen.getByRole("heading",{name:"Айдентика"})).toBeInTheDocument();
  expect(document.querySelector("#identity")).toBeInTheDocument();
  expect(screen.getByRole("link",{name:/Правила и примеры для агентов/})).toHaveAttribute("href","/reference/identity.md");
  expect(screen.getByText("--accent")).toBeInTheDocument();
  expect(screen.getByRole("heading",{name:"Индивидуальный знак сервиса"})).toBeVisible();
 });
});

describe("product-specific marks",()=>{
 const Custom=({monochrome}:{monochrome:boolean})=><svg viewBox="0 0 16 16" data-testid="custom-mark" data-mono={String(monochrome)}/>;
 it("keeps the exact official parent and UI marks even if custom artwork is supplied",()=>{
  render(<><VanyaArcLockup productMark={Custom}/><VanyaArcLockup product="UI" productMark={Custom}/></>);
  for(const label of ["Vanya Arc","Vanya Arc / UI"]){expect(screen.getByRole("img",{name:label}).querySelector("path")).toHaveAttribute("d",VANYA_ARC_MARK_PATH)}
  expect(screen.queryByTestId("custom-mark")).not.toBeInTheDocument();
 });
 it("renders custom product marks with monochrome and a single accessible name",()=>{
  render(<VanyaArcLockup product="Example" productMark={Custom} monochrome/>);
  const lockup=screen.getByRole("img",{name:"Vanya Arc / Example"});
  expect(lockup.querySelector(".vanya-arc-product-mark")).toHaveAttribute("aria-hidden","true");
  expect(screen.getByTestId("custom-mark")).toHaveAttribute("data-mono","true");
  expect(lockup.querySelector(".vanya-arc-mark")).toBeNull();
 });
 it("preserves existing default and respects explicit text-only lockups",()=>{
  render(<><VanyaArcLockup product="Example"/><VanyaArcLockup product="Other" productMark={Custom} showMark={false}/><VanyaArcLockup product="Temporary" showMark={false}/></>);
  expect(screen.getByRole("img",{name:"Vanya Arc / Example"}).querySelector("path")).toHaveAttribute("d",VANYA_ARC_MARK_PATH);
  for(const name of ["Other","Temporary"])expect(screen.getByRole("img",{name:"Vanya Arc / "+name}).querySelector("svg")).toBeNull();
 });
});
