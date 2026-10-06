"use client";

import { useSyncExternalStore } from "react";
import { setLoopsPaused } from "./scheduler.ts";

/**
 * Motion preferences as one external store:
 * - reducedMotion: prefers-reduced-motion: reduce
 * - finePointer:   (pointer: fine) and (hover: hover); coarse pointers get no
 *                  custom cursor, tilt or magnet
 * - saveData:      navigator.connection.saveData; no intro, no shader, lighter hero
 * - paused:        the global "Pause animations" control, persisted
 *
 * `allowMotion` is the usual gate: not reduced and not paused.
 * The server snapshot assumes the most conservative case, so nothing animates
 * before hydration.
 */

export type MotionPrefs = {
  reducedMotion: boolean;
  finePointer: boolean;
  saveData: boolean;
  paused: boolean;
  allowMotion: boolean;
};

const STORAGE_KEY = "motion";

const SERVER: MotionPrefs = {
  reducedMotion: true,
  finePointer: false,
  saveData: false,
  paused: false,
  allowMotion: false,
};

let snapshot: MotionPrefs = SERVER;
const listeners = new Set<() => void>();
let initialised = false;

function readSaveData(): boolean {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  return nav.connection?.saveData === true;
}

function readPaused(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "paused";
  } catch {
    return document.documentElement.dataset.motion === "paused";
  }
}

function compute(paused = snapshot.paused): MotionPrefs {
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(pointer: fine) and (hover: hover)").matches;
  return { reducedMotion, finePointer, saveData: readSaveData(), paused, allowMotion: !reducedMotion && !paused };
}

function emit(next: MotionPrefs) {
  snapshot = next;
  setLoopsPaused(next.paused || next.reducedMotion);
  document.documentElement.dataset.motion = next.paused ? "paused" : "running";
  for (const l of listeners) l();
}

function init() {
  if (initialised) return;
  initialised = true;
  emit(compute(readPaused()));
  for (const q of ["(prefers-reduced-motion: reduce)", "(pointer: fine) and (hover: hover)"]) {
    matchMedia(q).addEventListener("change", () => emit(compute()));
  }
}

function subscribe(listener: () => void) {
  init();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useMotionPrefs(): MotionPrefs {
  return useSyncExternalStore(subscribe, () => snapshot, () => SERVER);
}

export function setPaused(paused: boolean) {
  init();
  try {
    if (paused) localStorage.setItem(STORAGE_KEY, "paused");
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage blocked: the choice lasts for this page view only.
  }
  emit(compute(paused));
}
