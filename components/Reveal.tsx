"use client";

import { motion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Fades and lifts its children in the first time they scroll into view. */
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Wipes its children in from the bottom edge, with a slight zoom-out inside. */
export function ClipReveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  // The in-view trigger sits on an unclipped wrapper: Chrome's IntersectionObserver
  // honours the target's own clip-path, so a fully clipped element never counts as visible.
  return (
    <motion.div className={className} initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.15 }}>
      <motion.div
        className="h-full w-full overflow-hidden rounded-[inherit]"
        variants={{ hidden: { clipPath: "inset(100% 0% 0% 0%)" }, shown: { clipPath: "inset(0% 0% 0% 0%)" } }}
        transition={{ duration: 1.2, ease: EASE }}
      >
        <motion.div
          className="relative h-full w-full"
          variants={{ hidden: { scale: 1.25 }, shown: { scale: 1 } }}
          transition={{ duration: 1.6, ease: EASE }}
        >
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
