"use client";

import Image from "next/image";
import { useEffect, useRef, useState, ViewTransition, type KeyboardEvent } from "react";
import { subscribe } from "@/lib/motion/scheduler.ts";
import { useInView } from "@/lib/motion/use-in-view.ts";
import { useMotionPrefs } from "@/lib/motion/preferences.ts";

type Shot = { src: string; alt: string; width: number; height: number };
type Labels = { region: string; previous: string; next: string; of: string; figure: string; screenshot: string };

const INTERVAL = 4500;

/**
 * M7 screenshot slider (Stage 7). Autoplay runs on the shared scheduler as a
 * "loop" task, so it stops off-screen, on a hidden tab and under the global
 * pause; it also holds while hovered or focused, and never runs under reduced
 * motion. The progress bars above the frame show where it is (the active bar
 * fills while it plays); previous / next buttons, the dots and the arrow keys
 * (with the slider focused) move by hand. The next screenshot wipes in from
 * the side it travels from (clip-path, both images fully opaque, so colors
 * never wash out mid-change).
 * Screenshots render in full color at quality 90 with `sizes` matching the
 * card column (docs/ISSUES.md ISS-25, ISS-26). The first slide carries the
 * shared-element name for the route morph (M8).
 */
export function ScreenshotCarousel({
  shots,
  labels,
  transitionName,
}: {
  shots: Shot[];
  labels: Labels;
  transitionName: string;
}) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<"next" | "prev">("next");
  const [held, setHeld] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLElement | null>(null);
  const elapsed = useRef(0);
  const inView = useInView(root);
  const { allowMotion } = useMotionPrefs();
  const count = shots.length;
  const playing = allowMotion && inView && !held && count > 1;

  useEffect(() => {
    if (!playing) return;
    return subscribe((_, dt) => {
      elapsed.current += dt;
      if (elapsed.current >= INTERVAL) {
        elapsed.current = 0;
        setDir("next");
        setIndex((i) => (i + 1) % count);
      }
      bar.current?.style.setProperty("--p", String(Math.min(1, elapsed.current / INTERVAL)));
    }, "loop");
  }, [playing, count]);

  const go = (to: number, d: "next" | "prev") => {
    elapsed.current = 0;
    setDir(d);
    setIndex((to + count) % count);
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(index + 1, "next");
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(index - 1, "prev");
    }
  };
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div
      ref={root}
      role="region"
      aria-roledescription="carousel"
      aria-label={labels.region}
      tabIndex={count > 1 ? 0 : undefined}
      onKeyDown={count > 1 ? onKey : undefined}
      data-dir={dir}
      data-playing={playing ? "" : undefined}
      className="carousel flex flex-col gap-3 rounded-inner"
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHeld(false);
      }}
    >
      {count > 1 ? (
        <div aria-hidden="true" className="flex gap-1.5">
          {shots.map((s, i) => (
            <span key={s.src} className="carousel-bar" data-state={i < index ? "done" : i === index ? "on" : undefined}>
              <i
                ref={
                  i === index
                    ? (el) => {
                        bar.current = el;
                        el?.style.setProperty("--p", String(elapsed.current / INTERVAL));
                      }
                    : undefined
                }
              />
            </span>
          ))}
        </div>
      ) : null}
      <div className="carousel-frame relative aspect-[16/10] overflow-clip rounded-inner border border-hair bg-raised">
        {shots.map((s, i) => {
          const img = (
            <Image
              src={s.src}
              alt={s.alt}
              width={s.width}
              height={s.height}
              sizes="(min-width: 1024px) 55vw, 100vw"
              quality={90}
              loading="lazy"
              fetchPriority={i === 0 ? "auto" : "low"}
              className="size-full object-cover object-top"
            />
          );
          return (
            <div
              key={s.src}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} ${labels.of} ${count}`}
              aria-hidden={i !== index}
              data-active={i === index ? "" : undefined}
              className="carousel-slide absolute inset-0"
            >
              {i === 0 ? (
                <ViewTransition name={transitionName} share="morph" default="none">
                  {img}
                </ViewTransition>
              ) : (
                img
              )}
            </div>
          );
        })}
        {count > 1 ? (
          <>
            <button type="button" onClick={() => go(index - 1, "prev")} aria-label={labels.previous} className="carousel-arrow start-3">
              <span aria-hidden="true">←</span>
            </button>
            <button type="button" onClick={() => go(index + 1, "next")} aria-label={labels.next} className="carousel-arrow end-3">
              <span aria-hidden="true">→</span>
            </button>
          </>
        ) : null}
      </div>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <p className="mono-label min-w-0 flex-1 pt-1 text-ink-3" aria-live={held ? "polite" : "off"}>
          {labels.figure} <span className="num">{pad(index + 1)} / {pad(count)}</span>
          <span className="normal-case tracking-normal"> · {shots[index]!.alt}</span>
        </p>
        {count > 1 ? (
          <div className="flex flex-none items-center">
            {shots.map((s, i) => (
              <button
                key={s.src}
                type="button"
                onClick={() => go(i, i < index ? "prev" : "next")}
                aria-label={`${labels.screenshot} ${i + 1} ${labels.of} ${count}`}
                aria-current={i === index ? "true" : undefined}
                className="carousel-dot"
              >
                <span aria-hidden="true" />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
