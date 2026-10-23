"use client";

import { useSyncExternalStore } from "react";

const formatters = new Map<string, Intl.DateTimeFormat>();

function formatNow(timeZone: string) {
  let fmt = formatters.get(timeZone);
  if (!fmt) {
    fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone });
    formatters.set(timeZone, fmt);
  }
  return fmt.format(new Date());
}

function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 1000);
  return () => clearInterval(id);
}

/** Live clock for a time zone. Renders "--:--" on the server, the real time once hydrated. */
export function LocalTime({ timeZone }: { timeZone: string }) {
  const time = useSyncExternalStore(
    subscribe,
    () => formatNow(timeZone),
    () => "--:--",
  );
  return <span className="tabular-nums">{time}</span>;
}
