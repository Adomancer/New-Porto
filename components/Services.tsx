"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { services } from "@/data/content";
import { SectionHeader } from "./SectionHeader";

const TONES = [
  "bg-ink text-ink-fg [--outline:var(--ink-fg)]",
  "bg-accent text-accent-fg [--outline:var(--accent-fg)]",
  "bg-violet text-white [--outline:#fff]",
  "bg-surface text-fg border border-hairline",
];

function ServiceCard({
  service,
  index,
  total,
  progress,
}: {
  service: (typeof services)[number];
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const reduceMotion = useReducedMotion();
  // Earlier cards shrink back a little as later ones slide over them.
  const scale = useTransform(progress, [index / total, 1], [1, 1 - (total - 1 - index) * 0.04]);

  return (
    <div className="sticky" style={{ top: `calc(4.75rem + ${index * 1.4}rem)` }}>
      <motion.article
        style={reduceMotion ? undefined : { scale }}
        className={`flex min-h-[64svh] origin-top flex-col justify-between gap-10 rounded-[28px] p-6 sm:p-10 lg:p-12 ${TONES[index % TONES.length]}`}
      >
        <div className="flex items-start justify-between gap-6">
          <span className="label opacity-80">
            Service {index + 1}/{total}
          </span>
          <span
            aria-hidden
            className="-mr-[0.04em] -mt-[0.1em] font-display text-[clamp(6rem,3rem+12vw,15rem)] font-extrabold leading-[0.8] tracking-[-0.06em] opacity-15"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <h3 className="font-display text-[clamp(2.6rem,1rem+5vw,6.25rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.045em] lg:col-span-7">
            {service.title}
          </h3>
          <div className="lg:col-span-5">
            <p className="max-w-[40ch] text-lg leading-snug opacity-85">{service.description}</p>
            <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2">
              {service.deliverables.map((item) => (
                <li key={item} className="label border-t border-current/25 pt-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.article>
    </div>
  );
}

/** Service cards that pin under the header and stack on top of each other while scrolling. */
export function Services() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section id="services" className="py-24 lg:py-32">
      <SectionHeader index="03" title="Services" meta="What I can do for you" />
      <div ref={ref} className="mt-10 flex flex-col gap-6 px-4 pb-[8vh] sm:px-8">
        {services.map((service, i) => (
          <ServiceCard key={service.title} service={service} index={i} total={services.length} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}
