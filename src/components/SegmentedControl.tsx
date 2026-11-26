import React, { useEffect, useRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ComponentSize } from "../sizes";

export interface SegmentItem<T extends string = string> {
  id: T;
  label: string;
  count?: number;
  icon?: React.ReactNode;
  disabled?: boolean;
}

/** A real tab must reference a matching tabpanel via aria-controls/aria-labelledby. */
export interface TabSegmentItem<T extends string = string> extends SegmentItem<T> {
  tabId: string;
  panelId: string;
}

interface SegmentedControlCommonProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  className?: string;
  /** xs remains a legacy alias for sm. */
  size?: ComponentSize | "xs";
  /** Matches compact filter toolbar form controls rather than standalone tabs. */
  density?: "default" | "toolbar";
  disabled?: boolean;
  "aria-label"?: string;
}

/** Filters are the safe default. Explicit tabs require real panel IDs. */
export type SegmentedControlProps<T extends string = string> =
  SegmentedControlCommonProps<T> & (
    | { semantics?: "filters"; items: SegmentItem<T>[] }
    | { semantics: "tabs"; items: TabSegmentItem<T>[] }
  );

export function SegmentedControl<T extends string = string>(props: SegmentedControlProps<T>) {
  const {
    items,
    value,
    onChange,
    className,
    size = "md",
    density = "default",
    disabled = false,
    "aria-label": ariaLabel,
  } = props;
  const tabs = props.semantics === "tabs";
  const rootRef = useRef<HTMLDivElement>(null);
  const enabledItems = items.filter((item) => !item.disabled);
  const tabStop = enabledItems.some((item) => item.id === value)
    ? value : enabledItems[0]?.id;

  // The owner renders the panels from value. Request recovery once per
  // invalid value/fallback pair; never silently select a different panel.
  const fallback = tabs && !disabled && tabStop !== value ? tabStop : undefined;
  const requestedRecovery = useRef<{value: T; fallback: T} | null>(null);
  useEffect(() => {
    if (fallback === undefined) {
      requestedRecovery.current = null;
      return;
    }
    if (requestedRecovery.current?.value === value &&
        requestedRecovery.current.fallback === fallback) return;
    requestedRecovery.current = {value, fallback};
    onChange(fallback);
  }, [fallback, value, onChange]);

  function handleTabKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, id: T) {
    if (!tabs || disabled || !enabledItems.length) return;
    const index = enabledItems.findIndex((item) => item.id === id);
    const key = event.key;
    const nextIndex = key === "Home" ? 0
      : key === "End" ? enabledItems.length - 1
      : key === "ArrowRight" ? (index + 1) % enabledItems.length
      : key === "ArrowLeft" ? (index + enabledItems.length - 1) % enabledItems.length
      : -1;
    if (nextIndex < 0) return;
    event.preventDefault();
    const nextId = enabledItems[nextIndex].id;
    const buttons = Array.from(rootRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? []);
    buttons.find((button) => button.dataset.segmentId === nextId)?.focus();
    // Automatic activation: consumers must keep the panels mounted or instantly available.
    if (nextId !== value) onChange(nextId);
  }

  return (
    <div
      ref={rootRef}
      role={tabs ? "tablist" : "group"}
      aria-label={ariaLabel}
      aria-orientation={tabs ? "horizontal" : undefined}
      aria-disabled={disabled || undefined}
      data-size={size === "xs" ? "sm" : size}
      data-density={density}
      className={twMerge(clsx(
        "ui-size ui-segments inline-flex w-fit max-w-full self-start shrink-0 items-center font-sans select-none",
        className
      ))}
    >
      {items.map((item) => {
        const isSelected = value === item.id;
        const unavailable = disabled || item.disabled;
        const tab = tabs ? (item as TabSegmentItem<T>) : undefined;
        return (
          <button
            key={item.id}
            id={tab?.tabId}
            data-segment-id={item.id}
            type="button"
            role={tabs ? "tab" : undefined}
            disabled={unavailable}
            tabIndex={tabs ? (item.id === tabStop && !disabled ? 0 : -1) : undefined}
            aria-controls={tab?.panelId}
            aria-selected={tabs ? isSelected : undefined}
            aria-pressed={tabs ? undefined : isSelected}
            onKeyDown={(event) => handleTabKeyDown(event, item.id)}
            onClick={() => { if (!unavailable) onChange(item.id); }}
            className={clsx(
              "ui-feedback-segment inline-flex items-center border-0 bg-transparent rounded-sm font-medium",
              unavailable ? "cursor-default opacity-35" : "cursor-pointer",
              isSelected
                ? "text-accent"
                : "text-ink-soft"
            )}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.count !== undefined && (
              <span className={clsx(
                "px-1.5 font-mono tabular-nums",
                isSelected ? "text-accent" : "text-ink-soft"
              )}>
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
