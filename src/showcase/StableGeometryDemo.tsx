import React, { useState } from "react";
import { ActionLink, LoadingRegion, ScrollRegion, SegmentedControl, Skeleton, WorkspaceEmptyState } from "../index";
import { CatalogSection } from "./CatalogSection";

export function StableGeometryDemo() {
  const [geometryDemo,setGeometryDemo]=useState<"empty"|"one"|"many"|"loading">("many");
  return (
    <CatalogSection id="composition-stable-geometry" title="Композиция / Стабильная геометрия"
      description="Переключи состояния. График, фильтры и соседнее действие сохраняют место; меняется содержимое результата. Демонстрационные данные.">
      <div style={{width:"100%",minWidth:0}}>
        <SegmentedControl semantics="filters" aria-label="Состояние результата"
          items={[{id:"empty",label:"Пусто"},{id:"one",label:"1 элемент"},{id:"many",label:"12 элементов"},{id:"loading",label:"Загрузка"}]}
          value={geometryDemo} onChange={v=>{if(v==="empty"||v==="one"||v==="many"||v==="loading")setGeometryDemo(v);}}/>
        <div className="stable-geometry-demo">
          <div style={{minWidth:0}}>
            <div className="stable-geometry-plot">
              <svg width="100%" height="100%" viewBox="0 0 320 120" preserveAspectRatio="none" role="img" aria-label="Условный график">
                {[20,60,100].map(y=><path key={y} d={`M0 ${y} H320`} stroke="var(--border)" strokeDasharray="3 4"/>)}
                <path d="M0 90 C30 90 45 20 75 20 S125 100 155 100 S220 22 250 22 S295 70 320 70" fill="none" stroke="var(--accent)" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
              </svg>
            </div>
            <p className="ui-type-caption">График и независимая строка действия</p>
            <ActionLink href="#stable-workspace-geometry">Правило композиции</ActionLink>
          </div>
          <div style={{minWidth:0}}>
            <div className="ui-type-caption" style={{minHeight:28}}>Результаты</div>
            <ScrollRegion label="Демонстрационный список" className="stable-geometry-results">
              {geometryDemo==="loading"?<LoadingRegion label="Загрузка результатов">{Array.from({length:3},(_,i)=><Skeleton key={i} width="90%" height={32}/>)}</LoadingRegion>:
                geometryDemo==="empty"?<WorkspaceEmptyState title="Результатов нет"/>:
                Array.from({length:geometryDemo==="one"?1:12},(_,i)=><div key={i} style={{padding:"10px 4px",borderBottom:"1px solid var(--border)"}}>Результат {i+1}</div>)}
            </ScrollRegion>
          </div>
        </div>
        <a className="guide-link" href="/reference/composition.md">Контракт и чек-лист геометрии</a>
      </div>
    </CatalogSection>
  );
}
