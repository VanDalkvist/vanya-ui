import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export type CategoryType = "Creative" | "Infra" | "Life" | "Product";

export interface CategoryBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  category: CategoryType | string;
  className?: string;
}

export function CategoryBadge({
  category,
  className,
  ...props
}: CategoryBadgeProps) {
  const normalized = category.toLowerCase();

  const colorStyles = {
    creative: "text-ink bg-accent/10",
    infra: "text-sky-800 dark:text-sky-300 bg-sky-400/10",
    life: "text-emerald-800 dark:text-emerald-300 bg-emerald-400/10",
    product: "text-rose-800 dark:text-rose-300 bg-rose-400/10",
  }[normalized] || "text-ink-soft bg-surface-raised";

  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center gap-1 rounded-full border-0 px-2.5 py-1 font-mono text-meta tracking-wider uppercase select-none",
          colorStyles,
          className
        )
      )}
      {...props}
    >
      <span className="opacity-50">#</span>
      <span>{category}</span>
    </span>
  );
}
