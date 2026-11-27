import type {DetailsHTMLAttributes,ReactNode} from "react";
import {clsx} from "clsx";

export interface DisclosureProps extends DetailsHTMLAttributes<HTMLDetailsElement>{
 summary:ReactNode;
 children:ReactNode;
}
/** Native disclosure for supplementary content. The browser owns user toggles;
 * open sets the initial attribute and is applied again when the prop changes. */
export function Disclosure({summary,children,className,...props}:DisclosureProps){
 return <details {...props} className={clsx("ui-disclosure",className)}>
  <summary className="ui-feedback-row" onKeyDown={e=>{if(e.key==="Enter"||e.key===" ")e.stopPropagation();}}>{summary}</summary>
  <div className="ui-disclosure-content">{children}</div>
 </details>;
}
