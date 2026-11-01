import React from "react";
import { ChevronDown } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface DisclosurePillProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function DisclosurePill({
  title,
  children,
  defaultOpen = false,
  className,
}: DisclosurePillProps) {
  return (
    <details
      open={defaultOpen}
      className={twMerge(clsx("group", className))}
    >
      <summary
        className={clsx(
          "inline-flex cursor-pointer list-none items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 font-sans text-[11px] tracking-wide text-ink-soft transition-all duration-150 select-none",
          "hover:bg-surface-raised hover:text-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent [&::-webkit-details-marker]:hidden"
        )}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") e.stopPropagation();
        }}
      >
        <span>{title}</span>
        <ChevronDown
          aria-hidden="true"
          className="size-3 text-ink-faint transition-transform duration-200 group-open:rotate-180"
        />
      </summary>
      <div className="mt-3 text-xs text-ink-soft leading-relaxed space-y-2">
        {children}
      </div>
    </details>
  );
}
