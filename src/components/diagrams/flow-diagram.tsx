"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Project } from "@/data/projects.ts";
import { useLenis } from "@/components/motion/smooth-scroll.tsx";
import { useMotionPrefs } from "@/lib/motion/preferences.ts";
import { subscribe } from "@/lib/motion/scheduler.ts";
import { useInView } from "@/lib/motion/use-in-view.ts";
import { exitPoint, layouts } from "./layouts.ts";

type Flow = NonNullable<Project["flow"]>;
type Labels = { play: string; pause: string; step: string; restart: string; scrub: string; steps: string };

const TRAVEL_MS = 900;
const DWELL_MS = 500;
const END_DWELL_MS = 1600;

/**
 * M9 animated architecture diagram, drawn only from `flow` (sourced nodes and
 * steps). Edges draw on (transform `scale` from their start point), then one
 * packet (the single --break mark) travels the steps in order.
 *
 *  - Static final state (all edges, no packet, full step list) with JS off,
 *    under reduced motion, and before the figure enters the viewport.
 *  - Autoplay is a "loop" task: stops off-screen, on a hidden tab and under
 *    the global pause. Step and Restart work without autoplay.
 *  - "Follow scroll" maps progress to the figure's position via Lenis' own
 *    scroll callback (offered only when Lenis is running).
 *  - The ordered step list is the text equivalent; the current step carries
 *    aria-current="step" and a → marker, never color alone.
 */
export function FlowDiagram({ slug, flow, labels }: { slug: string; flow: Flow; labels: Labels }) {
  const layout = layouts[slug];
  if (!layout) throw new Error(`FlowDiagram: no layout for "${slug}"`);
  for (const n of flow.nodes) if (!layout.at[n.id]) throw new Error(`FlowDiagram: layout "${slug}" lacks node "${n.id}"`);

  const hasAlt = flow.steps.some((s) => s.branch === "alt");
  const [path, setPath] = useState<"main" | "alt">("main");
  // A path is its own branch plus the shared steps, in source order.
  const steps = useMemo(() => flow.steps.filter((s) => s.branch === "both" || s.branch === path), [flow.steps, path]);

  const figure = useRef<HTMLDivElement>(null);
  const packet = useRef<SVGCircleElement>(null);
  const inView = useInView(figure, { rootMargin: "0px 0px -15% 0px" });
  // Latched: edges draw on the first time the figure is seen, then stay drawn.
  const drawn = useInView(figure, { rootMargin: "0px 0px -15% 0px", once: true });
  const { allowMotion, reducedMotion } = useMotionPrefs();
  const lenis = useLenis();
  const [playing, setPlaying] = useState(true);
  const [scrub, setScrub] = useState(false);
  const [current, setCurrent] = useState(-1);
  const progress = useRef(0); // in steps: 2.5 = halfway through step index 2
  const shown = useRef(-1); // last index pushed to React state

  const { w, h } = layout.box;
  const center = (id: string) => layout.at[id]!;
  const edgeKey = (a: string, b: string) => [a, b].sort().join("|");
  const edges = useMemo(() => {
    const seen = new Map<string, { a: string; b: string; alt: boolean }>();
    for (const s of flow.steps) {
      const k = edgeKey(s.from, s.to);
      const prev = seen.get(k);
      seen.set(k, { a: s.from, b: s.to, alt: (prev ? prev.alt : true) && s.branch === "alt" });
    }
    return [...seen.values()];
  }, [flow.steps]);

  const segment = (from: string, to: string) => {
    const [ax, ay] = center(from);
    const [bx, by] = center(to);
    return [exitPoint(ax, ay, bx, by, w, h), exitPoint(bx, by, ax, ay, w, h)] as const;
  };

  // Per-frame work touches only the packet's transform; React state changes
  // only when the current step index changes.
  const markCurrent = (i: number) => {
    if (shown.current === i) return;
    shown.current = i;
    setCurrent(i);
  };
  const place = (p: number) => {
    const el = packet.current;
    if (!el) return;
    const i = Math.min(Math.floor(p), steps.length - 1);
    const s = steps[i];
    if (!s || p <= 0) {
      el.style.opacity = "0";
      markCurrent(-1);
      return;
    }
    const t = Math.min(1, p - i);
    const [[x1, y1], [x2, y2]] = segment(s.from, s.to);
    el.style.opacity = "1";
    el.style.transform = `translate(${x1 + (x2 - x1) * t}px, ${y1 + (y2 - y1) * t}px)`;
    markCurrent(i);
  };

  // Autoplay loop.
  useEffect(() => {
    if (!allowMotion || !inView || !playing || scrub || !drawn) return;
    let dwell = 0;
    return subscribe((_, dt) => {
      if (dwell > 0) {
        dwell -= dt;
        return;
      }
      const before = Math.floor(progress.current);
      progress.current += dt / TRAVEL_MS;
      if (Math.floor(progress.current) > before) dwell = DWELL_MS;
      if (progress.current >= steps.length) {
        progress.current = steps.length - 0.0001;
        place(progress.current);
        progress.current = 0;
        dwell = END_DWELL_MS;
        return;
      }
      place(progress.current);
    }, "loop");
    // place is stable for a given steps/layout; listing it would restart the loop each render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowMotion, inView, playing, scrub, drawn, steps]);

  // Scroll-scrub via Lenis' callback (no scroll listener).
  useEffect(() => {
    if (!scrub || !lenis) return;
    const onScroll = () => {
      const el = figure.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const t = Math.max(0, Math.min(1, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
      progress.current = t * steps.length;
      place(progress.current);
    };
    onScroll();
    lenis.on("scroll", onScroll);
    return () => lenis.off("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrub, lenis, steps]);

  const stepOnce = () => {
    setPlaying(false);
    setScrub(false);
    const next = Math.floor(progress.current) + 1;
    progress.current = next > steps.length ? 1 : next;
    place(progress.current - 0.0001);
  };
  const restart = () => {
    setScrub(false);
    progress.current = 0;
    place(0);
    setPlaying(true);
  };
  const switchPath = (p: "main" | "alt") => {
    setPath(p);
    progress.current = 0;
    markCurrent(-1);
    if (packet.current) packet.current.style.opacity = "0";
  };

  const activeStep = current >= 0 ? steps[current] : undefined;
  const motionUi = !reducedMotion;

  return (
    <div ref={figure} className="flow flex flex-col gap-6" data-drawn={drawn ? "" : undefined}>
      <div className="flow-canvas overflow-x-auto border border-hair bg-raised" data-lenis-prevent>
        <svg
          viewBox={`0 0 ${layout.width} ${layout.height}`}
          className="block h-auto w-full min-w-[640px]"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <pattern id={`hatch-${slug}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="6" stroke="var(--line-hair)" strokeWidth="2" />
            </pattern>
          </defs>
          <g>
            {edges.map((e, i) => {
              const [[x1, y1], [x2, y2]] = segment(e.a, e.b);
              return (
                <line
                  key={edgeKey(e.a, e.b)}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  className="flow-edge"
                  style={{ transformOrigin: `${x1}px ${y1}px`, transitionDelay: `${i * 120}ms` }}
                  stroke="var(--text-3)"
                  strokeWidth="1.5"
                  strokeDasharray={e.alt ? "5 5" : undefined}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </g>
          <g>
            {flow.nodes.map((n) => {
              const [cx, cy] = center(n.id);
              const active = activeStep && (activeStep.to === n.id || activeStep.from === n.id);
              return (
                <g key={n.id} className="flow-node" data-active={active ? "" : undefined}>
                  <rect
                    x={cx - w / 2}
                    y={cy - h / 2}
                    width={w}
                    height={h}
                    rx="2"
                    fill={`url(#hatch-${slug})`}
                    className="flow-box"
                  />
                  <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx="2" className="flow-box-face" />
                  <text x={cx} y={cy + 5} textAnchor="middle" className="flow-label">
                    {n.label}
                  </text>
                </g>
              );
            })}
          </g>
          <circle ref={packet} r="6" cx="0" cy="0" fill="var(--break)" style={{ opacity: 0 }} className="flow-packet" />
        </svg>
      </div>

      {motionUi ? (
        <div className="flex flex-wrap items-center gap-2 font-mono text-mono">
          <button type="button" className="flow-btn" aria-pressed={playing && !scrub} onClick={() => { setScrub(false); setPlaying((v) => !v); }}>
            {playing && !scrub ? labels.pause : labels.play}
          </button>
          <button type="button" className="flow-btn" onClick={stepOnce}>
            {labels.step} <span aria-hidden="true">→</span>
          </button>
          <button type="button" className="flow-btn" onClick={restart}>
            {labels.restart}
          </button>
          {lenis ? (
            <button type="button" className="flow-btn" aria-pressed={scrub} onClick={() => setScrub((v) => !v)}>
              {labels.scrub}
            </button>
          ) : null}
          {hasAlt && flow.mainLabel && flow.altLabel ? (
            <span className="ml-auto inline-flex gap-1" role="group">
              {(["main", "alt"] as const).map((p) => (
                <button key={p} type="button" className="flow-btn" aria-pressed={path === p} onClick={() => switchPath(p)}>
                  {p === "main" ? flow.mainLabel : flow.altLabel}
                </button>
              ))}
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-8 md:grid-cols-[1fr_1fr]">
        <ol className="flow-steps flex flex-col" aria-label={labels.steps}>
          {steps.map((s, i) => (
            <li key={`${path}-${i}`} title={s.source} aria-current={i === current ? "step" : undefined} className="flow-step">
              <span aria-hidden="true" className="flow-step-mark">
                →
              </span>
              <span className="num font-mono text-mono text-ink-3">{String(i + 1).padStart(2, "0")}</span>
              <span>
                <span className="font-mono text-mono text-ink-3">
                  {flow.nodes.find((n) => n.id === s.from)?.label} → {flow.nodes.find((n) => n.id === s.to)?.label}
                </span>
                <span className="block text-small text-ink-2">{s.label}</span>
              </span>
            </li>
          ))}
        </ol>
        <dl className="flex flex-col gap-3">
          {flow.nodes.map((n) => (
            <div key={n.id} title={n.source} className="border-t border-hair pt-3">
              <dt className="font-mono text-mono text-ink">{n.label}</dt>
              <dd className="text-small text-ink-2">{n.detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
