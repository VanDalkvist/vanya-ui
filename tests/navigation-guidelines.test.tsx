import React from "react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { NavigationGuideline } from "../src/showcase/NavigationGuideline";

describe("Browser navigation guideline", () => {
  it("is a distinct directly loadable HTML entrypoint", () => {
    const html = readFileSync(resolve(import.meta.dirname, "..", "guidelines/navigation/index.html"), "utf8");
    expect(html).toContain('src="/src/showcase/navigation-main.tsx"');
    expect(html).toContain("<title>Навигация и URL");
  });

  it("explains the contract and uses native links throughout the reference", () => {
    render(<NavigationGuideline />);
    expect(screen.getByRole("heading", { level: 1, name: "У каждой страницы — свой адрес." })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Принципы" })).toHaveAttribute("href", "/guidelines/navigation/");
    expect(screen.getByRole("link", { name: "Принципы" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "К компонентам" })).toHaveAttribute("href", "/#catalog");
    expect(screen.getByRole("heading", { name: "Что обязан проверить агент перед сдачей" })).toBeInTheDocument();
  });
});
