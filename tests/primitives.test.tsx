import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { CraftCard } from "../src/components/CraftCard";
import { MeshStatusBadge } from "../src/components/MeshStatusBadge";
import { InspectDrawer } from "../src/components/InspectDrawer";
import { ActionButton } from "../src/components/ActionButton";
import { ThemeToggle } from "../src/components/ThemeToggle";
import { Kbd } from "../src/components/Kbd";
import { CategoryBadge } from "../src/components/CategoryBadge";
import { SegmentedControl } from "../src/components/SegmentedControl";
import { RangeSlider } from "../src/components/RangeSlider";
import { HearthPulse } from "../src/components/HearthPulse";

describe("CraftCard", () => {
  it("renders children with surface styling and feather-light border", () => {
    render(<CraftCard>Card content</CraftCard>);
    const el = screen.getByText("Card content");
    expect(el).toBeInTheDocument();
    expect(el.className).toContain("bg-surface");
    expect(el.className).toContain("border-border");
  });
});

describe("Kbd", () => {
  it("retains clean border and supports lit active state", () => {
    const { rerender } = render(<Kbd>Esc</Kbd>);
    const el = screen.getByText("Esc");
    expect(el).toBeInTheDocument();
    expect(el.className).toContain("border-border");

    rerender(<Kbd lit>Esc</Kbd>);
    expect(el.className).toContain("text-accent");
    expect(el.className).toContain("border-accent/60");
  });
});

describe("CategoryBadge", () => {
  it("renders borderless pill with category colors", () => {
    render(<CategoryBadge category="Creative" />);
    const el = screen.getByText("Creative");
    expect(el).toBeInTheDocument();
    expect(screen.getByText("#")).toBeInTheDocument();
  });
});

describe("SegmentedControl", () => {
  it("switches selection smoothly without individual button borders", () => {
    const handleChange = vi.fn();
    const items = [
      { id: "1d", label: "Сегодня", count: 2 },
      { id: "7d", label: "Неделя", count: 5 },
    ];
    render(<SegmentedControl items={items} value="1d" onChange={handleChange} />);

    expect(screen.getByText("Сегодня")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();

    const weekBtn = screen.getByRole("tab", { name: /Неделя/ });
    fireEvent.click(weekBtn);
    expect(handleChange).toHaveBeenCalledWith("7d");
  });
});

describe("RangeSlider", () => {
  it("renders minimal slider and triggers onChange", () => {
    const handleChange = vi.fn();
    render(<RangeSlider label="Зум" value={50} onChange={handleChange} />);
    expect(screen.getByText("Зум")).toBeInTheDocument();
    const slider = screen.getByRole("slider");
    expect(slider).toBeInTheDocument();
  });
});

describe("HearthPulse", () => {
  it("renders pulsing ember dot with label", () => {
    render(<HearthPulse label="очаг горит" />);
    expect(screen.getByText("очаг горит")).toBeInTheDocument();
  });
});

describe("ActionButton (Borderless by default)", () => {
  it("renders borderless typographic button matching life-wave", () => {
    const handleClick = vi.fn();
    render(<ActionButton onClick={handleClick}>Войти</ActionButton>);
    const btn = screen.getByRole("button", { name: "Войти" });
    expect(btn.className).toContain("border-0");
    expect(btn.className).toContain("bg-transparent");
    expect(btn.className).toContain("hover:text-accent");

    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

describe("InspectDrawer & ThemeToggle", () => {
  it("drawer handles close and theme toggle switches theme", () => {
    const handleClose = vi.fn();
    render(
      <InspectDrawer isOpen={true} title="Инспектор" onClose={handleClose}>
        <div>Body</div>
      </InspectDrawer>
    );
    expect(screen.getByText("Инспектор")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Закрыть инспектор" }));
    expect(handleClose).toHaveBeenCalledTimes(1);

    render(<ThemeToggle variant="segmented" />);
    expect(screen.getByRole("button", { name: "Светлая" })).toBeInTheDocument();
  });
});
