import React from "react";
import {describe,it,expect,vi} from "vitest";
import {render,screen,fireEvent,cleanup} from "@testing-library/react";
import {ActionButton,SearchField,TextField,SelectField,VersionLabel} from "../src/index";
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
 it("renders passive caller-owned full SemVer",()=>{
  render(<VersionLabel version="1.2.3-beta.1+build.42"/>);
  const version=screen.getByText("v1.2.3-beta.1+build.42");
  expect(version.tagName).toBe("SPAN");
  expect(version).not.toHaveAttribute("tabindex");
  expect(version).toHaveAttribute("data-ui-version","1.2.3-beta.1+build.42");
 });
});
