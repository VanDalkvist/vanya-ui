import React from "react";
import { ChapterHeader } from "./ChapterHeader";
import { VanyaArcLockup } from "../index";

/** Public, reusable reference for the parent brand and its UI product. */
export function IdentitySection() {
 return <section id="identity" className="catalog identity-section" aria-labelledby="identity-title">
  <ChapterHeader id="identity" description="Vanya Arc и дизайн-система UI используют общий знак V→A. У каждого другого сервиса — свой знак в форме волны, связанный с назначением продукта."/>
  <div className="identity-hero" aria-label="Основной логотип дизайн-системы">
    <VanyaArcLockup product="UI" size="lg" />
    <p>Логотип дизайн-системы</p>
  </div>
  <div className="identity-comparisons">
    <div className="identity-panel"><span className="identity-panel-label">Родительский бренд</span><VanyaArcLockup size="md"/><p>Утверждённый знак V→A.</p></div>
    <div className="identity-panel"><span className="identity-panel-label">Дизайн-система</span><VanyaArcLockup product="UI" size="md"/><p>К знаку и названию бренда добавляется UI акцентного цвета.</p></div>
  </div>
  <div className="identity-rules">
    <article><h3>Единое семейство</h3><p>Знаки объединяют форма волны, цвета, шрифт и написание Vanya Arc / Product.</p></article>
    <article><h3>Индивидуальный знак сервиса</h3><p>Форма знака отражает назначение сервиса. Знак и иконку вкладки согласовывают с владельцем.</p></article>
  </div>
  <div className="identity-comparisons identity-modes">
    <div className="identity-panel identity-dark-panel dark"><span className="identity-panel-label">Тёмная тема</span><VanyaArcLockup product="UI" size="md"/><p>Цвета адаптируются к тёмному фону.</p></div>
    <div className="identity-panel"><span className="identity-panel-label">Один цвет</span><VanyaArcLockup product="UI" size="md" monochrome/><p>Для печати и поверхностей без цвета.</p></div>
  </div>
  <div className="identity-rules">
    <article><h3>Форма</h3><p>Новый знак строится на основе волны. Контур V→A сохраняется.</p></article>
    <article><h3>Написание</h3><p>В логотипе используется Manrope с индивидуальными межбуквенными интервалами. В интерфейсе — Manrope со стандартными интервалами.</p></article>
    <article><h3>Иерархия</h3><p>Знак, название Vanya Arc, косая черта и название сервиса акцентного цвета.</p></article>
    <article><h3>Отступы и размеры</h3><p>Сохраняй пропорции своего символа. Favicon повторяет индивидуальную форму продукта. Проверь 16/24/32 px, обе темы и монохром.</p></article>
  </div>
  <div className="identity-palette" aria-label="Фирменные цвета из дизайн-токенов">
    <div><span className="identity-swatch" style={{background:"var(--ground)"}}/><strong>Бумага</strong><code>--ground</code></div>
    <div><span className="identity-swatch" style={{background:"var(--ink)"}}/><strong>Чернила</strong><code>--ink</code></div>
    <div><span className="identity-swatch" style={{background:"var(--accent)"}}/><strong>Терракота</strong><code>--accent</code></div>
  </div>
  <p className="catalog-intro">Для родителя и UI используй <code>VanyaArcMark</code>. Для другого сервиса передай утверждённый компонент в <code>VanyaArcLockup productMark</code>. До утверждения допустим временный текстовый lockup с <code>showMark=false</code>. <a href="/reference/identity.md" target="_blank" rel="noopener noreferrer">Правила и примеры для агентов (Markdown)<span aria-hidden="true" className="ui-inline-new-tab-marker"> ↗</span></a>. <a href="https://github.com/VanDalkvist/vanya-arc-brand/blob/main/BRAND.md" target="_blank" rel="noopener noreferrer">Правила бренда<span aria-hidden="true" className="ui-inline-new-tab-marker"> ↗</span></a>.</p>
 </section>;
}
