"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";

type Line = { kind: string; text: string };

const TONE: Record<string, string> = {
  out: "text-[#eeece6]/60",
  ok: "text-[#19c493]",
};

function Cursor() {
  return <span className="ml-0.5 inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] animate-pulse bg-[#c8f031]" />;
}

/**
 * A terminal that types its commands one character at a time and prints each
 * command's output, then starts over. Runs only while on screen; with reduced
 * motion it shows the finished session.
 */
export function Terminal({ title, lines }: { title: string; lines: Line[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -10% 0px" });
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState({ line: 0, chars: 0 });

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const current = lines[step.line];
    let next: typeof step;
    let delay: number;
    if (!current) {
      next = { line: 0, chars: 0 };
      delay = 5000;
    } else if (current.kind === "cmd" && step.chars < current.text.length) {
      next = { line: step.line, chars: step.chars + 1 };
      delay = 35 + Math.random() * 55;
    } else {
      next = { line: step.line + 1, chars: 0 };
      delay = current.kind === "cmd" ? 380 : 160;
    }
    const timer = setTimeout(() => setStep(next), delay);
    return () => clearTimeout(timer);
  }, [inView, reduceMotion, step, lines]);

  const done = reduceMotion ? lines.length : step.line;
  const current = lines[done];
  const typing = current?.kind === "cmd" ? current.text.slice(0, step.chars) : null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="flex h-full w-full flex-col bg-[#0f0f0f] font-mono text-[13px] leading-relaxed text-[#eeece6] dark:bg-surface"
    >
      <div className="flex items-center gap-1.5 border-b border-[#eeece6]/10 px-4 py-3">
        <span className="size-2.5 rounded-full bg-[#eeece6]/25" />
        <span className="size-2.5 rounded-full bg-[#eeece6]/25" />
        <span className="size-2.5 rounded-full bg-[#c8f031]" />
        <span className="ml-2 truncate text-[11px] text-[#eeece6]/50">{title}</span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col justify-end overflow-hidden wrap-break-word p-4">
        {lines.slice(0, done).map((line, i) =>
          line.kind === "cmd" ? (
            <p key={i} className={i > 0 ? "mt-3" : ""}>
              <span className="text-[#c8f031]">$</span> {line.text}
            </p>
          ) : (
            <p key={i} className={TONE[line.kind]}>
              {line.kind === "ok" && "✓ "}
              {line.text}
            </p>
          ),
        )}
        {(typing !== null || !current) && (
          <p className={done > 0 ? "mt-3" : ""}>
            <span className="text-[#c8f031]">$</span> {typing}
            <Cursor />
          </p>
        )}
      </div>
    </div>
  );
}
