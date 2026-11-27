import { useEffect, useRef } from "react";
import type { KeyboardEvent, MouseEvent, SyntheticEvent } from "react";

/** Private native modal lifecycle; visual layout and content belong to callers. */
export function useModalDialog(isOpen: boolean, onClose: () => void) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!isOpen || !dialog) return;
    const opener = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    dialog.querySelector<HTMLButtonElement>("button")?.focus();
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      if (opener?.isConnected) opener.focus();
    };
  }, [isOpen]);

  return {
    ref,
    onCancel(event: SyntheticEvent<HTMLDialogElement>) {
      event.preventDefault();
      onClose();
    },
    onKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    },
    onClick(event: MouseEvent<HTMLDialogElement>) {
      if (event.target !== event.currentTarget) return;
      const rect = event.currentTarget.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right ||
          event.clientY < rect.top || event.clientY > rect.bottom) onClose();
    },
  };
}
