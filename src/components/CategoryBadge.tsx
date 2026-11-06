import React from "react";
import { Hash } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { getHarnessType } from "../harness";
import type { ComponentSize } from "../sizes";

export type CategoryType = "Creative" | "Infra" | "Life" | "Product";

export interface CategoryBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  category: CategoryType | string;
  size?: ComponentSize;
  className?: string;
}

export function CategoryBadge({ category, size = "md", className, style, ...props }: CategoryBadgeProps) {
  const harness = getHarnessType(category);
  const Icon = harness?.icon ?? Hash;
  return (
    <span
      data-size={size}
      className={twMerge("ui-size inline-flex items-center rounded-full border-0 bg-surface-raised font-mono tracking-wider text-ink-soft select-none", className)}
      style={{ color: harness?.textColor, backgroundColor: harness?.backgroundColor, ...style }}
      {...props}
    >
      <Icon className="shrink-0" aria-hidden="true" />
      <span>{harness?.label ?? category}</span>
    </span>
  );
}
