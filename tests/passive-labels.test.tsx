import React from "react";
import { afterEach, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MeshStatusBadge, Tag } from "../src";

afterEach(cleanup);

it("renders a passive service status as a label, not a dead button", () => {
  render(<MeshStatusBadge status="online" label="Доступен" />);
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
  expect(screen.getByText("Доступен").closest("button")).toBeNull();
});

it("renders an actionable tag as a native toggle button", () => {
  function Example() {
    const [selected, setSelected] = React.useState(false);
    return <><Tag onClick={() => setSelected(!selected)} isActive={selected}>Фильтр</Tag><output>{selected ? "Выбран" : "Не выбран"}</output></>;
  }
  render(<Example />);
  const tag = screen.getByRole("button", { name: "Фильтр" });
  expect(tag.tagName).toBe("BUTTON");
  fireEvent.click(tag);
  expect(tag).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByText("Выбран")).toBeVisible();
});

it("keeps a status actionable when an action is supplied", () => {
  function Example() {
    const [open, setOpen] = React.useState(false);
    return <><MeshStatusBadge status="online" label="Открыть статус" onClick={() => setOpen(true)} />{open && <p>Сервис работает</p>}</>;
  }
  render(<Example />);
  fireEvent.click(screen.getByRole("button", { name: "Открыть статус" }));
  expect(screen.getByText("Сервис работает")).toBeVisible();
});
