import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { CraftCard } from "../src/components/CraftCard";
import { MeshStatusBadge } from "../src/components/MeshStatusBadge";
import { InspectDrawer } from "../src/components/InspectDrawer";
import { ReceiptDigestModal } from "../src/components/ReceiptDigestModal";
import { ActionButton } from "../src/components/ActionButton";
import { OfferCard } from "../src/components/OfferCard";
import { ThemeToggle } from "../src/components/ThemeToggle";

describe("CraftCard", () => {
  it("renders children and applies default craft classes", () => {
    render(<CraftCard>Test Content</CraftCard>);
    const el = screen.getByText("Test Content");
    expect(el).toBeInTheDocument();
    expect(el.className).toContain("bg-surface");
    expect(el.className).toContain("border-hairline");
  });

  it("handles custom className and onClick", () => {
    const handleClick = vi.fn();
    render(
      <CraftCard className="custom-class" onClick={handleClick}>
        Clickable Card
      </CraftCard>
    );
    const el = screen.getByText("Clickable Card");
    fireEvent.click(el);
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(el.className).toContain("custom-class");
  });
});

describe("MeshStatusBadge", () => {
  it("renders status text and online indicator", () => {
    render(<MeshStatusBadge status="online" label="gbrain serve" />);
    expect(screen.getByText("gbrain serve")).toBeInTheDocument();
    const dot = screen.getByTestId("status-dot");
    expect(dot.className).toContain("bg-emerald-400");
  });

  it("renders amber indicator for standby or warning", () => {
    render(<MeshStatusBadge status="standby" label="sherpa standby" />);
    const dot = screen.getByTestId("status-dot");
    expect(dot.className).toContain("bg-amber-400");
  });
});

describe("ActionButton", () => {
  it("renders with micro-radius and handles click", () => {
    const handleClick = vi.fn();
    render(<ActionButton onClick={handleClick}>Действие</ActionButton>);
    const btn = screen.getByRole("button", { name: "Действие" });
    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(btn.className).toContain("rounded-xs");
  });

  it("respects disabled state", () => {
    const handleClick = vi.fn();
    render(
      <ActionButton disabled onClick={handleClick}>
        Отключено
      </ActionButton>
    );
    const btn = screen.getByRole("button", { name: "Отключено" });
    fireEvent.click(btn);
    expect(handleClick).not.toHaveBeenCalled();
    expect(btn).toBeDisabled();
  });
});

describe("InspectDrawer", () => {
  it("renders title and content when open", () => {
    render(
      <InspectDrawer isOpen={true} title="Инспектор сервисов" onClose={vi.fn()}>
        <div>Содержимое инспектора</div>
      </InspectDrawer>
    );
    expect(screen.getByText("Инспектор сервисов")).toBeInTheDocument();
    expect(screen.getByText("Содержимое инспектора")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const handleClose = vi.fn();
    render(
      <InspectDrawer isOpen={true} title="Инспектор" onClose={handleClose}>
        <div>Body</div>
      </InspectDrawer>
    );
    const closeBtn = screen.getByRole("button", { name: "Закрыть инспектор" });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("does not render when isOpen is false", () => {
    render(
      <InspectDrawer isOpen={false} title="Скрыт" onClose={vi.fn()}>
        <div>Body</div>
      </InspectDrawer>
    );
    expect(screen.queryByText("Скрыт")).not.toBeInTheDocument();
  });
});

describe("ReceiptDigestModal", () => {
  it("renders narrative and receipts list when open", () => {
    render(
      <ReceiptDigestModal
        isOpen={true}
        title="Выжимка вчерашнего дня"
        narrative="Костёр обновлен до v1.0.0."
        receipts={["salon-presence: v1.0.0", "vanya-ui: tokens init"]}
        onClose={vi.fn()}
      />
    );
    expect(screen.getByText("Выжимка вчерашнего дня")).toBeInTheDocument();
    expect(screen.getByText(/Костёр обновлен до v1.0.0/)).toBeInTheDocument();
    expect(screen.getByText("salon-presence: v1.0.0")).toBeInTheDocument();
  });
});

describe("OfferCard", () => {
  it("renders offer with SDT tags and action button", () => {
    const handlePick = vi.fn();
    render(
      <OfferCard
        title="Собрать tokens.css"
        description="Зафиксировать OKLCH палитру"
        autonomy="5/5"
        competence="5/5"
        actionLabel="Взять на стол"
        onAction={handlePick}
      />
    );
    expect(screen.getByText("Собрать tokens.css")).toBeInTheDocument();
    expect(screen.getByText(/Автономия/)).toBeInTheDocument();
    expect(screen.getByText(/Мастерство/)).toBeInTheDocument();

    const btn = screen.getByRole("button", { name: "Взять на стол" });
    fireEvent.click(btn);
    expect(handlePick).toHaveBeenCalledTimes(1);
  });
});

describe("ThemeToggle", () => {
  it("renders segmented options and allows toggling", () => {
    render(<ThemeToggle variant="segmented" />);
    const lightBtn = screen.getByRole("button", { name: "Светлая" });
    const darkBtn = screen.getByRole("button", { name: "Тёмная" });
    expect(lightBtn).toBeInTheDocument();
    expect(darkBtn).toBeInTheDocument();

    fireEvent.click(lightBtn);
    expect(document.documentElement.classList.contains("light")).toBe(true);
  });

  it("renders icon toggle variant and toggles theme", () => {
    render(<ThemeToggle variant="icon" />);
    const btn = screen.getByRole("button");
    fireEvent.click(btn);
    // Toggled theme
    expect(document.documentElement.dataset.theme).toBeDefined();
  });
});
