"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useLenis } from "@/components/motion/smooth-scroll.tsx";
import { switchTheme } from "@/components/theme/theme-switch.ts";
import { setPaused, useMotionPrefs } from "@/lib/motion/preferences.ts";

export const OPEN_EVENT = "palette:open";

export type PaletteItem = {
  id: string;
  group: "sections" | "projects" | "openSource" | "links" | "actions";
  label: string;
  /** Short mono hint on the right, e.g. "01" or "github.com". */
  hint?: string;
  /** Extra words that match the filter but are not shown. */
  keywords?: string;
} & (
  | { kind: "section"; target: string }
  | { kind: "page"; href: string }
  | { kind: "external"; href: string }
  | { kind: "action"; action: "theme" | "pause" }
);

type Labels = {
  title: string;
  placeholder: string;
  empty: string;
  hint: string;
  groups: Record<PaletteItem["group"], string>;
  pause: string;
  play: string;
};

const GROUP_ORDER: PaletteItem["group"][] = ["sections", "projects", "openSource", "links", "actions"];

function matches(item: PaletteItem, words: string[]) {
  const hay = `${item.label} ${item.hint ?? ""} ${item.keywords ?? ""}`.toLowerCase();
  return words.every((w) => hay.includes(w));
}

/**
 * M13 command palette. A native modal <dialog> (focus trap, Esc, top layer)
 * holding an ARIA combobox: the input keeps focus, ↑ ↓ move the active option
 * (aria-activedescendant), Enter runs it. Opened with Ctrl/Cmd+K anywhere or
 * by PaletteTrigger (the header button, which is also the mobile menu).
 * Lenis stops while it is open so the wheel scrolls the list, not the page.
 */
export function PaletteDialog({ items, labels }: { items: PaletteItem[]; labels: Labels }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listId = useId();
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();
  const { paused, reducedMotion } = useMotionPrefs();

  const shown = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    const hits = items
      .map((it) => (it.kind === "action" && it.action === "pause" ? { ...it, label: paused ? labels.play : labels.pause } : it))
      .filter((it) => !(it.kind === "action" && it.action === "pause" && reducedMotion))
      .filter((it) => matches(it, words));
    return GROUP_ORDER.flatMap((g) => hits.filter((h) => h.group === g));
  }, [items, query, paused, reducedMotion, labels.play, labels.pause]);

  const current = Math.min(active, shown.length - 1);

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && !e.altKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, onOpen);
    };
  }, []);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      lenis?.stop();
    }
    if (!open && d.open) d.close();
  }, [open, lenis]);

  // Keep the active option visible inside the list.
  useEffect(() => {
    if (!open) return;
    list.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
  }, [current, open]);

  const onClose = () => {
    setOpen(false);
    setQuery("");
    setActive(0);
    lenis?.start();
  };

  function run(item: PaletteItem) {
    dialog.current?.close();
    // The close event fires a task later; Lenis must run before scrollTo.
    lenis?.start();
    switch (item.kind) {
      case "section": {
        if (pathname !== "/") {
          router.push(`/#${item.target}`);
          return;
        }
        const el = document.getElementById(item.target);
        if (!el) return;
        if (lenis) lenis.scrollTo(el, { offset: -64 });
        else el.scrollIntoView({ block: "start" });
        // Move focus with the view, for keyboard and screen-reader users.
        if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
        el.focus({ preventScroll: true });
        return;
      }
      case "page":
        router.push(item.href);
        return;
      case "external":
        window.location.assign(item.href);
        return;
      case "action":
        if (item.action === "theme") switchTheme(null, reducedMotion);
        else setPaused(!paused);
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.nativeEvent.isComposing) return;
    const last = shown.length - 1;
    if (e.key === "ArrowDown") setActive(current >= last ? 0 : current + 1);
    else if (e.key === "ArrowUp") setActive(current <= 0 ? last : current - 1);
    else if (e.key === "Home" && e.ctrlKey) setActive(0);
    else if (e.key === "End" && e.ctrlKey) setActive(last);
    else if (e.key === "Enter" && shown[current]) run(shown[current]);
    else return;
    e.preventDefault();
  }

  const optionId = (i: number) => `${listId}-o${i}`;

  return (
    <dialog ref={dialog} closedby="any" aria-label={labels.title} onClose={onClose} className="palette" data-lenis-prevent>
      {open ? (
        <div className="flex max-h-[min(70vh,36rem)] flex-col">
          <input
            ref={input}
            autoFocus
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={shown[current] ? optionId(current) : undefined}
            aria-label={labels.title}
            placeholder={labels.placeholder}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            enterKeyHint="go"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            className="palette-input"
          />
          <div ref={list} id={listId} role="listbox" aria-label={labels.title} className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-2">
            {shown.length === 0 ? (
              <p className="px-4 py-6 text-small text-ink-3" role="status">
                {labels.empty}
              </p>
            ) : (
              GROUP_ORDER.map((g) => {
                const inGroup = shown.map((it, i) => [it, i] as const).filter(([it]) => it.group === g);
                if (inGroup.length === 0) return null;
                return (
                  <div key={g} role="group" aria-labelledby={`${listId}-${g}`}>
                    <p id={`${listId}-${g}`} className="mono-label px-4 pb-1 pt-3 text-ink-3">
                      {labels.groups[g]}
                    </p>
                    {inGroup.map(([it, i]) => (
                      <div
                        key={it.id}
                        id={optionId(i)}
                        role="option"
                        aria-selected={i === current}
                        onPointerMove={() => i !== current && setActive(i)}
                        onClick={() => run(it)}
                        className="palette-option"
                      >
                        <span className="min-w-0 truncate">{it.label}</span>
                        {it.hint ? <span className="shrink-0 font-mono text-mono text-ink-3">{it.hint}</span> : null}
                      </div>
                    ))}
                  </div>
                );
              })
            )}
          </div>
          <p className="border-t border-hair px-4 py-2 font-mono text-mono text-ink-3" aria-hidden="true">
            {labels.hint}
          </p>
        </div>
      ) : null}
    </dialog>
  );
}
