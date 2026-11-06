import React from "react";
import { twMerge } from "tailwind-merge";
import type { ComponentSize } from "../sizes";
import { pointRadius, type PointAppearance } from "../wave-geometry";

/** Shared SVG glyph for the standalone control, event card and wave. */
export function EventPointMark({ x = 0, y = 0, focus = 1, count = 1, current, future, highlighted, ...appearance }: PointAppearance & { x?: number; y?: number }) {
  const radius = pointRadius({ ...appearance, focus, count, highlighted });
  const opacity = highlighted ? 1 : future ? 0.42 : 0.55 + focus * 0.45;
  const blur = highlighted ? 0 : (1 - focus) * (future ? 1.6 : 1.1);
  return <g transform={`translate(${x} ${y})`} aria-hidden="true">
    <g className={`event-point-glyph ${highlighted || current ? "text-accent" : future ? "text-ink/40" : "text-ink"}`} opacity={opacity} style={{ "--event-blur": `${blur}px` } as React.CSSProperties}>
      {count > 1 && <circle r={radius * 1.7} fill="none" stroke="currentColor" strokeWidth="1" opacity="0.25" />}
      <circle className="event-point-ring" r={radius + 2} fill="none" stroke="currentColor" strokeWidth="2" opacity={highlighted ? 0.6 : 0} />
      <circle className="event-point-core" r={radius} fill="currentColor" />
    </g>
  </g>;
}

export interface EventPointProps extends PointAppearance, React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  size?: ComponentSize;
}

export function EventPoint({ label, size = "md", weight, focus, count, current, future, highlighted, onClick, disabled, className, ...props }: EventPointProps) {
  const Element = onClick ? "button" : "span";
  return <Element
    type={onClick ? "button" : undefined}
    disabled={onClick ? disabled : undefined}
    role={onClick ? undefined : "img"}
    aria-label={label}
    title={label}
    onClick={onClick}
    data-size={size}
    data-interactive={!!onClick}
    className={twMerge("event-point", className)}
    {...props}
  >
    <svg viewBox="-16 -16 32 32" aria-hidden="true" focusable="false">
      <EventPointMark weight={weight} focus={focus} count={count} current={current} future={future} highlighted={highlighted} />
    </svg>
  </Element>;
}
