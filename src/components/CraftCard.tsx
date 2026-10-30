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
          "rounded-sm border border-hairline bg-surface p-4 text-ink transition-colors duration-150",
          isInteractive &&
            "cursor-pointer hover:border-hairline-active hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber",
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
}
