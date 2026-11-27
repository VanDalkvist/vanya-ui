import React from "react";
import {describe,it,expect,vi} from "vitest";
import {render,screen,fireEvent,cleanup} from "@testing-library/react";
import {ActionButton,SearchField,TextField,SelectField,VersionLabel,Tag,ActionLink,FilterSelect} from "../src/index";
import {afterEach} from "vitest";

afterEach(cleanup);
describe("Quiet control behavior",()=>{
 it("clears the real query and restores input focus",()=>{
  function Example(){const [value,setValue]=React.useState("Поиск");return <SearchField label="Поиск" value={value} onValueChange={setValue}/>}
  render(<Example/>);
  fireEvent.click(screen.getByRole("button",{name:"Очистить поиск"}));
  expect(screen.getByRole("searchbox",{name:"Поиск"})).toHaveValue("");
  expect(screen.getByRole("searchbox",{name:"Поиск"})).toHaveFocus();
 });
 it("does not expose mutation for disabled and readonly search",()=>{
  render(<><SearchField label="Disabled" value="a" onValueChange={()=>{}} disabled/><SearchField label="Readonly" value="b" onValueChange={()=>{}} readOnly/></>);
  expect(screen.queryByRole("button",{name:"Очистить поиск"})).not.toBeInTheDocument();
 });
 it("preserves caller validation descriptions and real labels",()=>{
  render(<><p id="external-hint">Внешняя подсказка</p><TextField id="name" label="Название" error="Ошибка" aria-describedby="external-hint"/><SelectField label="Жанр" options={[{value:"a",label:"Первый"}]}/></>);
  const field=screen.getByLabelText("Название");
  expect(field).toHaveAttribute("aria-invalid","true");
  expect(field).toHaveAccessibleDescription("Внешняя подсказка Ошибка");
  expect(screen.getByRole("combobox",{name:"Жанр"})).toBeInTheDocument();
 });
 it("keeps persistent pressed state and guards unavailable commands",()=>{
  const click=vi.fn();
  render(<><ActionButton aria-pressed={true}>Активно</ActionButton><ActionButton aria-disabled="true" onClick={click}>Недоступно</ActionButton><ActionButton actionState="pending" onClick={click}>Ожидание</ActionButton><ActionButton variant="prominent" onClick={click}>Подтвердить</ActionButton></>);
  expect(screen.getByRole("button",{name:"Активно"})).toHaveAttribute("aria-pressed","true");
  fireEvent.click(screen.getByRole("button",{name:"Недоступно"}));
  fireEvent.click(screen.getByRole("button",{name:/Ожидание/}));
  expect(click).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button",{name:"Подтвердить"}));
  expect(click).toHaveBeenCalledTimes(1);
 });
 it("reserves a stable indicator slot only for actions declaring execution state",()=>{
  const {rerender}=render(<ActionButton actionState="idle">Выполнить</ActionButton>);
  const slot=screen.getByRole("button",{name:"Выполнить"}).querySelector(".ui-action-indicator-slot");
  expect(slot).not.toBeNull();
  rerender(<ActionButton actionState="pending">Выполнить</ActionButton>);
  expect(screen.getByRole("button",{name:/Выполнить/}).querySelector(".ui-action-indicator-slot")).toBe(slot);
  expect(slot?.querySelector(".ui-action-indicator-pending")).not.toBeNull();
  rerender(<ActionButton actionState="success">Выполнить</ActionButton>);
  expect(screen.getByRole("button",{name:/Выполнить/}).querySelector(".ui-action-indicator-slot")).toBe(slot);
  rerender(<ActionButton>Выполнить</ActionButton>);
  expect(screen.getByRole("button",{name:"Выполнить"}).querySelector(".ui-action-indicator-slot")).toBeNull();
 });
 it("keeps passive tags and explicit toggle buttons semantically separate",()=>{
  const click=vi.fn();
  render(<><Tag>наблюдение</Tag><ActionButton aria-pressed onClick={click}>Фильтр</ActionButton></>);
  const passive=screen.getByText("наблюдение");
  expect(passive.tagName).toBe("SPAN");
  expect(passive).not.toHaveClass("ui-size");
  expect(passive.querySelector(".ui-tag-marker")).toHaveAttribute("aria-hidden","true");
  const active=screen.getByRole("button",{name:"Фильтр"});
  expect(active).toHaveAttribute("aria-pressed","true");fireEvent.click(active);expect(click).toHaveBeenCalledOnce();
 });
 it("derives exactly one new-tab indicator from the actual target",()=>{
  render(<><ActionLink href="/reference/navigation.md" target="_blank">Правила</ActionLink><ActionLink href="/#catalog">Каталог</ActionLink></>);
  expect(screen.getByRole("link",{name:"Правила"}).querySelectorAll(".ui-new-tab-marker")).toHaveLength(1);
  expect(screen.getByRole("link",{name:"Каталог"}).querySelector(".ui-new-tab-marker")).toBeNull();
 });
 it("derives visible toggle labels from caller-owned pressed state and preserves accessible name",()=>{
  function Demo(){const [on,setOn]=React.useState(false);return <ActionButton aria-pressed={on} pressedLabels={{on:"Вкл",off:"Выкл"}} onClick={()=>setOn(v=>!v)}>Автообновление</ActionButton>}
  render(<Demo/>);
  const button=screen.getByRole("button",{name:"Автообновление"});
  const slot=button.querySelector(".ui-action-toggle-state")!;
  expect(slot).toHaveAttribute("aria-hidden","true");
  expect(slot.querySelector('[data-current="true"]')).toHaveTextContent("Выкл");
  fireEvent.click(button);
  expect(button).toHaveAttribute("aria-pressed","true");
  expect(slot.querySelector('[data-current="true"]')).toHaveTextContent("Вкл");
  expect(slot.querySelector('[data-current="false"]')).toHaveTextContent("Выкл");
  expect(screen.getByRole("button",{name:"Автообновление"})).toBe(button);
 });
 it("reserves validation geometry without announcing an empty description",()=>{
  const {rerender,container}=render(<TextField label="Название" reserveNote/>);
  const input=screen.getByLabelText("Название"),note=container.querySelector(".ui-text-field-note-reserved");
  expect(note).not.toBeNull();expect(input).not.toHaveAttribute("aria-describedby");
  rerender(<TextField label="Название" reserveNote error="Введите название"/>);
  expect(container.querySelector(".ui-text-field-note-reserved")).toBe(note);
  expect(input).toHaveAccessibleDescription("Введите название");
  rerender(<TextField label="Название" reserveNote/>);
  expect(input).not.toHaveAttribute("aria-describedby");
  expect(container.querySelector(".ui-text-field-note-reserved")).toBe(note);
 });
 it("keeps property selection functional with independent presentation semantics",()=>{
  function Demo(){const [value,setValue]=React.useState("a");return <><FilterSelect purpose="property" label="Статус" value={value} allowEmpty={false} onValueChange={setValue} options={[{value:"a",label:"В работе"},{value:"b",label:"Готово"}]}/><output>{value}</output></>}
  const {container}=render(<Demo/>);
  const button=screen.getByRole("button",{name:"Статус В работе"});
  expect(button.closest(".ui-filter-select")).toHaveAttribute("data-purpose","property");
  fireEvent.click(button);fireEvent.click(screen.getByRole("option",{name:"Готово"}));
  expect(container.querySelector("output")).toHaveTextContent("b");
  expect(screen.getByRole("button",{name:"Статус Готово"})).toBe(button);
  expect(button).toHaveFocus();
 });
 it("renders passive caller-owned full SemVer",()=>{
  render(<VersionLabel version="1.2.3-beta.1+build.42"/>);
  const version=screen.getByText("v1.2.3-beta.1+build.42");
  expect(version.tagName).toBe("SPAN");
  expect(version).not.toHaveAttribute("tabindex");
  expect(version).toHaveAttribute("data-ui-version","1.2.3-beta.1+build.42");
 });
});
