import React from "react";
import {afterEach,describe,expect,it,vi} from "vitest";
import {cleanup,fireEvent,render,screen} from "@testing-library/react";
import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {ActionButton,CraftCard,Minimap} from "../src";
import {ComponentCatalog} from "../src/showcase/ComponentCatalog";

const css=()=>readFileSync(resolve(import.meta.dirname,"../src/tokens.css"),"utf8");
afterEach(cleanup);

describe("press feedback and genuine action semantics",()=>{
 it("supplies instant, distinct pressed feedback without changing hover/selected into success",()=>{
  const s=css();
  expect(s).toContain("--ui-feedback-pressed-fill");
  expect(s).toContain("transition-duration:0ms");
  expect(s).toContain('.ui-action-button:not([data-variant="prominent"]):not(:disabled):not([aria-disabled="true"]):active');
  expect(s).toContain('.ui-action-button[data-variant="prominent"]:not(:disabled):not([aria-disabled="true"]):active');
  expect(s).toContain(".ui-feedback-nav:not([aria-disabled=\"true\"]):active");
  expect(s).toContain(".ui-search-field-clear:active");
  expect(s).toContain(".ui-filter-select-trigger:not(:disabled):active");
  expect(s).toContain(".ui-action-indicator-pending{animation:none;}");
 });
 it("does not fabricate a result, protects a pending action from duplicate clicks and retains focusability",()=>{
  const handle=vi.fn();
  const {rerender}=render(<ActionButton onClick={handle}>Сохранить</ActionButton>);
  let button=screen.getByRole("button",{name:"Сохранить"});
  expect(button).toHaveAttribute("data-action-state","idle");
  expect(button).not.toHaveAttribute("aria-busy");
  fireEvent.click(button);
  expect(handle).toHaveBeenCalledTimes(1);
  expect(button).toHaveAttribute("data-action-state","idle");

  rerender(<ActionButton onClick={handle} actionState="pending" statusLabel="Сохраняем запись">Сохранить</ActionButton>);
  button=screen.getByRole("button",{name:/Сохранить/});
  expect(button).toHaveAttribute("aria-disabled","true");
  expect(button).toHaveAttribute("aria-busy","true");
  expect(button).not.toBeDisabled();
  expect(screen.getByRole("status")).toHaveTextContent("Сохраняем запись");
  expect(button.querySelector(".ui-action-indicator-pending")).toBeInTheDocument();
  fireEvent.click(button);
  expect(handle).toHaveBeenCalledTimes(1);

  rerender(<ActionButton onClick={handle} actionState="success">Сохранить</ActionButton>);
  button=screen.getByRole("button",{name:/Сохранить/});
  expect(button).not.toHaveAttribute("aria-disabled");
  expect(screen.getByRole("status")).toHaveTextContent("Выполнено");
  fireEvent.click(button);
  expect(handle).toHaveBeenCalledTimes(2);
  rerender(<ActionButton actionState="error">Сохранить</ActionButton>);
  expect(screen.getByRole("status")).toHaveTextContent("Действие не удалось");
 });
 it("does not pretend an unbound CraftCard is actionable; activates wired cards with Enter or Space",()=>{
  const handle=vi.fn();
  const {rerender}=render(<CraftCard isInteractive>Описание</CraftCard>);
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
  expect(screen.getByText("Описание")).not.toHaveClass("cursor-pointer");
  rerender(<CraftCard onClick={handle}>Действие</CraftCard>);
  const card=screen.getByRole("button",{name:"Действие"});
  expect(card).toHaveAttribute("tabindex","0");
  expect(card).toHaveClass("ui-feedback-pressable");
  fireEvent.keyDown(card,{key:"Enter"});
  fireEvent.keyDown(card,{key:" "});
  expect(handle).toHaveBeenCalledTimes(2);
  fireEvent.click(card);
  expect(handle).toHaveBeenCalledTimes(3);
 });
 it("composes a passive card with independent native actions",()=>{
  const open=vi.fn(),park=vi.fn();
  render(<CraftCard><h3>Новый проект</h3><ActionButton onClick={open}>Открыть проект</ActionButton><ActionButton onClick={park}>Запарковать</ActionButton></CraftCard>);
  expect(screen.getAllByRole("button")).toHaveLength(2);
  fireEvent.click(screen.getByRole("button",{name:"Открыть проект"}));
  expect(open).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole("button",{name:"Запарковать"}));
  expect(park).toHaveBeenCalledTimes(1);expect(open).toHaveBeenCalledTimes(1);
 });
 it("makes Minimap seek available by keyboard rather than relying on pointer-only clicks",()=>{
  const seek=vi.fn();
  render(<Minimap min={0} max={100} from={10} to={40} onSeek={seek}/>);
  const slider=screen.getByRole("slider",{name:"Перейти по временной шкале"});
  expect(slider).toHaveAttribute("tabindex","0");
  expect(slider).toHaveAttribute("aria-valuenow","25");
  fireEvent.keyDown(slider,{key:"ArrowRight"});
  expect(seek).toHaveBeenLastCalledWith(30);
  fireEvent.keyDown(slider,{key:"Home"});
  expect(seek).toHaveBeenLastCalledWith(0);
  fireEvent.keyDown(slider,{key:"End"});
  expect(seek).toHaveBeenLastCalledWith(100);
 });
 it("exhibits actual pending, error and success state changes in the showcase",()=>{
  render(<ComponentCatalog/>);
  expect(screen.getByRole("region",{name:"Press / pending / result"})).toBeInTheDocument();
  const trigger=screen.getByRole("button",{name:"Отправить тестовое действие"});
  fireEvent.click(trigger);
  expect(trigger).toHaveAttribute("data-action-state","pending");
  expect(trigger).toHaveAttribute("aria-disabled","true");
  expect(screen.getByText(/повторный клик заблокирован/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button",{name:"Вернуть ошибку"}));
  expect(trigger).toHaveAttribute("data-action-state","error");
  expect(screen.getByText(/Тестовый результат: ошибка/)).toBeInTheDocument();
  fireEvent.click(trigger);
  expect(trigger).toHaveAttribute("data-action-state","pending");
  fireEvent.click(screen.getByRole("button",{name:"Подтвердить успех"}));
  expect(trigger).toHaveAttribute("data-action-state","success");
  expect(screen.getByText(/Тестовый результат: выполнено/)).toBeInTheDocument();
 });
});
