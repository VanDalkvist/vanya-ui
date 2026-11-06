import React, { useState } from "react";
import {
  ActionButton, AvatarLink, CategoryBadge, CraftCard, DeskSlotCard, DisclosurePill,
  Divider, EnergyRadar, EventCard, HARNESS_TYPES, HearthPulse, InspectDrawer, Kbd, LinkChip,
  MeshStatusBadge, Minimap, NavLinks, OfferCard, RangeSlider, ReceiptDigestModal,
  SegmentedControl, SineWave, SpiderRadar, Tag, ThemeToggle, TimelinePreviewCard, VoiceWaveIndicator,
} from "../index";
import { CatalogSection } from "./CatalogSection";

const horizons = [{ id: "day", label: "День" }, { id: "week", label: "Неделя" }, { id: "month", label: "Месяц" }];
const counts = { day: [4, 2, 1, 3], week: [10, 3, 4, 3], month: [14, 8, 10, 8] };
const eventTicks = [
  { id: "first", value: 2016.4 }, { id: "second", value: 2017.2 }, { id: "third", value: 2018.1 },
  { id: "fourth", value: 2019.3 }, { id: "fifth", value: 2020.2 }, { id: "sixth", value: 2020.4 },
  { id: "seventh", value: 2021.1 }, { id: "eighth", value: 2022.4 }, { id: "ninth", value: 2023.2 },
  { id: "tenth", value: 2024.1 }, { id: "eleventh", value: 2024.3 }, { id: "twelfth", value: 2024.5 },
  { id: "thirteenth", value: 2025.2 }, { id: "fourteenth", value: 2025.4 }, { id: "now", value: 2026, current: true },
  { id: "future", value: 2027.1, future: true }, { id: "later", value: 2027.6, future: true },
];

export function ComponentCatalog() {
  const [horizon, setHorizon] = useState<keyof typeof counts>("day");
  const [range, setRange] = useState(40);
  const [mapFocus, setMapFocus] = useState(2023.5);
  const [section, setSection] = useState("one");
  const [overlay, setOverlay] = useState<"sheet" | "digest" | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [sampleVisible, setSampleVisible] = useState(true);
  const [slotActive, setSlotActive] = useState(true);
  const total = counts[horizon].reduce((sum, value) => sum + value, 0);
  const items = HARNESS_TYPES.map((harness, index) => ({ id: harness.id, label: harness.label, count: counts[horizon][index], percentage: counts[horizon][index] / total * 100 }));
  const changeHorizon = (value: string) => {
    if (value === "day" || value === "week" || value === "month") setHorizon(value);
  };

  return <section id="catalog" className="catalog" aria-labelledby="catalog-title">
    <h2 id="catalog-title" className="catalog-title">Компоненты в деле</h2>
    <p className="catalog-intro">Не рисунки компонентов, а сами компоненты. Каждый пример импортирован из @vanya/ui; переключатели, раскрытия и действия работают. Данные ниже — демонстрационные.</p>
    <CatalogSection id="tokens" title="Тема и материал" description="tokens.css — единственный источник палитры. Одна тема для всей библиотеки.">
      {["ground", "surface", "surface-raised", "ink", "accent"].map((name) => <div key={name} className="token-sample"><span className="token-swatch" style={{ background: `var(--${name})` }} /><span>--{name}</span></div>)}
      <details><summary>Подключение библиотеки</summary><pre>{'import { EventCard, InspectDrawer } from "@vanya/ui";\nimport "@vanya/ui/tokens.css";'}</pre></details>
    </CatalogSection>
    <CatalogSection id="sine-wave" title="SineWave" description="Тихая фоновая синусоида с двумя отдалёнными эхо. Отдельный SVG-компонент, без движения и перехвата кликов.">
      <SineWave className="h-32" />
    </CatalogSection>
    <CatalogSection id="theme" title="ThemeToggle" description="Два вида одного переключателя: меню и сегменты. Состояние синхронизировано с переключателем в шапке.">
      <ThemeToggle /><ThemeToggle variant="segmented" />
    </CatalogSection>
    <CatalogSection id="actions" title="ActionButton" description="Состояния одной кнопки вместе: текстовая, моноширинная, акцентная, мягкая и недоступная.">
      <ActionButton onClick={() => setOverlay("sheet")}>Открыть лист</ActionButton>
      <ActionButton variant="mono" onClick={() => setOverlay("sheet")}>Подробнее</ActionButton>
      <ActionButton variant="accent" onClick={() => setOverlay("digest")}>Открыть выжимку</ActionButton>
      <ActionButton variant="pill" onClick={() => setOverlay("sheet")}>Посмотреть</ActionButton>
      <ActionButton disabled>Недоступно</ActionButton>
    </CatalogSection>
    <CatalogSection id="kbd" title="Kbd" description="Клавиатурная подсказка: обычное и активное состояния."><Kbd>Esc</Kbd><Kbd lit>Enter</Kbd></CatalogSection>
    <CatalogSection id="navigation" title="NavLinks" description="Тихая навигация, которая не забирает пространство у содержимого.">
      <div className="demo-column"><NavLinks items={[{ id: "one", label: "Первый раздел", isActive: section === "one" }, { id: "two", label: "Второй раздел", isActive: section === "two" }]} onSelect={setSection} /><p aria-live="polite">Открыт {section === "one" ? "первый" : "второй"} раздел</p></div>
    </CatalogSection>
    <CatalogSection id="divider" title="Divider" description="Ненавязчивое разделение связанных групп."><Divider className="w-full" /></CatalogSection>
    <CatalogSection id="avatar" title="AvatarLink" description="Два размера ссылки-профиля."><AvatarLink src="/avatar.svg" alt="Демонстрационный профиль" href="https://vanya-arc.dev" /><AvatarLink src="/avatar.svg" alt="Демонстрационный профиль, крупный" href="https://vanya-arc.dev" size="md" /></CatalogSection>
    <CatalogSection id="segments" title="SegmentedControl" description="Переключатель занимает ширину своих элементов, в том числе внутри растягивающегося столбца.">
      <div className="demo-column"><SegmentedControl items={horizons} value={horizon} onChange={changeHorizon} /><SegmentedControl items={horizons} value={horizon} onChange={changeHorizon} size="sm" /></div>
    </CatalogSection>
    <CatalogSection id="range" title="RangeSlider" description="Тонкий ползунок с отдельным состоянием примера.">
      <div className="demo-column"><RangeSlider label="Дистанция" aria-label="Дистанция в примере" value={range} min={0} max={80} onChange={(event) => setRange(Number(event.target.value))} /><output className="demo-label">{range}</output></div>
    </CatalogSection>
    <CatalogSection id="minimap" title="Minimap" description="Событийные засечки, текущий момент, будущие события и окно фокуса. Нажми на шкалу, чтобы переместить окно.">
      <div className="demo-column"><Minimap min={2016} max={2028} from={mapFocus} to={mapFocus + 2} ticks={eventTicks} onSeek={(value) => setMapFocus(Math.min(2026, Math.max(2016, value - 1)))} labels={[{ value: 2016, text: "2016" }, { value: 2020, text: "2020" }, { value: 2024, text: "2024" }, { value: 2028, text: "2028" }]} /><span className="demo-label">Демонстрационные события: прожитое · сейчас · впереди</span></div>
    </CatalogSection>
    <CatalogSection id="categories" title="CategoryBadge" description="Четыре типа харнессов из Фермы: те же иконки и матовые цвета в обеих темах.">
      {HARNESS_TYPES.map((harness) => <CategoryBadge key={harness.id} category={harness.id} />)}
    </CatalogSection>
    <CatalogSection id="status" title="MeshStatusBadge" description="Системные состояния одного компонента.">
      <MeshStatusBadge status="online" label="доступен" onClick={() => setOverlay("sheet")} /><MeshStatusBadge status="standby" label="ожидание" onClick={() => setOverlay("sheet")} /><MeshStatusBadge status="warning" label="внимание" onClick={() => setOverlay("sheet")} /><MeshStatusBadge status="offline" label="недоступен" onClick={() => setOverlay("sheet")} />
    </CatalogSection>
    <CatalogSection id="tag" title="Tag" description="Короткая нейтральная метка."><Tag>наблюдение</Tag><Tag>демо</Tag></CatalogSection>
    <CatalogSection id="disclosure" title="DisclosurePill" description="Второстепенные объяснения раскрываются по запросу."><DisclosurePill title="Что скрыто за этой строкой"><p>Дополнительное объяснение не занимает место, пока оно не понадобилось.</p></DisclosurePill></CatalogSection>
    <CatalogSection id="link" title="LinkChip" description="Ссылка с коротким названием и адресом."><LinkChip url="https://vanya-arc.dev" label="Синусоида" /></CatalogSection>
    <CatalogSection id="event" title="EventCard" description="Самостоятельная деталь: дата, название, текст и ссылка. Закрытое и открытое состояния остаются здесь.">
      {sampleVisible ? <EventCard date="5 ноября 2026" title="Пространство для своих вещей" description="Ничего лишнего вокруг. Но всё необходимое остаётся под рукой." links={[{ url: "https://vanya-arc.dev", label: "референс" }]} tags={["демо"]} onClose={() => setSampleVisible(false)} /> : <ActionButton onClick={() => setSampleVisible(true)}>Показать EventCard снова</ActionButton>}
    </CatalogSection>
    <CatalogSection id="preview" title="TimelinePreviewCard" description="Краткий взгляд на содержимое: интерактивный и обычный варианты."><TimelinePreviewCard date="ноябрь 2026" title="Посмотреть ближе" onClick={() => setOverlay("sheet")} /><TimelinePreviewCard date="ноябрь 2026" title="Спокойное превью" /></CatalogSection>
    <CatalogSection id="craft-card" title="CraftCard" description="Поверхность для связанного содержимого."><CraftCard><p>Содержимое без лишних обёрток.</p></CraftCard></CatalogSection>
    <CatalogSection id="desk" title="DeskSlotCard" description="Активное, отложенное и пустое состояния. Это демо, не ограничение на число проектов.">
      <div className="demo-column"><span className="demo-label">{slotActive ? "Активный проект" : "Проект отложен"}</span>{slotActive ? <DeskSlotCard title="Пример проекта" oneLiner="Короткое описание предмета работы." category="Creative" actionsCount={12} onPark={() => setSlotActive(false)} /> : <ActionButton onClick={() => setSlotActive(true)}>Вернуть пример</ActionButton>}<span className="demo-label">Пустое состояние</span><DeskSlotCard isEmpty emptyLabel="Выбрать проект" onClick={() => setOverlay("sheet")} /></div>
    </CatalogSection>
    <CatalogSection id="offer" title="OfferCard" description="Предложение со своим доступным действием."><OfferCard title="Новая возможность" description="Демонстрация предложения." autonomy="свой выбор" competence="понятный предмет" actionLabel="Посмотреть" onAction={() => setOverlay("sheet")} /></CatalogSection>
    <CatalogSection id="energy" title="EnergyRadar" description="Распределение по четырём типам харнессов Фермы. Горизонт действительно меняет данные.">
      <EnergyRadar items={items} horizons={horizons} activeHorizon={horizon} onHorizonChange={changeHorizon} totalCount={total} totalLabel="действий" />
    </CatalogSection>
    <CatalogSection id="spider" title="SpiderRadar" description="Многоосевой радар с теми же типами и иконками харнессов."><SpiderRadar size={240} axes={items.map((item) => ({ label: item.label, value: item.percentage }))} /></CatalogSection>
    <CatalogSection id="pulse" title="HearthPulse" description="Тихий индикатор активности, с учётом reduced motion."><HearthPulse /></CatalogSection>
    <CatalogSection id="voice" title="VoiceWaveIndicator" description="Голос и тишина — два состояния одного компонента."><VoiceWaveIndicator isSpeaking={speaking} level={0.7} /><ActionButton onClick={() => setSpeaking(!speaking)}>{speaking ? "Остановить голос" : "Показать голос"}</ActionButton></CatalogSection>
    <CatalogSection id="inspector" title="InspectDrawer" description="Лист для подробностей с возвратом фокуса."><ActionButton onClick={() => setOverlay("sheet")}>Открыть InspectDrawer</ActionButton></CatalogSection>
    <CatalogSection id="digest" title="ReceiptDigestModal" description="Редакционная выжимка с намеренно книжным текстом."><ActionButton onClick={() => setOverlay("digest")}>Открыть ReceiptDigestModal</ActionButton></CatalogSection>
    <InspectDrawer isOpen={overlay === "sheet"} title="Посмотреть ближе" onClose={() => setOverlay(null)}><p>Этот лист импортирован из пакета. В нём больше пространства для текста, а контекст остаётся за ним.</p><p>Закрой его кнопкой или Escape — и вернёшься к прежнему месту.</p></InspectDrawer>
    <ReceiptDigestModal isOpen={overlay === "digest"} title="Демонстрационная выжимка" narrative="Сегодня в интерфейсе стало чуть больше пространства." receipts={["Живые компоненты вместо HTML-копий", "Детали доступны по запросу"]} onClose={() => setOverlay(null)} />
  </section>;
}
