"use client";

import { ReactLenis } from "lenis/react";
import { MotionConfig } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";

export function Providers({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <ReactLenis
        root
        options={{
          lerp: 0.1,
          smoothWheel: !reduceMotion,
          anchors: { offset: -8, immediate: reduceMotion },
        }}
      >
        {children}
      </ReactLenis>
    </MotionConfig>
  );
}
