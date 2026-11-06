import React, { useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { createWaveGeometry, type PointAppearance } from "../wave-geometry";
import { EventPoint, EventPointMark } from "./EventPoint";
import { TimelineEvent } from "./TimelineEvent";

export interface SineWaveEvent extends PointAppearance {
  id: string;
  /** Fraction of viewport width; branches may also start outside the viewport. */
  position: number;
  label?: string;
  preview?: { date: string; title: string; imageSrc?: string };
  onClick?: () => void;
}
export interface SineWaveProps extends React.SVGProps<SVGSVGElement> {
  events?: readonly SineWaveEvent[];
  zoom?: number;
  /** Wave phase in world pixels, independent of personal dates. */
  origin?: number;
  /** Fraction of width where the solid path becomes future dots. */
  horizon?: number;
}
const EMPTY_EVENTS: readonly SineWaveEvent[] = [];

/** Source-derived wave geometry; no timeline data, camera or navigation dependency. */
export const SineWave = React.forwardRef<SVGSVGElement, SineWaveProps>(function SineWave({ events = EMPTY_EVENTS, zoom = 8.602, origin = 0, horizon, className, ...props }, forwardedRef) {
  const node = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ width: 1200, height: 400 });
  const prefix = `wave-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  React.useImperativeHandle(forwardedRef, () => node.current!, []);
  useLayoutEffect(() => {
    const svg = node.current;
    if (!svg) return;
    const measure = () => {
      const { width, height } = svg.getBoundingClientRect();
      if (width > 0 && height > 0) setSize(old => old.width === width && old.height === height ? old : { width, height });
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(svg);
    return () => observer.disconnect();
  }, []);
  const { width, height } = size;
  const geometry = useMemo(() => createWaveGeometry(width, height, { zoom, origin }), [width, height, zoom, origin]);
  const anchors = useMemo(() => events.filter(event => Number.isFinite(event.position)).map(event => ({
    event,
    point: geometry.pointAt(event.position),
    focus: event.focus ?? Math.max(0, 1 - Math.abs(event.position - 0.5) / 0.55),
    dots: geometry.branchDots(event.position, event.id),
  })), [events, geometry]);
  const visible = anchors.filter(({ point }) => point.x >= 0 && point.x <= width && point.y >= 0 && point.y <= height);
  const currentPosition = anchors.find(({ event }) => event.current)?.event.position ?? 1;
  const end = Math.max(0, Math.min(1, Number.isFinite(horizon) ? horizon! : currentPosition));
  const hasContent = visible.some(({ event }) => event.onClick || event.preview);
  return <svg
    ref={node}
    viewBox={`0 0 ${width} ${height}`}
    preserveAspectRatio="none"
    aria-hidden={hasContent ? undefined : true}
    aria-label={hasContent ? "События на синусоиде" : undefined}
    role={hasContent ? "group" : undefined}
    focusable="false"
    className={twMerge("sine-wave pointer-events-none w-full text-ink", className)}
    {...props}
  >
    <defs>{anchors.map(({ dots }, index) => dots.length > 1 && <linearGradient key={index} id={`${prefix}-${index}`} gradientUnits="userSpaceOnUse" x1={dots[0].x} x2={dots.at(-1)!.x} y1="0" y2="0">
      <stop offset="0" stopColor="currentColor" stopOpacity="0.22" /><stop offset="0.4" stopColor="currentColor" stopOpacity="0.12" /><stop offset="1" stopColor="currentColor" stopOpacity="0" />
    </linearGradient>)}</defs>
    <g aria-hidden="true" className="wave-ghosts">{anchors.map(({ event, dots }, index) => <g key={event.id} data-ghost={event.id}>{dots.map((point, i) => <circle key={i} cx={point.x} cy={point.y} r="1.5" fill={`url(#${prefix}-${index})`} />)}</g>)}</g>
    <g fill="none" stroke="currentColor" strokeLinecap="round" aria-hidden="true">
      <path d={geometry.path()} transform="translate(0 -70)" strokeWidth="1" opacity="0.1" vectorEffect="non-scaling-stroke" />
      <path d={geometry.path()} transform="translate(0 120)" strokeWidth="1" opacity="0.055" vectorEffect="non-scaling-stroke" />
      <path className="wave-past" d={geometry.path(0, end)} strokeWidth="1.35" opacity="0.82" vectorEffect="non-scaling-stroke" />
      {end < 1 && <path className="wave-future" d={geometry.path(end, 1)} strokeWidth="1" strokeDasharray="2 9" opacity="0.3" vectorEffect="non-scaling-stroke" />}
    </g>
    <g aria-hidden="true">{visible.filter(({ event }) => !event.preview && !event.onClick).map(({ event, point, focus }) => <EventPointMark key={event.id} {...event} {...point} focus={focus} />)}</g>
    <g className="wave-events">{visible.filter(({ event }) => event.preview || event.onClick).map(({ event, point, focus }) => {
      const cardWidth = Math.min(240, Math.max(32, width - 32));
      const shift = Math.max(cardWidth / 2 + 16, Math.min(width - cardWidth / 2 - 16, point.x)) - point.x;
      return <foreignObject key={event.id} x={point.x} y={point.y} width="1" height="1" style={{ overflow: "visible" }}>
        {event.preview ? <TimelineEvent {...event.preview} weight={event.weight} count={event.count} current={event.current} future={event.future} highlighted={event.highlighted} focus={focus} onClick={event.onClick} className="wave-event" style={{ width: cardWidth, "--event-card-shift": `${shift}px` } as React.CSSProperties} />
          : <EventPoint label={event.label ?? event.id} weight={event.weight} count={event.count} current={event.current} future={event.future} highlighted={event.highlighted} focus={focus} onClick={event.onClick} className="wave-point" />}
      </foreignObject>;
    })}</g>
  </svg>;
});
