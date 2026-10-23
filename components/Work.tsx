"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useScroll, useTransform } from "motion/react";
import { archive, projects } from "@/data/content";
import { ArrowRight, ArrowUpRight } from "./icons";
import { SectionHeader } from "./SectionHeader";

/**
 * Selected work. On large screens the section pins and the cards slide sideways
 * as you scroll down; on smaller screens it is a plain vertical list.
 */
export function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const distanceMV = useMotionValue(0);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(() => -scrollYProgress.get() * distanceMV.get());

  useEffect(() => {
    const track = trackRef.current!;
    const wide = matchMedia("(min-width: 1024px)");
    const measure = () => {
      const d = wide.matches ? Math.max(0, track.scrollWidth - window.innerWidth) : 0;
      distanceMV.set(d);
      setDistance(d);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    wide.addEventListener("change", measure);
    return () => {
      observer.disconnect();
      wide.removeEventListener("change", measure);
    };
  }, [distanceMV]);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative pt-16 lg:pt-0"
      style={distance ? { height: `calc(100svh + ${distance}px)` } : undefined}
    >
      <div className="flex flex-col lg:sticky lg:top-0 lg:h-svh lg:overflow-hidden lg:pt-24">
        <SectionHeader index="01" title="Selected work" meta={`${projects.length} projects — 2026`} />

        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex min-h-0 flex-1 flex-col gap-12 px-4 pb-6 pt-8 sm:px-8 lg:w-max lg:flex-row lg:gap-6 lg:pb-10"
        >
          <div className="flex shrink-0 flex-col justify-between gap-6 lg:w-max lg:min-w-[min(30vw,420px)]">
            <h2 className="font-display text-[clamp(3rem,1rem+5vw,6.5rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.045em]">
              Selected
              <br />
              <span className="text-outline">work</span>
            </h2>
            <p className="label hidden items-center gap-2 text-muted lg:flex">
              Keep scrolling <ArrowRight className="size-3.5" />
            </p>
          </div>

          {projects.map((project, i) => {
            // Private (client) projects have no href and render as a plain card.
            const Card = project.href ? "a" : "div";
            return (
              <Card
                key={project.title}
                {...(project.href
                  ? { href: project.href, target: "_blank", rel: "noreferrer", "data-cursor-label": "View" }
                  : { "data-cursor-label": "Private" })}
                className="group flex shrink-0 flex-col lg:h-full lg:w-[min(56vw,860px)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-surface lg:aspect-auto lg:min-h-0 lg:flex-1">
                  <Image
                    src={project.image}
                    alt={`${project.title} — ${project.category}`}
                    fill
                    sizes="(min-width: 1024px) 56vw, 100vw"
                    className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.04]"
                  />
                  <span className="label absolute left-3 top-3 rounded-full bg-bg/85 px-3 py-1.5 backdrop-blur">
                    {project.category} — {project.year}
                  </span>
                  {!project.href && (
                    <span className="label absolute right-3 top-3 rounded-full bg-fg px-3 py-1.5 text-bg">
                      Private repo
                    </span>
                  )}
                </div>
                <div className="mt-4 flex items-start gap-4">
                  <span className="label pt-1 text-muted">({String(i + 1).padStart(2, "0")})</span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-[clamp(2rem,1rem+2.6vw,3.5rem)] font-bold leading-none tracking-[-0.04em]">
                      {project.title}
                    </h3>
                    <p className="mt-2 max-w-[52ch] text-muted">{project.summary}</p>
                  </div>
                  <ul className="hidden shrink-0 flex-wrap justify-end gap-1.5 sm:flex sm:max-w-[45%]">
                    {project.tags.map((tag) => (
                      <li key={tag} className="label rounded-full border border-hairline px-2.5 py-1">
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            );
          })}

          <a
            href={archive.href}
            target="_blank"
            rel="noreferrer"
            className="group flex shrink-0 flex-col justify-between gap-10 rounded-[20px] bg-accent p-6 text-accent-fg lg:w-[min(28vw,400px)]"
          >
            <span className="label">(Archive)</span>
            <span className="flex items-end justify-between gap-4">
              <span className="font-display text-[clamp(2rem,1rem+2.2vw,3.25rem)] font-bold leading-[0.95] tracking-[-0.04em]">
                {archive.label}
              </span>
              <ArrowUpRight className="size-10 shrink-0 transition-transform duration-500 ease-out-expo group-hover:rotate-45" />
            </span>
          </a>
        </motion.div>

        <div className="mx-8 mb-6 hidden h-px bg-hairline lg:block">
          <motion.div className="h-full origin-left bg-fg" style={{ scaleX: scrollYProgress }} />
        </div>
      </div>
    </section>
  );
}
