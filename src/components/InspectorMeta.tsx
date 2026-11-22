import type {DetailsHTMLAttributes,ReactNode} from "react";
import {clsx} from "clsx";
export interface InspectorMetaProps extends DetailsHTMLAttributes<HTMLDetailsElement>{
 summary:ReactNode;
 children:ReactNode;
}
/** Technical provenance and caveats remain available, without occupying the
 * reader's first screen. Uses native details/summary for keyboard support. */
export function InspectorMeta({summary,children,className,...props}:InspectorMetaProps){
 return <details {...props} className={clsx("ui-inspector-meta",className)}>
  <summary>{summary}</summary>
  <div className="ui-inspector-meta-content">{children}</div>
 </details>;
}