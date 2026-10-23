"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useTransform } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { stats } from "@/data/content";

function CountUp({ value, start }: { value: number; start: boolean }) {
  const reduceMotion = useReducedMotion();
  const count = useMotionValue(0);
  const text = useTransform(count, (v) => Math.round(v).toLocaleString("en-US"));

  useEffect(() => {
    if (!start) return;
    if (reduceMotion) {
      count.set(value);
      return;
    }
    const controls = animate(count, value, { duration: 1.8, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [start, value, count, reduceMotion]);

  return <motion.span>{text}</motion.span>;
}

/** Four counters on a hairline grid that count up the first time they scroll into view. */
export function Stats() {
  const ref = useRef<HTMLDListElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });

  return (
    <dl ref={ref} className="grid grid-cols-2 border-t border-hairline lg:grid-cols-4">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className={`flex flex-col-reverse gap-2 border-b border-hairline py-6 pr-4 ${i % 2 === 1 ? "border-l pl-4" : ""} ${
            i > 0 ? "lg:border-l lg:pl-5" : ""
          }`}
        >
          <dt className="label text-muted">{stat.label}</dt>
          <dd className="font-display text-[clamp(2.75rem,1.5rem+3vw,4.5rem)] font-bold leading-none tracking-[-0.05em] tabular-nums">
            <CountUp value={stat.value} start={inView} />
            {stat.suffix}
          </dd>
        </div>
      ))}
    </dl>
  );
}
