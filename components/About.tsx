import { about, site } from "@/data/content";
import { ClipReveal, Reveal } from "./Reveal";
import { ScrollRevealText } from "./ScrollRevealText";
import { SectionHeader } from "./SectionHeader";
import { Stats } from "./Stats";
import { Terminal } from "./Terminal";

export function About() {
  return (
    <section id="about" className="py-24 lg:py-36">
      <SectionHeader index="02" title="About" meta={site.location} />

      <div className="mt-10 grid gap-12 px-4 sm:px-8 md:grid-cols-12 md:gap-6">
        <figure className="md:col-span-4 lg:col-span-3">
          <ClipReveal className="relative aspect-[4/5] rounded-[20px] bg-surface">
            <Terminal title={about.terminal.title} lines={about.terminal.lines} />
          </ClipReveal>
          <figcaption className="label mt-3 text-muted">{about.caption}</figcaption>
        </figure>

        <div className="md:col-span-8 lg:col-start-5">
          <ScrollRevealText
            text={about.statement}
            className="font-display text-[clamp(1.9rem,1rem+2.5vw,3.5rem)] font-semibold leading-[1.06] tracking-[-0.035em]"
          />
          <div className="mt-14 grid gap-6 text-muted sm:grid-cols-2">
            {about.bio.map((paragraph, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <p className="max-w-[46ch] leading-relaxed">{paragraph}</p>
              </Reveal>
            ))}
          </div>
          <div className="mt-16">
            <Stats />
          </div>
        </div>
      </div>
    </section>
  );
}
