import React from "react";
import { ArrowUpRight, CornerDownRight } from "lucide-react";
import { ShowcaseHeader } from "./ShowcaseHeader";

const checks = [
  "У каждого экрана и значимого представления есть прямой, копируемый URL.",
  "Вставленный в новую вкладку адрес открывает то же содержимое, а обновление страницы не сбрасывает его.",
  "Назад и Вперёд восстанавливают маршрут, фильтры и выбранную подстраницу.",
  "Ссылки поддерживают клавиатуру, контекстное меню, Cmd/Ctrl-клик и открытие в новой вкладке.",
  "Клиентские переходы обновляют заголовок документа, фокус и положение прокрутки.",
  "Неизвестный путь возвращает страницу 404; сервер умеет отдавать вложенные маршруты.",
];
const semanticExample = [
  '<a href="/projects/ferma">Ферма</a>',
  '<a href="/films?list=mine">Мои фильмы</a>',
  '<button type="button" onClick={openFilters}>Фильтры</button>',
].join("\n");
const routerExample = [
  'import { Link } from "react-router";',
  '<Link to="/projects/ferma">Ферма</Link>',
].join("\n");

export function NavigationGuideline() {
  return <>
    <a href="#guideline-main" className="skip-link">К содержимому</a>
    <ShowcaseHeader active="principles" />
    <main id="guideline-main" className="guideline">
      <header className="guideline-hero">
        <p className="guideline-eyebrow">Принципы <span aria-hidden="true">/</span> 01 · Навигация</p>
        <h1>У каждой страницы — свой адрес.</h1>
        <p className="guideline-lead">Навигация браузера — часть интерфейса, а не особенность реализации. Пользователь может открыть страницу напрямую, поделиться ссылкой, вернуться назад и обновить вкладку, не теряя контекст.</p>
        <div className="guideline-hero-links">
          <a href="#rules">Правило и границы <CornerDownRight size={15} aria-hidden="true" /></a>
          <a href="#acceptance">Критерии готовности <CornerDownRight size={15} aria-hidden="true" /></a>
          <a href="https://github.com/VanDalkvist/vanya-ui/blob/main/docs/patterns/browser-navigation.md" target="_blank" rel="noopener noreferrer">Спецификация для агентов <ArrowUpRight size={15} aria-hidden="true" /></a>
        </div>
      </header>

      <section id="rules" className="guideline-section" aria-labelledby="guideline-rules-title">
        <div className="guideline-section-index"><span>01 / Модель</span></div>
        <div className="guideline-section-body">
          <h2 id="guideline-rules-title">Адрес отражает, где человек находится</h2>
          <p>Ресурс, самостоятельная страница, настройки, детальная карточка и разделяемое представление имеют собственный адрес. Внутренние состояния кнопки, ховеры и временные поповеры — нет.</p>
          <div className="guideline-paths" aria-label="Модель URL">
            <div><span>Страница</span><code>/projects/ferma</code></div>
            <div><span>Представление</span><code>/films?list=mine&amp;sort=added</code></div>
            <div><span>Раздел документа</span><code>/guidelines/navigation/#acceptance</code></div>
            <div><span>Временное состояние</span><span>Локальный state, без нового URL</span></div>
          </div>
          <p>Для вкладок действует смысловой критерий: отдельное назначение — маршрут или query; секция одного документа — <code>#fragment</code>. Не нужно создавать URL для каждого раскрытого пояснения.</p>
        </div>
      </section>

      <section id="links" className="guideline-section" aria-labelledby="guideline-links-title">
        <div className="guideline-section-index"><span>02 / Семантика</span></div>
        <div className="guideline-section-body">
          <h2 id="guideline-links-title">Ссылка ведёт. Кнопка действует.</h2>
          <p>Любой переход использует настоящий <code>&lt;a href&gt;</code> или роутерный <code>Link</code>, который его рендерит. Не заменяй переходы на <code>onClick + setState</code> и не перехватывай <code>preventDefault</code> без полноценного роутера.</p>
          <pre className="guideline-code"><code>{semanticExample}</code></pre>
          <p>В SPA — те же ссылки. Роутер улучшает переход, но не лишает ссылку стандартных возможностей.</p>
          <pre className="guideline-code"><code>{routerExample}</code></pre>
          <div className="guideline-native-demo">
            <span>Живой пример — обычные ссылки</span>
            <a href="/">На главную</a>
            <a href="/#catalog">К компонентам</a>
            <a href="#acceptance">К проверке</a>
          </div>
        </div>
      </section>

      <section id="history" className="guideline-section" aria-labelledby="guideline-history-title">
        <div className="guideline-section-index"><span>03 / Поведение</span></div>
        <div className="guideline-section-body">
          <h2 id="guideline-history-title">История браузера — источник истины</h2>
          <p>Новый переход добавляет запись истории, Back/Forward восстанавливают предыдущий экран; <code>replace</code> используется только для исправления текущего адреса. Обновление и открытие вложенного маршрута напрямую работают без посещения главной.</p>
          <p>При клиентских переходах восстанавливаются заголовок страницы, фокус на основном заголовке и прокрутка. Неизвестные и удалённые ресурсы показывают понятный 404, а не произвольный экран с чужим URL.</p>
        </div>
      </section>

      <section id="acceptance" className="guideline-section" aria-labelledby="guideline-acceptance-title">
        <div className="guideline-section-index"><span>04 / Проверка</span></div>
        <div className="guideline-section-body">
          <h2 id="guideline-acceptance-title">Что обязан проверить агент перед сдачей</h2>
          <ol className="guideline-checks">{checks.map((check, i) => <li key={i}><span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>{check}</li>)}</ol>
          <p>Тесты компонентов не заменяют проверку переходов в настоящем браузере. Серверный fallback и авторизация проверяются отдельно.</p>
        </div>
      </section>

      <footer className="guideline-sources">
        <span>Основание</span>
        <a href="https://atlassian.design/components/button/button-legacy/usage" target="_blank" rel="noopener noreferrer">Atlassian</a>
        <a href="https://www.carbondesignsystem.com/building-blocks/core/components/link/guidelines" target="_blank" rel="noopener noreferrer">Carbon</a>
        <a href="https://design-system.service.gov.uk/components/tabs/" target="_blank" rel="noopener noreferrer">GOV.UK</a>
        <a href="https://reactrouter.com/explanation/progressive-enhancement" target="_blank" rel="noopener noreferrer">React Router</a>
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/History_API/Working_with_the_History_API" target="_blank" rel="noopener noreferrer">MDN</a>
      </footer>
    </main>
    <footer className="showcase-footer"><span>@vanya/ui · Принципы</span><a href="/">К библиотеке компонентов</a></footer>
  </>;
}
