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
 /** Property editing keeps the current value neutral; a facet highlights applied filtering. */
 purpose?:"filter"|"property";
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
 searchable,disabled=false,id,menuWidth=290,purpose="filter"
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
 const [keyboardActive,setKeyboardActive]=useState(false);
 const [position,setPosition]=useState<React.CSSProperties>({position:"fixed",top:0,left:0,width:260,visibility:"hidden"});
 const allOptions=useMemo(()=>allowEmpty?[{value:"",label:emptyLabel},...options]:options,[allowEmpty,emptyLabel,options]);
 const doSearch=searchable??allOptions.length>12;
 const filtered=useMemo(()=>{
  const q=query.trim().toLocaleLowerCase("ru").replaceAll("ё","е");
  return !q?allOptions:allOptions.filter(o=>o.label.toLocaleLowerCase("ru").replaceAll("ё","е").includes(q));
 },[allOptions,query]);
 const capped=useMemo(()=>filtered.slice(0,150),[filtered]);
 const enabledIndices=useMemo(()=>capped.flatMap((o,i)=>o.disabled?[]:[i]),[capped]);
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
  setOpen(false);setQuery("");setKeyboardActive(false);
  if(restoreFocus)triggerRef.current?.focus();
 };
 const openMenu=(direction=0,keyboard=false)=>{
  if(disabled)return;
  const visible=allOptions.slice(0,150);
  const selectedIndex=visible.findIndex(o=>o.value===value&&!o.disabled);
  const first=visible.findIndex(o=>!o.disabled);
  const start=selectedIndex>=0?selectedIndex:first;
  let next=start;
  if(direction!==0&&start>=0){
   for(let i=1;i<=visible.length;i++){
    const candidate=(start+direction*i+visible.length)%visible.length;
    if(!visible[candidate].disabled){next=candidate;break;}
   }
  }
  setActive(next);setKeyboardActive(keyboard);setQuery("");setOpen(true);
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
    const start=current<0?(step>0?-1:0):current;
    const next=(start+step*i+capped.length*2)%capped.length;
    if(!capped[next].disabled)return next;
   }
   return current;
  });
 };
 const movePage=(direction:number)=>{
  setActive(current=>{
   if(!enabledIndices.length)return -1;
   const offset=enabledIndices.indexOf(current);
   return enabledIndices[Math.max(0,Math.min(enabledIndices.length-1,(offset<0?0:offset)+direction*8))];
  });
 };
 const onMenuKey=(event:React.KeyboardEvent)=>{
  if(event.nativeEvent.isComposing)return;
  if(event.target===searchRef.current&&(event.key==="Home"||event.key==="End"))return;
  if(["ArrowDown","ArrowUp","Home","End","PageDown","PageUp"].includes(event.key))setKeyboardActive(true);
  if(event.key==="ArrowDown"){event.preventDefault();moveActive(1)}
  else if(event.key==="ArrowUp"){event.preventDefault();moveActive(-1)}
  else if(event.key==="Home"){event.preventDefault();setActive(enabledIndices[0]??-1)}
  else if(event.key==="End"){event.preventDefault();setActive(enabledIndices[enabledIndices.length-1]??-1)}
  else if(event.key==="PageDown"){event.preventDefault();movePage(1)}
  else if(event.key==="PageUp"){event.preventDefault();movePage(-1)}
  else if(event.key==="Enter"&&!event.nativeEvent.isComposing){event.preventDefault();const o=capped[active];if(o)pick(o)}
  else if(event.key==="Escape"){event.preventDefault();event.stopPropagation();close(true)}
  else if(event.key==="Tab"){close(true)}
 };
 useLayoutEffect(()=>{
  if(open)updatePosition();
 },[open,doSearch]);
 useLayoutEffect(()=>{
  if(!open||position.visibility!=="visible")return;
  if(doSearch)searchRef.current?.focus();
  else listRef.current?.focus();
 },[open,doSearch,position.visibility]);
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
 useEffect(()=>{
  const selectedIndex=capped.findIndex(o=>o.value===value&&!o.disabled);
  setActive(selectedIndex>=0?selectedIndex:capped.findIndex(o=>!o.disabled));
 },[query,value]);
 useEffect(()=>{
  setActive(current=>enabledIndices.includes(current)?current:(enabledIndices[0]??-1));
 },[enabledIndices]);
 useLayoutEffect(()=>{
  if(!open||!keyboardActive||!capped[active]||capped[active].disabled)return;
  const list=listRef.current,row=document.getElementById(optionId(active));
  if(!list||!row||!list.contains(row))return;
  const bounds=list.getBoundingClientRect(),item=row.getBoundingClientRect();
  if(item.top<bounds.top)list.scrollTop+=item.top-bounds.top;
  else if(item.bottom>bounds.bottom)list.scrollTop+=item.bottom-bounds.bottom;
 },[open,keyboardActive,active,capped,position.visibility]);
 return <div className={clsx("ui-filter-select",className)} data-expanded={open||undefined} data-purpose={purpose}>
  <button ref={triggerRef} id={triggerId} type="button" className="ui-filter-select-trigger"
   disabled={disabled} aria-labelledby={triggerId+"-label "+triggerId+"-value"}
   aria-haspopup="listbox" aria-expanded={open} aria-controls={open?listId:undefined}
   onClick={e=>open?close():openMenu(0,e.detail===0)}
   onKeyDown={e=>{
    if(!open&&(e.key==="ArrowDown"||e.key==="ArrowUp"||e.key===" ")){
     e.preventDefault();openMenu(e.key==="ArrowUp"?-1:0,true);
    }
   }}>
   <span id={triggerId+"-label"} className="ui-filter-select-label">{label}<span aria-hidden="true">:</span></span>{" "}
   <span id={triggerId+"-value"} className={clsx("ui-filter-select-value",!value&&"ui-filter-select-empty")} title={selectedLabel}>{selectedLabel}</span>
   <ChevronDown size={15} className="ui-filter-select-chevron" aria-hidden="true"/>
  </button>
  {open&&createPortal(<div ref={panelRef} className="ui-filter-select-panel" style={position}
   data-placement={position.top===undefined?"below":"floating"}>
   {doSearch&&<div className="ui-filter-select-search-wrap">
    <Search size={16} aria-hidden="true"/>
    <input ref={searchRef} type="search" className="ui-filter-select-search"
     aria-label={"Поиск по вариантам: "+label} value={query} onChange={e=>{setKeyboardActive(true);setQuery(e.target.value);}}
     onKeyDown={onMenuKey} aria-controls={listId} aria-activedescendant={capped[active]&&!capped[active].disabled?optionId(active):undefined}/>
   </div>}
   <div ref={listRef} role="listbox" id={listId} aria-label={label} tabIndex={doSearch?-1:0}
    aria-activedescendant={capped[active]&&!capped[active].disabled?optionId(active):undefined}
    onKeyDown={doSearch?undefined:onMenuKey} className="ui-filter-select-options">
    {capped.map((option,i)=><div key={option.value||"empty"} id={optionId(i)}
      role="option" aria-selected={option.value===value} aria-disabled={option.disabled||undefined}
      data-active={keyboardActive&&i===active||undefined} className="ui-filter-select-option"
      onMouseEnter={()=>{if(!option.disabled){setActive(i);setKeyboardActive(false);}}} onClick={()=>pick(option)}>
      <span className="ui-filter-select-option-text">{option.label}</span>
      {option.value===value&&<Check size={15} aria-hidden="true"/>}
     </div>)}
    {capped.length===0&&<p className="ui-filter-select-no-results">Ничего не найдено</p>}
    {filtered.length>150&&<p className="ui-filter-select-more">Показаны первые 150 вариантов. Уточните поиск.</p>}
   </div>
  </div>,document.body)}
 </div>;
}
