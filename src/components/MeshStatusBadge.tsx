import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export type MeshStatus = "online" | "standby" | "warning" | "offline";

export interface MeshStatusBadgeProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  status: MeshStatus;
  label: string;
  metricNote?: string;
  className?: string;
}

export function MeshStatusBadge({
  status,
  label,
  metricNote,
  className,
  onClick,
  ...props
}: MeshStatusBadgeProps) {
  const dotColor = {
    online: "bg-emerald-400",
    standby: "bg-amber-400",
    warning: "bg-orange-500",
    offline: "bg-rose-500",
  }[status];

  return (
    <button
      type="button"
      onClick={onClick}
      className={twMerge(
        clsx(
          "inline-flex items-center gap-2 rounded-full border-0 bg-surface-raised/60 px-3 py-1 text-xs font-mono text-ink-soft transition-colors duration-200 lowercase cursor-pointer",
          "hover:bg-surface-raised hover:text-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent",
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
    </button>
  );
}
