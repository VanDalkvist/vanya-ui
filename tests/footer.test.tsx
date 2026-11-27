import React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { ShowcaseFooter } from "../src/showcase/ShowcaseFooter";

afterEach(cleanup);

describe("longread footer",()=>{
  it("closes with brand attribution and grouped utility links, not a second section menu",()=>{
    render(<ShowcaseFooter/>);
    const footer=screen.getByRole("contentinfo");
    expect(within(footer).getByRole("link",{name:"Vanya Arc / UI — к началу страницы"})).toHaveAttribute("href","/#composition");
    expect(within(footer).getByText("React-компоненты и правила интерфейсов.")).toBeInTheDocument();
    const nav=within(footer).getByRole("navigation",{name:"Ссылки проекта"});
    expect(within(nav).getAllByRole("link")).toHaveLength(4);
    expect(within(nav).getByRole("link",{name:"Исходники"})).toHaveAttribute("href","https://github.com/VanDalkvist/vanya-ui");
    expect(within(nav).getByRole("link",{name:"Документация"})).toHaveAttribute("href","/reference/components.md");
    expect(within(nav).getByRole("link",{name:"Бренд"})).toHaveAttribute("href","https://github.com/VanDalkvist/vanya-arc-brand");
    expect(within(nav).getByRole("link",{name:"Лицензии"})).toHaveAttribute("href","/reference/licensing.md");
    expect(within(footer).getByRole("link",{name:"Ваня Афанасов"})).toHaveAttribute("href","https://vanya-arc.dev");
    expect(within(footer).getByRole("link",{name:/Наверх/})).toHaveAttribute("href","/#composition");
    expect(within(footer).queryByText(/На основе Синусоиды/)).not.toBeInTheDocument();
  });
  it("keeps focus visible, restrained spacing, and mobile link wrapping",()=>{
    const css=readFileSync(resolve(import.meta.dirname,"../src/showcase/showcase.css"),"utf8");
    expect(css).toContain(".showcase-footer-main { display:flex;");
    expect(css).toContain(".showcase-footer-links { display:grid; grid-template-columns:repeat(2,minmax(0,1fr));");
    expect(css).toContain(".showcase-footer :is(a):not(.ui-action-link):focus-visible");
    expect(css).toContain("border-top:1px solid var(--border)");
  });
});
