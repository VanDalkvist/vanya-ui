import React from "react";
import { clsx } from "clsx";

/**
 * Only the geometry of a list/detail workspace, never the content or data.
 * On wide screens, put two sibling ScrollRegion components in these slots.
 * At compact widths the layout stacks; the consumer must choose one page
 * scroll owner and turn the list into a horizontal chooser if appropriate.
 */
export interface WorkspaceSplitProps extends React.HTMLAttributes<HTMLDivElement> {
  navigation: React.ReactNode;
  content: React.ReactNode;
  compact?: "stack" | "keep-columns";
}
export function WorkspaceSplit({
  navigation, content, compact="stack", className, ...props
}:WorkspaceSplitProps){
  return <div {...props} data-compact={compact} className={clsx("ui-workspace-split",className)}>
    <div className="ui-workspace-split-navigation">{navigation}</div>
    <div className="ui-workspace-split-content">{content}</div>
  </div>;
}
