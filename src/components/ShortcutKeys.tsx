import React from "react";
import { clsx } from "clsx";
import { Kbd } from "./Kbd";
import type { ComponentSize } from "../sizes";

export interface ShortcutKeysProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Render keys in the order the user presses them. */
  keys: readonly string[];
  /** "sequence": press one key then another; "combo": hold together. */
  mode?: "sequence" | "combo";
  size?: ComponentSize;
  lit?: boolean;
}

/** A quiet, accessible shortcut label using the library's existing Kbd primitive. */
export function ShortcutKeys({ keys, mode = "sequence", size = "sm", lit = false, className, ...props }: ShortcutKeysProps) {
  const accessible = keys.join(mode === "sequence" ? ", затем " : " плюс ");
  return <span {...props} className={clsx("ui-shortcut-keys", className)}>
    <span className="sr-only">{accessible}</span>
    <span aria-hidden="true" className="ui-shortcut-keys-visual">
      {keys.map((key, index) => <React.Fragment key={index}>
        {index > 0 && <span className="ui-shortcut-join">{mode === "combo" ? "+" : "→"}</span>}
        <Kbd size={size} lit={lit}>{key}</Kbd>
      </React.Fragment>)}
    </span>
  </span>;
}
