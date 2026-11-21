import React from "react";
import {clsx} from "clsx";

/** An orientation slot inside the app's EXISTING header, not another sticky bar.
 * The caller owns navigation callbacks, selected item and scroll state.
 * Never duplicates app routing or creates an extra scroll container.
 */
export type WorkspaceContextCrumb = {
  id: string;
  label: string;
  onSelect?: () => void;
};
export interface WorkspaceContextHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  breadcrumbs: WorkspaceContextCrumb[];
  title: string;
  showTitle?: boolean;
  status?: React.ReactNode;
  actions?: React.ReactNode;
  label?: string;
}
export function WorkspaceContextHeader({breadcrumbs,title,showTitle=true,status,actions,label="Текущий документ",className,...props}:WorkspaceContextHeaderProps){
  return <div {...props} className={clsx("ui-workspace-context",className)} role="group" aria-label={label}>
    <div className="ui-workspace-context-identity">
      {breadcrumbs.length>0&&<nav className="ui-workspace-context-crumbs" aria-label="Хлебные крошки">
        <ol>{breadcrumbs.map((item,i)=><li key={item.id}>
          {i>0&&<span className="ui-workspace-context-separator" aria-hidden="true">/</span>}
          {item.onSelect?<button type="button" onClick={item.onSelect}>{item.label}</button>:
            <span>{item.label}</span>}
        </li>)}</ol>
      </nav>}
      {showTitle&&<div className="ui-workspace-context-heading" title={title} aria-label={title}>
        <strong>{title}</strong>
      </div>}
    </div>
    {(status||actions)&&<div className="ui-workspace-context-tools">
      {status&&<span className="ui-workspace-context-status">{status}</span>}
      {actions&&<div className="ui-workspace-context-actions">{actions}</div>}
    </div>}
  </div>;
}
