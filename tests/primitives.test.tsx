import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { CraftCard } from "../src/components/CraftCard";
import { ActionButton } from "../src/components/ActionButton";
import { Kbd } from "../src/components/Kbd";
import { CategoryBadge } from "../src/components/CategoryBadge";
import { SegmentedControl } from "../src/components/SegmentedControl";
import { RangeSlider } from "../src/components/RangeSlider";
import { HearthPulse } from "../src/components/HearthPulse";
import { NavLinks } from "../src/components/NavLinks";
import { Minimap } from "../src/components/Minimap";
import { DisclosurePill } from "../src/components/DisclosurePill";
import { Divider } from "../src/components/Divider";
import { AvatarLink } from "../src/components/AvatarLink";
import { LinkChip } from "../src/components/LinkChip";
import { Tag } from "../src/components/Tag";
import { TimelinePreviewCard } from "../src/components/TimelinePreviewCard";
import { EventCard } from "../src/components/EventCard";

describe("Base Primitives", () => {
  it("renders CraftCard, ActionButton, Kbd, and Badges", () => {
    const handleClick = vi.fn();
    render(
      <CraftCard>
        <ActionButton onClick={handleClick}>Войти</ActionButton>
        <Kbd lit>Esc</Kbd>
        <CategoryBadge category="Creative" />
        <Tag>#тег</Tag>
      </CraftCard>
    );
    const btn = screen.getByRole("button", { name: "Войти" });
    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Esc")).toBeInTheDocument();
    expect(screen.getByText("Creative")).toBeInTheDocument();
    expect(screen.getByText("#тег")).toBeInTheDocument();
  });
});

describe("Navigation & Sliders", () => {
  it("renders NavLinks, Minimap, and RangeSlider", () => {
    const handleSelect = vi.fn();
    const handleSeek = vi.fn();
    render(
      <div>
        <NavLinks
          items={[{ id: "s1", label: "Раздел 1" }]}
          onSelect={handleSelect}
        />
        <Minimap min={0} max={100} from={10} to={40} onSeek={handleSeek} />
        <RangeSlider value={50} onChange={vi.fn()} />
        <Divider />
      </div>
    );
    expect(screen.getByText("Раздел 1")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Мини-карта времени" })).toBeInTheDocument();
    expect(screen.getByRole("slider")).toBeInTheDocument();
  });
});

describe("Timeline Cards & Chips", () => {
  it("renders AvatarLink, LinkChip, and TimelinePreviewCard", () => {
    render(
      <div>
        <AvatarLink src="/test.jpg" alt="Ваня" href="https://example.com" />
        <LinkChip url="https://github.com" label="репозиторий" />
        <TimelinePreviewCard date="23 окт" title="Костёр" />
      </div>
    );
    expect(screen.getByTitle("Ваня")).toBeInTheDocument();
    expect(screen.getByText("репозиторий")).toBeInTheDocument();
    expect(screen.getByText("Костёр")).toBeInTheDocument();
  });

  it("renders EventCard with title, date, links, and close handler", () => {
    const handleClose = vi.fn();
    render(
      <EventCard
        date="23 ОКТ 2026"
        title="Цифровой созерцательный костёр"
        description="Экран групповой практики присутствия."
        links={[{ url: "https://t.me/channel", label: "канал" }]}
        tags={["созерцание", "звук"]}
        onClose={handleClose}
      />
    );
    expect(screen.getByText("23 ОКТ 2026")).toBeInTheDocument();
    expect(screen.getByText("Цифровой созерцательный костёр")).toBeInTheDocument();
    expect(screen.getByText("Экран групповой практики присутствия.")).toBeInTheDocument();
    expect(screen.getByText("канал")).toBeInTheDocument();
    expect(screen.getByText("созерцание")).toBeInTheDocument();

    const closeBtn = screen.getByRole("button", { name: "Закрыть" });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
