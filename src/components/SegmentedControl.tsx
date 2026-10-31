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
          "inline-flex items-center gap-0.5 rounded-xs border border-hairline bg-surface p-0.5 font-mono text-xs select-none",
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
              "inline-flex items-center gap-1.5 rounded-xs transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber",
              size === "xs" ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-xs",
              isSelected
                ? "bg-surface-raised text-amber font-medium shadow-xs"
                : "text-ink-soft hover:bg-surface-raised/50 hover:text-ink"
            )}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.count !== undefined && (
              <span
                className={clsx(
                  "rounded-xs px-1 py-0.2 text-[9px] font-mono",
                  isSelected ? "bg-amber/15 text-amber" : "bg-ground text-ink-faint"
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
