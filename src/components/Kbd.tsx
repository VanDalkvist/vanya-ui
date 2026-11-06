import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ComponentSize } from "../sizes";

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  size?: ComponentSize;
  lit?: boolean;
  className?: string;
}

export function Kbd({ children, lit = false, size = "sm", className, ...props }: KbdProps) {
  return (
    <kbd
      data-size={size}
      className={twMerge(
        clsx(
          "ui-size inline-grid place-items-center rounded-[3px] border font-mono transition-all duration-200 select-none",
          lit
            ? "border-accent/60 bg-accent/12 text-ink"
            : "border-border bg-surface-raised/70 text-ink-soft",
          className
        )
      )}
      {...props}
    >
      {children}
    </kbd>
  );
}
