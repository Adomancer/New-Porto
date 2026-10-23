"use client";

import { useLayoutEffect } from "react";

type Theme = "light" | "dark";

function preferredTheme(): Theme {
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
  } catch {}
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** Small "Light ◐ Dark" switch. The new theme is revealed in a circle growing from the switch. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  // Re-apply after React's dev-mode remount clears the attribute set by the inline script.
  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", preferredTheme());
  }, []);

  function toggle(event: React.MouseEvent<HTMLButtonElement>) {
    const root = document.documentElement;
    const next: Theme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    const apply = () => {
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch {}
    };

    if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply();
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document.startViewTransition(apply).ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 800, easing: "cubic-bezier(0.16, 1, 0.3, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className={`label group flex items-center gap-2 ${className}`}
    >
      <span className="dark:opacity-50">Light</span>
      <span aria-hidden className="relative h-[18px] w-8 rounded-full border border-current">
        <span className="absolute left-[3px] top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-current transition-transform duration-500 ease-out-expo dark:translate-x-[13px]" />
      </span>
      <span className="opacity-50 dark:opacity-100">Dark</span>
    </button>
  );
}
