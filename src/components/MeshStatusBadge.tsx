import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ComponentSize } from "../sizes";

export type MeshStatus = "online" | "standby" | "warning" | "offline";

export interface MeshStatusBadgeProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  status: MeshStatus;
  size?: ComponentSize;
  label: string;
  metricNote?: string;
  className?: string;
}

export function MeshStatusBadge({
  status,
  size = "sm",
  label,
  metricNote,
  className,
  onClick,
  disabled = false,
  ...props
}: MeshStatusBadgeProps) {
  const dotColor = {
    online: "bg-emerald-400",
    standby: "bg-amber-400",
    warning: "bg-orange-500",
    offline: "bg-rose-500",
  }[status];

  const Element = onClick ? "button" : "span";
  return (
    <Element
      data-size={size}
      type={onClick ? "button" : undefined}
      disabled={onClick ? disabled : undefined}
      onClick={onClick}
      className={twMerge(
        clsx(
          "ui-size inline-flex items-center rounded-full border-0 bg-surface-raised/60 font-mono text-ink-soft transition-colors duration-200 lowercase",
          onClick && !disabled ? "cursor-pointer hover:bg-surface-raised hover:text-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent" : "cursor-default",
          onClick && disabled && "opacity-35",
          className
        )
      )}
      {...props}
    >
      <span
        data-testid="status-dot"
        className={clsx("size-1.5 rounded-full shrink-0", dotColor)}
      />
      <span>{label}</span>
      {metricNote && (
        <span className="text-ink-faint border-l border-border pl-2 ml-0.5">
          {metricNote}
        </span>
      )}
    </Element>
  );
}
