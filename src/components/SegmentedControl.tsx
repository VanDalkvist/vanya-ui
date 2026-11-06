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
  disabled?: boolean;
  "aria-label"?: string;
}

export function SegmentedControl<T extends string = string>({
  items,
  value,
  onChange,
  className,
  size = "md",
  disabled = false,
  "aria-label": ariaLabel,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      data-size={size === "xs" ? "sm" : size}
      className={twMerge(
        clsx(
          "ui-size ui-segments inline-flex w-fit max-w-full self-start shrink-0 items-center rounded-full border border-border bg-surface-raised/60 font-sans select-none backdrop-blur-xs",
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
            role="tab"
            disabled={disabled}
            aria-selected={isSelected}
            onClick={() => onChange(item.id)}
            className={clsx(
              "inline-flex items-center rounded-full border-0 bg-transparent transition-all duration-200",
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
