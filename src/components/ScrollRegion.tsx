import React from "react";
import { clsx } from "clsx";

/** An explicitly named, keyboard-scrollable owner for a list or an article. */
export interface ScrollRegionProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  orientation?: "vertical" | "horizontal";
  stableGutter?: boolean;
  children: React.ReactNode;
}
export function ScrollRegion({label,orientation="vertical",stableGutter=true,children,className,...props}:ScrollRegionProps){
  return <div {...props} role="region" aria-label={label} tabIndex={0}
    data-axis={orientation} data-gutter={stableGutter?"stable":"auto"}
    className={clsx("ui-scroll-region",className)}>{children}</div>;
}
