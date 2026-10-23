"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

const QUERY = "(pointer: fine) and (prefers-reduced-motion: no-preference)";

function subscribe(onChange: () => void) {
  const mq = matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

type Cursor = { mode: "hidden" | "dot" | "link" | "label"; label?: string };

const SIZES = { hidden: 0, dot: 10, link: 34, label: 88 };

/**
 * Trailing cursor: a dot by default, a ring over links, and a lime bubble with a
 * label (e.g. "View", "Drag") over elements with data-cursor-label. Mouse only.
 */
export function CustomCursor() {
  const enabled = useSyncExternalStore(subscribe, () => matchMedia(QUERY).matches, () => false);
  const [cursor, setCursor] = useState<Cursor>({ mode: "hidden" });
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 650, damping: 45, mass: 0.45 });
  const springY = useSpring(y, { stiffness: 650, damping: 45, mass: 0.45 });

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target as Element;
      const labelled = el.closest("[data-cursor-label]");
      if (labelled) {
        const label = labelled.getAttribute("data-cursor-label")!;
        setCursor((c) => (c.mode === "label" && c.label === label ? c : { mode: "label", label }));
      } else if (el.closest("a, button")) {
        setCursor((c) => (c.mode === "link" ? c : { mode: "link" }));
      } else {
        setCursor((c) => (c.mode === "dot" ? c : { mode: "dot" }));
      }
    };
    const onLeave = () => setCursor({ mode: "hidden" });
    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const isLabel = cursor.mode === "label";
  const size = SIZES[cursor.mode];

  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none fixed left-0 top-0 z-[70] ${isLabel ? "" : "mix-blend-difference"}`}
      style={{ x: springX, y: springY }}
    >
      <motion.div
        className={`label flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full ${
          isLabel ? "bg-accent text-accent-fg" : cursor.mode === "link" ? "border border-white" : "bg-white"
        }`}
        animate={{ width: size, height: size }}
        transition={{ type: "spring", stiffness: 420, damping: 30 }}
      >
        {isLabel && (
          <motion.span initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}>
            {cursor.label}
          </motion.span>
        )}
      </motion.div>
    </motion.div>
  );
}
