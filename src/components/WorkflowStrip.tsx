import type {HTMLAttributes,ReactNode} from "react";
import {clsx} from "clsx";

export interface WorkflowStripProps extends HTMLAttributes<HTMLElement> {
 label:string;
 status?:ReactNode;
 progress?:{value:number;max:number;label?:string};
 actions?:ReactNode;
}
/** A single short progress/action row; never creates a second sticky bar. */
export function WorkflowStrip({label,status,progress,actions,className,...props}:WorkflowStripProps){
 const max=Math.max(1,progress?.max||1);
 const value=Math.min(max,Math.max(0,progress?.value||0));
 return <section {...props} className={clsx("ui-workflow-strip",className)} aria-label={label}>
  <div className="ui-workflow-strip-leading">
   <strong>{label}</strong>
   {status&&<span className="ui-workflow-strip-status">{status}</span>}
   {progress&&<div className="ui-workflow-strip-progress" role="progressbar"
    aria-label={progress.label||"Прогресс"} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value}>
    <span style={{width:(value/max*100)+"%"}}/>
   </div>}
  </div>
  {actions&&<div className="ui-workflow-strip-actions">{actions}</div>}
 </section>;
}