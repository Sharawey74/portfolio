/**
 * The one requestAnimationFrame loop for the whole site.
 *
 * - Runs only while at least one task is subscribed and the tab is visible.
 * - `kind: "loop"` tasks are autoplaying animation (canvas, marquee, packets).
 *   The global pause (WCAG 2.2.2) stops them.
 * - `kind: "input"` tasks follow the user (Lenis, cursor). Pause leaves them
 *   running, because they move only when the user does.
 * - Every loop also pauses itself off-screen: callers subscribe only while
 *   their element is in view (see useInView).
 */

export type FrameTask = (time: number, delta: number) => void;
type Kind = "loop" | "input";

const tasks = new Map<FrameTask, Kind>();
let frame = 0;
let last = 0;
let paused = false;

function tick(time: number) {
  const delta = last ? Math.min(time - last, 100) : 16.7;
  last = time;
  for (const [task, kind] of tasks) {
    if (paused && kind === "loop") continue;
    task(time, delta);
  }
  frame = requestAnimationFrame(tick);
}

function start() {
  if (frame || tasks.size === 0 || document.hidden) return;
  last = 0;
  frame = requestAnimationFrame(tick);
}

function stop() {
  cancelAnimationFrame(frame);
  frame = 0;
}

if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
}

export function subscribe(task: FrameTask, kind: Kind = "loop"): () => void {
  tasks.set(task, kind);
  start();
  return () => {
    tasks.delete(task);
    if (tasks.size === 0) stop();
  };
}

export function setLoopsPaused(value: boolean) {
  paused = value;
}
