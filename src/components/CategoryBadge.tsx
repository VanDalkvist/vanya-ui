import React from "react";
import { Hash } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { getHarnessType } from "../harness";

export type CategoryType = "Creative" | "Infra" | "Life" | "Product";

export interface CategoryBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  category: CategoryType | string;
  className?: string;
}

export function CategoryBadge({ category, className, style, ...props }: CategoryBadgeProps) {
  const harness = getHarnessType(category);
  const Icon = harness?.icon ?? Hash;
  return (
    <span
      className={twMerge("inline-flex items-center gap-1.5 rounded-full border-0 bg-surface-raised px-2.5 py-1 font-mono text-meta tracking-wider text-ink-soft select-none", className)}
      style={{ color: harness?.textColor, backgroundColor: harness?.backgroundColor, ...style }}
      {...props}
    >
      <Icon className="size-3 shrink-0" aria-hidden="true" />
      <span>{harness?.label ?? category}</span>
    </span>
  );
}
