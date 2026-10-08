"use client";

import Image from "next/image";
import { useEffect, useRef, useState, ViewTransition } from "react";
import { subscribe } from "@/lib/motion/scheduler.ts";
import { useInView } from "@/lib/motion/use-in-view.ts";
import { useMotionPrefs } from "@/lib/motion/preferences.ts";

type Shot = { src: string; alt: string; width: number; height: number };
type Labels = { region: string; previous: string; next: string; of: string };

const INTERVAL = 4500;

/**
 * M7 screenshot carousel. Crossfades (opacity only) on the shared scheduler as
 * a "loop" task, so it stops off-screen, on a hidden tab and under the global
 * pause. It also holds while hovered or focused, and always has manual
 * previous / next controls. Under reduced motion it never autoplays.
 * Screenshots render in full color at quality 90 with `sizes` matching the
 * card column (7 of 12 from 1024 px): quality 75 plus a grayscale filter
 * blurred small UI text (docs/ISSUES.md ISS-25, ISS-26). Originals were
 * sharper still but slowed the home page on slow 4G (lighthouse-review1.md).
 * The first slide carries the shared-element name for the route morph (M8).
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
  const [held, setHeld] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root);
  const { allowMotion } = useMotionPrefs();
  const count = shots.length;

  useEffect(() => {
    if (!allowMotion || !inView || held || count < 2) return;
    let elapsed = 0;
    return subscribe((_, dt) => {
      elapsed += dt;
      if (elapsed >= INTERVAL) {
        elapsed = 0;
        setIndex((i) => (i + 1) % count);
      }
    }, "loop");
  }, [allowMotion, inView, held, count]);

  const go = (delta: number) => setIndex((i) => (i + delta + count) % count);

  return (
    <div
      ref={root}
      role="region"
      aria-roledescription="carousel"
      aria-label={labels.region}
      className="carousel flex flex-col gap-3"
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHeld(false);
      }}
    >
      <div className="carousel-frame relative aspect-[16/10] overflow-clip border border-hair bg-raised">
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
      </div>
      {count > 1 ? (
        <div className="flex items-center gap-1 font-mono text-mono text-ink-3">
          <button type="button" onClick={() => go(-1)} aria-label={labels.previous} className="carousel-btn">
            <span aria-hidden="true">←</span>
          </button>
          <button type="button" onClick={() => go(1)} aria-label={labels.next} className="carousel-btn">
            <span aria-hidden="true">→</span>
          </button>
          <span className="num ml-2" aria-live={held ? "polite" : "off"}>
            {String(index + 1).padStart(2, "0")} {labels.of} {String(count).padStart(2, "0")}
          </span>
        </div>
      ) : null}
    </div>
  );
}
