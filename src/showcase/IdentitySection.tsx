import React from "react";
import { VanyaArcLockup, VanyaArcMark } from "../index";

/** Public, reusable reference for the parent brand and its UI product. */
export function IdentitySection() {
 return <section id="identity" className="catalog identity-section" aria-labelledby="identity-title">
  <p className="guide-eyebrow">Айдентика / 02</p>
  <h2 id="identity-title" className="catalog-title">Одна форма. Семейство продуктов.</h2>
  <p className="catalog-intro">Vanya Arc — родительский бренд. UI — его дизайн-система, а не часть нового самостоятельного имени. Знак общий для всего семейства; продукт обозначается после косой черты.</p>
  <div className="identity-hero" aria-label="Основной логотип дизайн-системы">
    <VanyaArcLockup product="UI" size="lg" />
    <p>Основной горизонтальный логотип</p>
  </div>
  <div className="identity-comparisons">
    <div className="identity-panel"><span className="identity-panel-label">01 · Родительский бренд</span><VanyaArcLockup size="md"/><p>Vanya Arc — постоянный знак и цельная надпись угольного цвета.</p></div>
    <div className="identity-panel"><span className="identity-panel-label">02 · Продукт</span><VanyaArcLockup product="UI" size="md"/><p>UI — выделенный продуктовый суффикс в действующем акцентном цвете Vanya UI.</p></div>
  </div>
  <div className="identity-comparisons identity-modes">
    <div className="identity-panel identity-dark-panel dark"><span className="identity-panel-label">03 · Тёмная тема</span><VanyaArcLockup product="UI" size="md"/><p>Те же семантические токены; знак остаётся узнаваемым.</p></div>
    <div className="identity-panel"><span className="identity-panel-label">04 · Один цвет</span><VanyaArcLockup product="UI" size="md" monochrome/><p>Для печати, тиснения и ситуаций, где цвет недоступен.</p></div>
  </div>
  <div className="identity-rules">
    <article><h3>Форма</h3><p>Не заменять утверждённый знак произвольной синусоидой: короткий тёмный гребень, впадина и один большой цветной гребень переходят друг в друга без разрыва.</p></article>
    <article><h3>Написание</h3><p>Для логотипа — Manrope с ручной оптической настройкой межбуквенных интервалов. В интерфейсе остаётся обычный Manrope; отдельный шрифт или Apple SF Pro не требуются.</p></article>
    <article><h3>Иерархия</h3><p>Слова «Vanya Arc» не раскрашиваем по первым буквам: соответствие V и A уже показано знаком. Слеш второстепенный, UI — в терракотовом акценте.</p></article>
    <article><h3>Отступы и размеры</h3><p>Не сжимать и не искажать знак. Для компактной иконки использовать только символ. В маленьком размере проверять толщину штриха и контраст обеих тем.</p></article>
  </div>
  <div className="identity-palette" aria-label="Фирменные цвета из дизайн-токенов">
    <div><span className="identity-swatch" style={{background:"var(--ground)"}}/><strong>Бумага</strong><code>--ground</code></div>
    <div><span className="identity-swatch" style={{background:"var(--ink)"}}/><strong>Чернила</strong><code>--ink</code></div>
    <div><span className="identity-swatch" style={{background:"var(--accent)"}}/><strong>Терракота</strong><code>--accent</code></div>
  </div>
  <p className="catalog-intro">Для реализации используй <code>VanyaArcMark</code> и <code>VanyaArcLockup</code>, не копируй их SVG вручную. <a href="/reference/identity.md">Правила и примеры для агентов (Markdown)</a>.</p>
 </section>;
}
