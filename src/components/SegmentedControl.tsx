import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ComponentSize } from "../sizes";

export interface SegmentItem<T extends string = string> {
  id: T;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface SegmentedControlProps<T extends string = string> {
  items: SegmentItem<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  /** xs remains a legacy alias for sm. */
  size?: ComponentSize | "xs";
  /** Matches compact filter toolbar form controls rather than standalone tabs. */
  density?: "default" | "toolbar";
  disabled?: boolean;
  /** Use filters for in-place data filtering; tabs for actual tab panels (default). */
  semantics?: "tabs" | "filters";
  "aria-label"?: string;
}

export function SegmentedControl<T extends string = string>({
  items,
  value,
  onChange,
  className,
  size = "md",
  density = "default",
  disabled = false,
  semantics = "tabs",
  "aria-label": ariaLabel,
}: SegmentedControlProps<T>) {
  return (
    <div
      role={semantics === "tabs" ? "tablist" : "group"}
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      data-size={size === "xs" ? "sm" : size}
      data-density={density}
      className={twMerge(
        clsx(
          "ui-size ui-segments inline-flex w-fit max-w-full self-start shrink-0 items-center border border-border bg-surface-raised/60 font-sans select-none backdrop-blur-xs",
          density==="toolbar"?"":"rounded-full",
          className
        )
      )}
    >
      {items.map((item) => {
        const isSelected = value === item.id;
        return (
          <button
            key={item.id}
            type="button"
            role={semantics === "tabs" ? "tab" : undefined}
            disabled={disabled}
            aria-selected={semantics === "tabs" ? isSelected : undefined}
            aria-pressed={semantics === "filters" ? isSelected : undefined}
            onClick={() => onChange(item.id)}
            className={clsx(
              "inline-flex items-center border-0 bg-transparent transition-all duration-200",
              density==="toolbar"?"":"rounded-full",
              disabled ? "cursor-default opacity-35" : "cursor-pointer",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent",
              isSelected
                ? "bg-surface text-accent font-medium shadow-xs"
                : disabled ? "text-ink-soft" : "text-ink-soft hover:text-ink hover:bg-surface/40"
            )}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.count !== undefined && (
              <span
                className={clsx(
                  "rounded-full px-1.5 font-mono",
                  isSelected ? "bg-accent/15 text-accent" : "bg-ground/60 text-ink-faint"
                )}
              >
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
