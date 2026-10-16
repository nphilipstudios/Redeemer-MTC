import assert from "node:assert/strict"
import test from "node:test"
import { getCalendarWindow, parseICalEvents } from "../lib/ical-events"
import {
  formatEventDate,
  formatEventTime,
  isServiceEvent,
  isSundaySchoolEvent,
  parseCalendarDate,
  type CalendarEvent,
} from "../lib/calendar-events"

process.env.TZ = "America/New_York"

function feed(...entries: string[]) {
  return ["BEGIN:VCALENDAR", "VERSION:2.0", ...entries, "END:VCALENDAR"].join("\r\n")
}

function event(uid: string, properties: string) {
  return `BEGIN:VEVENT\nUID:${uid}\nDTSTAMP:20261001T120000Z\n${properties}\nEND:VEVENT`
}

const window = {
  from: new Date("2026-10-01T00:00:00Z"),
  to: new Date("2026-12-31T23:59:59Z"),
}

test("New York weekly recurrences keep their local time across DST and ChurchTrac date-only UNTIL", () => {
  const events = parseICalEvents(feed(event("weekly", [
    "DTSTART;TZID=America/New_York:20261025T103000",
    "DTEND;TZID=America/New_York:20261025T110000",
    "RRULE:FREQ=WEEKLY;UNTIL=20261108",
    "SUMMARY:Sunday School",
  ].join("\n"))), window)

  assert.deepEqual(events.map(e => e.start), [
    "2026-10-25T14:30:00.000Z",
    "2026-11-01T15:30:00.000Z",
    "2026-11-08T15:30:00.000Z",
  ])
  assert.equal(new Set(events.map(e => e.id)).size, 3)
  assert.ok(events.every(e => isSundaySchoolEvent(e)))
  assert.equal(events[1].end, "2026-11-01T16:00:00.000Z")
})

test("recurrence exclusions, moved instances, and cancelled overrides are applied", () => {
  const events = parseICalEvents(feed(
    event("series", [
      "DTSTART;TZID=America/New_York:20261004T113000",
      "DTEND;TZID=America/New_York:20261004T123000",
      "RRULE:FREQ=WEEKLY;COUNT=4",
      "EXDATE;TZID=America/New_York:20261011T113000",
      "SUMMARY:Holy Communion",
      "DESCRIPTION:Holy Communion worship",
      "LOCATION:Redeemer MTC Church",
    ].join("\n")),
    event("series", [
      "RECURRENCE-ID;TZID=America/New_York:20261018T113000",
      "DTSTART;TZID=America/New_York:20261018T130000",
      "DTEND;TZID=America/New_York:20261018T140000",
      "SUMMARY:Rescheduled service",
    ].join("\n")),
    event("series", [
      "RECURRENCE-ID;TZID=America/New_York:20261025T113000",
      "DTSTART;TZID=America/New_York:20261025T113000",
      "STATUS:CANCELLED",
    ].join("\n")),
  ), window)

  assert.equal(events.length, 2)
  assert.equal(events[1].start, "2026-10-18T17:00:00.000Z")
  assert.equal(events[1].end, "2026-10-18T18:00:00.000Z")
  assert.equal(events[1].title, "Rescheduled service")
  assert.equal(events[1].description, "Holy Communion worship")
  assert.equal(events[1].location, "Redeemer MTC Church")
  assert.equal(events[1].id, "series-2026-10-18T15:30:00.000Z")
})

test("all-day events retain local dates and inclusive ends, including across DST", () => {
  const events = parseICalEvents(feed(
    event("weekend", "DTSTART;VALUE=DATE:20261031\nDTEND;VALUE=DATE:20261102\nSUMMARY:Retreat"),
    event("single", "DTSTART;VALUE=DATE:20261114\nSUMMARY:Talent Fest"),
  ), window)

  assert.equal(events[0].start, "2026-10-31")
  assert.equal(events[0].end, "2026-11-01T23:59:59.999")
  assert.equal(events[1].end, "2026-11-14T23:59:59.999")
  assert.equal(parseCalendarDate(events[1].start).getDate(), 14)
  assert.equal(formatEventDate(events[1].start), "Nov 14")
  assert.equal(formatEventTime(events[1].start), "")
})

test("folded and escaped text and property parameters are decoded", () => {
  const [entry] = parseICalEvents(feed(event("text", [
    "DTSTART:20261004T150000Z",
    "DTEND:20261004T160000Z",
    "SUMMARY;LANGUAGE=en:Parish Day",
    "DESCRIPTION:Holy Communion\\nJoin us\\, friends\\; welcome ",
    " everyone.",
    "LOCATION;LANGUAGE=en:Redeemer MTC Church",
  ].join("\r\n"))), window)

  assert.equal(entry.title, "Parish Day")
  assert.equal(entry.description, "Holy Communion\nJoin us, friends; welcome everyone.")
  assert.equal(entry.location, "Redeemer MTC Church")
})

test("the window excludes out-of-range and cancelled events and includes ongoing entries", () => {
  const events = parseICalEvents(feed(
    event("old", "DTSTART:20260901T100000Z\nDTEND:20260901T110000Z"),
    event("ongoing", "DTSTART:20260930T100000Z\nDTEND:20261002T110000Z"),
    event("cancelled", "DTSTART:20261004T100000Z\nSTATUS:CANCELLED"),
    event("future", "DTSTART:20270101T100000Z"),
  ), window)
  assert.deepEqual(events.map(e => e.id), ["ongoing"])
  assert.equal(events[0].title, "Untitled Event")
})

test("valid empty calendars are accepted while HTML and truncated feeds fail", () => {
  assert.deepEqual(parseICalEvents(feed(), window), [])
  assert.throws(() => parseICalEvents("<html>Feed unavailable</html>", window), /Invalid iCalendar/)
  assert.throws(() => parseICalEvents("BEGIN:VCALENDAR\nVERSION:2.0", window), /Invalid iCalendar/)
})

test("the default calendar window remains two months past through six months future", () => {
  const { from, to } = getCalendarWindow(new Date("2026-10-02T12:00:00Z"))
  assert.equal(from.toISOString(), "2026-08-02T12:00:00.000Z")
  assert.equal(to.toISOString(), "2027-04-02T12:00:00.000Z")
})

test("classification uses titles only when descriptions are empty", () => {
  const base: CalendarEvent = { id: "test", title: "Holy Communion", start: "2026-10-04", end: "2026-10-04T23:59:59.999" }
  assert.equal(isServiceEvent(base), true)
  assert.equal(isServiceEvent({ ...base, description: "  " }), true)
  assert.equal(isServiceEvent({ ...base, description: "Choir rehearsal" }), false)
  assert.equal(isServiceEvent({ ...base, title: "Parish Day", description: "Holy Qurbana" }), true)
  assert.equal(isSundaySchoolEvent({ ...base, title: "Sunday School" }), true)
  assert.equal(isSundaySchoolEvent({ ...base, title: "Sunday School", description: "Planning meeting" }), false)
})
