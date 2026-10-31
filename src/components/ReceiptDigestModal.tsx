import { useEffect } from "react";
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
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ground/85 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        data-testid="modal-backdrop"
      />

      {/* Modal Card */}
      <div
        className={twMerge(
          clsx(
            "relative z-10 w-full max-w-xl rounded-sm border border-hairline bg-surface p-6 shadow-2xl transition-all duration-200",
            className
          )
        )}
      >
        <div className="flex items-center justify-between border-b border-hairline pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-amber" />
            <h3 className="font-serif text-lg text-ink font-normal">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть выжимку"
            className="rounded-xs p-1 text-ink-soft hover:bg-surface-raised hover:text-ink cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Narrative prose */}
        <div className="mb-6 font-serif text-base leading-relaxed text-ink/90 italic">
          «{narrative}»
        </div>

        {/* Physical receipts list */}
        <div className="space-y-2 border-t border-hairline pt-4">
          <div className="font-mono text-xs text-ink-faint uppercase tracking-wider mb-2">
            Физические подтверждения (Receipts):
          </div>
          <ul className="space-y-1.5 font-mono text-xs text-ink-soft">
            {receipts.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
