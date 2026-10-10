"use client";

import { useSyncExternalStore } from "react";
import { ScrambleText } from "@/components/motion/scramble.tsx";
import { OPEN_EVENT } from "./palette-dialog.tsx";

const isMac = () => /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

/**
 * Header button for the command palette. Below 1024 px it reads "Menu" and is
 * the section navigation (the header links need 1024 px); above, "Search"
 * plus the shortcut. The shortcut
 * glyphs are decorative; aria-keyshortcuts announces both forms.
 */
export function PaletteTrigger({ labels }: { labels: { open: string; menu: string } }) {
  const mac = useSyncExternalStore(
    () => () => {},
    isMac,
    () => false,
  );
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
      aria-haspopup="dialog"
      aria-keyshortcuts="Control+K Meta+K"
      className="ui-label inline-flex min-h-11 rounded-pill transition-colors duration-200 ease-out hover:bg-hover items-center gap-2 px-3 text-ink-2 hover:text-ink"
    >
      <span className="lg:hidden">
        <ScrambleText text={labels.menu} />
      </span>
      <span className="hidden lg:inline">
        <ScrambleText text={labels.open} />
      </span>
      <kbd aria-hidden="true" className="hidden rounded-xs border border-hair px-1.5 font-mono text-mono text-ink-3 lg:inline">
        {mac ? "⌘K" : "Ctrl K"}
      </kbd>
    </button>
  );
}
