"use client";

import { useSyncExternalStore } from "react";
import { ScrambleText } from "@/components/motion/scramble.tsx";
import { OPEN_EVENT } from "./palette-dialog.tsx";

const isMac = () => /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

/**
 * Header button for the command palette. Below 768 px it reads "Menu" and is
 * the section navigation; above, "Search" plus the shortcut. The shortcut
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
      className="mono-label inline-flex min-h-11 items-center gap-2 px-2 text-ink-2 hover:text-ink"
    >
      <span className="md:hidden">
        <ScrambleText text={labels.menu} />
      </span>
      <span className="hidden md:inline">
        <ScrambleText text={labels.open} />
      </span>
      <kbd aria-hidden="true" className="hidden rounded-xs border border-hair px-1.5 font-mono text-mono text-ink-3 md:inline">
        {mac ? "⌘K" : "Ctrl K"}
      </kbd>
    </button>
  );
}
