import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { Badge, EnergyRadar, SpiderRadar, SegmentedControl, useTheme } from "../src";
import { Sparkles, HeartHandshake } from "lucide-react";
import { ComponentCatalog } from "../src/showcase/ComponentCatalog";

afterEach(cleanup);

describe("approved showcase refinements", () => {
  it("renders caller-provided category identity", () => {
    const { container } = render(<Badge label="Creative" icon={Sparkles} style={{color:"#654321",backgroundColor:"#eeeeee"}} />);
    expect(screen.getByText("Creative")).toBeVisible();
    expect(container.querySelector("svg.lucide-sparkles")).not.toBeNull();
    expect(screen.queryByText("#")).not.toBeInTheDocument();
  });

  it("renders only explicit radar identity and gives arbitrary categories the same fallback", () => {
    const {container,rerender}=render(<EnergyRadar items={[
      {id:"life_harness",label:"Life",count:2,percentage:40},
      {id:"custom",label:"Custom",count:3,percentage:60,color:"#123456",icon:HeartHandshake},
    ]}/>);
    const life=container.querySelector('[title="Life: 40% (2)"]') as HTMLElement;
    expect(life.style.backgroundColor).toBe("var(--accent)");
    expect(container.querySelectorAll("svg.lucide-heart-handshake")).toHaveLength(1);
    const custom=container.querySelector('[title="Custom: 60% (3)"]') as HTMLElement;
    expect(custom.style.backgroundColor).toBe("rgb(18, 52, 86)");
    rerender(<SpiderRadar axes={[{label:"Life",value:40},{label:"Custom",value:60,icon:HeartHandshake,textColor:"#123456"},{label:"Third",value:25}]}/>);
    expect(container.querySelectorAll("svg.lucide-heart-handshake")).toHaveLength(1);
    expect(screen.getByText("Life (40%)")).not.toHaveAttribute("style");
    expect(screen.getByText("Custom (60%)")).toHaveStyle({fill:"#123456"});
    expect(screen.getByText("Third (25%)")).toBeInTheDocument();
  });

  it("keeps selection working through the last segment", () => {
    function Example() {
      const [value, setValue] = React.useState("day");
      return <SegmentedControl semantics="filters" items={[{ id: "day", label: "День" }, { id: "month", label: "Месяц" }]} value={value} onChange={setValue} />;
    }
    render(<Example />);
    const month = screen.getByRole("button", { name: "Месяц" });
    const day = screen.getByRole("button", { name: "День" });
    expect(screen.queryByRole("tab")).not.toBeInTheDocument();
    expect(month).toHaveAttribute("aria-pressed", "false");
    expect(day).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(month);
    expect(month).toHaveAttribute("aria-pressed", "true");
    expect(day).toHaveAttribute("aria-pressed", "false");
  });

  it("synchronizes separate theme controls on the same page", () => {
    function Controls() {
      const first = useTheme();
      const second = useTheme();
      return <><button onClick={() => first.setTheme("dark")}>Change theme</button><output>{second.theme}</output></>;
    }
    render(<Controls />);
    fireEvent.click(screen.getByRole("button", { name: "Change theme" }));
    expect(screen.getByText("dark")).toBeVisible();
    expect(document.documentElement).toHaveClass("dark");
  });

  it("gives every component its own catalogue row and keeps badge states together", () => {
    render(<ComponentCatalog />);
    for (const name of ["WorkspaceSplit", "ScrollRegion", "SectionToolbar", "WorkspaceActionBar", "WorkspaceEmptyState", "ActionButton", "Kbd", "ShortcutKeys", "NavLinks", "Divider", "AvatarLink", "SegmentedControl", "RangeSlider", "Minimap", "Badge", "Статусы", "Tag", "Disclosure", "LinkChip", "CraftCard", "Карточка проекта", "EnergyRadar", "SpiderRadar", "HearthPulse", "VoiceWaveIndicator", "InspectDrawer", "ReceiptDigestModal", "ThemeToggle", "SineWave"]) {
      expect(screen.getByRole("region", { name })).toBeInTheDocument();
    }
    const badges = screen.getByRole("region", { name: "Badge" });
    for (const label of ["Creative", "Life", "Product", "Infra"]) expect(within(badges).getAllByText(label)).toHaveLength(2);
  });
});
