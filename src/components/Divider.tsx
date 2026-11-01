import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface DividerProps extends React.HTMLAttributes<HTMLSpanElement> {
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function Divider({
  orientation = "vertical",
  className,
  ...props
}: DividerProps) {
  return (
    <span
      aria-hidden="true"
      className={twMerge(
        clsx(
          orientation === "vertical"
            ? "inline-block h-3 w-px bg-ink/15 shrink-0"
            : "block h-px w-full bg-border my-3",
          className
        )
      )}
      {...props}
    />
  );
}
