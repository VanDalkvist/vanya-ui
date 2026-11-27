import {clsx} from "clsx";
import type {ComponentSize} from "../sizes";

export interface TagProps {
 children:string;
 size?:ComponentSize;
 className?:string;
 title?:string;
}

/** Passive inline text metadata. */
export function Tag({children,size="sm",className,title}:TagProps){
 return <span data-size={size} title={title} className={clsx("ui-tag inline-flex items-center gap-1 font-mono text-meta text-ink-soft cursor-default",className)}>
  <span aria-hidden="true" className="ui-tag-marker">#</span>{children}
 </span>;
}
