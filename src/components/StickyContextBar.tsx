import React from "react";
import {clsx} from "clsx";

/**
 * Zero-height sticky anchor for a document-specific compact context bar.
 * The consuming app observes its own scroll owner and decides when to show it.
 * No window scrolling, observer, product knowledge, or sticky height imposed.
 */
export interface StickyContextBarProps extends React.HTMLAttributes<HTMLDivElement> {
  visible: boolean;
  title: string;
  eyebrow?: React.ReactNode;
  status?: React.ReactNode;
  actions?: React.ReactNode;
  label?: string;
}
export function StickyContextBar({visible,title,eyebrow,status,actions,label="Контекст материала",className,...props}:StickyContextBarProps) {
  return <div {...props} className={clsx("ui-sticky-context-anchor",className)} data-visible={visible?"true":"false"}>
    {visible && <div className="ui-sticky-context-bar" role="region" aria-label={label}>
      <div className="ui-sticky-context-identity">
        {eyebrow&&<span className="ui-sticky-context-eyebrow">{eyebrow}</span>}
        <strong className="ui-sticky-context-title" title={title}>{title}</strong>
      </div>
      {status&&<div className="ui-sticky-context-status">{status}</div>}
      {actions&&<div className="ui-sticky-context-actions">{actions}</div>}
    </div>}
  </div>;
}
