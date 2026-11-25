import React from "react";
import { VanyaArcLockup } from "../index";

/** Public, reusable reference for the parent brand and its UI product. */
export function IdentitySection() {
 return <section id="identity" className="catalog identity-section" aria-labelledby="identity-title">
  <p className="guide-eyebrow">Айдентика / 02</p>
  <h2 id="identity-title" className="catalog-title">Семейство знаков. Единая пластика волны.</h2>
  <p className="catalog-intro">Vanya Arc — зонтичный бренд. Синусоида задаёт принцип построения айдентики: каждый сервис получает индивидуальный символ, связанный с его назначением. Исходный V→A принадлежит бренду и дизайн-системе UI.</p>
  <div className="identity-hero" aria-label="Основной логотип дизайн-системы">
    <VanyaArcLockup product="UI" size="lg" />
    <p>Логотип дизайн-системы</p>
  </div>
  <div className="identity-comparisons">
    <div className="identity-panel"><span className="identity-panel-label">01 · Родительский бренд</span><VanyaArcLockup size="md"/><p>Исходный V→A — неизменный знак родительского бренда.</p></div>
    <div className="identity-panel"><span className="identity-panel-label">02 · Дизайн-система</span><VanyaArcLockup product="UI" size="md"/><p>UI использует исходный знак V→A и акцентный суффикс.</p></div>
  </div>
  <div className="identity-rules">
    <article><h3>Единое семейство</h3><p>Общие пластика волны, цветовые роли, типографика и структура Vanya Arc / Product.</p></article>
    <article><h3>Индивидуальный знак сервиса</h3><p>Геометрия отражает назначение продукта. Символ и favicon проектируются отдельно, с согласованием владельца.</p></article>
  </div>
  <div className="identity-comparisons identity-modes">
    <div className="identity-panel identity-dark-panel dark"><span className="identity-panel-label">03 · Тёмная тема</span><VanyaArcLockup product="UI" size="md"/><p>Те же токены, но для тёмного фона.</p></div>
    <div className="identity-panel"><span className="identity-panel-label">04 · Один цвет</span><VanyaArcLockup product="UI" size="md" monochrome/><p>Для печати и поверхностей без цвета.</p></div>
  </div>
  <div className="identity-rules">
    <article><h3>Форма</h3><p>Волна — генеративный принцип. Продуктовый знак получает свою геометрию и смысл; исходный V→A сохраняет утверждённый контур.</p></article>
    <article><h3>Написание</h3><p>Логотип — Manrope с настроенными интервалами. Текст интерфейса — обычный Manrope. Отдельный шрифт не нужен.</p></article>
    <article><h3>Иерархия</h3><p>Общая структура: символ, Vanya Arc, второстепенный слеш и акцентное название сервиса.</p></article>
    <article><h3>Отступы и размеры</h3><p>Сохраняй пропорции своего символа. Favicon повторяет индивидуальную форму продукта. Проверь 16/24/32 px, обе темы и монохром.</p></article>
  </div>
  <div className="identity-palette" aria-label="Фирменные цвета из дизайн-токенов">
    <div><span className="identity-swatch" style={{background:"var(--ground)"}}/><strong>Бумага</strong><code>--ground</code></div>
    <div><span className="identity-swatch" style={{background:"var(--ink)"}}/><strong>Чернила</strong><code>--ink</code></div>
    <div><span className="identity-swatch" style={{background:"var(--accent)"}}/><strong>Терракота</strong><code>--accent</code></div>
  </div>
  <p className="catalog-intro">Для родителя и UI используй <code>VanyaArcMark</code>. Для другого сервиса передай утверждённый компонент в <code>VanyaArcLockup productMark</code>. До утверждения допустим временный текстовый lockup. <a href="/reference/identity.md">Правила и примеры для агентов (Markdown)</a>. <a href="https://github.com/VanDalkvist/vanya-arc-brand/blob/main/BRAND.md" target="_blank" rel="noopener noreferrer">Правила бренда</a>.</p>
 </section>;
}
