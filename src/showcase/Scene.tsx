import React, { useState } from "react";
import { DisclosurePill, InspectDrawer, RangeSlider, SineWave, TimelinePreviewCard } from "../index";

const moments = [
  { title: "Навигация", date: "NavLinks", description: "Кнопки в шапке переключают между первым экраном и каталогом компонентов.", detail: "Переключатель рядом меняет тему всей страницы." },
  { title: "Детали по запросу", date: "InspectDrawer", description: "Описание открывается в боковой панели поверх страницы.", detail: "Панель закрывается кнопкой, клавишей Esc или нажатием вне её. После закрытия фокус возвращается к карточке." },
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
        <p>Компоненты для своих проектов.<br />Кнопки и карточки можно попробовать.</p>
      </div>
      <div className="scene-moments" style={{ gap: `${distance}px` }}>
        {moments.map((item, index) => (
          <div key={item.title} className={`scene-moment scene-moment-${index}`}>
            <TimelinePreviewCard date={item.date} title={item.title} onClick={() => setSelected(index)} className="w-full max-w-[280px]" />
          </div>
        ))}
      </div>
      <footer className="scene-footer">
        <span>Нажми на карточку</span>
        <div className="scene-distance"><RangeSlider label="Расстояние" aria-label="Расстояние между карточками" min={32} max={120} value={distance} onChange={(event) => setDistance(Number(event.target.value))} /></div>
      </footer>
      <InspectDrawer isOpen={moment !== null} title={moment?.title ?? "Описание"} onClose={() => setSelected(null)}>
        {moment && <>
          <p className="text-base leading-relaxed text-ink">{moment.description}</p>
          <p>{moment.detail}</p>
          <DisclosurePill title="Компоненты этого примера">
            <p>TimelinePreviewCard, InspectDrawer, RangeSlider и DisclosurePill доступны в пакете @vanya/ui.</p>
          </DisclosurePill>
        </>}
      </InspectDrawer>
    </section>
  );
}
