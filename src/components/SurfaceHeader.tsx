import type {HTMLAttributes,ReactNode} from "react";
import {clsx} from "clsx";

/** In-flow heading for one workspace/inspector, NOT another sticky header.
 * collapseAnchor marks where a parent InspectDrawer may promote context into
 * its existing fixed toolbar. */
export interface SurfaceHeaderProps extends HTMLAttributes<HTMLElement> {
 eyebrow?:ReactNode;
 title:string;
 subtitle?:ReactNode;
 actions?:ReactNode;
 collapseAnchor?:boolean;
 headingLevel?:2|3;
}
export function SurfaceHeader({eyebrow,title,subtitle,actions,collapseAnchor=false,
 headingLevel=3,className,...props}:SurfaceHeaderProps){
 const Heading=headingLevel===2?"h2":"h3";
 return <header {...props} data-inspect-collapse-anchor={collapseAnchor||undefined}
  className={clsx("ui-surface-header",className)}>
  <div className="ui-surface-header-identity">
   {eyebrow&&<span className="ui-surface-header-eyebrow">{eyebrow}</span>}
   <Heading className="ui-surface-header-title" title={title}>{title}</Heading>
   {subtitle&&<div className="ui-surface-header-subtitle">{subtitle}</div>}
  </div>
  {actions&&<div className="ui-surface-header-actions">{actions}</div>}
 </header>;
}