"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { motion, useMotionValue } from "motion/react";
import { notes } from "@/data/content";
import { ArrowLeft, ArrowRight } from "./icons";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

/** Blog teaser: a free-scrolling, draggable row of note cards with a progress line. */
export function Notes() {
  const [viewportRef, api] = useEmblaCarousel({ align: "start", dragFree: true, containScroll: "trimSnaps" });
  const progress = useMotionValue(0);
  const [edges, setEdges] = useState({ prev: false, next: true });

  useEffect(() => {
    if (!api) return;
    const onScroll = () => progress.set(Math.max(0, Math.min(1, api.scrollProgress())));
    const onSelect = () => setEdges({ prev: api.canScrollPrev(), next: api.canScrollNext() });
    api.on("scroll", onScroll).on("reInit", onScroll).on("select", onSelect).on("reInit", onSelect);
    return () => {
      api.off("scroll", onScroll).off("reInit", onScroll).off("select", onSelect).off("reInit", onSelect);
    };
  }, [api, progress]);

  return (
    <section id="notes" className="overflow-x-clip py-24 lg:py-32">
      <SectionHeader index="04" title="Notes" meta="Writing & experiments" />

      <div className="mt-10 flex items-end justify-between gap-6 px-4 sm:px-8">
        <Reveal>
          <h2 className="max-w-[13ch] font-display text-[clamp(2.4rem,1rem+4vw,5.25rem)] font-extrabold uppercase leading-[0.88] tracking-[-0.045em]">
            Notes &amp; <span className="text-outline">experiments</span>
          </h2>
        </Reveal>
        <div className="hidden shrink-0 gap-2 sm:flex">
          <button
            type="button"
            onClick={() => api?.scrollPrev()}
            disabled={!edges.prev}
            aria-label="Previous notes"
            className="grid size-12 place-items-center rounded-full border border-line transition-colors hover:bg-fg hover:text-bg disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-fg"
          >
            <ArrowLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => api?.scrollNext()}
            disabled={!edges.next}
            aria-label="Next notes"
            className="grid size-12 place-items-center rounded-full border border-line transition-colors hover:bg-fg hover:text-bg disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-fg"
          >
            <ArrowRight className="size-5" />
          </button>
        </div>
      </div>

      <div ref={viewportRef} data-cursor-label="Drag" className="mt-10 cursor-grab px-4 active:cursor-grabbing sm:px-8">
        <div className="-ml-4 flex touch-pan-y">
          {notes.map((note) => (
            <article key={note.title} className="min-w-0 flex-[0_0_86%] pl-4 sm:flex-[0_0_48%] lg:flex-[0_0_32%]">
              <a href={note.href} className="group block" draggable={false}>
                <div className="relative aspect-[16/11] overflow-hidden rounded-[20px] bg-[#0b0d14]">
                  <Image
                    src={note.image}
                    alt=""
                    fill
                    draggable={false}
                    sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 86vw"
                    className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-105"
                  />
                </div>
                <p className="label mt-4 flex gap-2 text-muted">
                  <span>{note.date}</span>
                  <span aria-hidden>·</span>
                  <span>{note.read} read</span>
                  <span className="ml-auto rounded-full border border-hairline px-2">{note.tag}</span>
                </p>
                <h3 className="mt-2 text-xl font-medium leading-snug tracking-[-0.02em] underline-offset-4 group-hover:underline">
                  {note.title}
                </h3>
              </a>
            </article>
          ))}
        </div>
      </div>

      <div className="mx-4 mt-10 h-px bg-hairline sm:mx-8">
        <motion.div className="h-full origin-left bg-fg" style={{ scaleX: progress }} />
      </div>
    </section>
  );
}
