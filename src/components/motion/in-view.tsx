"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * Adds `is-in` to its element the first time it scrolls into view. CSS decides
 * what that means (e.g. `.clip-reveal`); the hidden state applies only under
 * html[data-reveal="on"], so content is visible with JS off.
 */
export function InView({
  as: Tag = "div",
  className = "",
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
