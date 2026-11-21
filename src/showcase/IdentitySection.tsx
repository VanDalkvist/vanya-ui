import React from "react";
import { VanyaArcLockup, VanyaArcMark } from "../index";

/** Public, reusable reference for the parent brand and its UI product. */
export function IdentitySection() {
 return <section id="identity" className="catalog identity-section" aria-labelledby="identity-title">
  <p className="guide-eyebrow">Айдентика / 02</p>
  <h2 id="identity-title" className="catalog-title">Один знак для всех продуктов.</h2>
  <p className="catalog-intro">Vanya Arc — название бренда. UI — его дизайн-система. У них общий знак и одно написание. Название продукта стоит после косой черты.</p>
  <div className="identity-hero" aria-label="Основной логотип дизайн-системы">
    <VanyaArcLockup product="UI" size="lg" />
    <p>Логотип дизайн-системы</p>
  </div>
  <div className="identity-comparisons">
    <div className="identity-panel"><span className="identity-panel-label">01 · Родительский бренд</span><VanyaArcLockup size="md"/><p>Знак и название Vanya Arc не меняются от продукта к продукту.</p></div>
    <div className="identity-panel"><span className="identity-panel-label">02 · Продукт</span><VanyaArcLockup product="UI" size="md"/><p>Название UI выделено акцентом. Слеш остаётся второстепенным.</p></div>
  </div>
  <div className="identity-comparisons identity-modes">
    <div className="identity-panel identity-dark-panel dark"><span className="identity-panel-label">03 · Тёмная тема</span><VanyaArcLockup product="UI" size="md"/><p>Те же токены, но для тёмного фона.</p></div>
    <div className="identity-panel"><span className="identity-panel-label">04 · Один цвет</span><VanyaArcLockup product="UI" size="md" monochrome/><p>Для печати и поверхностей без цвета.</p></div>
  </div>
  <div className="identity-rules">
    <article><h3>Форма</h3><p>У знака два разных по высоте изгиба. Тёмный переходит в терракотовый одним штрихом. Не заменяй его обычной синусоидой.</p></article>
    <article><h3>Написание</h3><p>Логотип — Manrope с настроенными интервалами. Текст интерфейса — обычный Manrope. Отдельный шрифт не нужен.</p></article>
    <article><h3>Иерархия</h3><p>Vanya Arc пишем одним цветом. UI выделяем терракотовым. Буквы V и A уже связаны в знаке.</p></article>
    <article><h3>Отступы и размеры</h3><p>Не растягивай знак. В тесном месте показывай только символ. Проверь его читаемость в обеих темах.</p></article>
  </div>
  <div className="identity-palette" aria-label="Фирменные цвета из дизайн-токенов">
    <div><span className="identity-swatch" style={{background:"var(--ground)"}}/><strong>Бумага</strong><code>--ground</code></div>
    <div><span className="identity-swatch" style={{background:"var(--ink)"}}/><strong>Чернила</strong><code>--ink</code></div>
    <div><span className="identity-swatch" style={{background:"var(--accent)"}}/><strong>Терракота</strong><code>--accent</code></div>
  </div>
  <p className="catalog-intro">Для реализации используй <code>VanyaArcMark</code> и <code>VanyaArcLockup</code>, не копируй их SVG вручную. <a href="/reference/identity.md">Правила и примеры для агентов (Markdown)</a>. <a href="https://github.com/VanDalkvist/vanya-arc-brand/blob/main/BRAND.md" target="_blank" rel="noopener noreferrer">Правила бренда</a>.</p>
 </section>;
}
