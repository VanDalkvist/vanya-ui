import React, { useState } from "react";
import {
  ActionButton, AvatarLink, CategoryBadge, CraftCard, DeskSlotCard, DisclosurePill,
  Divider, EnergyRadar, EventCard, HearthPulse, InspectDrawer, Kbd, LinkChip,
  MeshStatusBadge, Minimap, NavLinks, OfferCard, RangeSlider, ReceiptDigestModal,
  SegmentedControl, SpiderRadar, Tag, TimelinePreviewCard, VoiceWaveIndicator,
} from "../index";
import { CatalogSection } from "./CatalogSection";

const horizons = [{ id: "day", label: "День" }, { id: "week", label: "Неделя" }, { id: "month", label: "Месяц" }];
const distributions = {
  day: [{ id: "creative", label: "Creative", count: 6, percentage: 60 }, { id: "infra", label: "Infra", count: 4, percentage: 40, color: "var(--ink-soft)" }],
  week: [{ id: "creative", label: "Creative", count: 15, percentage: 75 }, { id: "infra", label: "Infra", count: 5, percentage: 25, color: "var(--ink-soft)" }],
  month: [{ id: "creative", label: "Creative", count: 20, percentage: 50 }, { id: "infra", label: "Infra", count: 20, percentage: 50, color: "var(--ink-soft)" }],
};

export function ComponentCatalog() {
  const [horizon, setHorizon] = useState("day");
  const [range, setRange] = useState(40);
  const [section, setSection] = useState("one");
  const [overlay, setOverlay] = useState<"sheet" | "digest" | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [sampleVisible, setSampleVisible] = useState(true);
  const [slotActive, setSlotActive] = useState(true);
  const items = distributions[horizon as keyof typeof distributions];
  return <section id="catalog" className="catalog" aria-labelledby="catalog-title">
    <h2 id="catalog-title" className="catalog-title">Компоненты в деле</h2>
    <p className="catalog-intro">Не рисунки компонентов, а сами компоненты. Каждый пример импортирован из @vanya/ui; переключатели, раскрытия и действия работают. Данные ниже — демонстрационные.</p>
    <CatalogSection id="tokens" title="Тема и материал" description="tokens.css — единственный источник палитры. Переключатель ThemeToggle в шапке меняет тему всей страницы.">
      {["ground", "surface", "surface-raised", "ink", "accent"].map((name) => <div key={name} className="token-sample"><span className="token-swatch" style={{ background: `var(--${name})` }} /><span>--{name}</span></div>)}
      <details><summary>Подключение библиотеки</summary><pre>{'import { EventCard, InspectDrawer } from "@vanya/ui";\nimport "@vanya/ui/tokens.css";'}</pre></details>
    </CatalogSection>
    <CatalogSection id="actions" title="ActionButton · Kbd" description="Текстовое действие без обязательной рамки. Клавиша — отдельная подсказка, не замена доступной кнопке.">
      <ActionButton onClick={() => setOverlay("sheet")}>Открыть лист</ActionButton>
      <ActionButton variant="accent" onClick={() => setOverlay("digest")}>Открыть выжимку</ActionButton>
      <ActionButton disabled>Недоступно</ActionButton><Kbd>Esc</Kbd><Kbd lit>Enter</Kbd>
    </CatalogSection>
    <CatalogSection id="navigation" title="NavLinks · Divider · AvatarLink" description="Тихая навигация и ссылки, которые не забирают пространство у содержимого.">
      <div className="demo-column"><NavLinks items={[{ id: "one", label: "Первый раздел", isActive: section === "one" }, { id: "two", label: "Второй раздел", isActive: section === "two" }]} onSelect={setSection} /><p aria-live="polite">Открыт {section === "one" ? "первый" : "второй"} раздел</p><Divider />
      <AvatarLink src="/avatar.svg" alt="Демонстрационный профиль" href="https://vanya-arc.dev" /></div>
    </CatalogSection>
    <CatalogSection id="controls" title="SegmentedControl · RangeSlider · Minimap" description="У каждого контрола своё состояние. Дистанция ползунка связана с окном мини-карты.">
      <div className="demo-column"><SegmentedControl items={horizons} value={horizon} onChange={setHorizon} />
      <RangeSlider label="Дистанция" aria-label="Дистанция в примере" value={range} min={0} max={80} onChange={(event) => setRange(Number(event.target.value))} />
      <Minimap min={0} max={100} from={range} to={range + 20} onSeek={(value) => setRange(Math.min(80, Math.max(0, value)))} labels={[{ value: 10, text: "начало" }, { value: 90, text: "сейчас" }]} /></div>
    </CatalogSection>
    <CatalogSection id="labels" title="CategoryBadge · MeshStatusBadge · Tag" description="Категории, системные состояния и короткие метки — разные роли, а не универсальный набор цветных плашек.">
      <CategoryBadge category="Creative" /><CategoryBadge category="Infra" /><CategoryBadge category="Life" /><CategoryBadge category="Product" />
      <MeshStatusBadge status="online" label="сервис доступен" onClick={() => setOverlay("sheet")} /><MeshStatusBadge status="offline" label="сервис недоступен" onClick={() => setOverlay("sheet")} /><Tag>наблюдение</Tag>
    </CatalogSection>
    <CatalogSection id="disclosure" title="DisclosurePill · LinkChip" description="Второстепенные объяснения раскрываются по запросу. Ссылка остаётся обычной ссылкой.">
      <div className="demo-column"><DisclosurePill title="Что скрыто за этой строкой"><p>Дополнительное объяснение не занимает место, пока оно не понадобилось.</p></DisclosurePill><LinkChip url="https://vanya-arc.dev" label="Синусоида" /></div>
    </CatalogSection>
    <CatalogSection id="event" title="EventCard" description="Самостоятельная деталь: дата, название, текст и ссылка. Заголовок на Manrope, как в светлой Синусоиде.">
      {sampleVisible ? <EventCard date="5 ноября 2026" title="Пространство для своих вещей" description="Ничего лишнего вокруг. Но всё необходимое остаётся под рукой." links={[{ url: "https://vanya-arc.dev", label: "референс" }]} tags={["демо"]} onClose={() => setSampleVisible(false)} /> : <ActionButton onClick={() => setSampleVisible(true)}>Показать EventCard снова</ActionButton>}
    </CatalogSection>
    <CatalogSection id="preview" title="TimelinePreviewCard" description="Краткий взгляд на содержимое. Настоящая кнопка открывает настоящую деталь; работает и с клавиатуры.">
      <TimelinePreviewCard date="ноябрь 2026" title="Посмотреть ближе" onClick={() => setOverlay("sheet")} />
    </CatalogSection>
    <CatalogSection id="surfaces" title="CraftCard · DeskSlotCard · OfferCard" description="Собранная карточка и рабочие состояния показаны отдельно. Это демо, не ограничение на число проектов.">
      <div className="demo-column"><CraftCard><p>Поверхность для связанного содержимого.</p></CraftCard>
      <span className="demo-label">{slotActive ? "Активный проект" : "Проект отложен"}</span>
      {slotActive ? <DeskSlotCard title="Пример проекта" oneLiner="Короткое описание предмета работы." category="Creative" actionsCount={12} onPark={() => setSlotActive(false)} /> : <ActionButton onClick={() => setSlotActive(true)}>Вернуть пример</ActionButton>}
      <span className="demo-label">Пустое состояние</span><DeskSlotCard isEmpty emptyLabel="Выбрать проект" onClick={() => setOverlay("sheet")} />
      <OfferCard title="Новая возможность" description="Демонстрация предложения с доступным действием." autonomy="свой выбор" competence="понятный предмет" actionLabel="Посмотреть" onAction={() => setOverlay("sheet")} /></div>
    </CatalogSection>
    <CatalogSection id="energy" title="EnergyRadar · SpiderRadar" description="Демонстрационные значения. Горизонт действительно меняет распределение, а не только подпись кнопки.">
      <div className="demo-column"><EnergyRadar items={items} horizons={horizons} activeHorizon={horizon} onHorizonChange={setHorizon} totalCount={items.reduce((total, item) => total + item.count, 0)} totalLabel="действий" />
      <SpiderRadar size={240} axes={[{ label: "Creative", value: items[0].percentage }, { label: "Infra", value: items[1].percentage }, { label: "Life", value: 40 }, { label: "Product", value: 65 }]} /></div>
    </CatalogSection>
    <CatalogSection id="presence" title="HearthPulse · VoiceWaveIndicator" description="Активность и голос как состояние, не декоративный график. Режим reduced motion учитывается общей темой.">
      <HearthPulse /><VoiceWaveIndicator isSpeaking={speaking} level={0.7} /><ActionButton onClick={() => setSpeaking(!speaking)}>{speaking ? "Остановить голос" : "Показать голос"}</ActionButton>
    </CatalogSection>
    <CatalogSection id="overlays" title="InspectDrawer · ReceiptDigestModal" description="Лист для подробностей и редакционная выжимка. Fraunces остаётся уместным для намеренно книжного текста.">
      <ActionButton onClick={() => setOverlay("sheet")}>InspectDrawer</ActionButton><ActionButton onClick={() => setOverlay("digest")}>ReceiptDigestModal</ActionButton>
    </CatalogSection>
    <InspectDrawer isOpen={overlay === "sheet"} title="Посмотреть ближе" onClose={() => setOverlay(null)}><p>Этот лист импортирован из пакета. В нём больше пространства для текста, а контекст остаётся за ним.</p><p>Закрой его кнопкой или Escape — и вернёшься к прежнему месту.</p></InspectDrawer>
    <ReceiptDigestModal isOpen={overlay === "digest"} title="Демонстрационная выжимка" narrative="Сегодня в интерфейсе стало чуть больше пространства." receipts={["Живые компоненты вместо HTML-копий", "Детали доступны по запросу"]} onClose={() => setOverlay(null)} />
  </section>;
}
