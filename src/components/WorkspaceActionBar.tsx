import React from "react";
import { clsx } from "clsx";

/** Keep editing actions visible without duplicating a sticky header. */
export interface WorkspaceActionBarProps extends React.HTMLAttributes<HTMLElement> {
  status?: React.ReactNode;
  actions: React.ReactNode;
  placement?: "footer" | "sticky";
}
export function WorkspaceActionBar({status,actions,placement="footer",children,className,...props}:WorkspaceActionBarProps){
  return <footer {...props} data-placement={placement} className={clsx("ui-workspace-action-bar",className)}>
    <div className="ui-workspace-action-status">{status}{children}</div>
    <div className="ui-workspace-action-actions">{actions}</div>
  </footer>;
}
