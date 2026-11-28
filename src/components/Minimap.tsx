import React from "react";
import {clsx} from "clsx";
import {twMerge} from "tailwind-merge";

export interface MinimapTick {
  id:string;
  value:number;
  current?:boolean;
  future?:boolean;
}
export interface MinimapProps {
  min:number;
  max:number;
  from:number;
  to:number;
  ticks?:MinimapTick[];
  labels?:{value:number;text:string}[];
  onSeek:(value:number)=>void;
  className?:string;
}
function clamp(value:number,min:number,max:number){
 return Math.min(max,Math.max(min,value));
}

/** Bounded timeline seek control: pointer press and keyboard refer to the same point. */
export function Minimap({min,max,from,to,ticks=[],labels=[],onSeek,className}:MinimapProps){
 const span=Math.max(1,max-min);
 const pct=(value:number)=>clamp(((value-min)/span)*100,0,100);
 const left=pct(from);
 const right=pct(to);
 const width=Math.max(1,right-left);
 const current=clamp((from+to)/2,min,max);
 const seek=(value:number)=>onSeek(clamp(value,min,max));
 const step=span/20;
 return <div role="region" aria-label="Мини-карта времени"
   className={twMerge(clsx("w-full select-none",className))}>
   <div role="slider" tabIndex={0}
     aria-label="Перейти по временной шкале"
     aria-valuemin={min} aria-valuemax={max} aria-valuenow={current}
     className="ui-minimap-seek relative h-8 cursor-pointer"
     onClick={event=>{
       const r=event.currentTarget.getBoundingClientRect();
       if(!r.width)return;
       const portion=clamp((event.clientX-r.left)/r.width,0,1);
       seek(min+portion*span);
     }}
     onKeyDown={event=>{
       const key=event.key;
       const delta=key==="ArrowRight"||key==="ArrowUp"?step:key==="ArrowLeft"||key==="ArrowDown"?-step:
         key==="PageUp"?span/5:key==="PageDown"?-span/5:0;
       if(key==="Home"||key==="End"||delta!==0){
         event.preventDefault();
         seek(key==="Home"?min:key==="End"?max:current+delta);
       }
     }}>
     <div className="absolute top-3.5 right-0 left-0 h-px bg-ink/12" aria-hidden="true"/>
     {ticks.map(t=><span key={t.id} aria-hidden="true"
       className={clsx("absolute top-2.5 block h-2 w-px",t.current?"bg-accent":t.future?"bg-ink/15":"bg-ink/30")}
       style={{left:`calc(${pct(t.value)}% - ${pct(t.value)/100}px)`}}/>)}
     <div aria-hidden="true" className="ui-minimap-window absolute top-1 h-6 rounded-xs border border-accent/45 bg-accent/10 transition-colors duration-200"
       style={{left:`${Math.min(left,100-width)}%`,width:`${width}%`}}/>
   </div>
   {labels.length>0&&<div className="relative h-3" aria-hidden="true">
     {labels.map((item,i)=>{
       const position=pct(item.value);
       return <div key={i} className="absolute inset-0 grid"
         style={{gridTemplateColumns:`minmax(0,${position}fr) minmax(0,max-content) minmax(0,${100-position}fr)`}}>
         <span className="col-start-2 min-w-0 truncate font-mono text-meta tracking-widest text-ink-faint" title={item.text}>{item.text}</span>
       </div>;
     })}
   </div>}
 </div>;
}
