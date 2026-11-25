import React from "react";
import {afterEach,expect,it,vi} from "vitest";
import {cleanup,fireEvent,render,screen} from "@testing-library/react";
import {CraftCard} from "../src";

afterEach(cleanup);

it("requires a real handler and honors an explicit opt-out",()=>{
 const click=vi.fn();
 const {rerender}=render(<CraftCard isInteractive>Карточка</CraftCard>);
 const passive=screen.getByText("Карточка");
 expect(passive).not.toHaveAttribute("role","button");
 expect(passive).not.toHaveAttribute("tabindex");
 expect(passive).not.toHaveClass("cursor-pointer");
 rerender(<CraftCard isInteractive={false} onClick={click}>Карточка</CraftCard>);
 fireEvent.click(passive);
 fireEvent.keyDown(passive,{key:"Enter"});
 expect(click).not.toHaveBeenCalled();
 expect(passive).not.toHaveClass("cursor-pointer");
 expect(passive).not.toHaveAttribute("role","button");
 expect(passive).not.toHaveAttribute("tabindex");
 rerender(<CraftCard onClick={click}>Карточка</CraftCard>);
 expect(screen.getByRole("button",{name:"Карточка"})).toHaveAttribute("tabindex","0");
 expect(passive).toHaveClass("cursor-pointer");
 fireEvent.click(passive);
 expect(click).toHaveBeenCalledTimes(1);
});

it("activates an actionable card once per pointer, Enter and Space",()=>{
 const click=vi.fn();
 render(<CraftCard isInteractive onClick={click}>Открыть</CraftCard>);
 const card=screen.getByRole("button",{name:"Открыть"});
 card.focus();
 expect(card).toHaveFocus();
 fireEvent.click(card);
 fireEvent.keyDown(card,{key:"Enter"});
 fireEvent.keyDown(card,{key:" "});
 fireEvent.keyDown(card,{key:" ",repeat:true});
 expect(click).toHaveBeenCalledTimes(3);
 expect(card).toHaveFocus();
});

it("honors consumer prevention and leaves independent nested actions alone",()=>{
 const parent=vi.fn(),child=vi.fn(),link=vi.fn();
 render(<CraftCard onClick={parent} onKeyDown={e=>{if(e.key==="Enter")e.preventDefault()}}>
  <span>Содержимое</span><button type="button" onClick={child}><span>Вложенное действие</span></button>
  <a href="#detail" onClick={e=>{e.preventDefault();link()}}>Детали</a>
 </CraftCard>);
 const card=screen.getByText("Содержимое").parentElement!;
 fireEvent.keyDown(card,{key:"Enter"});
 expect(parent).not.toHaveBeenCalled();
 const nested=screen.getByText("Вложенное действие");
 fireEvent.click(nested);
 fireEvent.keyDown(nested,{key:" "});
 fireEvent.click(screen.getByRole("link",{name:"Детали"}));
 expect(child).toHaveBeenCalledTimes(1);
 expect(link).toHaveBeenCalledTimes(1);
 expect(parent).not.toHaveBeenCalled();
 fireEvent.click(screen.getByText("Содержимое"));
 expect(parent).toHaveBeenCalledTimes(1);
});
