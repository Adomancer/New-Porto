import { contact, site, socials } from "@/data/content";
import { CopyEmail } from "./CopyEmail";
import { GradientText } from "./GradientText";
import { ArrowUpRight } from "./icons";
import { LocalTime } from "./LocalTime";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

export function Footer() {
  return (
    <footer id="contact" className="pb-5 pt-8 lg:pt-12">
      <SectionHeader index="04" title="Contact" meta={site.availability} />

      <div className="mt-10 grid gap-12 px-4 sm:px-8 md:grid-cols-12 md:gap-6">
        <div className="md:col-span-7 lg:col-span-6">
          <Reveal>
            <p className="max-w-[18ch] font-display text-[clamp(1.9rem,1rem+2.2vw,3.25rem)] font-semibold leading-[1.04] tracking-[-0.035em]">
              {contact.blurb}
            </p>
          </Reveal>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${site.email}`}
              className="rounded-full bg-accent px-6 py-3.5 text-lg font-medium text-accent-fg transition-transform duration-300 hover:-rotate-2"
            >
              {site.email}
            </a>
            <CopyEmail email={site.email} />
          </div>
        </div>

        <div className="label grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-5 lg:col-span-5 lg:col-start-8">
          <div>
            <p className="text-muted">Socials</p>
            <ul className="mt-3 space-y-1.5">
              {socials.map((social) => (
                <li key={social.label}>
                  <a href={social.href} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1 hover:text-violet">
                    {social.label}
                    <ArrowUpRight className="size-3 transition-transform group-hover:rotate-45" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-muted">Local time</p>
            <p className="mt-3">
              <LocalTime timeZone={site.timeZone} /> — {site.location}
            </p>
          </div>
          <div>
            <p className="text-muted">Status</p>
            <p className="mt-3 flex items-center gap-2">
              <span className="size-2 animate-pulse-dot rounded-full bg-accent" />
              Open to work
            </p>
          </div>
        </div>
      </div>

      <a href={`mailto:${site.email}`} aria-label={`Email ${site.email}`} className="mt-20 block px-4 sm:px-8">
        <GradientText as="span" words={contact.big} seed={27} />
      </a>

      <div className="label mx-4 mt-6 flex flex-wrap justify-between gap-3 border-t border-hairline pt-3 text-muted sm:mx-8">
        <p>
          © {site.year} {site.firstName} {site.lastName}
        </p>
        <p className="hidden sm:block">YOOOHOOO</p>
        <a href="#top" className="hover:text-fg">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
