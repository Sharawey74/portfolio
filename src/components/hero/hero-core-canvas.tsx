"use client";

import { useEffect, useRef } from "react";
import { subscribe } from "@/lib/motion/scheduler.ts";

/**
 * The hero core's sphere (ISS-51), loaded on idle by HeroCore. The owner's
 * mock-up drew it with Three.js; this draws the same scene on a 2D canvas, so
 * no 3D library ships: a geodesic sphere (icosahedron, each edge in three) at
 * radius 4.8, an inner one (each edge in two) at 3.6, four planar rings from
 * 1.8 to 5.7, 140 particles between radius 2.5 and 6 and a pulsing core,
 * seen by a 45 degree camera 18 units away. Wireframe only, so draw order
 * does not matter and each layer is one path.
 */

type Vec = [number, number, number];

const CAMERA_Z = 18;
const FOCAL = 1 / Math.tan((22.5 * Math.PI) / 180);
const LEAN = 0.8;
const EASE = 0.05;

/** Unique edges of an icosahedron with each edge split in `n`, on a sphere. */
function geodesic(radius: number, n: number): { points: Vec[]; edges: [number, number][] } {
  const t = (1 + Math.sqrt(5)) / 2;
  const base: Vec[] = [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
    [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
    [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
  ];
  const faces = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
  ] as const;
  const points: Vec[] = [];
  const index = new Map<string, number>();
  const edges = new Map<string, [number, number]>();
  const at = (p: Vec) => {
    const len = Math.hypot(p[0], p[1], p[2]);
    const q: Vec = [(p[0] / len) * radius, (p[1] / len) * radius, (p[2] / len) * radius];
    const key = q.map((v) => v.toFixed(4)).join();
    let i = index.get(key);
    if (i === undefined) {
      i = points.push(q) - 1;
      index.set(key, i);
    }
    return i;
  };
  const link = (a: number, b: number) => edges.set(a < b ? `${a}-${b}` : `${b}-${a}`, [a, b]);
  for (const [ia, ib, ic] of faces) {
    const [a, b, c] = [base[ia]!, base[ib]!, base[ic]!];
    const p = (i: number, j: number) =>
      at([0, 1, 2].map((k) => a[k]! + ((b[k]! - a[k]!) * i) / n + ((c[k]! - a[k]!) * j) / n) as Vec);
    for (let i = 0; i < n; i++) {
      for (let j = 0; i + j < n; j++) {
        const v0 = p(i, j);
        const v1 = p(i + 1, j);
        const v2 = p(i, j + 1);
        link(v0, v1);
        link(v0, v2);
        link(v1, v2);
      }
    }
  }
  return { points, edges: [...edges.values()] };
}

function rings(): Vec[][] {
  const out: Vec[][] = [];
  for (let r = 1.8; r <= 5.8; r += 1.3) {
    const ring: Vec[] = [];
    for (let i = 0; i <= 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      ring.push([Math.cos(a) * r, Math.sin(a) * r, 0]);
    }
    out.push(ring);
  }
  return out;
}

/** Fixed seed, so the cloud is the same on every visit. */
function particles(count: number): Vec[] {
  let s = 0x4f9b;
  const rand = () => {
    s = (s + 0x6d2b79f5) | 0;
    let x = Math.imul(s ^ (s >>> 15), 1 | s);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
  return Array.from({ length: count }, () => {
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);
    const r = 2.5 + rand() * 3.5;
    return [r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi)] as Vec;
  });
}

/** Euler XYZ, as Three.js applies it: z first, then y, then x. */
function rotate([x, y, z]: Vec, rx: number, ry: number, rz: number): Vec {
  let c = Math.cos(rz);
  let s = Math.sin(rz);
  [x, y] = [x * c - y * s, x * s + y * c];
  c = Math.cos(ry);
  s = Math.sin(ry);
  [x, z] = [x * c + z * s, -x * s + z * c];
  c = Math.cos(rx);
  s = Math.sin(rx);
  [y, z] = [y * c - z * s, y * s + z * c];
  return [x, y, z];
}

const OUTER = geodesic(4.8, 3);
const MID = geodesic(3.6, 2);
const RINGS = rings();
const CLOUD = particles(140);

export default function HeroCoreCanvas({ active, still, tilt }: { active: boolean; still: boolean; tilt: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const state = useRef({
    outer: [0.35, 0.6, 0] as Vec,
    mid: [0, 0.2, 0.1] as Vec,
    cloud: 0,
    group: [0, 0] as [number, number],
    target: [0, 0] as [number, number],
    time: 0,
    draw: () => {},
  });

  // Size, colors and the draw function; redraw on resize and theme change.
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let color = "";
    let w = 0;
    let h = 0;
    const st = state.current;

    const readColor = () => {
      color = getComputedStyle(canvas).getPropertyValue("--break").trim();
    };
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      st.draw();
    };

    st.draw = () => {
      if (!w || !h) return;
      const scale = (h / 2) * FOCAL;
      const [gx, gy] = st.group;
      const project = (v: Vec, own: Vec): [number, number, number] => {
        const [x, y, z] = rotate(rotate(v, own[0], own[1], own[2]), gx, gy, 0);
        const k = scale / (CAMERA_Z - z);
        return [w / 2 + x * k, h / 2 - y * k, k];
      };
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 1;

      const mesh = ({ points, edges }: typeof OUTER, own: Vec, alpha: number) => {
        const p = points.map((v) => project(v, own));
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        for (const [a, b] of edges) {
          ctx.moveTo(p[a]![0], p[a]![1]);
          ctx.lineTo(p[b]![0], p[b]![1]);
        }
        ctx.stroke();
      };
      mesh(OUTER, st.outer, 0.22);
      mesh(MID, st.mid, 0.4);

      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      for (const ring of RINGS) {
        ring.forEach((v, i) => {
          const [x, y] = project(v, [0, 0, 0]);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
      }
      ctx.stroke();

      ctx.globalAlpha = 0.8;
      for (const v of CLOUD) {
        const [x, y, k] = project(v, [0, st.cloud, 0]);
        const size = 0.12 * k;
        ctx.fillRect(x - size / 2, y - size / 2, size, size);
      }

      const [cx, cy, k] = project([0, 0, 0], [0, 0, 0]);
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, 0.55 * (1 + Math.sin(st.time * 3) * 0.15) * k, 0, Math.PI * 2);
      ctx.fill();
    };

    readColor();
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const mo = new MutationObserver(() => {
      readColor();
      st.draw();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => {
      ro.disconnect();
      mo.disconnect();
      st.draw = () => {};
    };
  }, []);

  // The sphere leans toward a mouse anywhere over the hero.
  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.closest("section");
    const st = state.current;
    if (!canvas || !host || !tilt) {
      st.target = [0, 0];
      return;
    }
    const clamp = (v: number) => Math.max(-1, Math.min(1, v));
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = canvas.getBoundingClientRect();
      const mx = clamp(((e.clientX - r.left) / r.width) * 2 - 1);
      const my = clamp(((e.clientY - r.top) / r.height) * 2 - 1);
      st.target = [my * LEAN, mx * LEAN];
    };
    const onLeave = () => {
      st.target = [0, 0];
    };
    host.addEventListener("pointermove", onMove as EventListener, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    return () => {
      host.removeEventListener("pointermove", onMove as EventListener);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [tilt]);

  // The loop: only while on screen, not paused and motion allowed.
  useEffect(() => {
    const st = state.current;
    if (still || !active) {
      st.draw();
      return;
    }
    return subscribe((_, dt) => {
      const k = dt / (1000 / 60);
      st.time += dt / 1000;
      st.outer = [st.outer[0] + 0.0015 * k, st.outer[1] + 0.003 * k, 0];
      st.mid = [st.mid[0], st.mid[1] - 0.005 * k, st.mid[2] + 0.002 * k];
      st.cloud += 0.001 * k;
      const e = 1 - (1 - EASE) ** k;
      st.group = [st.group[0] + (st.target[0] - st.group[0]) * e, st.group[1] + (st.target[1] - st.group[1]) * e];
      st.draw();
    }, "loop");
  }, [active, still]);

  return <canvas ref={ref} className="hero-core-canvas" />;
}
