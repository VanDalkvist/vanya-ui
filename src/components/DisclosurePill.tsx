import type {ReactNode} from "react";
import {InspectorMeta} from "./InspectorMeta";

export interface DisclosurePillProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

/** Existing caller signature; rendering is owned by the shared native disclosure. */
export function DisclosurePill({title,children,defaultOpen=false,className}:DisclosurePillProps) {
  return <InspectorMeta summary={title} open={defaultOpen} className={className}>{children}</InspectorMeta>;
}
