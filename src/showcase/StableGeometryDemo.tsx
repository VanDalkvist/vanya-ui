import React, { useState } from "react";
import { ActionLink, LoadingRegion, ScrollRegion, SegmentedControl, Skeleton, WorkspaceEmptyState } from "../index";
import { CatalogSection } from "./CatalogSection";

type DemoState = "empty" | "one" | "many" | "loading" | "partial" | "error";
const states: { id: DemoState; label: string }[] = [
  { id: "empty", label: "0 проектов" }, { id: "one", label: "1 проект" },
  { id: "many", label: "12 проектов" }, { id: "loading", label: "Загрузка" },
  { id: "partial", label: "Часть данных" }, { id: "error", label: "Ошибка" },
];
const samples: Record<DemoState, number[] | null> = {
  empty: [0, 0, 0, 0, 0, 0, 0], one: [1, 2, 1, 3, 2, 1, 4],
  many: [4, 10, 7, 16, 11, 20, 12], partial: [4, 10, 7, 16],
  loading: null, error: null,
};
const projectNames = [
  "Личный кабинет", "История изменений", "Каталог материалов",
  "Исследование длинных пользовательских сценариев и рабочих пространств",
  "Архив документов", "Заметки", "Календарь", "Справка",
  "Отчёты", "Интеграции", "Настройки", "Профиль",
];

export function StableGeometryDemo() {
  const [geometryDemo, setGeometryDemo] = useState<DemoState>("many");
  const values = samples[geometryDemo];
  const names = projectNames.slice(0, geometryDemo === "many" ? 12 : geometryDemo === "partial" ? 6 : geometryDemo === "one" ? 1 : 0);
  const plotLabel = values
    ? "Действия по дням (1–7): " + values.join(", ") + (geometryDemo === "partial" ? ". За последние три дня данных нет." : "")
    : geometryDemo === "loading" ? "График загружается" : "График недоступен";
  const points = values?.map((value, i) => (24 + i * 46) + "," + (102 - value * 4)).join(" ");
  return (
    <CatalogSection id="composition-stable-geometry" title="Стабильность интерфейса"
      description="Выбери состояние примера. Сравни положение кнопок и графика. Данные вымышлены.">
      <div style={{width:"100%",minWidth:0}}>
        <SegmentedControl<DemoState> semantics="filters" aria-label="Состояние примера"
          className="stable-geometry-controls" items={states} value={geometryDemo} onChange={setGeometryDemo}/>
        <div className="stable-geometry-demo">
          <div style={{minWidth:0}}>
            <div className="stable-geometry-plot">
              {values ? <svg width="100%" height="100%" viewBox="0 0 320 135" role="img" aria-label={plotLabel}>
                {[0, 10, 20].map(value => <g key={value}>
                  <text x="2" y={106 - value * 4} fontSize="10" fill="var(--ink-soft)">{value}</text>
                  <path d={"M24 " + (102 - value * 4) + " H300"} stroke="var(--border)" strokeDasharray="3 4"/>
                </g>)}
                <text x="24" y="11" fontSize="10" fill="var(--ink-soft)">Действия</text>
                {Array.from({length:7},(_,i)=><text key={i} x={24+i*46} y="118" textAnchor="middle" fontSize="10" fill="var(--ink-soft)">{i+1}</text>)}
                <text x="300" y="131" textAnchor="end" fontSize="9" fill="var(--ink-soft)">День</text>
                <polyline points={points} fill="none" stroke="var(--accent)" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
                {values.map((value, i) => <circle key={i} cx={24 + i * 46} cy={102 - value * 4} r="3" fill="var(--accent)"><title>{"День " + (i + 1) + ": " + value}</title></circle>)}
              </svg> : <div className="stable-geometry-plot-message">{plotLabel}</div>}
            </div>
            <ActionLink href="/reference/composition.md">Правила стабильного интерфейса</ActionLink>
            <details className="stable-geometry-details">
              <summary>Значения графика</summary>
              <p>{values ? plotLabel : "Значения пока недоступны."}</p>
            </details>
          </div>
          <div style={{minWidth:0}}>
            <div className="ui-type-caption" style={{minHeight:28}}>Результаты</div>
            <ScrollRegion label="Проекты" className="stable-geometry-results">
              {geometryDemo === "loading" ? <LoadingRegion label="Загрузка результатов">{Array.from({length:3},(_,i)=><Skeleton key={i} width="90%" height={32}/>)}</LoadingRegion> :
                geometryDemo === "empty" ? <WorkspaceEmptyState title="Нет проектов" description="Выбери состояние с проектами."/> :
                geometryDemo === "error" ? <WorkspaceEmptyState title="Не удалось загрузить проекты" description="Выбери другое состояние примера."/> :
                <><p className="ui-type-caption" role="status">{geometryDemo === "partial" ? "Доступно 6 из 12 проектов. Данных за последние 3 дня нет." : names.length === 1 ? "1 проект" : "12 проектов"}</p>
                <ul className="stable-geometry-list">{names.map(name => <li key={name}>{name}</li>)}</ul></>}
            </ScrollRegion>
          </div>
        </div>
      </div>
    </CatalogSection>
  );
}
