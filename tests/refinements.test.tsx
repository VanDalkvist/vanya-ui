import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { CategoryBadge, EnergyRadar, SegmentedControl } from "../src";
import { ComponentCatalog } from "../src/showcase/ComponentCatalog";

afterEach(cleanup);

describe("approved showcase refinements", () => {
  it("renders Farm's canonical harness identity rather than a raw ID and hash", () => {
    const { container } = render(<CategoryBadge category="creative_harness" />);
    expect(screen.getByText("Creative")).toBeVisible();
    expect(container.querySelector("svg.lucide-sparkles")).not.toBeNull();
    expect(screen.queryByText("#")).not.toBeInTheDocument();
  });

  it("uses Farm icons/colors in radar while preserving custom item color", () => {
    const { container } = render(<EnergyRadar items={[
      { id: "life_harness", label: "Life", count: 2, percentage: 40 },
      { id: "custom", label: "Custom", count: 3, percentage: 60, color: "#123456" },
    ]} />);
    expect(container.querySelector("svg.lucide-heart-handshake")).not.toBeNull();
    const life = container.querySelector('[title="Life: 40% (2)"]') as HTMLElement;
    expect(life.style.backgroundColor).toBe("var(--harness-life)");
    const custom = container.querySelector('[title="Custom: 60% (3)"]') as HTMLElement;
    expect(custom.style.backgroundColor).toBe("rgb(18, 52, 86)");
  });

  it("keeps selection working through the last segment", () => {
    function Example() {
      const [value, setValue] = React.useState("day");
      return <SegmentedControl items={[{ id: "day", label: "День" }, { id: "month", label: "Месяц" }]} value={value} onChange={setValue} />;
    }
    render(<Example />);
    fireEvent.click(screen.getByRole("tab", { name: "Месяц" }));
    expect(screen.getByRole("tab", { name: "Месяц" })).toHaveAttribute("aria-selected", "true");
  });

  it("gives every component its own catalogue row and keeps badge states together", () => {
    render(<ComponentCatalog />);
    for (const name of ["ActionButton", "Kbd", "NavLinks", "Divider", "AvatarLink", "SegmentedControl", "RangeSlider", "Minimap", "CategoryBadge", "MeshStatusBadge", "Tag", "DisclosurePill", "LinkChip", "CraftCard", "DeskSlotCard", "OfferCard", "EnergyRadar", "SpiderRadar", "HearthPulse", "VoiceWaveIndicator", "InspectDrawer", "ReceiptDigestModal", "ThemeToggle", "SineWave"]) {
      expect(screen.getByRole("region", { name, exact: true })).toBeInTheDocument();
    }
    const badges = screen.getByRole("region", { name: "CategoryBadge", exact: true });
    for (const label of ["Creative", "Life", "Product", "Infra"]) expect(within(badges).getByText(label)).toBeVisible();
  });
});
