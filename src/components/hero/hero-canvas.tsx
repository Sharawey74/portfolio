"use client";

import { useEffect, useRef } from "react";
import { subscribe } from "@/lib/motion/scheduler.ts";
import { createNodes, edgesOf, LINK_DISTANCE, rng, SEED, type Node } from "./node-field.ts";

const MAX_DPR = 2;
const POINTER_RADIUS = 180;
const PACKET_SPEED = 0.0011; // edge lengths per ms

type Colors = { line: string; node: string; near: string; packet: string };

function readColors(): Colors {
  const s = getComputedStyle(document.documentElement);
  const v = (name: string) => s.getPropertyValue(name).trim();
  return { line: v("--g5"), node: v("--g7"), near: v("--g9"), packet: v("--break") };
}

/**
 * M4 canvas. Monochrome node graph that leans toward the pointer; one packet
 * (the single allowed --break mark in this graphic) hops along edges.
 *
 * - Loaded lazily after first paint by HeroGraph; never rendered on the server.
 * - Runs as a "loop" task on the shared scheduler: stops under the global
 *   pause, on a hidden tab, and when `active` is false (hero off-screen).
 * - DPR capped at 2; at most 80 nodes on desktop, 30 below 768 px.
 * - Colors come from the live tokens and follow theme changes.
 */
export default function HeroCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useRef<{ draw: () => void; step: (dt: number) => void } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    let colors = readColors();
    const pointer = { x: -9999, y: -9999, on: false };
    const rand = rng(SEED + 1);
    const packet = { from: 0, to: 1, t: 0 };

    const nextHop = () => {
      const edges = edgesOf(nodes);
      const options = edges.filter(([a, b]) => a === packet.to || b === packet.to);
      const pick = options[Math.floor(rand() * options.length)];
      packet.from = packet.to;
      packet.to = pick ? (pick[0] === packet.to ? pick[1] : pick[0]) : Math.floor(rand() * nodes.length);
      packet.t = 0;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, MAX_DPR);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = width < 768 ? 30 : Math.min(80, Math.round((width * height) / 22000));
      nodes = createNodes(count, width, height);
      packet.from = 0;
      packet.to = 1;
      packet.t = 0;
      draw();
    };

    const step = (dt: number) => {
      for (const n of nodes) {
        n.x += n.vx * dt;
        n.y += n.vy * dt;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      }
      packet.t += PACKET_SPEED * dt;
      if (packet.t >= 1) nextHop();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      // Pointer pull is drawn, not simulated: nodes near the pointer are
      // displaced toward it, so they settle back the moment it leaves.
      const pos = nodes.map((n) => {
        if (!pointer.on) return n;
        const dx = pointer.x - n.x;
        const dy = pointer.y - n.y;
        const d = Math.hypot(dx, dy);
        if (d > POINTER_RADIUS) return n;
        const k = (1 - d / POINTER_RADIUS) * 0.22;
        return { ...n, x: n.x + dx * k, y: n.y + dy * k };
      });

      ctx.lineWidth = 1;
      ctx.strokeStyle = colors.line;
      for (const [a, b, s] of edgesOf(pos, LINK_DISTANCE)) {
        ctx.globalAlpha = 0.25 + s * 0.75;
        ctx.beginPath();
        ctx.moveTo(pos[a]!.x, pos[a]!.y);
        ctx.lineTo(pos[b]!.x, pos[b]!.y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      for (const n of pos) {
        const near = pointer.on && Math.hypot(pointer.x - n.x, pointer.y - n.y) < POINTER_RADIUS;
        ctx.fillStyle = near ? colors.near : colors.node;
        ctx.beginPath();
        ctx.arc(n.x, n.y, near ? 2.5 : 2, 0, Math.PI * 2);
        ctx.fill();
      }

      const a = pos[packet.from];
      const b = pos[packet.to];
      if (a && b) {
        ctx.fillStyle = colors.packet;
        ctx.beginPath();
        ctx.arc(a.x + (b.x - a.x) * packet.t, a.y + (b.y - a.y) * packet.t, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    state.current = { draw, step };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const host = canvas.parentElement!;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.on = true;
    };
    const onLeave = () => {
      pointer.on = false;
    };
    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);

    const mo = new MutationObserver(() => {
      colors = readColors();
      draw();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    return () => {
      ro.disconnect();
      mo.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      state.current = null;
    };
  }, []);

  useEffect(() => {
    if (!active) return;
    return subscribe((_, dt) => {
      state.current?.step(dt);
      state.current?.draw();
    }, "loop");
  }, [active]);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 size-full" />;
}
