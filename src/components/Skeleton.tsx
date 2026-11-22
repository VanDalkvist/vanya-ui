import React from "react";
import {clsx} from "clsx";

export type SkeletonShape = "text" | "block" | "circle";

/** Decorative geometry only: announce loading once on the enclosing LoadingRegion. */
export interface SkeletonProps extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  shape?: SkeletonShape;
  width?: React.CSSProperties["width"];
  height?: React.CSSProperties["height"];
  /** Default pulse is disabled automatically for reduced-motion users. */
  motion?: "pulse" | "none";
}
export function Skeleton({shape="block",width,height,motion="pulse",className,style,...props}:SkeletonProps){
  const Element = shape==="text" ? "span" : "div";
  return <Element {...props} aria-hidden="true" data-shape={shape} data-motion={motion}
    className={clsx("ui-skeleton",className)} style={{...style, ...(width!==undefined?{width}:{}), ...(height!==undefined?{height}:{})}}/>;
}

export interface SkeletonTextProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number;
  /** Line widths: e.g. ["90%","70%","48%"]. */
  widths?: Array<React.CSSProperties["width"]>;
}
export function SkeletonText({lines=2,widths,className,...props}:SkeletonTextProps){
 const count=Math.max(1,Math.min(8,Math.floor(Number.isFinite(lines)?lines:2)));
 return <div {...props} className={clsx("ui-skeleton-text",className)} aria-hidden="true">
  {Array.from({length:count},(_,i)=><Skeleton key={i} shape="text" width={widths?.[i]??(i===count-1&&count>1?"68%":"100%")}/>)}
 </div>;
}

/** Sibling status text announces only once; individual placeholders stay hidden. */
export interface LoadingRegionProps extends React.HTMLAttributes<HTMLDivElement> {
 label: string;
 children: React.ReactNode;
}
export function LoadingRegion({label,children,className,...props}:LoadingRegionProps){
 return <div {...props} className={clsx("ui-loading-region",className)}>
  <span role="status" aria-live="polite" className="ui-loading-sr-only">{label}</span>
  <div aria-busy="true" aria-label={label} className="ui-loading-region-content">{children}</div>
 </div>;
}

/** Generic cover + lines scaffold. Same geometry as the real MediaCard. */
export interface MediaCardSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
 layout?: "poster" | "row";
}
export function MediaCardSkeleton({layout="poster",className,...props}:MediaCardSkeletonProps){
 return <div {...props} className={clsx("ui-media-card","ui-media-card-skeleton",className)} data-layout={layout} aria-hidden="true">
  <div className="ui-media-card-artwork-wrap"><Skeleton shape="block" className="ui-media-card-artwork"/></div>
  <div className="ui-media-card-content">
   {layout==="row"&&<Skeleton shape="text" width="42%" height={12}/>}
   <Skeleton shape="text" width="88%" height={18}/>
   <Skeleton shape="text" width="66%" height={14}/>
   {layout==="poster"&&<div className="ui-media-card-footer"><Skeleton shape="text" width="56%" height={14}/></div>}
  </div>
 </div>;
}
