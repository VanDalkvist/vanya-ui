import React, { useId } from "react";
import { clsx } from "clsx";

/**
 * Authoritative V → A mark, traced from the owner's approved original reference.
 * Do not replace this double-crest contour with a generic sinusoid or arc.
 * Theme colors come from Vanya UI tokens, never product-specific hardcodes.
 */
export const VANYA_ARC_MARK_PATH = "M 97 293 C 125 259, 140 248, 160 252 C 206 252, 223 319, 275 319 C 342 319, 373 149, 477 149 C 530 149, 564 182, 595 227";
export interface VanyaArcMarkProps extends React.SVGProps<SVGSVGElement> {
  monochrome?: boolean;
  label?: string;
}
export function VanyaArcMark({ monochrome = false, label, className, ...props }: VanyaArcMarkProps) {
  const id = useId().replace(/:/g, "");
  return <svg {...props} className={clsx("vanya-arc-mark", className)}
    viewBox="75 115 540 235" xmlns="http://www.w3.org/2000/svg"
    role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true} focusable="false">
    {!monochrome && <defs><linearGradient id={id} gradientUnits="userSpaceOnUse" x1="97" y1="0" x2="595" y2="0">
      <stop offset="0%" stopColor="var(--ink)" />
      <stop offset="38%" stopColor="var(--ink)" />
      <stop offset="60%" stopColor="var(--accent)" />
      <stop offset="100%" stopColor="var(--accent)" />
    </linearGradient></defs>}
    <path d={VANYA_ARC_MARK_PATH} fill="none"
      stroke={monochrome ? "currentColor" : `url(#${id})`}
      strokeWidth="29" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>;
}
