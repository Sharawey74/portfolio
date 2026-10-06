"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * True while the element intersects the viewport (IntersectionObserver, no
 * scroll listeners). Loops subscribe to the scheduler only while this is true.
 * `once` latches to true after the first intersection, for reveals.
 */
export function useInView(
  ref: RefObject<Element | null>,
  { rootMargin = "0px", threshold = 0, once = false }: { rootMargin?: string; threshold?: number; once?: boolean } = {},
): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = entry?.isIntersecting ?? false;
        setInView(visible);
        if (visible && once) io.disconnect();
      },
      { rootMargin, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, threshold, once]);

  return inView;
}
