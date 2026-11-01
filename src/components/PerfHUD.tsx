import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface PerfHUDProps {
  fps: number;
  frameMs: number;
  commitMs?: number;
  nodes?: number;
  modeLabel?: string;
  onToggleMode?: () => void;
  className?: string;
}

export function PerfHUD({
  fps,
  frameMs,
  commitMs,
  nodes,
  modeLabel = "detail · on",
  onToggleMode,
  className,
}: PerfHUDProps) {
  const tone =
    fps >= 55 ? "text-emerald-400" : fps >= 40 ? "text-ink" : "text-accent";

  return (
    <div
      className={twMerge(
        clsx(
          "w-[190px] rounded-sm border border-border bg-surface/80 px-3 py-2.5 font-mono text-[10px] leading-relaxed text-ink-soft backdrop-blur-sm select-none",
          className
        )
      )}
    >
      <div className="flex items-baseline justify-between border-b border-border/80 pb-1.5 mb-1.5">
        <span className="tracking-[0.24em] uppercase text-ink-faint">perf</span>
        <span className={clsx("font-semibold", tone)}>{fps.toFixed(0)} fps</span>
      </div>
      <div className="flex justify-between">
        <span className="text-ink-faint">frame</span>
        <span className="text-ink">{frameMs.toFixed(1)} ms</span>
      </div>
      {commitMs !== undefined && (
        <div className="flex justify-between">
          <span className="text-ink-faint">commit</span>
          <span className="text-ink">{commitMs.toFixed(2)} ms</span>
        </div>
      )}
      {nodes !== undefined && (
        <div className="flex justify-between">
          <span className="text-ink-faint">nodes</span>
          <span className="text-ink">{nodes}</span>
        </div>
      )}
      {onToggleMode && (
        <button
          type="button"
          onClick={onToggleMode}
          className="mt-2 w-full border-t border-border pt-1.5 text-left tracking-[0.16em] uppercase text-ink-faint hover:text-ink transition-colors cursor-pointer"
        >
          {modeLabel}
        </button>
      )}
    </div>
  );
}
