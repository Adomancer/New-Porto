"use client";

import { useRef, useSyncExternalStore } from "react";
import { useLenis } from "lenis/react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { marquee } from "@/data/content";
import { Sparkle } from "./icons";

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

const FINE_POINTER = "(pointer: fine)";

function subscribe(onChange: () => void) {
  const mq = matchMedia(FINE_POINTER);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

type RowProps = {
  children: React.ReactNode;
  baseVelocity: number;
  scrollVelocity: MotionValue<number>;
};

// Four identical copies: shifting by exactly one copy (25%) loops seamlessly.
function Copies({ children }: { children: React.ReactNode }) {
  return [0, 1, 2, 3].map((i) => (
    <span key={i} aria-hidden={i > 0} className="flex shrink-0 items-center">
      {children}
    </span>
  ));
}

/**
 * Touch screens get a pure CSS loop: it runs on the compositor, so it stays smooth while
 * the main thread is busy with a touch scroll. Lenis doesn't track touch scrolling, so
 * the scroll-reactive version would add nothing there. Mouse users get the JS version.
 */
function MarqueeRow(props: RowProps) {
  const finePointer = useSyncExternalStore(subscribe, () => matchMedia(FINE_POINTER).matches, () => false);
  return finePointer ? <ScrollMarqueeRow {...props} /> : <CssMarqueeRow {...props} />;
}

function CssMarqueeRow({ children, baseVelocity }: RowProps) {
  return (
    <div className="flex overflow-hidden whitespace-nowrap">
      <div
        className="marquee-track flex w-max"
        style={{
          animationDuration: `${25 / Math.abs(baseVelocity)}s`,
          animationDirection: baseVelocity < 0 ? "normal" : "reverse",
        }}
      >
        <Copies>{children}</Copies>
      </div>
    </div>
  );
}

function ScrollMarqueeRow({ children, baseVelocity, scrollVelocity }: RowProps) {
  const reduceMotion = useReducedMotion();
  const baseX = useMotionValue(0);
  const smooth = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const boost = useTransform(smooth, [-60, 0, 60], [-5, 0, 5], { clamp: false });
  const direction = useRef(1);
  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduceMotion) return;
    const b = boost.get();
    if (b < 0) direction.current = -1;
    else if (b > 0) direction.current = 1;
    let moveBy = direction.current * baseVelocity * (delta / 1000);
    moveBy += direction.current * moveBy * b;
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="flex overflow-hidden whitespace-nowrap">
      <motion.div className="flex w-max will-change-transform" style={{ x }}>
        <Copies>{children}</Copies>
      </motion.div>
    </div>
  );
}

/** Two rows of oversized type that drift in opposite directions and speed up with the scroll. */
export function Marquee() {
  const scrollVelocity = useMotionValue(0);
  useLenis((lenis) => scrollVelocity.set(lenis.velocity));

  return (
    <section aria-label="Services" className="overflow-x-clip py-16 lg:py-24">
      <div className="-ml-[5%] w-[110%] -rotate-2 border-y border-line bg-accent py-3 text-accent-fg">
        <MarqueeRow baseVelocity={-2.2} scrollVelocity={scrollVelocity}>
          {marquee.primary.map((item) => (
            <span
              key={item}
              className="flex items-center gap-[0.35em] pr-[0.35em] font-display text-[clamp(2.5rem,1rem+6vw,7rem)] font-extrabold uppercase leading-none tracking-[-0.04em]"
            >
              {item}
              <Sparkle className="size-[0.45em]" />
            </span>
          ))}
        </MarqueeRow>
      </div>
      <div className="-ml-[5%] mt-6 w-[110%] rotate-1 py-1">
        <MarqueeRow baseVelocity={1.6} scrollVelocity={scrollVelocity}>
          <span className="text-outline pr-[0.4em] font-display text-[clamp(2.5rem,1rem+6vw,7rem)] font-extrabold uppercase leading-none tracking-[-0.04em]">
            {marquee.secondary}
          </span>
        </MarqueeRow>
      </div>
    </section>
  );
}
