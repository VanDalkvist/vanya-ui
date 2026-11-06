import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ComponentSize } from "../sizes";

export interface LinkChipProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  url: string;
  size?: ComponentSize;
  label?: string;
  className?: string;
}

export function LinkChip({
  url,
  size = "sm",
  label = "источник",
  className,
  ...props
}: LinkChipProps) {
  return (
    <a
      data-size={size}
      href={url}
      target="_blank"
      rel="noreferrer"
      className={twMerge(
        clsx(
          "ui-size inline-flex items-center font-sans text-accent underline-offset-4 hover:underline select-none transition-opacity duration-150",
          className
        )
      )}
      {...props}
    >
      <span className="font-mono tracking-[0.24em] text-ink-soft uppercase shrink-0">
        {label}
      </span>
      <span className="min-w-0 truncate max-w-[280px] font-mono text-ink-soft hover:text-ink">
        {url}
      </span>
      <span className="leading-none opacity-60" style={{ fontSize: "var(--ui-icon)" }} aria-hidden="true">↗</span>
    </a>
  );
}
