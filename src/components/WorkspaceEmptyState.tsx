import React from "react";
import { clsx } from "clsx";

/** Calm empty state derived from Ferma's empty work desk. */
export interface WorkspaceEmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}
export function WorkspaceEmptyState({title,description,icon,action,className,...props}:WorkspaceEmptyStateProps){
  return <div {...props} className={clsx("ui-workspace-empty",className)}>
    {icon&&<div aria-hidden="true" className="ui-workspace-empty-icon">{icon}</div>}
    <h3 className="ui-workspace-empty-title">{title}</h3>
    {description&&<p className="ui-workspace-empty-description">{description}</p>}
    {action&&<div className="ui-workspace-empty-action">{action}</div>}
  </div>;
}
