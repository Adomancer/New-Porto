import Image from "next/image";
import { hero, site } from "@/data/content";
import { GradientText } from "./GradientText";
import { ArrowDown, ArrowUpRight } from "./icons";
import { LocalTime } from "./LocalTime";
import { Reveal } from "./Reveal";
import { RichText } from "./RichText";

export function Hero() {
  return (
    <section id="top" className="flex min-h-svh flex-col px-4 pb-5 pt-[4.5rem] sm:px-8 md:pt-24">
      <div className="label grid grid-cols-2 gap-4 border-t border-line pt-3 md:grid-cols-12">
        <p className="md:col-span-3">
          {hero.roleLines[0]}
          <br />
          {hero.roleLines[1]}
        </p>
        <p className="hidden md:col-span-5 md:block">
          {hero.currently[0]}
          <br />
          <span className="text-muted">{hero.currently[1]}</span>
        </p>
        <p className="flex items-start justify-end gap-2 text-right md:col-span-4">
          <span className="mt-[3px] size-2 shrink-0 animate-pulse-dot rounded-full bg-accent" />
          {site.availability}
        </p>
      </div>

      <div className="flex flex-1 flex-col justify-center gap-10 py-12 md:flex-row md:items-end md:justify-between">
        <Reveal>
          <p className="max-w-[20ch] font-display text-[clamp(2rem,1rem+2.8vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
            <RichText text={hero.intro} boldClassName="marker marker-animate" />
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <a
            href={hero.latest.href}
            data-cursor-label="View"
            className="group flex w-full max-w-[340px] items-center gap-4 rounded-[18px] border border-hairline p-2.5 pr-4 transition-colors hover:border-fg"
          >
            <span className="relative block h-[68px] w-[92px] shrink-0 overflow-hidden rounded-[12px] bg-surface">
              <Image src={hero.latest.image} alt="" fill sizes="92px" className="object-cover" />
            </span>
            <span className="label flex-1">{hero.latest.label}</span>
            <ArrowUpRight className="size-4 shrink-0 transition-transform duration-500 ease-out-expo group-hover:rotate-45" />
          </a>
        </Reveal>
      </div>

      <GradientText as="h1" words={hero.name} seed={3} />

      <div className="label mt-4 grid grid-cols-2 gap-4 text-muted md:grid-cols-12">
        <p className="md:col-span-3">
          {site.location} — {site.coords}
        </p>
        <a href="#work" className="hidden items-center gap-2 transition-colors hover:text-fg md:col-span-6 md:flex">
          <ArrowDown className="size-3.5 animate-bounce" />
          Scroll to explore
        </a>
        <p className="text-right md:col-span-3">
          <LocalTime timeZone={site.timeZone} /> in {site.location.split(",")[0]}
        </p>
      </div>
    </section>
  );
}
