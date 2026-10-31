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
    creative: "text-amber border-amber/30 bg-amber/10",
    infra: "text-sky-400 border-sky-400/30 bg-sky-400/10",
    life: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
    product: "text-rose-400 border-rose-400/30 bg-rose-400/10",
  }[normalized] || "text-ink-soft border-hairline bg-surface";

  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center gap-1 rounded-xs border px-1.5 py-0.5 font-mono text-[10px] tracking-wider uppercase select-none",
          colorStyles,
          className
        )
      )}
      {...props}
    >
      <span className="opacity-60">#</span>
      <span>{category}</span>
    </span>
  );
}
