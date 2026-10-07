"use client";

import { useEffect, useRef } from "react";
import { subscribe } from "@/lib/motion/scheduler.ts";

/** Render scale: the field is soft, so half resolution is indistinguishable and quarter the fill cost. */
const RESOLUTION = 0.5;
const MAX_DPR = 1.5;

const VERTEX = `#version 300 es
in vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

// Grayscale flow field: two octaves of value noise advected by a slow curl.
// Output is a blend of two token grays (page and hairline), so it can only
// ever produce colors already on the ramp.
const FRAGMENT = `#version 300 es
precision mediump float;
uniform vec2 u_res;
uniform float u_time;
uniform vec3 u_base;
uniform vec3 u_line;
out vec4 color;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float field(vec2 p, float t) {
  vec2 q = vec2(noise(p + t * 0.05), noise(p + vec2(5.2, 1.3) - t * 0.04));
  return noise(p * 1.7 + 2.0 * q) * 0.65 + noise(p * 3.4 - q) * 0.35;
}
void main() {
  vec2 uv = gl_FragCoord.xy / u_res.y;
  float v = field(uv * 2.2, u_time);
  float lines = smoothstep(0.48, 0.5, fract(v * 9.0)) * smoothstep(0.52, 0.5, fract(v * 9.0));
  color = vec4(mix(u_base, u_line, lines * 0.9 + v * 0.15), 1.0);
}`;

function rgb(name: string): [number, number, number] {
  const hex = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const n = Number.parseInt(hex.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
}

/**
 * M15 (optional, off unless NEXT_PUBLIC_ENABLE_SHADER=1). Raw WebGL2, no
 * library. HeroGraph imports it only after idle and only when WebGL2,
 * deviceMemory ≥ 4, hardwareConcurrency ≥ 4, no Save-Data, no reduced motion
 * and a visible tab all hold; any failure here calls `onFail`, and the host
 * falls back to the M4 canvas.
 *
 * Runs as a "loop" task on the shared scheduler: stops off-screen, on a hidden
 * tab and under the global pause. Colors follow the theme tokens.
 */
export default function HeroShader({ active, onFail }: { active: boolean; onFail: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const draw = useRef<((dt: number) => void) | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl2", { antialias: false, depth: false, powerPreference: "low-power" });
    if (!canvas || !gl) return onFail();

    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) return onFail();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return onFail();
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uBase = gl.getUniformLocation(prog, "u_base");
    const uLine = gl.getUniformLocation(prog, "u_line");
    const setColors = () => {
      gl.uniform3fv(uBase, rgb("--g0"));
      gl.uniform3fv(uLine, rgb("--g5"));
    };
    setColors();

    let time = 0;
    const render = () => {
      gl.uniform1f(uTime, time / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const scale = Math.min(devicePixelRatio || 1, MAX_DPR) * RESOLUTION;
      canvas.width = Math.max(1, Math.round(r.width * scale));
      canvas.height = Math.max(1, Math.round(r.height * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      render();
    };
    resize();
    draw.current = (dt) => {
      time += dt;
      render();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const mo = new MutationObserver(() => {
      setColors();
      render();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const lost = (e: Event) => {
      e.preventDefault();
      onFail();
    };
    canvas.addEventListener("webglcontextlost", lost);

    return () => {
      ro.disconnect();
      mo.disconnect();
      canvas.removeEventListener("webglcontextlost", lost);
      draw.current = null;
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [onFail]);

  useEffect(() => {
    if (!active) return;
    return subscribe((_, dt) => draw.current?.(dt), "loop");
  }, [active]);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 size-full" />;
}
