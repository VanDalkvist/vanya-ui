import React from "react";
import { InspectDrawer, Kbd, ShortcutKeys } from "../index";
import { SHOWCASE_SHORTCUTS } from "./shortcut-spec";

export interface ShowcaseShortcutHelpProps {
  open: boolean;
  onClose: () => void;
  enabled: boolean;
  onEnabledChange: (value: boolean) => void;
}

/** Actual runnable shortcuts; not a decorative cheatsheet. */
export function ShowcaseShortcutHelp({ open, onClose, enabled, onEnabledChange }: ShowcaseShortcutHelpProps) {
  return <InspectDrawer isOpen={open} onClose={onClose} title="Горячие клавиши">
    <p>Можно перейти к разделу без мыши. Сначала нажми <Kbd>G</Kbd>, затем букву. Системные сочетания браузера продолжают работать.</p>
    <div className="shortcut-help-list" aria-label="Переходы по разделам">
      {SHOWCASE_SHORTCUTS.map(item => <div className="shortcut-help-row" key={item.id}>
        <a href={`/#${item.id}`} onClick={onClose}>{item.label}</a>
        <ShortcutKeys keys={["G", item.key.toUpperCase()]} />
      </div>)}
      <div className="shortcut-help-row"><span>Открыть эту справку</span><ShortcutKeys keys={["?"]}/></div>
      <div className="shortcut-help-row"><span>Закрыть панель</span><ShortcutKeys keys={["Esc"]}/></div>
    </div>
    <label className="shortcut-preference">
      <input type="checkbox" checked={enabled} onChange={event => onEnabledChange(event.target.checked)}/>
      <span><strong>Быстрые переходы включены</strong><small>Отключи, если буквы мешают. Выбор сохранится в браузере.</small></span>
    </label>
    <p>Сокращения не срабатывают в полях ввода, во время набора текста или внутри открытых окон. Все разделы доступны и через обычные ссылки в шапке.</p>
    <a href="/#keyboard-shortcuts" onClick={onClose}>Правила горячих клавиш в дизайн-системе</a>
  </InspectDrawer>;
}
