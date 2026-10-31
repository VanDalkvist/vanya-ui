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
          "inline-grid h-[19px] min-w-[19px] place-items-center rounded-xs border px-[5px] font-mono text-[10px] leading-none transition-all duration-150 select-none",
          lit
            ? "border-amber/60 bg-amber/15 text-amber scale-105"
            : "border-hairline bg-surface text-ink-soft",
          className
        )
      )}
      {...props}
    >
      {children}
    </kbd>
  );
}
