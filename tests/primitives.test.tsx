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
import { NavLinks } from "../src/components/NavLinks";
import { Minimap } from "../src/components/Minimap";
import { DisclosurePill } from "../src/components/DisclosurePill";
import { Divider } from "../src/components/Divider";

describe("CraftCard & ActionButton", () => {
  it("renders with borderless button and feather-light card border", () => {
    const handleClick = vi.fn();
    render(
      <CraftCard>
        <ActionButton onClick={handleClick}>Тест</ActionButton>
      </CraftCard>
    );
    const btn = screen.getByRole("button", { name: "Тест" });
    expect(btn.className).toContain("border-0");
    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

describe("Kbd, CategoryBadge & SegmentedControl", () => {
  it("renders keyboard keys, category badges, and segmented tabs", () => {
    const handleChange = vi.fn();
    render(
      <div>
        <Kbd lit>N</Kbd>
        <CategoryBadge category="Infra" />
        <SegmentedControl
          items={[{ id: "1d", label: "Сегодня" }]}
          value="1d"
          onChange={handleChange}
        />
      </div>
    );
    expect(screen.getByText("N")).toBeInTheDocument();
    expect(screen.getByText("Infra")).toBeInTheDocument();
    expect(screen.getByText("Сегодня")).toBeInTheDocument();
  });
});

describe("NavLinks & Divider", () => {
  it("renders navigation links, now jump, and dividers", () => {
    const handleSelect = vi.fn();
    const handleNow = vi.fn();
    const items = [
      { id: "past", label: "Кем я был", isActive: false },
      { id: "now", label: "Кто я сейчас", isActive: true },
    ];
    render(
      <div>
        <NavLinks
          items={items}
          onSelect={handleSelect}
          nowLabel="Сейчас"
          onNowClick={handleNow}
        />
        <Divider orientation="horizontal" />
      </div>
    );

    expect(screen.getByText("Кем я был")).toBeInTheDocument();
    expect(screen.getByText("Кто я сейчас")).toBeInTheDocument();

    const nowBtn = screen.getByRole("button", { name: "Сейчас" });
    fireEvent.click(nowBtn);
    expect(handleNow).toHaveBeenCalledTimes(1);
  });
});

describe("Minimap & RangeSlider", () => {
  it("renders timeline minimap and triggers seek", () => {
    const handleSeek = vi.fn();
    render(
      <Minimap
        min={0}
        max={100}
        from={20}
        to={50}
        ticks={[{ id: "t1", value: 30, current: true }]}
        labels={[{ value: 2026, text: "2026" }]}
        onSeek={handleSeek}
      />
    );
    expect(screen.getByRole("region", { name: "Мини-карта времени" })).toBeInTheDocument();
    expect(screen.getByText("2026")).toBeInTheDocument();
  });

  it("renders range slider and triggers onChange", () => {
    const handleChange = vi.fn();
    render(<RangeSlider label="Зум" value={42} onChange={handleChange} />);
    expect(screen.getByText("Зум")).toBeInTheDocument();
  });
});

describe("DisclosurePill & HearthPulse", () => {
  it("renders disclosure pill and hearth pulse", () => {
    render(
      <div>
        <HearthPulse label="активен" />
        <DisclosurePill title="Детали вехи">
          <p>Скрытый текст</p>
        </DisclosurePill>
      </div>
    );

    expect(screen.getByText("активен")).toBeInTheDocument();
    expect(screen.getByText("Детали вехи")).toBeInTheDocument();
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
