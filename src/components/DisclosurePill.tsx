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
          "ui-feedback-row inline-flex cursor-pointer list-none items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 font-sans text-meta tracking-wide text-ink-soft select-none",
          "[&::-webkit-details-marker]:hidden"
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
