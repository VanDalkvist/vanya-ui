import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface LinkChipProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  url: string;
  label?: string;
  className?: string;
}

export function LinkChip({
  url,
  label = "источник",
  className,
  ...props
}: LinkChipProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={twMerge(
        clsx(
          "inline-flex items-baseline gap-2 text-sm font-sans text-accent underline-offset-4 hover:underline select-none transition-opacity duration-150",
          className
        )
      )}
      {...props}
    >
      <span className="font-mono text-[10px] tracking-[0.24em] text-ink-soft uppercase shrink-0">
        {label}
      </span>
      <span className="truncate max-w-[280px] text-xs font-mono text-ink-soft hover:text-ink">
        {url}
      </span>
      <span className="text-[10px] leading-none opacity-60">↗</span>
    </a>
  );
}
