import React, { useState } from "react";
import {
  ActionButton, ActionLink, GitHubIcon, AvatarLink, CategoryBadge, CraftCard, DeskSlotCard, DisclosurePill,
  Divider, EnergyRadar, EventCard, EventPoint, HARNESS_TYPES, HearthPulse, InspectDrawer, Kbd, ShortcutKeys, LinkChip,
  FilterSelect, LoadingRegion, MediaCard, MediaCardSkeleton, MeshStatusBadge, Minimap, NavLinks, RangeSlider, ReceiptDigestModal, SearchField, SelectField, Skeleton, SkeletonText, TextField,
  ScrollRegion, SectionToolbar, StickyContextBar, WorkspaceContextHeader, WorkspaceActionBar, WorkspaceEmptyState, WorkspaceSplit,
  SurfaceHeader, WorkflowStrip, InspectorMeta, CostIndicator,
  SegmentedControl, SineWave, SpiderRadar, Tag, TimelineEvent, ThemeToggle, TimelinePreviewCard, VoiceWaveIndicator,
} from "../index";
import { CatalogSection } from "./CatalogSection";

function Sizes({ children }: { children: (size: "sm" | "md") => React.ReactNode }) {
  return <div className="demo-column">{(["md", "sm"] as const).map((size) => <div key={size} className="size-examples"><span className="demo-label size-label">{size}</span>{children(size)}</div>)}</div>;
}

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
  const [overlay, setOverlay] = useState<"sheet" | "digest" | "composition" | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [sampleVisible, setSampleVisible] = useState(true);
  const [contextHeadingGone,setContextHeadingGone]=useState(false);
  const [slotActive, setSlotActive] = useState(true);
  const [mediaQuery,setMediaQuery]=useState("");
  const [sampleTitle,setSampleTitle]=useState("Тихий берег");
  const [toolbarQuery,setToolbarQuery]=useState("");
  const [toolbarScope,setToolbarScope]=useState("all");
  const [toolbarGenre,setToolbarGenre]=useState("");
  const [loadingDemo,setLoadingDemo]=useState<"loading"|"ready"|"error">("loading");
  const [interactionScope,setInteractionScope] = useState("all");
  const [interactionClicks,setInteractionClicks] = useState(0);
  const total = counts[horizon].reduce((sum, value) => sum + value, 0);
  const items = HARNESS_TYPES.map((harness, index) => ({ id: harness.id, label: harness.label, count: counts[horizon][index], percentage: counts[horizon][index] / total * 100 }));
  const changeHorizon = (value: string) => {
    if (value === "day" || value === "week" || value === "month") setHorizon(value);
  };

  return <section id="catalog" className="catalog" aria-labelledby="catalog-title">
    <h2 id="catalog-title" className="catalog-title">Компоненты</h2>
    <p className="catalog-intro">Настоящие компоненты в разных состояниях. Примеры используют вымышленные данные.</p>
    <CatalogSection id="tokens" title="Цвета" description="Палитра из tokens.css. Переключение темы работает во всех примерах.">
      {["ground", "surface", "surface-raised", "ink", "accent"].map((name) => <div key={name} className="token-sample"><span className="token-swatch" style={{ background: `var(--${name})` }} /><span>--{name}</span></div>)}
    </CatalogSection>
    <CatalogSection id="interaction-states" title="Hover / focus / selected"
      description="Один контракт взаимодействия: наведи курсор, перейди Tab, нажми и сравни выбранное состояние. Цвета адаптируются к светлой и тёмной теме; на таче hover не требуется.">
      <div className="demo-interaction-specimen">
        <div className="demo-interaction-sample">
          <span className="demo-label">Текстовая ссылка</span>
          <ActionLink href="/reference/interaction-states.md" variant="text" size="md">Правила состояний ↗</ActionLink>
          <span className="ui-type-caption">Цвет + подчёркивание при наведении; focus — отдельный контур</span>
        </div>
        <div className="demo-interaction-sample">
          <span className="demo-label">Действие / disabled</span>
          <div className="demo-interaction-pair">
            <ActionButton variant="outline" size="md" onClick={()=>setInteractionClicks(n=>n+1)}>Проверить действие</ActionButton>
            <ActionButton variant="outline" size="md" disabled>Недоступно</ActionButton>
          </div>
          <output className="ui-type-caption">Нажатий: {interactionClicks}</output>
        </div>
        <div className="demo-interaction-sample">
          <span className="demo-label">Hover не заменяет selected</span>
          <SegmentedControl semantics="filters" aria-label="Пример выбранного состояния"
            value={interactionScope} onChange={setInteractionScope}
            items={[{id:"all",label:"Все"},{id:"mine",label:"Мои"}]} />
          <span className="ui-type-caption">Текущий выбор остаётся видимым после ухода курсора</span>
        </div>
        <div className="demo-interaction-sample">
          <span className="demo-label">Иконки и тема</span>
          <div className="demo-interaction-pair">
            <a href="https://github.com/VanDalkvist/vanya-ui" target="_blank" rel="noopener noreferrer"
              aria-label="GitHub — исходники Vanya UI, новая вкладка" className="ui-feedback-icon demo-interaction-icon">
              <GitHubIcon size={14}/>
            </a>
            <ThemeToggle/>
          </div>
          <span className="ui-type-caption">14px символ внутри удобной области нажатия; только мягкий фон</span>
        </div>
      </div>
    </CatalogSection>
    <CatalogSection id="loading-states" title="Skeleton / LoadingRegion" description="Начальная загрузка, готовые данные и ошибка. Ровно одна подпись для скринридера, никаких кликабельных заглушек.">
      <div className="demo-loading" >
       <div className="demo-loading-controls" role="group" aria-label="Состояние примера">
        {([{id:"loading",label:"Загрузка"},{id:"ready",label:"Готово"},{id:"error",label:"Ошибка"}] as const).map(item=>
         <ActionButton key={item.id} size="md" variant={loadingDemo===item.id?"accent":"text"}
          aria-pressed={loadingDemo===item.id} onClick={()=>setLoadingDemo(item.id)}>{item.label}</ActionButton>)}
       </div>
       <div className="demo-loading-surface">
        <SectionToolbar title="Коллекция" variant="section"/>
        {loadingDemo==="loading"?<LoadingRegion label="Загружаем коллекцию">
         <div className="demo-loading-grid">{Array.from({length:3},(_,i)=><MediaCardSkeleton key={i}/>)}</div>
         <div className="demo-loading-row"><MediaCardSkeleton layout="row"/></div>
         <div className="demo-loading-shapes"><Skeleton shape="circle" width={34} height={34}/><SkeletonText lines={2} widths={["80%","57%"]}/></div>
        </LoadingRegion>:loadingDemo==="ready"?<div className="demo-loading-grid">
         {["Тихий берег","Маяк на холме","Следы в лесу"].map((title,i)=><MediaCard
          key={title} title={title} href="#loading-states"
          artwork={<span className="demo-media-art" aria-hidden="true">{["◉","✦","✳"][i]}</span>}
          subtitle="Вымышленный пример" meta="2026"/>)}
        </div>:<WorkspaceEmptyState title="Не удалось загрузить коллекцию"
          description="Проверьте соединение и повторите запрос."
          action={<ActionButton size="md" variant="accent" onClick={()=>setLoadingDemo("loading")}>Повторить</ActionButton>}/>}
       </div>
       <p className="ui-type-caption demo-loading-note">Форма скелетона повторяет карточки, но не изображает реальные фильмы. <a href="/reference/loading.md">Правила загрузки</a></p>
      </div>
    </CatalogSection>
    <CatalogSection id="compact-filter-toolbar" title="Компактные фильтры" description="Компактный поиск и переключатель дополнены собственным выпадающим списком FilterSelect: единая высота 40 px, подписи и темы. Системное меню macOS не используется.">
      <div className="demo-compact-filter-strip">
        <div className="demo-compact-filter-search"><SearchField density="toolbar" label="Поиск по каталогу" placeholder="Найти" value={toolbarQuery} onValueChange={setToolbarQuery}/></div>
        <SegmentedControl density="toolbar" semantics="filters" aria-label="Чьи фильмы показывать" value={toolbarScope} onChange={setToolbarScope}
         items={[{id:"all",label:"Все"},{id:"mine",label:"Мои"}]}/>
        <FilterSelect label="Жанр" value={toolbarGenre} onValueChange={setToolbarGenre}
         searchable options={[{value:"drama",label:"Драма"},{value:"comedy",label:"Комедия"},{value:"fantasy",label:"Фантастика"}]}/>
      </div>
      <p className="ui-type-caption">Данные примера вымышлены. В приложении панель закрепляется под шапкой; лишние фильтры переходят в раскрываемый блок, а не создают второй ряд.</p>
    </CatalogSection>
    <CatalogSection id="media-catalogue" title="MediaCard / SearchField / TextField" description="Композиция для фильмотек, книг и других коллекций: настоящие ссылки, поиск, метаданные и формы на общих токенах.">
     <div className="demo-media-catalogue">
      <SectionToolbar title="Коллекция" variant="section" count={2} total={2}/>
      <SearchField value={mediaQuery} onValueChange={setMediaQuery} label="Поиск по примерам" placeholder="Поиск по коллекции"/>
      <div className="demo-media-items">
       {["Тихий берег","Маяк на холме"].filter(t=>t.toLowerCase().includes(mediaQuery.toLowerCase())).map((title,i)=><MediaCard
        key={title} title={title} href="#media-catalogue"
        artwork={<span className="demo-media-art" aria-hidden="true">{i===0?"◉":"✦"}</span>}
        subtitle={i===0?"Фильм · 2026":"Книга · 2025"}
        meta={i===0?"Документальный":"Рассказы"}
        footer={<ActionButton size="md" variant="accent" onClick={()=>setSampleTitle(title)}>Выбрать</ActionButton>}/>)}
      </div>
      <div className="demo-media-row"><MediaCard title="Тихий берег" href="#media-catalogue" layout="row"
       artwork={<span className="demo-media-art" aria-hidden="true">◉</span>}
       eyebrow="В подборке" subtitle="Короткая форма для полки" meta="Вымышленный пример"/></div>
      <div className="demo-media-form"><TextField label="Название новой подборки" value={sampleTitle}
       onChange={e=>setSampleTitle(e.target.value)} hint="Пример общего поля формы; данные никуда не отправляются."/></div>
     </div>
    </CatalogSection>
    <CatalogSection id="sine-wave" title="SineWave" description="Наклонная линия и точечные ветки от событий. Геометрия из Синусоиды.">
      <SineWave className="h-60" fit origin={590} events={[
        { id: "wave-one", position: .1, weight: 1 }, { id: "wave-two", position: .3, weight: 2 },
        { id: "wave-three", position: .5, weight: 3 }, { id: "wave-now", position: .72, weight: 4, current: true },
        { id: "wave-future", position: .9, weight: 2, future: true },
      ]} />
    </CatalogSection>
    <CatalogSection id="theme" title="ThemeToggle" description="Меню и сегментированный переключатель. Оба меняют общую тему страницы.">
      <ThemeToggle /><ThemeToggle variant="segmented" />
    </CatalogSection>
    <CatalogSection id="actions" title="ActionButton" description="Варианты кнопки и недоступное состояние.">
      <Sizes>{(size) => <>
        <ActionButton size={size} onClick={() => setOverlay("sheet")}>Открыть панель</ActionButton>
        <ActionButton size={size} variant="mono" onClick={() => setOverlay("sheet")}>Подробнее</ActionButton>
        <ActionButton size={size} variant="accent" onClick={() => setOverlay("digest")}>Открыть итоги</ActionButton>
        <ActionButton size={size} variant="pill" onClick={() => setOverlay("sheet")}>Посмотреть</ActionButton>
        <ActionButton size={size} disabled>Недоступно</ActionButton>
      </>}</Sizes>
    </CatalogSection>
    <CatalogSection id="kbd" title="Kbd" description="Подсказка для клавиш. Обычное и выделенное состояния."><Sizes>{(size) => <><Kbd size={size}>Esc</Kbd><Kbd size={size} lit>Enter</Kbd></>}</Sizes></CatalogSection>
    <CatalogSection id="shortcut-keys" title="ShortcutKeys" description="Последовательность клавиш и одновременное нажатие. Подсказка не должна выглядеть как отдельная кнопка.">
      <div className="demo-column">
        <div className="size-examples"><ShortcutKeys keys={["G","I"]}/><ShortcutKeys keys={["⌘","K"]} mode="combo"/><ShortcutKeys keys={["Esc"]}/></div>
        <p className="demo-label">Это обозначения, не перехват сочетаний. На этой странице работают G → I и ?; остальные — только образцы оформления.</p>
        <a href="/#keyboard-shortcuts" className="guide-link">Как назначать горячие клавиши</a>
      </div>
    </CatalogSection>
    <CatalogSection id="navigation" title="NavLinks" description="Навигация по адресам через настоящие ссылки, а не локальный React state.">
      <div className="demo-column">
        <NavLinks items={[{ id: "divider", label: "К разделителю", href: "#divider" }, { id: "principles", label: "Правила URL", href: "/#browser-navigation" }]} />
        <p className="demo-label">Обе ссылки можно скопировать, открыть в новой вкладке или пройти назад/вперёд.</p>
      </div>
    </CatalogSection>
    <CatalogSection id="divider" title="Divider" description="Горизонтальный и вертикальный разделители."><div className="demo-column"><Divider orientation="horizontal" /><div className="size-examples"><span className="demo-label">Слева</span><Divider /><span className="demo-label">Справа</span></div></div></CatalogSection>
    <CatalogSection id="avatar" title="AvatarLink" description="Ссылка с изображением профиля. Два размера."><Sizes>{(size) => <AvatarLink size={size} src="/avatar.svg" alt="Пример профиля" href="https://vanya-arc.dev" />}</Sizes></CatalogSection>
    <CatalogSection id="segments" title="SegmentedControl" description="Выбор одного варианта из группы. Два размера.">
      <Sizes>{(size) => <SegmentedControl size={size} items={horizons} value={horizon} onChange={changeHorizon} />}</Sizes>
    </CatalogSection>
    <CatalogSection id="range" title="RangeSlider" description="Ползунок для выбора значения.">
      <div className="demo-column"><RangeSlider label="Дистанция" aria-label="Дистанция в примере" value={range} min={0} max={80} onChange={(event) => setRange(Number(event.target.value))} /><output className="demo-label">{range}</output></div>
    </CatalogSection>
    <CatalogSection id="minimap" title="Minimap" description="События на шкале времени. Нажми на шкалу, чтобы переместить выделенную область.">
      <div className="demo-column"><Minimap min={2016} max={2028} from={mapFocus} to={mapFocus + 2} ticks={eventTicks} onSeek={(value) => setMapFocus(Math.min(2026, Math.max(2016, value - 1)))} labels={[{ value: 2016, text: "2016" }, { value: 2020, text: "2020" }, { value: 2024, text: "2024" }, { value: 2028, text: "2028" }]} /><span className="demo-label">Примеры событий: прошлые, текущие и будущие.</span></div>
    </CatalogSection>
    <CatalogSection id="categories" title="CategoryBadge" description="Иконки и палитра типов харнессов из Фермы.">
      <Sizes>{(size) => HARNESS_TYPES.map((harness) => <CategoryBadge key={harness.id} size={size} category={harness.id} />)}</Sizes>
    </CatalogSection>
    <CatalogSection id="status" title="MeshStatusBadge" description="Статусы сервисов без действий по нажатию.">
      <Sizes>{(size) => <><MeshStatusBadge size={size} status="online" label="доступен" /><MeshStatusBadge size={size} status="standby" label="ожидание" /><MeshStatusBadge size={size} status="warning" label="внимание" /><MeshStatusBadge size={size} status="offline" label="недоступен" /></>}</Sizes>
    </CatalogSection>
    <CatalogSection id="tag" title="Tag" description="Текстовая метка без действий по нажатию."><Sizes>{(size) => <><Tag size={size}>наблюдение</Tag><Tag size={size}>демо</Tag></>}</Sizes></CatalogSection>
    <CatalogSection id="disclosure" title="DisclosurePill" description="Дополнительный текст, который можно раскрыть."><DisclosurePill title="Показать пояснение"><p>Здесь можно разместить пояснение, которое не нужно показывать сразу.</p></DisclosurePill></CatalogSection>
    <CatalogSection id="link" title="LinkChip" description="Подписанная ссылка с адресом."><Sizes>{(size) => <LinkChip size={size} url="https://vanya-arc.dev" label="Синусоида" />}</Sizes></CatalogSection>
    <CatalogSection id="event" title="EventCard" description="Карточка с датой, описанием и ссылками.">
      {sampleVisible ? <EventCard date="5 ноября 2026" title="Пример проекта" description="Описание проекта со ссылкой и тегом." links={[{ url: "https://vanya-arc.dev", label: "референс" }]} tags={["демо"]} onClose={() => setSampleVisible(false)} /> : <ActionButton onClick={() => setSampleVisible(true)}>Показать EventCard снова</ActionButton>}
    </CatalogSection>
    <CatalogSection id="preview" title="TimelinePreviewCard" description="Короткая карточка. С действием по нажатию и без него."><TimelinePreviewCard date="ноябрь 2026" title="Открыть описание" onClick={() => setOverlay("sheet")} /><TimelinePreviewCard date="ноябрь 2026" title="Карточка без действия" /></CatalogSection>
    <CatalogSection id="event-point" title="EventPoint" description="Четыре веса события. С действием — кнопка с hover и фокусом; без действия — метка.">
      <div className="demo-column"><div className="size-examples">{([1, 2, 3, 4] as const).map(weight => <EventPoint key={weight} weight={weight} label={`Вес ${weight}`} />)}</div><div className="size-examples"><EventPoint label="Открыть событие" weight={3} onClick={() => setOverlay("sheet")} /><EventPoint label="Сейчас" current /><EventPoint label="Будущее событие" future /><EventPoint label="Группа событий" count={6} weight={3} /><EventPoint label="Недоступное событие" disabled onClick={() => setOverlay("sheet")} /></div></div>
    </CatalogSection>
    <CatalogSection id="timeline-event" title="TimelineEvent" description="Точка и карточка с общим hover, фокусом и одним действием.">
      <TimelineEvent date="Пример" title="Открыть описание события" weight={3} onClick={() => setOverlay("sheet")} /><TimelineEvent date="Пример" title="Событие без действия" weight={2} future />
    </CatalogSection>
    <CatalogSection id="craft-card" title="CraftCard" description="Контейнер для связанных элементов."><CraftCard><p>Содержимое карточки.</p></CraftCard></CatalogSection>
    <CatalogSection id="desk" title="DeskSlotCard" description="Карточка проекта: активное, отложенное и пустое состояния.">
      <div className="demo-column"><span className="demo-label">{slotActive ? "Активный проект" : "Проект отложен"}</span>{slotActive ? <DeskSlotCard title="Пример проекта" oneLiner="Описание проекта." category="Creative" actionsCount={12} onPark={() => setSlotActive(false)} /> : <ActionButton onClick={() => setSlotActive(true)}>Вернуть пример</ActionButton>}<span className="demo-label">Пустое состояние</span><DeskSlotCard isEmpty emptyLabel="Выбрать проект" onClick={() => setOverlay("sheet")} /></div>
    </CatalogSection>
    <CatalogSection id="workspace" title="Рабочие поверхности: композиция"
      description="Нейтральная композиция: заголовок списка, счётчик, пустое состояние, один скролл на область и футер действий.">
      <div className="demo-column" style={{ width: "min(100%, 700px)", border: "1px solid var(--border)", padding: 14 }}>
        <SectionToolbar title="Полка исследований" count={7} total={22}
          actions={<ActionButton size="sm" onClick={() => setOverlay("sheet")}>Открыть детали</ActionButton>} />
        <div style={{ height: 195, minHeight: 0 }}>
          <WorkspaceSplit compact="keep-columns"
            navigation={<ScrollRegion label="Список исследований" style={{ height: "100%", paddingRight: 10 }}>
              {Array.from({length: 14}, (_, index) => (
                <p key={index} style={{ margin: "0 0 10px", fontSize: 11 }}>Материал {index + 1} · состояние, графы и пайплайны</p>
              ))}
            </ScrollRegion>}
            detail={<ScrollRegion label="Читательская область" style={{ height: "100%", fontSize: 12, lineHeight: 1.7, paddingLeft: 10 }}>
              <strong>Восстанавливаемый workflow</strong>
              {Array.from({length: 13}, (_, index) => (
                <p key={index}>Один предмет для чтения. Фрагмент {index + 1}. Список слева не меняет позицию, пока читаем эту статью.</p>
              ))}
            </ScrollRegion>}
          />
        </div>
        <WorkspaceActionBar placement="footer" status="Изменений нет"
          actions={<ActionButton variant="accent" onClick={() => setOverlay("sheet")}>Следующий этап</ActionButton>} />
      </div>
      <WorkspaceEmptyState title="Рабочий стол свободен" description="Когда материалов нет, показываем контекст, а не нулевую карточку."
        action={<ActionButton onClick={() => setOverlay("sheet")}>Добавить материал</ActionButton>} />
    </CatalogSection>
    <CatalogSection id="workspace-split" title="WorkspaceSplit"
      description="Два соседних слота для списка и содержимого. В компактной компоновке складываются в один поток; не создаёт лишнего scroll owner.">
      <div style={{width:"min(100%, 590px)",height:180}}>
        <WorkspaceSplit compact="keep-columns"
          navigation={<div style={{padding:12,fontSize:12}}><strong>Навигация</strong><p>Одна предметная очередь</p><p>Выбранный объект</p></div>}
          detail={<div style={{padding:12,fontSize:12}}><strong>Содержимое</strong><p>Центральная область меняется, а маршрут сохраняется.</p></div>} />
      </div>
    </CatalogSection>
    <CatalogSection id="scroll-region" title="ScrollRegion"
      description="Явно именованная область прокрутки; фокусируемая клавишей Tab. Два соседних скролла допустимы, вложенные вертикальные — нет.">
      <ScrollRegion label="Пример длинного списка" style={{height:150,width:"min(100%, 360px)",border:"1px solid var(--border)",padding:12}}>
        {Array.from({length:12},(_,i)=><p key={i} style={{fontSize:12,marginBottom:10}}>Пункт {i+1}: отдельная запись</p>)}
      </ScrollRegion>
    </CatalogSection>
    <CatalogSection id="section-toolbar" title="SectionToolbar"
      description="Небольшой заголовок списка, счётчик и инструменты. Сам заголовок не нужно закреплять над длинной статьёй.">
      <div style={{width:"min(100%, 520px)"}}>
        <SectionToolbar title="Материалы" count={5} total={20}
          actions={<ActionButton size="sm" onClick={()=>setOverlay("sheet")}>Действия</ActionButton>}/>
      </div>
    </CatalogSection>
    <CatalogSection id="composition-reading-inspector" title="Композиция / Reader Inspector"
      description="Правила композиции: один исходный заголовок, действия возле контекста, одна компактная полоса процесса и вторичная информация в раскрытии. При прокрутке название переходит в существующий InspectDrawer, без второго sticky-хедера. Не складывай flex gap и space-y.">
      <div style={{width:"min(100%,760px)",display:"flex",flexDirection:"column",gap:11}}>
        <SurfaceHeader title="Background agents are here. Your orchestration isn't ready"
          eyebrow="СТАТЬЯ · EXA" subtitle="inngest.com"
          actions={<ActionButton size="sm" variant="text" onClick={()=>setOverlay("composition")}>Обновить</ActionButton>}/>
        <WorkflowStrip label="Перевод" status="Ревью · 2 / 15"
          progress={{value:2,max:15,label:"Прогресс перевода"}}
          actions={<ActionButton size="sm" variant="text" onClick={()=>setOverlay("composition")}>Пауза</ActionButton>}/>
        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          <CostIndicator label="Exa" certainty="unknown" usd={null}/>
          <CostIndicator label="Перевод (free)" certainty="free" usd={0}/>
        </div>
        <InspectorMeta summary="Exa · 9 988 символов · Кеш">
          <p>Исходный текст может быть неполным. Для точных цитат сверяй оригинальную страницу.</p>
          <p>Получено: 22.11.2026 · Подробности источника доступны без нагрузки на первый экран.</p>
        </InspectorMeta>
        <p style={{fontFamily:"var(--font-serif)",fontSize:18,lineHeight:1.75,maxWidth:"70ch",margin:0}}>Every six months, the right way to build an AI agent changes. В примере тело статьи начинается сразу после короткой рабочей панели.</p>
        <ActionButton size="sm" variant="accent" onClick={()=>setOverlay("composition")}>Открыть пример в дровере</ActionButton>
      </div>
    </CatalogSection>
    <CatalogSection id="workspace-context-header" title="WorkspaceContextHeader"
      description="Контекстная навигация, полный заголовок и действие внутри существующей верхней панели — без второго sticky header. Хлебные крошки ведут к реальным родительским разделам.">
      <div style={{display:"flex",gap:16,alignItems:"center",width:"min(100%, 900px)",minHeight:78,padding:"10px 14px",background:"var(--surface)",border:"1px solid var(--border)"}}>
        <strong style={{flex:"0 0 auto",fontSize:15}}>app.</strong>
        <WorkspaceContextHeader title="Как восстановить долгую операцию после сбоя" showTitle={contextHeadingGone} breadcrumbs={[
          {id:"library",label:"Библиотека",href:"/#catalog"},
          {id:"category",label:"Рабочие поверхности",href:"/#workspace"}
        ]} status="3 / 18" actions={<ActionButton variant="accent" size="sm" onClick={()=>setOverlay("sheet")}>Исследовать</ActionButton>}/>
      <div style={{display:"flex",alignItems:"center",gap:12,marginTop:8}}>
        <ActionButton variant="text" size="sm" onClick={()=>setContextHeadingGone(x=>!x)}>
          {contextHeadingGone?"Заголовок снова виден в документе":"Заголовок документа ушёл при скролле"}
        </ActionButton>
      </div>
      </div>
    </CatalogSection>
    <CatalogSection id="sticky-context" title="StickyContextBar"
      description="При прокрутке длинного материала сохраняет его название, контекст и главное действие. Витрина показывает оба состояния без прокрутки глобального header.">
      <div className="demo-column" style={{width:"min(100%, 610px)",gap:18}}>
        <StickyContextBar visible={false} title="Длинный материал" eyebrow="Сборник"/>
        <div style={{height:52,fontSize:12,color:"var(--ink-soft)"}}>До прокрутки: компактная панель скрыта, заголовок документа остаётся на месте.</div>
        <div style={{position:"relative",height:82,paddingTop:10}}>
          <StickyContextBar visible title="Как устроен восстановимый пайплайн" eyebrow="Исследование · Workflow"
            status="3 / 12" actions={<ActionButton size="sm" variant="accent" onClick={()=>setOverlay("sheet")}>Разобрать</ActionButton>}/>
          <div style={{fontSize:12,paddingTop:60,color:"var(--ink-soft)"}}>После прокрутки: компактный контекст, без дополнительного глобального меню.</div>
        </div>
      </div>
    </CatalogSection>
    <CatalogSection id="workspace-action-bar" title="WorkspaceActionBar"
      description="Статус слева и действия справа. В редакторе это footer вне скролла текста, а не перекрытие поля.">
      <div style={{width:"min(100%, 520px)"}}>
        <WorkspaceActionBar placement="footer" status="Изменений нет"
          actions={<ActionButton size="md" variant="accent" onClick={()=>setOverlay("sheet")}>Продолжить</ActionButton>} />
      </div>
    </CatalogSection>
    <CatalogSection id="workspace-empty-state" title="WorkspaceEmptyState"
      description="Честное пустое состояние без выдуманных карточек и неподконтрольной генерации данных.">
      <WorkspaceEmptyState title="Записей пока нет" description="Добавьте первую запись или поменяйте фильтр."
        action={<ActionButton onClick={()=>setOverlay("sheet")}>Новая запись</ActionButton>} />
    </CatalogSection>
    <CatalogSection id="energy" title="EnergyRadar" description="Доля действий по типам проектов. Переключатель меняет период.">
      <EnergyRadar items={items} horizons={horizons} activeHorizon={horizon} onHorizonChange={changeHorizon} totalCount={total} totalLabel="действий" />
    </CatalogSection>
    <CatalogSection id="spider" title="SpiderRadar" description="Те же данные на четырёх осях."><SpiderRadar size={240} axes={items.map((item) => ({ label: item.label, value: item.percentage }))} /></CatalogSection>
    <CatalogSection id="pulse" title="HearthPulse" description="Индикатор активности. Учитывает настройку уменьшения анимации."><HearthPulse /></CatalogSection>
    <CatalogSection id="voice" title="VoiceWaveIndicator" description="Состояния индикатора речи."><VoiceWaveIndicator isSpeaking={speaking} level={0.7} /><ActionButton onClick={() => setSpeaking(!speaking)}>{speaking ? "Выключить пример" : "Включить пример"}</ActionButton></CatalogSection>
    <CatalogSection id="inspector" title="InspectDrawer" description="Боковая панель с подробностями."><ActionButton onClick={() => setOverlay("sheet")}>Открыть InspectDrawer</ActionButton></CatalogSection>
    <CatalogSection id="digest" title="ReceiptDigestModal" description="Окно с итогами и списком изменений."><ActionButton onClick={() => setOverlay("digest")}>Открыть ReceiptDigestModal</ActionButton></CatalogSection>
    <InspectDrawer isOpen={overlay === "sheet"} title="Описание проекта" onClose={() => setOverlay(null)}><p>Здесь можно разместить описание, ссылки и другие подробности проекта.</p><p>Закрыть панель можно кнопкой, клавишей Esc или нажатием вне её.</p></InspectDrawer>
    <InspectDrawer isOpen={overlay === "composition"} title="Читать оригинал"
      size="wide" onClose={()=>setOverlay(null)}
      compactContext={{title:"Background agents are here. Your orchestration isn't ready",eyebrow:"EXA",
        status:"2 / 15",actions:<button type="button" onClick={()=>setOverlay(null)}>Готово</button>}}>
      <SurfaceHeader collapseAnchor title="Background agents are here. Your orchestration isn't ready"
        eyebrow="ПОЛНЫЙ ИЗВЛЕЧЁННЫЙ ТЕКСТ · EXA" subtitle="inngest.com"
        actions={<button type="button" onClick={()=>setOverlay(null)}>Открыть сайт · пример</button>}/>
      <WorkflowStrip label="Перевод · ревью · исправление" status="2 / 15"
        progress={{value:2,max:15}} actions={<button onClick={()=>setOverlay(null)}>Пауза</button>}/>
      <InspectorMeta summary="Exa · 9 988 символов · Кеш">
        <p>Информация о происхождении и полноте доступна здесь, но не выталкивает статью ниже экрана.</p>
      </InspectorMeta>
      <div style={{maxWidth:"70ch",marginInline:"auto",fontFamily:"var(--font-serif)",fontSize:18,lineHeight:1.8}}>
        {Array.from({length:18},(_,i)=><p key={i} style={{marginBottom:22}}>Every six months, the way to build an AI agent changes. A clear, compact header leaves space for reading rather than making the reader scroll through controls and disclaimers.</p>)}
      </div>
    </InspectDrawer>
    <ReceiptDigestModal isOpen={overlay === "digest"} title="Пример итогов" narrative="Обновили витрину компонентов." receipts={["Добавили фон первого экрана", "Обновили примеры компонентов"]} onClose={() => setOverlay(null)} />
  </section>;
}
