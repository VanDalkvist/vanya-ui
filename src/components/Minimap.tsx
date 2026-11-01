import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface MinimapTick {
  id: string;
  value: number;
  current?: boolean;
  future?: boolean;
}

export interface MinimapProps {
  min: number;
  max: number;
  from: number;
  to: number;
  ticks?: MinimapTick[];
  labels?: { value: number; text: string }[];
  onSeek: (value: number) => void;
  className?: string;
}

function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val));
}

export function Minimap({
  min,
  max,
  from,
  to,
  ticks = [],
  labels = [],
  onSeek,
  className,
}: MinimapProps) {
  const span = Math.max(1, max - min);
  const pct = (val: number) => clamp(((val - min) / span) * 100, 0, 100);
  const left = pct(from);
  const right = pct(to);
  const width = Math.max(1, right - left);

  return (
    <div
      role="region"
      aria-label="Мини-карта времени"
      className={twMerge(clsx("w-full select-none", className))}
    >
      <div
        className="relative h-8 cursor-pointer"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const p = clamp((e.clientX - rect.left) / rect.width, 0, 1);
          onSeek(min + p * span);
        }}
      >
        {/* Горизонтальная направляющая */}
        <div className="absolute top-3.5 right-0 left-0 h-px bg-ink/12" />

        {/* Засечки событий */}
        {ticks.map((t) => (
          <span
            key={t.id}
            className={clsx(
              "absolute top-2.5 block h-2 w-px",
              t.current ? "bg-accent" : t.future ? "bg-ink/15" : "bg-ink/30"
            )}
            style={{ left: `${pct(t.value)}%` }}
          />
        ))}

        {/* Окно активного фокуса */}
        <div
          className="absolute top-1 h-6 rounded-[2px] border border-accent/45 bg-accent/10 transition-all duration-200"
          style={{ left: `${left}%`, width: `${width}%` }}
        />
      </div>

      {/* Метки дат / лет */}
      {labels.length > 0 && (
        <div className="relative h-3">
          {labels.map((l, idx) => (
            <span
              key={idx}
              className="absolute -translate-x-1/2 font-mono text-[9px] tracking-[0.18em] text-ink-faint"
              style={{ left: `${pct(l.value)}%` }}
            >
              {l.text}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
