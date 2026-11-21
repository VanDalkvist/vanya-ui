import React from "react";
import {clsx} from "clsx";

/** Reusable media/artwork item for books, films, playlists and learning resources.
 * Presentation only: all metadata, source resolution, navigation and actions belong
 * to the consuming app. Native anchors remain openable in new tabs.
 */
export interface MediaCardProps extends Omit<React.HTMLAttributes<HTMLElement>,"title"> {
 title: string;
 href: string;
 artwork: React.ReactNode;
 layout?: "poster"|"row";
 eyebrow?: React.ReactNode;
 subtitle?: React.ReactNode;
 meta?: React.ReactNode;
 overlay?: React.ReactNode;
 footer?: React.ReactNode;
 onNavigate?: React.MouseEventHandler<HTMLAnchorElement>;
 artworkLabel?: string;
}
export function MediaCard({title,href,artwork,layout="poster",eyebrow,subtitle,meta,overlay,footer,onNavigate,artworkLabel,className,...props}:MediaCardProps){
 return <article {...props} data-layout={layout} className={clsx("ui-media-card",className)}>
  <div className="ui-media-card-artwork-wrap">
   <a href={href} onClick={onNavigate} className="ui-media-card-artwork" aria-label={artworkLabel||title}>{artwork}</a>
   {overlay&&<div className="ui-media-card-overlay">{overlay}</div>}
  </div>
  <div className="ui-media-card-content">
   {eyebrow&&<div className="ui-media-card-eyebrow">{eyebrow}</div>}
   <h3 className="ui-media-card-title"><a href={href} onClick={onNavigate}>{title}</a></h3>
   {subtitle&&<div className="ui-media-card-subtitle">{subtitle}</div>}
   {meta&&<div className="ui-media-card-meta">{meta}</div>}
   {footer&&<div className="ui-media-card-footer">{footer}</div>}
  </div>
 </article>;
}
