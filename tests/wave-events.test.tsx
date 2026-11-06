import React from "react";
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { EventPoint, TimelineEvent } from "../src";
import { createWaveGeometry, pointRadius } from "../src/wave-geometry";
import reference from "./fixtures/arc-wave-reference.json";

afterEach(cleanup);

it("matches actual source wave and ghost coordinates at different viewport sizes", () => {
  for (const frame of reference.frames) {
    const geometry = createWaveGeometry(frame.width, frame.height, { origin: frame.origin });
    for (const point of frame.points) {
      const actual = geometry.pointAt(point.position);
      expect(actual.x).toBeCloseTo(point.x, 8);
      expect(actual.y).toBeCloseTo(point.y, 8);
    }
    for (const point of frame.ghost) {
      const actual = geometry.branchAt(.35, point.dx, -1, .43);
      expect(actual.x).toBeCloseTo(point.x, 8);
      expect(actual.y).toBeCloseTo(point.y, 8);
    }
    expect(geometry.branchAt(.35, 0, -1, .43)).toEqual(geometry.pointAt(.35));
  }
});

it("preserves all four source event weights and focus-dependent radii", () => {
  for (const point of reference.radii) expect(pointRadius({ weight: point.weight as 1|2|3|4, focus: point.focus })).toBeCloseTo(point.value, 8);
});

it("keeps a standalone point passive unless an action exists", () => {
  const action = vi.fn();
  render(<><EventPoint label="Метка" weight={1} /><EventPoint label="Открыть событие" weight={4} onClick={action} /></>);
  expect(screen.getByRole("img", { name: "Метка" })).toBeVisible();
  const button = screen.getByRole("button", { name: "Открыть событие" });
  expect(button.tagName).toBe("BUTTON");
  fireEvent.click(button);
  expect(action).toHaveBeenCalledTimes(1);
});

it("gives point and card one native action without nested buttons", () => {
  const action = vi.fn();
  render(<TimelineEvent date="Пример" title="Описание события" weight={3} onClick={action} />);
  const button = screen.getByRole("button", { name: /Описание события/ });
  expect(screen.getAllByRole("button")).toHaveLength(1);
  expect(button.querySelector("button")).toBeNull();
  fireEvent.click(screen.getByText("Описание события"));
  expect(action).toHaveBeenCalledTimes(1);
});
