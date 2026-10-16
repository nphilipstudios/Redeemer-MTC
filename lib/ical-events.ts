import ical, { type ParameterValue } from "node-ical"
import type { CalendarEvent } from "./calendar-event"

function text(value?: ParameterValue): string {
  return typeof value === "string" ? value : value?.val ?? ""
}

function localDateString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

export function getCalendarWindow(now = new Date()) {
  const from = new Date(now)
  from.setMonth(from.getMonth() - 2)
  const to = new Date(now)
  to.setMonth(to.getMonth() + 6)
  return { from, to }
}

/** Parse and expand iCalendar entries into the site's existing event shape. */
export function parseICalEvents(
  source: string,
  { from, to } = getCalendarWindow()
): CalendarEvent[] {
  // Parsers can accept arbitrary text as an empty calendar. Reject failed HTML
  // responses and truncated feeds instead of making them look like no events.
  if (!/^BEGIN:VCALENDAR\s*$/im.test(source) || !/^END:VCALENDAR\s*$/im.test(source)) {
    throw new Error("Invalid iCalendar feed")
  }

  const calendar = ical.sync.parseICS(source)
  const events: CalendarEvent[] = []

  for (const entry of Object.values(calendar)) {
    if (entry?.type !== "VEVENT" || entry.status === "CANCELLED" || !entry.start) continue

    const instances = ical.expandRecurringEvent(entry, { from, to, expandOngoing: true })
    for (const instance of instances) {
      if (instance.event.status === "CANCELLED") continue
      if (!Number.isFinite(instance.start.getTime()) || !Number.isFinite(instance.end.getTime())) continue

      const start = instance.isFullDay
        ? localDateString(instance.start)
        : instance.start.toISOString()
      // iCal DTEND for DATE events is exclusive. Keep the date local and make
      // the last day inclusive for the site's past-event/visibility helpers.
      const lastDay = new Date(instance.end)
      lastDay.setDate(lastDay.getDate() - 1)
      const end = instance.isFullDay
        ? `${localDateString(lastDay)}T23:59:59.999`
        : instance.end.toISOString()

      const recurrenceId = instance.event.recurrenceid
      const instanceKey = recurrenceId ? recurrenceId.toISOString() : start
      events.push({
        id: instance.isRecurring ? `${entry.uid}-${instanceKey}` : entry.uid,
        title: text(instance.summary) || "Untitled Event",
        description: text(instance.event.description ?? entry.description),
        location: text(instance.event.location ?? entry.location),
        start,
        end,
      })
    }
  }

  return events.sort((a, b) => a.start.localeCompare(b.start))
}
