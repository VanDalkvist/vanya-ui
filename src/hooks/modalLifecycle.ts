type Entry = { dialog: HTMLDialogElement; opener: HTMLElement | null; openerOwner?: Entry };
type Stack = { entries: Entry[]; overflow: string; priority: string };
const stacks = new WeakMap<Document, Stack>();

/** Document-owned native modal lifetime. Each release is idempotent, including
 * out-of-order unmounts. Product state remains in the caller. */
export function openModal(dialog: HTMLDialogElement): () => void {
  const doc = dialog.ownerDocument;
  const body = doc.body;
  const opener = doc.activeElement as HTMLElement | null;
  dialog.showModal();
  let stack = stacks.get(doc);
  if (!stack) {
    stack = { entries: [], overflow: body.style.getPropertyValue("overflow"), priority: body.style.getPropertyPriority("overflow") };
    stacks.set(doc, stack);
    body.style.setProperty("overflow", "hidden");
  }
  const entry: Entry = { dialog, opener, openerOwner: stack.entries.find(item=>item.dialog.contains(opener)) };
  stack.entries.push(entry);
  dialog.querySelector<HTMLButtonElement>("button")?.focus();
  return () => {
    const index = stack.entries.indexOf(entry);
    if (index < 0) return;
    const wasTop = index === stack.entries.length - 1;
    stack.entries.splice(index, 1);
    // An upper dialog may have been opened from the lower dialog being removed.
    for (const remaining of stack.entries) {
      if (remaining.openerOwner===entry) {
        remaining.opener=entry.opener;
        remaining.openerOwner=entry.openerOwner;
      }
    }
    if (dialog.open) dialog.close();
    const top = stack.entries.at(-1);
    if (top) {
      if (wasTop && entry.opener?.isConnected && top.dialog.contains(entry.opener)) entry.opener.focus();
      else if (!top.dialog.contains(doc.activeElement)) top.dialog.querySelector<HTMLButtonElement>("button")?.focus();
      return;
    }
    stacks.delete(doc);
    if (stack.overflow) body.style.setProperty("overflow", stack.overflow, stack.priority);
    else body.style.removeProperty("overflow");
    if (entry.opener?.isConnected) entry.opener.focus();
  };
}
