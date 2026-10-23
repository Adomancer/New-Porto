# Portfolio

A one-page editorial portfolio built with Next.js 16, Tailwind CSS v4, Lenis (smooth scroll), Motion and Embla Carousel.

```bash
npm run dev    # http://localhost:3000
npm run build  # static production build
```

## Make it yours

- **Copy:** everything lives in `data/content.ts`. In strings, `**text**` gets the lime highlighter and `*text*` renders in the violet accent. The giant hero name and footer "LET'S TALK" resize themselves to fit the page width, so any name works.
- **Images:** replace the SVGs in `public/placeholder/` (portrait, notes, project previews), or point `content.ts` at your own files.
- **Colors:** the palette is the set of CSS variables at the top of `app/globals.css` (`:root` for light, `[data-theme="dark"]` for dark). `--g1`…`--g4` are the colors flowing inside the giant letters.
- **Fonts:** Bricolage Grotesque (display), Geist (body) and Geist Mono (labels) load via `next/font` in `app/layout.tsx`.

## Sections

| Section | What it does | File |
| --- | --- | --- |
| Header | Info bar with live local time; inverts over any background | `components/Header.tsx` |
| Hero | Full-width name with a WebGL gradient inside the letters that ripples near the cursor | `components/Hero.tsx`, `GradientText.tsx` |
| Marquee | Two rows of services that speed up and flip direction with your scroll | `components/Marquee.tsx` |
| Work | Pins and scrolls sideways on desktop; vertical list on phones | `components/Work.tsx` |
| About | Words fill in as you scroll, highlighter swipes, counting stats | `components/About.tsx`, `ScrollRevealText.tsx`, `Stats.tsx` |
| Services | Cards that stick and stack on top of each other | `components/Services.tsx` |
| Notes | Draggable blog carousel | `components/Notes.tsx` |
| Contact | Email + copy button, socials, giant gradient "LET'S TALK" | `components/Footer.tsx` |

Dark mode is applied before first paint (inline script in `app/layout.tsx`) and switches with a circular reveal (`components/ThemeToggle.tsx`). All motion is reduced when the visitor has `prefers-reduced-motion` set.
