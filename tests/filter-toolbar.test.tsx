import React from "react";
import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {describe,it,expect,vi} from "vitest";
import {render,screen,fireEvent} from "@testing-library/react";
import {SelectField,SearchField,SegmentedControl} from "../src/index";

describe("compact inline filters",()=>{
 it("keeps a visible label and native keyboard-selectable options in toolbar mode",()=>{
  const onChange=vi.fn();
  render(<SelectField density="toolbar" label="Жанр" value="drama"
   onChange={onChange} options={[{value:"drama",label:"Драма"},{value:"comedy",label:"Комедия"}]}/>);
  const control=screen.getByRole("combobox",{name:"Жанр"});
  expect(control.closest(".ui-select-field")).toHaveAttribute("data-density","toolbar");
  expect(screen.getByText("Жанр")).toBeVisible();
  fireEvent.change(control,{target:{value:"comedy"}});
  expect(onChange).toHaveBeenCalledOnce();
 });
 it("keeps the search clear affordance and filter scope's pressed state",()=>{
  const onSearch=vi.fn(),onScope=vi.fn();
  render(<>
   <SearchField density="toolbar" value="Верн" onValueChange={onSearch} label="Поиск"/>
   <SegmentedControl density="toolbar" size="md" semantics="filters" aria-label="Подборка" value="mine" onChange={onScope}
    items={[{id:"all",label:"Все"},{id:"mine",label:"Мои"}]}/>
  </>);
  expect(screen.getByRole("search")).toHaveAttribute("data-density","toolbar");
  expect(screen.getByRole("group",{name:"Подборка"})).toHaveAttribute("data-density","toolbar");
  expect(screen.getByRole("button",{name:"Мои"})).toHaveAttribute("aria-pressed","true");
  fireEvent.click(screen.getByRole("button",{name:"Очистить поиск"}));
  expect(onSearch).toHaveBeenCalledWith("");
  fireEvent.click(screen.getByRole("button",{name:"Все"}));
  expect(onScope).toHaveBeenCalledWith("all");
 });
 it("uses Vanya UI semantic variables and identical 40px toolbar heights",()=>{
  const css=readFileSync(resolve(import.meta.dirname,"../src/tokens.css"),"utf8");
  expect(css).toContain('.ui-select-field[data-density="toolbar"]');
  expect(css).toContain('.ui-search-field[data-density="toolbar"]');
  expect(css).toContain('.ui-segments[data-density="toolbar"]');
  expect(css).toContain("height:40px");
  expect(css).toContain("var(--surface)");
  expect(css).toContain("var(--border)");
 });
});
