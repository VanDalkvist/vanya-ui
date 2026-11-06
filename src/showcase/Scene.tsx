import React, { useState } from "react";
import { DisclosurePill, InspectDrawer, RangeSlider, SineWave, type SineWaveEvent } from "../index";

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
      <SineWave className="scene-background" origin={590} events={[
        { id: "early", position: 0.1, weight: 1 },
        ...moments.map((item, index): SineWaveEvent => ({ id: item.date, position: 0.5 + (index === 0 ? -1 : 1) * distance / 320, weight: index === 0 ? 2 : 4, preview: { date: item.date, title: item.title }, onClick: () => setSelected(index) })),
        { id: "middle", position: 0.5, weight: 3 },
        { id: "current", position: 0.86, weight: 3, current: true },
        { id: "later", position: 0.95, weight: 1, future: true },
      ]} />
      <div className="scene-intro">
        <h1 id="scene-title">Библиотека компонентов</h1>
        <p>Кнопки, карточки и другие элементы.<br />Можно менять тему и пробовать состояния.</p>
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
            <p>SineWave, TimelineEvent, EventPoint, InspectDrawer, RangeSlider и DisclosurePill доступны в пакете @vanya/ui.</p>
          </DisclosurePill>
        </>}
      </InspectDrawer>
    </section>
  );
}
