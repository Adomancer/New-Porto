"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * Hydration-safe prefers-reduced-motion. Motion's own hook reads the media query
 * during the first client render, which makes markup that depends on it differ
 * from the server HTML. This one reports `false` while hydrating, then updates.
 */
export function useReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => matchMedia(QUERY).matches,
    () => false,
  );
}
