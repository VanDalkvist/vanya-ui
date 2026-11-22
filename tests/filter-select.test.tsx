import React from "react";
import {describe,it,expect,vi} from "vitest";
import {render,screen,fireEvent} from "@testing-library/react";
import {FilterSelect} from "../src/index";

const options=[{value:"drama",label:"Драма"},{value:"comedy",label:"Комедия"},{value:"science",label:"Научная фантастика"}];
describe("FilterSelect custom popup",()=>{
 it("renders a controlled trigger, opens a Vanya UI listbox portal and selects",()=>{
  const onValueChange=vi.fn();
  render(<FilterSelect label="Жанр" value="drama" options={options} onValueChange={onValueChange}/>);
  const trigger=screen.getByRole("button",{name:"Жанр: Драма"});
  expect(trigger).toHaveAttribute("aria-expanded","false");
  fireEvent.click(trigger);
  expect(trigger).toHaveAttribute("aria-expanded","true");
  expect(document.querySelector(".ui-filter-select-panel")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("option",{name:"Комедия"}));
  expect(onValueChange).toHaveBeenCalledWith("comedy");
  expect(trigger).toHaveAttribute("aria-expanded","false");
 });
 it("filters a long tag list with an input and preserves the empty option",()=>{
  const onValueChange=vi.fn();
  render(<FilterSelect label="ML тег" value="" searchable options={options} onValueChange={onValueChange}/>);
  fireEvent.click(screen.getByRole("button",{name:"ML тег: Все"}));
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
  const trigger=screen.getByRole("button",{name:"Тип: Драма"});
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
  fireEvent.click(screen.getByRole("button",{name:"Порядок: Все"}));
  expect(document.querySelector(".ui-filter-select-panel")?.parentElement).toBe(document.body);
  expect(document.querySelector(".ui-filter-select-panel select")).toBeNull();
 });
});
