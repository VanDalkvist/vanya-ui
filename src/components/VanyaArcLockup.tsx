import React from "react";
import { clsx } from "clsx";
import { VanyaArcMark } from "./VanyaArcMark";

/**
 * Branded-house hierarchy: "Vanya Arc" is the parent, "/ UI" is a product.
 * Never recolor initial V/A letters; the monogram relationship lives in the mark.
 */
export interface VanyaArcLockupProps extends React.HTMLAttributes<HTMLSpanElement> {
  product?: string;
  size?: "sm" | "md" | "lg";
  showMark?: boolean;
  monochrome?: boolean;
}
export function VanyaArcLockup({
  product, size = "md", showMark = true, monochrome = false, className, ...props
}: VanyaArcLockupProps) {
  const accessible = `Vanya Arc${product ? " / " + product : ""}`;
  return <span {...props} className={clsx("vanya-arc-lockup", className)}
    data-size={size} data-monochrome={monochrome ? "true" : "false"}
    role="img" aria-label={accessible}>
    {showMark && <VanyaArcMark monochrome={monochrome}/>}
    <span className="vanya-arc-wordmark" aria-hidden="true">Vanya Arc</span>
    {product && <span className="vanya-arc-suffix" aria-hidden="true">
      <span className="vanya-arc-separator">/</span><span className="vanya-arc-product">{product}</span>
    </span>}
  </span>;
}
