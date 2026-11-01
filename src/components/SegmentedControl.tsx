import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
  size?: "sm" | "xs";
}

export function SegmentedControl<T extends string = string>({
  items,
  value,
  onChange,
  className,
  size = "xs",
}: SegmentedControlProps<T>) {
  return (
    <div
      role="tablist"
      className={twMerge(
        clsx(
          "inline-flex items-center gap-0.5 rounded-full border border-border bg-surface-raised/60 p-0.5 font-sans select-none backdrop-blur-xs",
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
            aria-selected={isSelected}
            onClick={() => onChange(item.id)}
            className={clsx(
              "inline-flex items-center gap-1.5 rounded-full border-0 bg-transparent transition-all duration-200 cursor-pointer",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent",
              size === "xs" ? "px-2.5 py-1 text-[11px]" : "px-3.5 py-1.5 text-xs",
              isSelected
                ? "bg-surface text-accent font-medium shadow-xs"
                : "text-ink-soft/75 hover:text-ink hover:bg-surface/40"
            )}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.count !== undefined && (
              <span
                className={clsx(
                  "rounded-full px-1.5 py-0.2 text-[9px] font-mono",
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
