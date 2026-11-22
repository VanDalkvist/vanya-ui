import React, {useEffect, useId, useLayoutEffect, useMemo, useRef, useState} from "react";
import {createPortal} from "react-dom";
import {Check, ChevronDown, Search} from "lucide-react";
import {clsx} from "clsx";

export interface FilterSelectOption {value:string; label:string; disabled?:boolean}
export interface FilterSelectProps {
 label:string;
 value:string;
 onValueChange:(value:string)=>void;
 options:FilterSelectOption[];
 className?:string;
 emptyLabel?:string;
 allowEmpty?:boolean;
 searchable?:boolean;
 disabled?:boolean;
 id?:string;
 /** Optional narrower/fuller menu, still constrained to the viewport. */
 menuWidth?:number;
}

/** A toolbar-friendly filter selector with a styled, searchable listbox.
 * The popup is rendered in a portal so sticky toolbars cannot clip it.
 * Forms that require a native select should continue to use SelectField.
 */
export function FilterSelect({
 label,value,onValueChange,options,className,emptyLabel="Все",allowEmpty=true,
 searchable,disabled=false,id,menuWidth=290
}:FilterSelectProps){
 const generated=useId().replace(/:/g,"");
 const triggerId=id||"ui-filter-"+generated;
 const listId=triggerId+"-options";
 const triggerRef=useRef<HTMLButtonElement>(null);
 const panelRef=useRef<HTMLDivElement>(null);
 const listRef=useRef<HTMLDivElement>(null);
 const searchRef=useRef<HTMLInputElement>(null);
 const [open,setOpen]=useState(false);
 const [query,setQuery]=useState("");
 const [active,setActive]=useState(0);
 const [position,setPosition]=useState<React.CSSProperties>({position:"fixed",top:0,left:0,width:260,visibility:"hidden"});
 const allOptions=useMemo(()=>allowEmpty?[{value:"",label:emptyLabel},...options]:options,[allowEmpty,emptyLabel,options]);
 const doSearch=searchable??allOptions.length>12;
 const filtered=useMemo(()=>{
  const q=query.trim().toLocaleLowerCase("ru").replaceAll("ё","е");
  return !q?allOptions:allOptions.filter(o=>o.label.toLocaleLowerCase("ru").replaceAll("ё","е").includes(q));
 },[allOptions,query]);
 const capped=filtered.slice(0,150);
 const selected=allOptions.find(o=>o.value===value);
 const selectedLabel=selected?.label||value||emptyLabel;
 const optionId=(i:number)=>listId+"-"+i;
 const updatePosition=()=>{
  const r=triggerRef.current?.getBoundingClientRect();
  if(!r)return;
  const screenW=window.innerWidth,screenH=window.innerHeight;
  const width=Math.min(Math.max(r.width,menuWidth),screenW-20);
  const left=Math.min(Math.max(10,r.left),screenW-width-10);
  const below=screenH-r.bottom-10,above=r.top-10;
  const upsideDown=below<220&&above>below;
  const available=Math.max(112,Math.min(350,upsideDown?above-8:below-8));
  setPosition({
   position:"fixed",left,top:upsideDown?Math.max(8,r.top-6-available):r.bottom+6,
   width,maxHeight:available,visibility:"visible",
  });
 };
 const close=(restoreFocus=false)=>{
  setOpen(false);setQuery("");
  if(restoreFocus)triggerRef.current?.focus();
 };
 const openMenu=(direction=0)=>{
  if(disabled)return;
  const selectedIndex=Math.max(0,allOptions.findIndex(o=>o.value===value&&!o.disabled));
  setActive(direction===1?Math.min(selectedIndex+1,allOptions.length-1):direction===-1?Math.max(0,selectedIndex-1):selectedIndex);
  setQuery("");setOpen(true);
 };
 const pick=(option:FilterSelectOption)=>{
  if(option.disabled)return;
  onValueChange(option.value);
  close(true);
 };
 const moveActive=(step:number)=>{
  if(!capped.length)return;
  setActive(current=>{
   for(let i=1;i<=capped.length;i++){
    const next=(current+step*i+capped.length*2)%capped.length;
    if(!capped[next].disabled)return next;
   }
   return current;
  });
 };
 const onMenuKey=(event:React.KeyboardEvent)=>{
  if(event.key==="ArrowDown"){event.preventDefault();moveActive(1)}
  else if(event.key==="ArrowUp"){event.preventDefault();moveActive(-1)}
  else if(event.key==="Home"){event.preventDefault();setActive(0)}
  else if(event.key==="End"){event.preventDefault();setActive(capped.length-1)}
  else if(event.key==="PageDown"){event.preventDefault();setActive(Math.min(capped.length-1,active+8))}
  else if(event.key==="PageUp"){event.preventDefault();setActive(Math.max(0,active-8))}
  else if(event.key==="Enter"&&!event.nativeEvent.isComposing){event.preventDefault();const o=capped[active];if(o)pick(o)}
  else if(event.key==="Escape"){event.preventDefault();event.stopPropagation();close(true)}
  else if(event.key==="Tab"){close()}
 };
 useLayoutEffect(()=>{
  if(!open)return;
  updatePosition();
  if(doSearch)searchRef.current?.focus();
  else listRef.current?.focus();
 },[open,doSearch]);
 useEffect(()=>{
  if(!open)return;
  const outside=(e:PointerEvent)=>{
   const t=e.target as Node;
   if(triggerRef.current?.contains(t)||panelRef.current?.contains(t))return;
   close();
  };
  const keyboard=(e:KeyboardEvent)=>{
   if(e.key==="Escape"){e.preventDefault();close(true)}
  };
  const reposition=()=>updatePosition();
  document.addEventListener("pointerdown",outside);
  document.addEventListener("keydown",keyboard);
  window.addEventListener("scroll",reposition,true);
  window.addEventListener("resize",reposition);
  return()=>{
   document.removeEventListener("pointerdown",outside);
   document.removeEventListener("keydown",keyboard);
   window.removeEventListener("scroll",reposition,true);
   window.removeEventListener("resize",reposition);
  };
 },[open]);
 useEffect(()=>{setActive(Math.max(0,capped.findIndex(o=>o.value===value&&!o.disabled)))},[query,open,value]);
 return <div className={clsx("ui-filter-select",className)} data-expanded={open||undefined}>
  <button ref={triggerRef} id={triggerId} type="button" className="ui-filter-select-trigger"
   disabled={disabled} aria-label={label+": "+selectedLabel}
   aria-haspopup="listbox" aria-expanded={open} aria-controls={open?listId:undefined}
   onClick={()=>open?close():openMenu()}
   onKeyDown={e=>{
    if(!open&&(e.key==="ArrowDown"||e.key==="ArrowUp"||e.key===" ")){
     e.preventDefault();openMenu(e.key==="ArrowUp"?-1:0);
    }
   }}>
   <span className="ui-filter-select-label">{label}</span>
   <span className={clsx("ui-filter-select-value",!value&&"ui-filter-select-empty")} title={selectedLabel}>{selectedLabel}</span>
   <ChevronDown size={15} className="ui-filter-select-chevron" aria-hidden="true"/>
  </button>
  {open&&createPortal(<div ref={panelRef} className="ui-filter-select-panel" style={position}
   data-placement={position.top===undefined?"below":"floating"}>
   {doSearch&&<div className="ui-filter-select-search-wrap">
    <Search size={16} aria-hidden="true"/>
    <input ref={searchRef} type="search" className="ui-filter-select-search"
     aria-label={"Поиск по вариантам: "+label} value={query} onChange={e=>setQuery(e.target.value)}
     onKeyDown={onMenuKey} aria-controls={listId} aria-activedescendant={capped[active]?optionId(active):undefined}/>
   </div>}
   <div ref={listRef} role="listbox" id={listId} aria-label={label} tabIndex={doSearch?-1:0}
    aria-activedescendant={capped[active]?optionId(active):undefined}
    onKeyDown={doSearch?undefined:onMenuKey} className="ui-filter-select-options">
    {capped.map((option,i)=><div key={option.value||"empty"} id={optionId(i)}
      role="option" aria-selected={option.value===value} aria-disabled={option.disabled||undefined}
      data-active={i===active||undefined} className="ui-filter-select-option"
      onMouseEnter={()=>setActive(i)} onClick={()=>pick(option)}>
      <span className="ui-filter-select-option-text">{option.label}</span>
      {option.value===value&&<Check size={15} aria-hidden="true"/>}
     </div>)}
    {capped.length===0&&<p className="ui-filter-select-no-results">Ничего не найдено</p>}
    {filtered.length>150&&<p className="ui-filter-select-more">Показаны первые 150 вариантов. Уточните поиск.</p>}
   </div>
  </div>,document.body)}
 </div>;
}
