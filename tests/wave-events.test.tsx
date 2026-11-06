import React from "react";
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { EnergyRadar, EventPoint, SineWave, TimelineEvent } from "../src";
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

it("renders changed geometry from real inputs and ignores invalid/offscreen controls", () => {
  const { container, rerender } = render(<SineWave events={[{ id: "one", position: .3, weight: 2 }]} />);
  const before = container.querySelector(".wave-past")!.getAttribute("d");
  expect(container.querySelectorAll("[data-ghost=one] circle").length).toBeGreaterThan(2);
  rerender(<SineWave origin={137} events={[{ id: "invalid", position: NaN, current: true }, { id: "offscreen", position: -2, label: "Hidden", onClick: () => {} }]} />);
  const after = container.querySelector(".wave-past")!.getAttribute("d");
  expect(after).not.toBe(before);
  expect(after).not.toContain("NaN");
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});

it("uses the shared segmented control for radar periods and disables a passive selector", () => {
  const periods = [{ id: "day", label: "День" }, { id: "week", label: "Неделя" }];
  const change = vi.fn();
  const { rerender } = render(<EnergyRadar items={[]} horizons={periods} activeHorizon="day" onHorizonChange={change} />);
  expect(screen.getByRole("tablist", { name: "Период" })).toHaveAttribute("data-size", "sm");
  fireEvent.click(screen.getByRole("tab", { name: "Неделя" }));
  expect(change).toHaveBeenCalledWith("week");
  rerender(<EnergyRadar items={[]} horizons={periods} activeHorizon="week" />);
  expect(screen.getByRole("tab", { name: "Неделя" })).toBeDisabled();
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
