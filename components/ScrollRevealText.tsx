"use client";

import { useMemo, useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { richWords, type RichWord } from "@/lib/rich";

const SPAN = 0.14; // share of the scroll range each word takes to fill in

function Word({ word, progress, start }: { word: RichWord; progress: MotionValue<number>; start: number }) {
  const opacity = useTransform(progress, [start, start + SPAN], [0.16, 1]);
  // Highlighted words get a lime marker that swipes in just after the word appears.
  const markerSize = useTransform(progress, [start + SPAN * 0.6, start + SPAN * 2], ["0% 0.3em", "100% 0.3em"]);
  return (
    <>
      <motion.span
        style={word.bold ? { opacity, backgroundSize: markerSize } : { opacity }}
        className={word.bold ? "marker" : word.italic ? "text-violet" : undefined}
      >
        {word.text}
      </motion.span>
      {word.spaceAfter && " "}
    </>
  );
}

/** Paragraph whose words fill in one by one as it scrolls through the viewport. */
export function ScrollRevealText({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduceMotion = useReducedMotion();
  const words = useMemo(() => richWords(text), [text]);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.4"] });

  if (reduceMotion) {
    return (
      <p ref={ref} className={className}>
        {words.map((word, i) => (
          <span key={i} className={word.bold ? "marker" : word.italic ? "text-violet" : undefined}>
            {word.text}
            {word.spaceAfter && " "}
          </span>
        ))}
      </p>
    );
  }

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <Word key={i} word={word} progress={scrollYProgress} start={(i / words.length) * (1 - SPAN * 2)} />
      ))}
    </p>
  );
}
