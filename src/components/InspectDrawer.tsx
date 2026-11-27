import { useEffect, useId, useState } from "react";
import { useModalDialog } from "../hooks/useModalDialog";
import type { ReactNode } from "react";
import { X } from "lucide-react";
import { twMerge } from "tailwind-merge";

/** One persistent inspector toolbar, with an optional context that replaces
 * its label once the in-flow source heading leaves the scroll owner. */
export interface InspectorCompactContext {
  title: string;
  eyebrow?: ReactNode;
  status?: ReactNode;
  actions?: ReactNode;
}

export interface InspectDrawerProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  size?: "default" | "wide";
  compactContext?: InspectorCompactContext;
  className?: string;
}

export function InspectDrawer({isOpen,title,onClose,children,size="default",compactContext,className}:InspectDrawerProps){
 const modal=useModalDialog(isOpen,onClose);
 const {ref}=modal;
 const titleId=useId();
 const [compact,setCompact]=useState(false);
 useEffect(()=>{
  if(!isOpen||!compactContext){setCompact(false);return}
  const dialog=ref.current;
  const target=dialog?.querySelector("[data-inspect-collapse-anchor]");
  const body=dialog?.querySelector<HTMLElement>(".inspect-sheet__body");
  if(!target||!body||!dialog||typeof IntersectionObserver==="undefined"){setCompact(false);return}
  const short=typeof window.matchMedia==="function"?window.matchMedia("(max-height: 600px)"):null;
  let observer:IntersectionObserver|undefined;
  const observe=()=>{
   observer?.disconnect();
   setCompact(false);
   observer=new IntersectionObserver(([entry])=>setCompact(!entry.isIntersecting),{
    root:short?.matches?dialog:body,threshold:0
   });
   observer.observe(target);
  };
  observe();
  short?.addEventListener("change",observe);
  return()=>{short?.removeEventListener("change",observe);observer?.disconnect()};
 },[isOpen,compactContext?.title]);
 if(!isOpen)return null;
 const collapsed=Boolean(compactContext&&compact);
 return <dialog {...modal} aria-labelledby={titleId} aria-modal="true"
   data-has-compact-context={Boolean(compactContext)}
   className={twMerge("inspect-sheet fixed inset-y-0 right-0 left-auto m-0 ml-auto h-dvh max-h-none w-full max-w-[560px] border-0 border-l border-border bg-surface p-0 text-ink",
    size==="wide"&&"inspect-sheet--wide max-w-[min(1080px,96vw)]",className)}>
   <header className="inspect-sheet__header flex shrink-0 items-start justify-between gap-6 border-b border-border px-7 pb-5 pt-8 sm:px-12 sm:pt-10"
    data-compact={collapsed}>
    <div className="inspect-sheet__context">
     {collapsed&&compactContext?.eyebrow&&<span className="inspect-sheet__context-eyebrow">{compactContext.eyebrow}</span>}
     <h2 id={titleId} title={collapsed?compactContext?.title:undefined}
      className="inspect-sheet__title min-w-0 font-sans text-2xl font-medium leading-tight tracking-tight sm:text-3xl">
      {collapsed?compactContext?.title:title}
     </h2>
    </div>
    {collapsed&&(compactContext?.status||compactContext?.actions)&&
     <div className="inspect-sheet__compact-tools">
      {compactContext.status&&<span className="inspect-sheet__compact-status">{compactContext.status}</span>}
      {compactContext.actions&&<span className="inspect-sheet__compact-actions">{compactContext.actions}</span>}
     </div>}
    <button type="button" onClick={onClose} aria-label="Закрыть инспектор"
     className="ui-feedback-icon grid size-9 shrink-0 cursor-pointer place-items-center rounded-xs">
     <X className="size-4" aria-hidden="true"/>
    </button>
   </header>
   <div role="region" aria-label={title+" — содержимое"} tabIndex={0}
    className="inspect-sheet__body min-h-0 flex-1 overscroll-contain px-7 pb-9 pt-6 font-sans text-sm leading-relaxed text-ink-soft sm:px-12">
    <div className="space-y-5">{children}</div>
   </div>
  </dialog>
}