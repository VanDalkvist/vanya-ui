import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { InspectDrawer, ReceiptDigestModal, TimelinePreviewCard } from "../src";

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

  it("opens a named receipt dialog, exposes the actual changes and restores its opener on dismissal", () => {
    function Example() {
      const [open, setOpen] = React.useState(false);
      return <><button onClick={() => setOpen(true)}>Показать итоги</button>
        <ReceiptDigestModal isOpen={open} title="Итоги" narrative="Работа завершена."
          receipts={["Обновили пример"]} onClose={() => setOpen(false)} /></>;
    }
    const priorOverflow = document.body.style.overflow;
    render(<Example />);
    const opener = screen.getByRole("button", {name:"Показать итоги"});
    for (const dismissal of ["escape", "button", "cancel"]) {
      opener.focus();
      fireEvent.click(opener);
      const dialog = screen.getByRole("dialog", {name:"Итоги"});
      expect(dialog).toHaveAttribute("aria-modal","true");
      expect(within(dialog).getByText("Обновили пример")).toBeVisible();
      const close = within(dialog).getByRole("button",{name:"Закрыть окно"});
      expect(close).toHaveFocus();
      expect(document.body.style.overflow).toBe("hidden");
      if(dismissal==="escape") fireEvent.keyDown(dialog,{key:"Escape"});
      else if(dismissal==="cancel") fireEvent(dialog,new Event("cancel",{bubbles:false,cancelable:true}));
      else fireEvent.click(close);
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(opener).toHaveFocus();
      expect(document.body.style.overflow).toBe(priorOverflow);
    }
  });
});
