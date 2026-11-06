import React, { useState } from "react";
import { DisclosurePill, InspectDrawer, RangeSlider, SineWave, TimelinePreviewCard } from "../index";

const moments = [
  { title: "Тихая навигация", date: "На краю внимания", description: "Действия не обязаны жить в большой панели. Они могут оставаться рядом с содержимым — заметными, когда нужны, и спокойными всё остальное время.", detail: "Кнопки, ссылки и переключатель темы используют общую типографику. Между группами достаточно места, чтобы различать их без дополнительных рамок." },
  { title: "Детали по запросу", date: "В нужный момент", description: "Короткий взгляд не превращается в стену текста. Открой момент: подробности займут отдельный лист, а пространство останется за ним.", detail: "Это настоящий InspectDrawer из пакета: его можно закрыть кнопкой, нажатием Escape или кликом вне листа. Фокус вернётся к тому месту, откуда ты пришёл." },
];

export function Scene() {
  const [selected, setSelected] = useState<number | null>(null);
  const [distance, setDistance] = useState(64);
  const moment = selected === null ? null : moments[selected];
  return (
    <section id="composition" className="scene" aria-labelledby="scene-title">
      <SineWave className="scene-background" />
      <div className="scene-intro">
        <h1 id="scene-title">Открытое пространство</h1>
        <p>Тёплая бумага, спокойные действия.<br />Содержимое выходит на первый план.</p>
      </div>
      <div className="scene-moments" style={{ gap: `${distance}px` }}>
        {moments.map((item, index) => (
          <div key={item.title} className={`scene-moment scene-moment-${index}`}>
            <TimelinePreviewCard date={item.date} title={item.title} onClick={() => setSelected(index)} className="w-full max-w-[280px]" />
          </div>
        ))}
      </div>
      <footer className="scene-footer">
        <span>Нажми на любой момент</span>
        <div className="scene-distance"><RangeSlider label="Пространство" aria-label="Пространство между моментами" min={32} max={120} value={distance} onChange={(event) => setDistance(Number(event.target.value))} /></div>
      </footer>
      <InspectDrawer isOpen={moment !== null} title={moment?.title ?? "Деталь"} onClose={() => setSelected(null)}>
        {moment && <>
          <p className="text-base leading-relaxed text-ink">{moment.description}</p>
          <p>{moment.detail}</p>
          <DisclosurePill title="Из чего собрана эта сцена">
            <p>TimelinePreviewCard, InspectDrawer, ActionButton, RangeSlider и DisclosurePill — те же экспорты, которые доступны приложениям.</p>
          </DisclosurePill>
        </>}
      </InspectDrawer>
    </section>
  );
}
