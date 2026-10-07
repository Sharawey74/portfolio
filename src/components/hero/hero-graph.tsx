"use client";

import { useCallback, useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import { useMotionPrefs } from "@/lib/motion/preferences.ts";
import { useInView } from "@/lib/motion/use-in-view.ts";

type CanvasProps = { active: boolean };
type ShaderProps = CanvasProps & { onFail: () => void };

/** Inlined at build: the M15 shader ships only when this is "1". */
const SHADER_FLAG = process.env.NEXT_PUBLIC_ENABLE_SHADER === "1";

/** M15 gates beyond reduced motion and Save-Data, which `wanted` covers. */
function shaderCapable(): boolean {
  const nav = navigator as Navigator & { deviceMemory?: number };
  return (
    typeof WebGL2RenderingContext !== "undefined" &&
    (nav.deviceMemory ?? 0) >= 4 &&
    (nav.hardwareConcurrency ?? 0) >= 4 &&
    document.visibilityState === "visible"
  );
}

/**
 * M4 host (and M15 when enabled). Shows the server-rendered static graph
 * (children) until a live layer has loaded, then crossfades to it. The layer
 * is imported only after the browser is idle, and never when motion is reduced
 * or Save-Data is on, so it costs nothing on first load.
 *
 * With NEXT_PUBLIC_ENABLE_SHADER=1 and every M15 gate passing, the WebGL2
 * shader loads instead of the canvas; if it fails at runtime it reports back
 * and the M4 canvas loads in its place.
 */
export function HeroGraph({ children }: { children: ReactNode }) {
  const { allowMotion, reducedMotion, saveData } = useMotionPrefs();
  const host = useRef<HTMLDivElement>(null);
  const inView = useInView(host);
  const [Canvas, setCanvas] = useState<ComponentType<CanvasProps> | null>(null);
  const [Shader, setShader] = useState<ComponentType<ShaderProps> | null>(null);
  const [shaderFailed, setShaderFailed] = useState(false);
  const wanted = !reducedMotion && !saveData;

  useEffect(() => {
    if (!wanted || Canvas || Shader) return;
    let cancelled = false;
    const load = () => {
      if (SHADER_FLAG && !shaderFailed && shaderCapable()) {
        import("./hero-shader.tsx").then((m) => {
          if (!cancelled) setShader(() => m.default);
        });
        return;
      }
      import("./hero-canvas.tsx").then((m) => {
        if (!cancelled) setCanvas(() => m.default);
      });
    };
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(load, { timeout: 2500 })
      : window.setTimeout(load, 1200);
    return () => {
      cancelled = true;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };
  }, [wanted, Canvas, Shader, shaderFailed]);

  const onShaderFail = useCallback(() => {
    setShader(null);
    setShaderFailed(true);
  }, []);

  const active = inView && allowMotion;
  const live = wanted && (Canvas !== null || Shader !== null);
  return (
    <div ref={host} data-live={live ? "" : undefined} className="hero-graph pointer-events-auto absolute inset-0">
      <div className="hero-graph-static absolute inset-0">{children}</div>
      {wanted && Shader ? <Shader active={active} onFail={onShaderFail} /> : null}
      {wanted && !Shader && Canvas ? <Canvas active={active} /> : null}
    </div>
  );
}
