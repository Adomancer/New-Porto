"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { nav, site, socials } from "@/data/content";
import { LocalTime } from "./LocalTime";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const lenis = useLenis();

  // Mark the nav item for the section crossing the middle of the viewport.
  useEffect(() => {
    const sections = nav
      .map((item) => document.querySelector(item.href))
      .filter((el): el is Element => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(`#${entry.target.id}`);
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    sections.forEach((el) => observer.observe(el));
    const onScroll = () => {
      if (window.scrollY < window.innerHeight * 0.5) setActive(null);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen, lenis]);

  function goTo(event: React.MouseEvent<HTMLAnchorElement>, href: string) {
    event.preventDefault();
    setMenuOpen(false);
    lenis?.start();
    lenis?.scrollTo(href);
  }

  return (
    <>
      {/* Phones get a solid bar so body text never shows through it; from md up,
          mix-blend-difference keeps the floating bar legible over any section. */}
      <header className="label fixed inset-x-0 top-0 z-50 border-b border-hairline bg-bg px-4 py-3 text-fg sm:px-8 md:border-0 md:bg-transparent md:pb-0 md:pt-4 md:text-white md:mix-blend-difference">
        <div className="flex items-center justify-between gap-4 md:grid md:grid-cols-12 md:items-start">
          <a href="#top" className="md:col-span-3">
            {site.firstName} <span className="hidden sm:inline">{site.lastName}</span>
            <span className="sm:hidden">{site.lastName.split(" ").at(-1)}</span>
            <br />
            <span className="opacity-60">Portfolio ©{site.year}</span>
          </a>

          <p className="hidden md:col-span-3 md:block">
            {site.location}
            <br />
            <span className="opacity-60">
              <LocalTime timeZone={site.timeZone} /> local time
            </span>
          </p>

          <nav aria-label="Main" className="hidden md:col-span-4 md:block">
            <ul className="grid grid-cols-3 gap-x-4 gap-y-0.5 lg:flex lg:gap-6">
              {nav.map((item, i) => (
                <li key={item.href}>
                  <a href={item.href} className="group inline-flex items-center gap-1.5">
                    <span
                      aria-hidden
                      className={`size-1.5 bg-white transition-transform duration-300 ${
                        active === item.href ? "scale-100" : "scale-0 group-hover:scale-100"
                      }`}
                    />
                    <span className="opacity-60">0{i + 1}</span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center justify-end gap-5 md:col-span-2 md:items-start">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="uppercase md:hidden"
            >
              Menu
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            data-lenis-prevent
            className="fixed inset-0 z-[60] flex flex-col bg-ink px-4 pb-6 pt-4 text-ink-fg"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="label flex items-start justify-between">
              <span>
                {site.firstName} {site.lastName}
              </span>
              <button type="button" onClick={() => setMenuOpen(false)} autoFocus className="uppercase">
                Close
              </button>
            </div>
            <ul className="mt-auto flex flex-col">
              {nav.map((item, i) => (
                <motion.li
                  key={item.href}
                  className="border-t border-ink-fg/15"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  <a
                    href={item.href}
                    onClick={(e) => goTo(e, item.href)}
                    className="flex items-baseline justify-between py-2 font-display text-[3.4rem] font-extrabold uppercase leading-none tracking-[-0.04em]"
                  >
                    {item.label}
                    <span className="label opacity-50">0{i + 1}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="label mt-10 flex flex-wrap justify-between gap-3 opacity-70">
              <a href={`mailto:${site.email}`}>{site.email}</a>
              <span className="flex gap-4">
                {socials.slice(0, 3).map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                    {s.label}
                  </a>
                ))}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
