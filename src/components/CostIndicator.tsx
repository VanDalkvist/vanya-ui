import type {HTMLAttributes} from "react";
import {clsx} from "clsx";
export type CostCertainty="measured"|"estimated"|"free"|"unknown";
export interface CostIndicatorProps extends HTMLAttributes<HTMLSpanElement>{
 usd?:number|null;certainty?:CostCertainty;label?:string;cached?:boolean;compact?:boolean;
}
/** In-context price: null is unknown, never silently shown as $0. */
export function CostIndicator({usd,certainty="unknown",label="Запрос",cached=false,compact=false,className,...props}:CostIndicatorProps){
 const amount=typeof usd==="number"&&Number.isFinite(usd)&&usd>=0?usd:null;
 const value=cached?"Кеш · $0 новых вызовов":amount===null?"Стоимость неизвестна":
  amount===0?"$0":amount<0.000001?"< $0.000001":"$"+amount.toFixed(amount<0.01?6:4);
 const description=certainty==="free"?"Бесплатная модель":certainty==="measured"?"Измерено":
  certainty==="estimated"?"Оценка по тарифу":"Нет подтверждённой цены";
 return <span {...props} className={clsx("ui-cost-indicator",compact&&"ui-cost-indicator--compact",className)}
  data-certainty={certainty} title={description} aria-label={label+": "+value+", "+description}>
  {!compact&&<span className="ui-cost-indicator-label">{label}</span>}
  <span className="ui-cost-indicator-value">{value}</span>
 </span>;
}
