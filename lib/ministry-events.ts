import type { CalendarEvent } from "./calendar-event"
import { parseCalendarDate, isServiceEvent, isSundaySchoolEvent } from "./calendar-events"
import { getEventGroup, type EventGroup } from "./eventgroup"

const ministryGroups: Record<string, EventGroup["name"]> = {
  Music: "Music",
  youth: "Youth",
  men: "Men's",
  women: "Women's",
  prayer: "Prayer Meeting",
}

export function matchesMinistryEvent(event: CalendarEvent, slug: string) {
  if (isServiceEvent(event)) return false

  if (slug === "children") {
    const text = event.description?.trim() || event.title
    return isSundaySchoolEvent(event) || /\bchildren(?:['’]s)? ministry\b/i.test(text)
  }

  if (slug === "prayer" && /\bprayer call\b/i.test(`${event.title} ${event.description ?? ""}`)) {
    return true
  }

  return getEventGroup(event).name === ministryGroups[slug]
}

export function getUpcomingMinistryEvents(events: CalendarEvent[], slug: string, now = new Date()) {
  return events
    .filter((event) => {
      if (!matchesMinistryEvent(event, slug)) return false
      const start = parseCalendarDate(event.start)
      if (Number.isNaN(start.getTime())) return false
      // Keep ongoing and all-day events visible until they end.
      const end = parseCalendarDate(event.end)
      return start >= now || end >= now
    })
    .sort((a, b) => parseCalendarDate(a.start).getTime() - parseCalendarDate(b.start).getTime())
}
