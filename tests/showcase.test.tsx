import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { InspectDrawer, TimelinePreviewCard } from "../src";

afterEach(cleanup);

describe("reference composition interactions", () => {
  it("exposes an interactive preview as a keyboard-accessible native button", () => {
    const open = vi.fn();
    render(<TimelinePreviewCard date="ноябрь 2026" title="Открытое пространство" onClick={open} />);
    const preview = screen.getByRole("button", { name: /Открытое пространство/ });
    expect(preview.tagName).toBe("BUTTON");
    fireEvent.click(preview);
    expect(open).toHaveBeenCalledOnce();
  });

  it("names its dialog, closes on Escape, and restores focus to the opener", () => {
    function Composition() {
      const [open, setOpen] = React.useState(false);
      return <><button onClick={() => setOpen(true)}>Открыть деталь</button>
        <InspectDrawer isOpen={open} title="Выбранный момент" onClose={() => setOpen(false)}>
          <p>Подробности появляются по запросу.</p><button>Второе действие</button>
        </InspectDrawer></>;
    }
    render(<Composition />);
    const trigger = screen.getByRole("button", { name: "Открыть деталь" });
    trigger.focus();
    fireEvent.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "Выбранный момент" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(within(dialog).getByText("Подробности появляются по запросу.")).toBeVisible();
    expect(dialog.contains(document.activeElement)).toBe(true);
    fireEvent.keyDown(dialog, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
