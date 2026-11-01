import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  isActive?: boolean;
  className?: string;
}

export function Tag({
  children,
  isActive = false,
  className,
  ...props
}: TagProps) {
  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center rounded-xs border border-border bg-surface-raised/60 px-2.5 py-0.5 font-mono text-[11px] text-ink-soft select-none transition-colors duration-150",
          isActive
            ? "border-accent/60 bg-accent/10 text-accent font-medium"
            : "hover:border-hairline-active hover:text-ink",
          className
        )
      )}
      {...props}
    >
      {children}
    </span>
  );
}
