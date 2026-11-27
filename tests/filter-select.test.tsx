import React from "react";
import {describe,it,expect,vi} from "vitest";
import {render,screen,fireEvent} from "@testing-library/react";
import {FilterSelect} from "../src/index";

const options=[{value:"drama",label:"Драма"},{value:"comedy",label:"Комедия"},{value:"science",label:"Научная фантастика"}];
describe("FilterSelect custom popup",()=>{
 it("renders a controlled trigger, opens a Vanya UI listbox portal and selects",()=>{
  const onValueChange=vi.fn();
  render(<FilterSelect label="Жанр" value="drama" options={options} onValueChange={onValueChange}/>);
  const trigger=screen.getByRole("button",{name:"Жанр Драма"});
  expect(trigger).toHaveAttribute("aria-expanded","false");
  expect(trigger).toHaveAccessibleName("Жанр Драма");
  expect(trigger.textContent).toContain("Жанр: Драма");
  expect(trigger.querySelector(".ui-filter-select-label [aria-hidden=true]")).toHaveTextContent(":");
  fireEvent.click(trigger);
  expect(trigger).toHaveAttribute("aria-expanded","true");
  expect(document.querySelector(".ui-filter-select-panel")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("option",{name:"Комедия"}));
  expect(onValueChange).toHaveBeenCalledWith("comedy");
  expect(trigger).toHaveAttribute("aria-expanded","false");
 });
 it("separates pointer opening, selected check and keyboard position",()=>{
  const onValueChange=vi.fn();
  render(<FilterSelect label="Жанр" value="drama" options={options} onValueChange={onValueChange}/>);
  const trigger=screen.getByRole("button",{name:"Жанр Драма"});
  fireEvent.click(trigger,{detail:1});
  const selected=screen.getByRole("option",{name:"Драма"});
  expect(selected).toHaveAttribute("aria-selected","true");
  expect(selected.querySelector(".lucide-check")).not.toBeNull();
  expect(selected).not.toHaveAttribute("data-active");
  const list=screen.getByRole("listbox");
  fireEvent.keyDown(list,{key:"ArrowDown"});
  const next=screen.getByRole("option",{name:"Комедия"});
  expect(next).toHaveAttribute("data-active","true");
  expect(next).toHaveAttribute("aria-selected","false");
  expect(selected).toHaveAttribute("aria-selected","true");
  expect(list).toHaveAttribute("aria-activedescendant",next.id);
  fireEvent.keyDown(list,{key:"Enter"});
  expect(onValueChange).toHaveBeenCalledWith("comedy");
  expect(trigger).toHaveFocus();
  fireEvent.keyDown(trigger,{key:"ArrowDown"});
  expect(screen.getByRole("option",{name:"Драма"})).toHaveAttribute("data-active","true");
  fireEvent.keyDown(screen.getByRole("listbox"),{key:"Escape"});
  expect(trigger).toHaveFocus();
 });
 it("filters a long tag list with an input and preserves the empty option",()=>{
  const onValueChange=vi.fn();
  render(<FilterSelect label="ML тег" value="" searchable options={options} onValueChange={onValueChange}/>);
  fireEvent.click(screen.getByRole("button",{name:"ML тег Все"}));
  const search=screen.getByRole("searchbox",{name:"Поиск по вариантам: ML тег"});
  fireEvent.change(search,{target:{value:"фантастика"}});
  expect(screen.getByRole("option",{name:"Научная фантастика"})).toBeInTheDocument();
  expect(screen.queryByRole("option",{name:"Драма"})).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("option",{name:"Научная фантастика"}));
  expect(onValueChange).toHaveBeenCalledWith("science");
 });
 it("supports keyboard selection and Escape",()=>{
  const onValueChange=vi.fn();
  render(<FilterSelect label="Тип" value="drama" options={options} onValueChange={onValueChange}/>);
  const trigger=screen.getByRole("button",{name:"Тип Драма"});
  fireEvent.keyDown(trigger,{key:"ArrowDown"});
  const listbox=screen.getByRole("listbox",{name:"Тип"});
  fireEvent.keyDown(listbox,{key:"ArrowDown"});
  fireEvent.keyDown(listbox,{key:"Enter"});
  expect(onValueChange).toHaveBeenCalled();
  fireEvent.click(trigger);
  fireEvent.keyDown(screen.getByRole("listbox",{name:"Тип"}),{key:"Escape"});
  expect(trigger).toHaveAttribute("aria-expanded","false");
 });
 it("uses portal and preserves native SelectField as a separate component",()=>{
  render(<div data-testid="wrap"><FilterSelect label="Порядок" value="" options={options} onValueChange={()=>{}}/></div>);
  fireEvent.click(screen.getByRole("button",{name:"Порядок Все"}));
  expect(document.querySelector(".ui-filter-select-panel")?.parentElement).toBe(document.body);
  expect(document.querySelector(".ui-filter-select-panel select")).toBeNull();
 });
});
