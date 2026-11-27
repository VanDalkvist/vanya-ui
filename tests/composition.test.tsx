import React from "react";
import {describe,it,expect} from "vitest";
import {render,within} from "@testing-library/react";
import {Showcase} from "../src/showcase/Showcase";

describe("shared documentation composition",()=>{
 it("gives each chapter a named row with visible content and preserves critical anchors",()=>{
  const {container}=render(<Showcase/>);
  for(const id of ["identity","typography","writing","principles","catalog","workspace","setup","agents"]){
   const chapter=container.querySelector("#"+id)!;
   const rows=chapter.querySelectorAll(":scope > .catalog-section");
   expect(rows.length,id).toBeGreaterThan(0);
   for(const row of rows){
    const header=row.querySelector(":scope > header");
    expect(header?.querySelector("h3")?.textContent?.trim()).toBeTruthy();
    expect(row.querySelector(":scope > .catalog-examples")?.children.length).toBeGreaterThan(0);
    expect(row.getAttribute("aria-labelledby")).toBe(header?.querySelector("h3")?.id);
   }
  }
  for(const id of ["typography-scale","typography-tracking","typography-editorial","type-reading-title","browser-navigation","compact-filter-toolbar","quiet-editor","quiet-confirmation"]){
   expect(container.querySelectorAll("#"+id),id).toHaveLength(1);
  }
  const identity=container.querySelector("#identity") as HTMLElement;
  expect(within(identity).getAllByRole("img",{name:"Vanya Arc / UI"})).toHaveLength(4);
  expect(container.querySelector("#identity-logo")).toHaveAttribute("data-layout","wide");
  expect(container.querySelector("#typography-editorial")).toHaveAttribute("data-layout","wide");
 });
});
