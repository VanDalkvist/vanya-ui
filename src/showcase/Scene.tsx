import React, { useState } from "react";
import { DisclosurePill, InspectDrawer, RangeSlider, SineWave, type SineWaveEvent } from "../index";

const moments = [
  { title: "Навигация", date: "NavLinks", description: "Кнопки в шапке переключают между первым экраном и каталогом компонентов.", detail: "Переключатель рядом меняет тему всей страницы." },
  { title: "Детали по запросу", date: "InspectDrawer", description: "Описание открывается в боковой панели поверх страницы.", detail: "Панель закрывается кнопкой, клавишей Esc или нажатием вне её. После закрытия фокус возвращается к карточке." },
];

const pointMoments = [
  { title: "Отдельная точка", date: "EventPoint", description: "Размер точки показывает вес события.", detail: "Наведение и фокус выделяют точку акцентным цветом. Нажатие открывает подробности." },
  { title: "Точка и карточка", date: "TimelineEvent", description: "Точка и карточка ведут к одним подробностям.", detail: "У них общий hover и один шаг при навигации клавишей Tab." },
  { title: "Текущий момент", date: "EventPoint", description: "Акцентная точка обозначает текущий момент.", detail: "Сплошная линия сменяется точками там, где начинается будущее." },
  { title: "Будущее событие", date: "EventPoint", description: "Будущие события показаны светлее.", detail: "Их тоже можно открыть, нажав на точку." },
];

export function Scene() {
  const [moment, setSelected] = useState<typeof moments[number] | null>(null);
  const [distance, setDistance] = useState(64);
  return (
    <section id="composition" className="scene" aria-labelledby="scene-title">
      <div className="scene-intro">
        <h1 id="scene-title">Библиотека компонентов</h1>
        <p>Кнопки, карточки и другие элементы.<br />Можно менять тему и пробовать состояния.</p>
      </div>
      <div className="scene-wave"><SineWave className="scene-background" fit origin={590} events={[
        { id: "early", position: 0.1, weight: 1, label: pointMoments[0].title, onClick: () => setSelected(pointMoments[0]) },
        ...moments.map((item, index): SineWaveEvent => ({ id: item.date, position: 0.5 + (index === 0 ? -1 : 1) * distance / 320, weight: index === 0 ? 2 : 4, preview: { date: item.date, title: item.title }, onClick: () => setSelected(item) })),
        { id: "middle", position: 0.5, weight: 3, label: pointMoments[1].title, onClick: () => setSelected(pointMoments[1]) },
        { id: "current", position: 0.86, weight: 3, current: true, label: pointMoments[2].title, onClick: () => setSelected(pointMoments[2]) },
        { id: "later", position: 0.95, weight: 1, future: true, label: pointMoments[3].title, onClick: () => setSelected(pointMoments[3]) },
      ]} /></div>
      <footer className="scene-footer">
        <div className="scene-distance"><RangeSlider label="Между событиями" aria-label="Расстояние между событиями" min={32} max={120} value={distance} onChange={(event) => setDistance(Number(event.target.value))} /></div>
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
