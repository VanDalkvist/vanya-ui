import React from "react";
import { afterEach, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { CategoryBadge, SegmentedControl } from "../src";

afterEach(cleanup);

it("accepts both canonical CategoryBadge sizes without losing identity", () => {
  render(<><CategoryBadge category="life_harness" size="sm" /><CategoryBadge category="life_harness" size="md" /></>);
  const labels = screen.getAllByText("Life");
  expect(labels[0].parentElement).toHaveAttribute("data-size", "sm");
  expect(labels[1].parentElement).toHaveAttribute("data-size", "md");
});

it("normalizes the old xs segmented size to the shared compact size", () => {
  render(<SegmentedControl items={[{ id: "one", label: "Первый" }]} value="one" onChange={() => {}} size="xs" />);
  expect(screen.getByRole("tablist")).toHaveAttribute("data-size", "sm");
});
