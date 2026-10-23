// All site copy lives here. Everything below is placeholder content — replace it with your own.
// Inline markup: **text** gets the lime highlighter, *text* renders in the violet accent.

export const site = {
  firstName: "Samuel",
  lastName: "Jagar Adoman Manalu",
  role: "Full-stack Developer & Cybersecurity",
  description:
    "Samuel Jagar Adoman Manalu — full-stack developer with a cybersecurity mindset, building web apps, security tools and the systems behind them.",
  location: "Indonesia",
  coords: "UTC+7",
  timeZone: "Asia/Jakarta",
  email: "adomansamuel123@gmail.com",
  availability: "Open to full-time, freelance & collabs",
  year: 2026,
};

export const nav = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  // Notes section is hidden for now — re-add { label: "Notes", href: "#notes" } and <Notes /> in app/page.tsx.
  { label: "Contact", href: "#contact" },
];

export const hero = {
  // Rendered as one line on desktop, one word per line on phones.
  name: ["Samuel", "Manalu"],
  roleLines: ["Full-stack developer", "& cybersecurity"],
  currently: ["Fresh graduate — December 2026", "Building tools that are useful and safe"],
  intro: "I build web apps end to end — and think about how they could **break** before anyone else does.",
  latest: { label: "Latest — DistroRelay", href: "#work", image: "/projects/distrorelay.svg" },
};

export const marquee = {
  primary: ["Full-stack development", "Cybersecurity", "Backend & APIs", "Security tooling", "Automation"],
  secondary: "Open to full-time, freelance & collabs — let's build something solid —",
};

// Projects without an href are private (client work) and render without a link.
export const projects = [
  {
    title: "DistroRelay",
    category: "Systems tool",
    year: "2026",
    tags: ["Python", "Textual TUI", "Windows", "UEFI"],
    summary:
      "A distro-hopping toolkit for dual-boot laptops: backup, cleanly remove GRUB and Linux partitions, install a new distro and set it up — driven from Windows with dry-runs, journals and restore.",
    href: "https://github.com/Adomancer/DistroRelay",
    image: "/projects/distrorelay.svg",
  },
  {
    title: "URL Scanner",
    category: "Security tool",
    year: "2026",
    tags: ["Python", "Flask", "OSINT", "Docker"],
    summary:
      "A self-hosted URL threat scanner that runs 100% locally — no third-party APIs. Separate threat-risk and security-posture verdicts, with every point backed by evidence and a fix.",
    href: "https://github.com/Adomancer/URLscanner",
    image: "/projects/urlscanner.svg",
  },
  {
    title: "VidHelp",
    category: "Client project",
    year: "2026",
    tags: ["Laravel", "Next.js", "MySQL", "2FA"],
    summary:
      "Management app for a live-streaming host agency: weekly schedules, backup hosts, check-ins and live reports, and pay per approved hour — desktop for admins, mobile-first for hosts.",
    image: "/projects/vidhelp.svg",
  },
  {
    title: "KRS — Kebun Raya System",
    category: "Client project — team",
    year: "2026",
    tags: ["Vue 3", "Express", "MySQL", "Docker"],
    summary:
      "Project, ticket and calendar management system with an AI service. I was PIC of the calendar module and helped across other modules, front end and back end.",
    image: "/projects/krs.svg",
  },
  {
    title: "The Everlasting Love",
    category: "Visual novel — team",
    year: "2026",
    tags: ["Ren'Py", "Python", "Game dev"],
    summary:
      "A fantasy-romance visual novel. I handled the programming and created the female main character.",
    href: "https://github.com/haelahpx/TheeverlastingLove",
    image: "/projects/everlasting-love.jpg",
  },
];

export const archive = { label: "Everything else lives on GitHub", href: "https://github.com/Adomancer" };

export const about = {
  statement:
    "I'm a full-stack developer who thinks like an attacker. I build the whole thing — database to UI — and keep asking how it could **break**, so it **doesn't**.",
  bio: [
    "I'm graduating in December 2026 with a B.Sc. in Information Technology from President University. Along the way I've shipped client apps for real businesses, team projects from back end to front end, and a visual novel.",
    "My favourite projects sit where development meets security: a URL threat scanner that never sends your links to a third party, and a dual-boot toolkit careful enough to refuse to run without a verified backup.",
  ],
  // Typed out by the terminal next to the bio. "cmd" lines are typed, "out" and "ok" lines are printed.
  terminal: {
    title: "samuel@portfolio: ~",
    lines: [
      { kind: "cmd", text: "whoami" },
      { kind: "out", text: "samuel — full-stack dev & cybersecurity" },
      { kind: "cmd", text: "cat stack.txt" },
      { kind: "out", text: "next.js · vue · laravel · express · python" },
      { kind: "cmd", text: "./scan portfolio --passive" },
      { kind: "ok", text: "tls 1.3, hsts, csp" },
      { kind: "ok", text: "no secrets in repo" },
      { kind: "ok", text: "threat risk 0/100" },
      { kind: "cmd", text: "echo $STATUS" },
      { kind: "out", text: "open to work — let's talk" },
    ],
  },
  caption: "Fig. 1 — whoami, on a loop.",
};

export const stats = [
  { value: 5, suffix: "", label: "Featured projects" },
  { value: 2, suffix: "", label: "Client projects" },
  { value: 320, suffix: "+", label: "Commits" },
  { value: 36, suffix: "", label: "Repos contributed" },
];

export const services = [
  {
    title: "Full-stack web",
    description: "Web apps built end to end — from data model and API to a responsive, usable interface.",
    deliverables: ["Next.js & React", "Vue", "Laravel", "Tailwind CSS"],
  },
  {
    title: "Backend & APIs",
    description: "Reliable APIs with clear auth, roles and data rules — documented and ready to integrate.",
    deliverables: ["REST APIs", "Express & Laravel", "MySQL", "Auth & 2FA"],
  },
  {
    title: "Security tooling",
    description: "Tools and reviews that find weak spots early — phishing signals, misconfigurations, risky defaults.",
    deliverables: ["URL & OSINT analysis", "Security headers & TLS", "Code review", "Hardening"],
  },
  {
    title: "Automation & CLI",
    description: "Scripts, CLIs and desktop utilities that turn tedious, risky manual steps into safe, repeatable ones.",
    deliverables: ["Python", "TUI & CLI apps", "Windows tooling", "Docker"],
  },
];

export const notes = [
  {
    title: "Painting with noise: a gentle intro to WebGL gradients",
    date: "Sep 2026",
    read: "8 min",
    tag: "Shaders",
    href: "#",
    image: "/placeholder/post-1.svg",
  },
  {
    title: "Motion that helps: when animation earns its place",
    date: "Jul 2026",
    read: "6 min",
    tag: "Motion",
    href: "#",
    image: "/placeholder/post-2.svg",
  },
  {
    title: "Type scales that actually survive a real layout",
    date: "May 2026",
    read: "5 min",
    tag: "Typography",
    href: "#",
    image: "/placeholder/post-3.svg",
  },
  {
    title: "Shipping fast, static-first sites with Next.js 16",
    date: "Mar 2026",
    read: "10 min",
    tag: "Engineering",
    href: "#",
    image: "/placeholder/post-4.svg",
  },
];

export const contact = {
  // Rendered as one line on desktop, one word per line on phones.
  big: ["Let's", "talk"],
  blurb: "Have a project in mind — or just want to say hi? My inbox is always open.",
};

export const socials = [
  { label: "GitHub", href: "https://github.com/Adomancer" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/samuel-jagar-manalu" },
];
