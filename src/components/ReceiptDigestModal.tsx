import { useId } from "react";
import { useModalDialog } from "../hooks/useModalDialog";
import { X, Sparkles } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface ReceiptDigestModalProps {
  isOpen: boolean;
  title: string;
  narrative: string;
  receipts: string[];
  onClose: () => void;
  className?: string;
}

export function ReceiptDigestModal({
  isOpen,
  title,
  narrative,
  receipts,
  onClose,
  className,
}: ReceiptDigestModalProps) {
  const modal = useModalDialog(isOpen, onClose);
  const titleId = useId();
  if (!isOpen) return null;

  return (
    <dialog
      {...modal}
      aria-labelledby={titleId}
      aria-modal="true"
      className={twMerge(
        clsx(
          "ui-receipt-dialog fixed inset-0 m-auto max-w-xl overflow-y-auto overscroll-contain rounded-sm border border-border bg-surface p-6 text-ink shadow-2xl",
          className
        )
      )}
    >
        <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-accent" aria-hidden="true" />
            <h3 id={titleId} className="font-serif text-lg text-ink font-normal">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть окно"
            className="ui-feedback-icon grid size-9 place-items-center rounded-xs p-1 cursor-pointer"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        {/* Narrative prose */}
        <div className="mb-6 font-serif text-base leading-relaxed text-ink/90 italic">
          «{narrative}»
        </div>

        {/* Physical receipts list */}
        <div className="space-y-2 border-t border-border pt-4">
          <div className="font-mono text-xs text-ink-faint uppercase tracking-wider mb-2">
            Изменения:
          </div>
          <ul className="space-y-1.5 font-mono text-xs text-ink-soft">
            {receipts.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-accent" aria-hidden="true">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
    </dialog>
  );
}
