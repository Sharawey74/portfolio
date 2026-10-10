"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useLenis } from "@/components/motion/smooth-scroll.tsx";

const REVEAL_ZONE = 120;

/**
 * M13 smart header: slides away while scrolling down, returns on scroll up.
 * Driven by Lenis' own scroll callback (no scroll event listener). Under
 * reduced motion there is no Lenis, so the header simply stays put. Keyboard
 * focus inside the header always brings it back (CSS :focus-within).
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    const onScroll = ({ scroll, direction }: { scroll: number; direction: number }) => {
      const el = ref.current;
      if (!el) return;
      if (scroll < REVEAL_ZONE || direction < 0) delete el.dataset.hidden;
      else if (direction > 0) el.dataset.hidden = "";
    };
    lenis.on("scroll", onScroll);
    return () => lenis.off("scroll", onScroll);
  }, [lenis]);

  return (
    <header ref={ref} className="site-header header-fade fixed inset-x-0 top-0 z-50">
      {children}
    </header>
  );
}
