import { useMemo } from "react";
import { useAdminData } from "@/contexts/AdminDataContext";
import type { AdminEvent } from "@/contexts/AdminDataContext";

/** Start of today in local time for date-only comparison. */
function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Parse event date so it works on all devices (including mobile Safari). Invalid dates are treated as upcoming so events are not hidden. */
function parseEventDate(dateStr: string): Date {
  const d = new Date(dateStr);
  if (!Number.isNaN(d.getTime())) {
    d.setHours(0, 0, 0, 0);
    return d;
  }
  const iso = dateStr.replace(/^(\w+)\s+(\d{1,2}),\s*(\d{4})$/, "$2 $1 $3");
  const d2 = new Date(iso);
  if (!Number.isNaN(d2.getTime())) {
    d2.setHours(0, 0, 0, 0);
    return d2;
  }
  return new Date(9999, 0, 1);
}

/** Categorize and sort events by date. Runs on every render (dynamic, no manual toggle). */
export function usePublicEvents(): {
  upcomingEvents: AdminEvent[];
  pastEvents: AdminEvent[];
} {
  const { events } = useAdminData();
  return useMemo(() => {
    const today = startOfToday();
    const published = events.filter((e) => e.published !== false);
    const upcoming: AdminEvent[] = [];
    const past: AdminEvent[] = [];
    for (const e of published) {
      const eventDate = parseEventDate(e.date);
      if (eventDate >= today) {
        upcoming.push(e);
      } else {
        past.push(e);
      }
    }
    upcoming.sort((a, b) => parseEventDate(a.date).getTime() - parseEventDate(b.date).getTime());
    past.sort((a, b) => parseEventDate(b.date).getTime() - parseEventDate(a.date).getTime());
    return { upcomingEvents: upcoming, pastEvents: past };
  }, [events]);
}
