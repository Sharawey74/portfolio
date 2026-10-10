"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Shot = { src: string; alt: string; width: number; height: number };

/**
 * Screenshot grid with a zoom view: a native modal <dialog> (focus trap, Esc,
 * top layer) opened with showModal(). closedby="any" gives light dismiss;
 * Safari lacks it, so a click on the backdrop closes it there too. Images are
 * the original files in full color (docs/ISSUES.md ISS-25, ISS-26).
 */
export function ZoomGallery({
  shots,
  labels,
}: {
  shots: Shot[];
  labels: { zoom: string; close: string; cursor: string };
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<Shot | null>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  useEffect(() => {
    const d = dialog.current;
    if (!d || "closedBy" in HTMLDialogElement.prototype) return;
    // Light-dismiss fallback: a click whose point lies outside the dialog box.
    const onClick = (e: MouseEvent) => {
      const r = d.getBoundingClientRect();
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (!inside) d.close();
    };
    d.addEventListener("click", onClick);
    return () => d.removeEventListener("click", onClick);
  }, []);

  return (
    <>
      <ul className="rise-group grid grid-cols-2 gap-3 md:grid-cols-3">
        {shots.map((s) => (
          <li key={s.src} className="overflow-clip rounded-inner border border-hair bg-raised">
            <button
              type="button"
              onClick={() => setOpen(s)}
              data-cursor={labels.cursor}
              className="group block w-full overflow-clip"
            >
              <span className="sr-only">
                {labels.zoom}: {s.alt}
              </span>
              <Image
                src={s.src}
                alt=""
                width={s.width}
                height={s.height}
                unoptimized
                loading="lazy"
                className="aspect-[16/10] w-full object-cover object-top"
              />
            </button>
          </li>
        ))}
      </ul>
      <dialog
        ref={dialog}
        closedby="any"
        aria-label={open?.alt}
        onClose={() => setOpen(null)}
        className="zoom-dialog"
      >
        {open ? (
          <figure className="flex flex-col gap-3">
            <Image src={open.src} alt={open.alt} width={open.width} height={open.height} unoptimized className="max-h-[80vh] w-auto" />
            <figcaption className="flex items-center justify-between gap-6 font-mono text-mono text-ink-2">
              <span>{open.alt}</span>
              <button type="button" onClick={() => setOpen(null)} className="flow-btn" autoFocus>
                {labels.close}
              </button>
            </figcaption>
          </figure>
        ) : null}
      </dialog>
    </>
  );
}
