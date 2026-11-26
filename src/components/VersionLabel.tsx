import React from "react";
import { clsx } from "clsx";

export interface VersionLabelProps {
  /** Unprefixed SemVer supplied by the application at build time. */
  version: string;
  className?: string;
}

/** Passive release metadata; the caller owns the actual version. */
export function VersionLabel({version,className}:VersionLabelProps) {
  return <span className={clsx("ui-type-metadata text-ink-soft tabular-nums whitespace-nowrap shrink-0",className)} data-ui-version={version}>v{version}</span>;
}
