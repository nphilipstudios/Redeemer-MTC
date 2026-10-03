import assert from "node:assert/strict"
import { test } from "node:test"
import type { CalendarEvent } from "../lib/calendar-event"
import { getUpcomingMinistryEvents, matchesMinistryEvent } from "../lib/ministry-events"

function event(title: string, overrides: Partial<CalendarEvent> = {}): CalendarEvent {
  return { id: title, title, start: "2026-10-04T10:00:00", end: "2026-10-04T11:00:00", ...overrides }
}

test("Children's Ministry includes Sunday School using description/title fallback and excludes unrelated events", () => {
  assert.equal(matchesMinistryEvent(event("Sunday School"), "children"), true)
  assert.equal(matchesMinistryEvent(event("Talent Fest", { description: "Regional Sunday School Talent Fest" }), "children"), true)
  assert.equal(matchesMinistryEvent(event("Sunday School", { description: "Planning meeting" }), "children"), false)
  assert.equal(matchesMinistryEvent(event("Fall-O-Ween", { description: "Children’s Ministry event" }), "children"), true)
  assert.equal(matchesMinistryEvent(event("Father's Cupboard Missions", { description: "Feed my starving children" }), "children"), false)
  assert.equal(matchesMinistryEvent(event("Holy Communion", { description: "Holy Communion for World Sunday School Day" }), "children"), false)
  assert.equal(matchesMinistryEvent(event("Youth Fellowship"), "children"), false)
})

test("ministry matching follows existing event groups and includes prayer calls", () => {
  for (const [slug, title] of [
    ["Music", "Music rehearsal"],
    ["youth", "Youth Fellowship"],
    ["men", "Men's LifeGroup Movie Night"],
    ["women", "Women’s LifeGroup Meeting"],
    ["prayer", "Monthly Church Prayer Meeting"],
    ["prayer", "Saturday Morning Prayer Call"],
  ]) {
    assert.equal(matchesMinistryEvent(event(title), slug), true, title)
  }
  assert.equal(matchesMinistryEvent(event("Women's LifeGroup Meeting"), "men"), false)
  assert.equal(matchesMinistryEvent(event("Bible Study"), "prayer"), false)
  assert.equal(matchesMinistryEvent(event("Parish Day"), "unknown"), false)
})

test("upcoming ministry events sort by start and retain ongoing/all-day events until they end", () => {
  const now = new Date("2026-10-04T10:30:00")
  const upcoming = event("Next Sunday School", { start: "2026-10-11T10:00:00", end: "2026-10-11T11:00:00" })
  const ongoing = event("Sunday School")
  const allDay = event("Sunday School Talent Fest", { start: "2026-10-04", end: "2026-10-04T23:59:59.999" })
  const past = event("Previous Sunday School", { start: "2026-10-03T10:00:00", end: "2026-10-03T11:00:00" })
  const invalid = event("Sunday School", { start: "invalid" })
  const events = [upcoming, past, ongoing, allDay, event("Youth Fellowship"), invalid]
  assert.deepEqual(getUpcomingMinistryEvents(events, "children", now), [allDay, ongoing, upcoming])
  assert.equal(events[0], upcoming)
})
