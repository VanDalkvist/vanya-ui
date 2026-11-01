import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  lit?: boolean;
  className?: string;
}

export function Kbd({ children, lit = false, className, ...props }: KbdProps) {
  return (
    <kbd
      className={twMerge(
        clsx(
          "inline-grid h-[19px] min-w-[19px] place-items-center rounded-[3px] border px-[5px] font-mono text-[10px] leading-none transition-all duration-200 select-none",
          lit
            ? "scale-105 border-accent/60 bg-accent/12 text-accent"
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
