import { useCallback, useEffect, useRef, useState } from "react";
import { SHOWCASE_SHORTCUTS, SHOWCASE_SHORTCUT_STORAGE } from "./shortcut-spec";

/**
 * Optional single-letter navigation with an explicit off switch (WCAG 2.1.4).
 * A two-key sequence never overrides browser/OS Cmd/Ctrl/Alt shortcuts.
 */
export function useShowcaseShortcuts() {
  const [enabled, setEnabledState] = useState(true);
  const [helpOpen, setHelpOpen] = useState(false);
  const [awaitingDestination, setAwaitingDestination] = useState(false);
  const prefixTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const waiting = useRef(false);

  useEffect(() => {
    try { setEnabledState(window.localStorage.getItem(SHOWCASE_SHORTCUT_STORAGE) !== "off"); }
    catch { /* storage may be inaccessible */ }
  }, []);

  const setEnabled = useCallback((value: boolean) => {
    setEnabledState(value);
    try { window.localStorage.setItem(SHOWCASE_SHORTCUT_STORAGE, value ? "on" : "off"); }
    catch { /* accessibility preference still works in the current tab */ }
  }, []);

  const clearPrefix = useCallback(() => {
    waiting.current = false;
    setAwaitingDestination(false);
    if (prefixTimer.current !== null) clearTimeout(prefixTimer.current);
    prefixTimer.current = null;
  }, []);

  useEffect(() => {
    if (!enabled) clearPrefix();
  }, [enabled, clearPrefix]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!enabled || helpOpen || event.defaultPrevented || event.repeat || event.isComposing ||
          event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target;
      if (target instanceof HTMLElement && target.closest(
        'input, textarea, select, [contenteditable=""], [contenteditable="true"], [role="textbox"]'
      )) return;
      // In an open native dialog, only its own keyboard behavior applies.
      if (document.querySelector("dialog[open]")) return;

      if (event.key === "?" || (event.code === "Slash" && event.shiftKey)) {
        event.preventDefault();
        clearPrefix();
        setHelpOpen(true);
        return;
      }
      if (event.key === "Escape" && waiting.current) {
        event.preventDefault();
        clearPrefix();
        return;
      }
      if (waiting.current) {
        const destination = SHOWCASE_SHORTCUTS.find(item =>
          item.key === event.key.toLowerCase() || item.code === event.code
        );
        clearPrefix();
        if (destination && !event.shiftKey) {
          event.preventDefault();
          // A native fragment update creates a history entry and keeps Back/Forward working.
          window.location.hash = destination.id;
        }
        return;
      }
      if (!event.shiftKey && (event.key.toLowerCase() === "g" || event.code === "KeyG")) {
        waiting.current = true;
        setAwaitingDestination(true);
        prefixTimer.current = setTimeout(clearPrefix, 1800);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enabled, helpOpen, clearPrefix]);

  useEffect(() => () => { if (prefixTimer.current !== null) clearTimeout(prefixTimer.current); }, []);

  return { enabled, setEnabled, helpOpen, setHelpOpen, awaitingDestination };
}
