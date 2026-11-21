import React, { useId } from "react";
import { clsx } from "clsx";
import { VANYA_ARC_MARK_PATH } from "../brand/VanyaArcArtwork";

/**
 * MIT-licensed React renderer for the official Vanya Arc artwork.
 * The artwork geometry is separately identified in src/brand/VanyaArcArtwork.ts.
 * Authoritative V → A mark, traced from the owner's approved original reference.
 * Do not replace this double-crest contour with a generic sinusoid or arc.
 * Theme colors come from Vanya UI tokens, never product-specific hardcodes.
 */
export { VANYA_ARC_MARK_PATH } from "../brand/VanyaArcArtwork";
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
