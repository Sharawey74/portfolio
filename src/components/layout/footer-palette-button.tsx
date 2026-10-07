"use client";

import { ScrambleText } from "@/components/motion/scramble.tsx";
import { OPEN_EVENT } from "@/components/palette/palette-dialog.tsx";

/** Opens the command palette from the footer. */
export function FooterPaletteButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-keyshortcuts="Control+K Meta+K"
      onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
      className="footer-link mono-label"
    >
      <ScrambleText text={label} />
    </button>
  );
}
