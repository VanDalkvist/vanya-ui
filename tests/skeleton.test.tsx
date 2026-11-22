import React from "react";
import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {describe,it,expect} from "vitest";
import {render,screen} from "@testing-library/react";
import {Skeleton,SkeletonText,LoadingRegion,MediaCardSkeleton} from "../src/index";

describe("Vanya UI loading states",()=>{
 it("announces one state and leaves every child placeholder silent",()=>{
  const {container}=render(<LoadingRegion label="Загружаем фильмы">
   <MediaCardSkeleton/><MediaCardSkeleton layout="row"/><Skeleton shape="circle"/>
  </LoadingRegion>);
  expect(screen.getAllByRole("status")).toHaveLength(1);
  expect(screen.getByRole("status")).toHaveTextContent("Загружаем фильмы");
  expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument();
  expect(container.querySelectorAll(".ui-skeleton").length).toBeGreaterThan(6);
  expect(container.querySelectorAll('a,button,input,[tabindex]')).toHaveLength(0);
  expect(container.querySelectorAll('.ui-media-card-skeleton[aria-hidden="true"]')).toHaveLength(2);
 });
 it("exposes shapes and configurable dimensions without fake content",()=>{
  const {container}=render(<><Skeleton shape="circle" width={40} height={40} motion="none"/><SkeletonText lines={3} widths={["95%","73%","54%"]}/></>);
  const first=container.querySelector(".ui-skeleton");
  expect(first).toHaveAttribute("aria-hidden","true");
  expect(first).toHaveAttribute("data-shape","circle");
  expect(first).toHaveAttribute("data-motion","none");
  expect(first).toHaveStyle({width:"40px",height:"40px"});
  expect(container.querySelectorAll(".ui-skeleton-text .ui-skeleton")).toHaveLength(3);
 });
 it("has both media orientations using the same UI geometry",()=>{
  const {container}=render(<><MediaCardSkeleton layout="poster"/><MediaCardSkeleton layout="row"/></>);
  expect(container.querySelectorAll(".ui-media-card")).toHaveLength(2);
  expect(container.querySelector('.ui-media-card[data-layout="row"]')).toBeInTheDocument();
  expect(container.querySelectorAll(".ui-media-card-artwork")).toHaveLength(2);
 });
 it("follows motion, high contrast, source tokens and pattern docs",()=>{
  const root=resolve(import.meta.dirname,"..");
  const css=readFileSync(resolve(root,"src/tokens.css"),"utf8");
  const guide=readFileSync(resolve(root,"docs/patterns/loading-states.md"),"utf8");
  expect(css).toContain('prefers-reduced-motion: reduce');
  expect(css).toContain('.ui-skeleton[data-motion="pulse"]{animation:none;}');
  expect(css).toContain('forced-colors: active');
  expect(css).toContain("var(--surface-inset)");
  expect(guide).toContain("aria-busy");
  expect(guide).toContain("Повторить");
  expect(guide).toContain("ui.vanya-arc.dev/#loading-states");
 });
});
