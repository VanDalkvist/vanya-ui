import React from "react";
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ActionButton, Badge, Tag } from "../src";

afterEach(cleanup);

it("keeps metadata passive even if an accidental handler is supplied",()=>{
 const click=vi.fn();
 const accidental={onClick:click,tabIndex:0};
 render(<><Tag {...accidental}>Тема</Tag><Badge {...accidental} label="Доступен" tone="success" detail="42 мс"/></>);
 const tag=screen.getByText("Тема"),badge=screen.getByText("Доступен").closest(".ui-badge")!;
 expect(tag.tagName).toBe("SPAN");expect(badge.tagName).toBe("SPAN");
 expect(tag).not.toHaveAttribute("tabindex");expect(badge).not.toHaveAttribute("tabindex");
 expect(screen.queryByRole("button")).not.toBeInTheDocument();
 expect(badge).toHaveTextContent("42 мс");
 expect(badge.querySelector(".ui-badge-dot")).toHaveAttribute("aria-hidden","true");
 fireEvent.click(tag);fireEvent.click(badge);expect(click).not.toHaveBeenCalled();
});

it("keeps every status readable independently of its decorative color",()=>{
 render(<><Badge label="Доступен" tone="success"/><Badge label="Ожидание" tone="pending"/><Badge label="Внимание" tone="warning"/><Badge label="Недоступен" tone="error"/></>);
 for(const label of ["Доступен","Ожидание","Внимание","Недоступен"]){
  const node=screen.getByText(label);expect(node).toBeVisible();
  expect(node.closest(".ui-badge")?.querySelector(".ui-badge-dot")).toHaveAttribute("aria-hidden","true");
 }
});

it("uses an explicit native toggle for actual selection",()=>{
 function Example(){
  const [selected,setSelected]=React.useState(false);
  return <><ActionButton aria-pressed={selected} onClick={()=>setSelected(v=>!v)}>Фильтр</ActionButton><output>{selected?"Выбран":"Не выбран"}</output></>;
 }
 render(<Example/>);const button=screen.getByRole("button",{name:"Фильтр"});
 fireEvent.click(button);expect(button).toHaveAttribute("aria-pressed","true");expect(screen.getByText("Выбран")).toBeVisible();
});

it("uses an explicit command adjacent to a passive status",()=>{
 function Example(){
  const [open,setOpen]=React.useState(false);
  return <><Badge tone="success" label="Доступен"/><ActionButton onClick={()=>setOpen(true)}>Открыть статус</ActionButton>{open&&<p>Сервис работает</p>}</>;
 }
 render(<Example/>);fireEvent.click(screen.getByRole("button",{name:"Открыть статус"}));expect(screen.getByText("Сервис работает")).toBeVisible();
});
