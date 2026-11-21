import React, { useState } from "react";
import { DisclosurePill, InspectDrawer, RangeSlider, ShortcutKeys, SineWave, type SineWaveEvent } from "../index";
import { ArrowDownRight } from "lucide-react";

const moments = [
  { title: "Ссылки и навигация", date: "NavLinks", description: "У разделов есть прямые адреса. Ссылки можно открыть в новой вкладке, а кнопка «Назад» возвращает к предыдущему разделу.", detail: "В шапке можно сменить тему или открыть список горячих клавиш." },
  { title: "Детали по нажатию", date: "InspectDrawer", description: "Карточка открывает боковую панель. Основная страница остаётся на месте.", detail: "Закрой панель кнопкой или Esc. Фокус вернётся туда, откуда ты её открыл." },
];

const pointMoments = [
  { title: "Точка", date: "EventPoint", description: "Размер показывает вес события. Нажми, чтобы узнать больше.", detail: "Точка реагирует на наведение, нажатие и фокус с клавиатуры." },
  { title: "Точка и карточка", date: "TimelineEvent", description: "Точка и карточка открывают одни и те же подробности.", detail: "Для клавиатуры это одно действие, а не два лишних нажатия Tab." },
  { title: "Сейчас", date: "EventPoint", description: "Акцентная точка отмечает текущий момент.", detail: "Дальше сплошная линия превращается в пунктир." },
  { title: "Дальше", date: "EventPoint", description: "Будущие события светлее, но по ним тоже можно нажать.", detail: "Тот же компонент работает в другом состоянии." },
];

export function Scene() {
  const [moment, setSelected] = useState<typeof moments[number] | null>(null);
  const [distance, setDistance] = useState(64);
  return (
    <section id="composition" className="scene" aria-labelledby="scene-title">
      <div className="scene-intro">
        <h1 id="scene-title">Компоненты, которые не заслоняют главное.</h1>
        <p>Выбери событие на волне — откроется панель деталей. Передвинь ползунок — изменится расстояние между событиями. Переключи тему в шапке.</p>
        <div className="scene-discovery">
          <a href="/#catalog" className="scene-catalog-link">Смотреть компоненты <ArrowDownRight size={14} aria-hidden="true"/></a>
          <span className="scene-keys-hint">Быстрые переходы <ShortcutKeys keys={["?"]}/></span>
        </div>
      </div>
      <div className="scene-wave"><SineWave className="scene-background" fit origin={590} events={[
        { id: "early", position: 0.1, weight: 1, label: pointMoments[0].title, onClick: () => setSelected(pointMoments[0]) },
        ...moments.map((item, index): SineWaveEvent => ({ id: item.date, position: 0.5 + (index === 0 ? -1 : 1) * distance / 320, weight: index === 0 ? 2 : 4, preview: { date: item.date, title: item.title }, onClick: () => setSelected(item) })),
        { id: "middle", position: 0.5, weight: 3, label: pointMoments[1].title, onClick: () => setSelected(pointMoments[1]) },
        { id: "current", position: 0.86, weight: 3, current: true, label: pointMoments[2].title, onClick: () => setSelected(pointMoments[2]) },
        { id: "later", position: 0.95, weight: 1, future: true, label: pointMoments[3].title, onClick: () => setSelected(pointMoments[3]) },
      ]} /></div>
      <footer className="scene-footer">
        <div className="scene-distance"><RangeSlider label="Расстояние между событиями" aria-label="Расстояние между событиями" min={32} max={120} value={distance} onChange={(event) => setDistance(Number(event.target.value))} /></div>
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
