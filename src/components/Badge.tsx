import type {CSSProperties} from "react";
import type {LucideIcon} from "lucide-react";
import {clsx} from "clsx";
import type {ComponentSize} from "../sizes";

export type BadgeTone = "success" | "pending" | "warning" | "error";
type BadgeContent = {icon?:LucideIcon; tone?:never} | {tone:BadgeTone; icon?:never};
export type BadgeProps = BadgeContent & {
 label:string;
 size?:ComponentSize;
 detail?:string;
 className?:string;
 style?:CSSProperties;
 title?:string;
};

/** Passive, compact metadata. The caller supplies a readable status/category label.
 * Commands and selection belong to the existing action and filter primitives. */
export function Badge({label,size="md",icon:Icon,tone,detail,className,style,title}:BadgeProps){
 return <span data-size={size} data-tone={tone} className={clsx("ui-size ui-badge",className)} style={style} title={title}>
  {Icon&&<Icon aria-hidden="true"/>}
  {tone&&<span className="ui-badge-dot" aria-hidden="true"/>}
  <span className="ui-badge-label">{label}</span>
  {detail&&<span className="ui-badge-detail">{detail}</span>}
 </span>;
}
