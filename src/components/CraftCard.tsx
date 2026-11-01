import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface CraftCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  isInteractive?: boolean;
}

export function CraftCard({
  children,
  className,
  isInteractive = false,
  ...props
}: CraftCardProps) {
  return (
    <div
      className={twMerge(
        clsx(
          "rounded-sm border border-border bg-surface p-5 text-ink transition-all duration-200",
          isInteractive &&
            "cursor-pointer hover:bg-surface-raised hover:shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent",
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
}
