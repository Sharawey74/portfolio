"use client";

import { useEffect } from "react";

/**
 * Route focus (M8): after navigating to a case study, move focus to its H1 so
 * keyboard and screen-reader users start at the new page's title. A view
 * transition does not manage focus on its own.
 */
export function FocusHeading({ id }: { id: string }) {
  useEffect(() => {
    document.getElementById(id)?.focus({ preventScroll: true });
  }, [id]);
  return null;
}
