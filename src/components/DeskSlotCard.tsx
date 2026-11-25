import React from "react";

export interface DeskSlotCardProps {
  title?:string;
  oneLiner?:string;
  category?:string;
  categoryColor?:string;
  status?:string;
  actionsCount?:number;
  isEmpty?:boolean;
  emptyLabel?:string;
  onClick?:()=>void;
  onPark?:()=>void;
  className?:string;
}

/** One native card action plus a separate park action; no clickable wrapper div. */
export const DeskSlotCard:React.FC<DeskSlotCardProps>=({
 title,oneLiner,category,categoryColor,status="На столе",actionsCount,
 isEmpty=false,emptyLabel="Выбрать проект",onClick,onPark,className=""
})=>{
 if(isEmpty){
  const Element=onClick?"button":"div";
  return <Element
    type={onClick?"button":undefined}
    onClick={onClick}
    className={[
     "ui-desk-slot-empty flex flex-col items-center justify-center min-h-[100px] w-full p-4 rounded-sm border border-dashed border-border bg-surface/40 text-ink-soft",
     onClick?"ui-feedback-pressable cursor-pointer":"cursor-default",
     className
    ].join(" ")}
  ><span className="font-mono text-xs">{emptyLabel}</span></Element>;
 }
 return <div className={[
   "ui-desk-slot-card relative flex flex-col justify-between p-3.5 rounded-sm border border-border bg-surface text-ink group",
   onClick?"ui-desk-slot-actionable":"cursor-default",
   className
  ].join(" ")}>
    {onClick&&<button type="button" className="ui-desk-slot-hit"
      aria-label={title?`Открыть ${title}`:"Открыть проект"} onClick={onClick}/>}
    <div className="relative z-[1] pointer-events-none">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {category&&<span className="size-2 rounded-full inline-block shrink-0"
            style={{backgroundColor:categoryColor||"var(--accent)"}}/>}
          <h4 className="font-sans font-semibold text-sm leading-snug">{title}</h4>
        </div>
        {status&&<span className="font-mono text-meta uppercase tracking-wider text-accent bg-accent-soft px-1.5 py-0.5 rounded-xs">{status}</span>}
      </div>
      {oneLiner&&<p className="text-xs text-ink-soft line-clamp-2 mt-2 leading-relaxed">{oneLiner}</p>}
    </div>
    <div className="relative z-[1] pointer-events-none flex items-center justify-between gap-2 pt-3 mt-2 border-t border-border text-meta font-mono text-ink-faint">
      {actionsCount!==undefined?<span>{actionsCount} действий</span>:<span/>}
      {onPark&&<button type="button" onClick={onPark}
        className="ui-feedback-nav relative z-[2] pointer-events-auto border-0 bg-transparent p-0 cursor-pointer text-ink-soft">
        запарковать
      </button>}
    </div>
 </div>;
};
