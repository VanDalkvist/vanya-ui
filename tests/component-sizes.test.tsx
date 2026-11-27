import React from "react";
import { afterEach, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Badge, SegmentedControl } from "../src";

afterEach(cleanup);

it("accepts both canonical Badge sizes without losing identity", () => {
  render(<><Badge label="Life" size="sm" /><Badge label="Life" size="md" /></>);
  const labels = screen.getAllByText("Life");
  expect(labels[0].parentElement).toHaveAttribute("data-size", "sm");
  expect(labels[1].parentElement).toHaveAttribute("data-size", "md");
});

it("normalizes the old xs segmented size to the shared compact size", () => {
  render(<SegmentedControl items={[{ id: "one", label: "Первый" }]} value="one" onChange={() => {}} size="xs" />);
  expect(screen.getByRole("group")).toHaveAttribute("data-size", "sm");
});
