import React from "react";
import { twMerge } from "tailwind-merge";
import { EventPoint } from "./EventPoint";
import { TimelinePreviewCard, type TimelinePreviewCardProps } from "./TimelinePreviewCard";
import type { PointAppearance } from "../wave-geometry";

export interface TimelineEventProps extends TimelinePreviewCardProps, PointAppearance {
  disabled?: boolean;
  style?: React.CSSProperties;
}

/** One event action: the point and preview share hover, focus and activation. */
export function TimelineEvent({ date, title, imageSrc, onClick, disabled, className, style, weight, focus, count, current, future, highlighted }: TimelineEventProps) {
  const Element = onClick ? "button" : "div";
  return <Element
    type={onClick ? "button" : undefined}
    disabled={onClick ? disabled : undefined}
    onClick={onClick}
    aria-label={onClick ? `${date} ${title}` : undefined}
    data-interactive={!!onClick}
    className={twMerge("timeline-event", className)}
    style={style}
  >
    <TimelinePreviewCard date={date} title={title} imageSrc={imageSrc} className="timeline-event-card" />
    <EventPoint label={title} weight={weight} focus={focus} count={count} current={current} future={future} highlighted={highlighted} aria-hidden="true" className="pointer-events-none" />
  </Element>;
}
