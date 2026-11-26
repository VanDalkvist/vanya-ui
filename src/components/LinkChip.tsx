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
  target = "_blank",
  rel,
  ...props
}: LinkChipProps) {
  return (
    <a
      data-size={size}
      href={url}
      target={target}
      rel={target === "_blank" ? [rel, "noopener", "noreferrer"].filter(Boolean).join(" ") : rel}
      className={twMerge(
        clsx(
          "ui-size ui-feedback-source inline-flex items-center font-sans text-ink-soft underline-offset-4 select-none",
          className
        )
      )}
      {...props}
    >
      <span className="font-mono tracking-eyebrow text-ink-soft uppercase shrink-0">
        {label}
      </span>
      <span className="min-w-0 truncate max-w-[280px] font-mono">
        {url}
      </span>
      {target === "_blank" && <span className="leading-none opacity-60" style={{ fontSize: "var(--ui-icon)" }} aria-hidden="true">↗</span>}
    </a>
  );
}
