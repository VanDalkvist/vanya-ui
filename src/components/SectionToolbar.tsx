import React from "react";
import { clsx } from "clsx";

/** Ferma's shelf toolbar, extracted without product-specific search logic. */
export interface SectionToolbarProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  count?: number;
  total?: number;
  description?: string;
  actions?: React.ReactNode;
  headingLevel?: 2 | 3;
  /** Section headings keep the normal typography scale; compact stays backwards-compatible. */
  variant?: "compact" | "section";
}
export function SectionToolbar({title,count,total,description,actions,children,headingLevel=2,variant="compact",className,...props}:SectionToolbarProps){
  const Heading=headingLevel===2?"h2":"h3";
  const counter=count===undefined?null:total===undefined?String(count):String(count)+" из "+String(total);
  return <header {...props} className={clsx("ui-section-toolbar",className)}>
    <div className="ui-section-toolbar-heading">
      <Heading className={clsx("ui-section-toolbar-title",variant==="section"&&"ui-type-subheading")}>{title}</Heading>
      {counter!==null&&<span role="status" className="ui-section-toolbar-count" aria-label={"Показано "+counter}>{counter}</span>}
      {description&&<p className="ui-section-toolbar-description">{description}</p>}
    </div>
    {(children||actions)&&<div className="ui-section-toolbar-actions">{children}{actions}</div>}
  </header>;
}
