"use client"

import { useEffect, useState } from "react"

import type { CalendarEvent } from "./calendar-event"
import { parseCalendarDate } from "./calendar-date"

export type { CalendarEvent } from "./calendar-event"
export { parseCalendarDate } from "./calendar-date"

// ------------------------
// Hook: fetch from API
// ------------------------
export function useCalendarEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function fetchEvents() {
      try {
        setIsLoading(true)
        const response = await fetch("/api/calendar", { cache: "no-store" })
        const data = await response.json()

        if (!mounted) return

        if (!response.ok || data?.error) {
          setError(String(data?.error || "Failed to load calendar events"))
          setEvents([])
        } else {
          setError(null)
          setEvents(Array.isArray(data?.events) ? data.events : [])
        }
      } catch {
        if (!mounted) return
        setError("Failed to load calendar events")
        setEvents([])
      } finally {
        if (!mounted) return
        setIsLoading(false)
      }
    }

    fetchEvents()
    const interval = setInterval(fetchEvents, 5 * 60 * 1000)
    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [])

  return { events, isLoading, error }
}

// ------------------------
// Classification (description, with title fallback when empty)
// ------------------------
function classificationText(event: CalendarEvent) {
  return (event.description?.trim() || event.title).toLowerCase()
}

/**
 * Service detection uses descriptions, or titles when descriptions are empty.
 * Put keywords like "holy communion", "acts worship", "praise & worship"
 * in the calendar DESCRIPTION.
 */
export function isServiceEvent(event: CalendarEvent) {
  const d = classificationText(event)
  // A nonempty description remains authoritative for classification.
  return (
    // Holy Qurbana / Holy Communion
    d.includes("holy qurbana") ||
    d.includes("qurbana") ||
    d.includes("holy communion") ||

    // ACTS / Praise & Worship
    d.includes("acts worship") ||
    // keep a shorthand match, but avoid accidental matches like "acts" in other words
    /\bacts\b/.test(d) ||
    (d.includes("praise") && d.includes("worship"))
  )
}

/**
 * Sunday School detection uses the same description/title fallback.
 * Put "sunday school" in the calendar DESCRIPTION.
 */
export function isSundaySchoolEvent(event: CalendarEvent) {
  return classificationText(event).includes("sunday school")
}

/**
 * ✅ Location display helper
 */
export function prettyLocation(location?: string) {
  if (!location) return ""
  return location.toLowerCase().includes("redeemer") ? "Redeemer MTC" : location
}

/**
 * ✅ Title display helper (does NOT affect matching)
 * Shows church wording on the website while keeping raw calendar titles
 * for logic like image lookup / service matching.
 */
export function prettyTitle(title?: string) {
  if (!title) return ""

  return title
    // Normalize any "Holy Communion" → "Holy Qurbana"
    .replace(/holy\s+communion/gi, "Holy Qurbana")
    // Normalize any inconsistent Qurbana casing/spelling
    .replace(/holy\s+qurbana/gi, "Holy Qurbana")
}

// ------------------------
// Time helpers
// ------------------------
function safeDate(value: string) {
  const d = parseCalendarDate(value)
  return isNaN(d.getTime()) ? null : d
}

/**
 * All-day events are returned as "YYYY-MM-DD" (no "T").
 * Timed events include "T" (e.g. "YYYY-MM-DDT10:00:00-05:00").
 */
export function hasTime(dateString?: string) {
  return !!dateString && dateString.includes("T")
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

/**
 * Find a Sunday School event on the same date as `dateString`.
 * Matches descriptions, falling back to titles when empty.
 * ✅ If none exists, returns null.
 */
export function getSundaySchoolEventForDate(
  events: CalendarEvent[],
  dateString: string
) {
  const target = safeDate(dateString)
  if (!target) return null

  return (
    events.find((e) => {
      if (!isSundaySchoolEvent(e)) return false
      const start = safeDate(e.start)
      if (!start) return false
      return isSameDay(start, target)
    }) || null
  )
}

/**
 * Visible rule for SERVICES:
 * show if upcoming OR ended within the last `hoursAfterEnd` hours.
 */
export function isVisibleHoursAfterEnd(event: CalendarEvent, hoursAfterEnd = 6) {
  const now = new Date()

  const start = safeDate(event.start)
  const end = safeDate(event.end) || start

  if (!start) return false

  const effectiveEnd = end ?? start
  const cutoff = new Date(effectiveEnd.getTime() + hoursAfterEnd * 60 * 60 * 1000)

  return start >= now || cutoff >= now
}

/**
 * Generic: remove events older than `minutesPast` minutes (default 24h),
 * then sort ascending by start.
 * ✅ Keeps all-day events too (they have valid dates, just no time).
 */
export function filterFutureEvents(events: CalendarEvent[], minutesPast = 24 * 60) {
  const now = new Date()
  const cutoff = new Date(now.getTime() - minutesPast * 60 * 1000)

  return events
    .filter((event) => {
      const start = safeDate(event.start)
      return !!start && start >= cutoff
    })
    .slice()
    .sort((a, b) => parseCalendarDate(a.start).getTime() - parseCalendarDate(b.start).getTime())
}

// ------------------------
// Outputs used by components/pages
// ------------------------
export function getContinuousUpcoming(events: CalendarEvent[], limit: number) {
  return filterFutureEvents(events).slice(0, limit)
}

/**
 * SERVICES ONLY.
 * ✅ Automatically disappears N hours after it ENDED (default 6).
 */
export function getUpcomingServices(events: CalendarEvent[], hoursAfterEnd = 6) {
  return events
    .filter((e) => isServiceEvent(e))
    .filter((e) => isVisibleHoursAfterEnd(e, hoursAfterEnd))
    .slice()
    .sort((a, b) => parseCalendarDate(a.start).getTime() - parseCalendarDate(b.start).getTime())
}

/**
 * EVENTS (non-services).
 * Never includes services.
 * ✅ Includes recurring + all-day events too
 */
export function getUpcomingEvents(events: CalendarEvent[]) {
  return filterFutureEvents(events).filter((e) => !isServiceEvent(e))
}

/**
 * All events, sorted (no filtering).
 */
export function getAllEvents(events: CalendarEvent[]) {
  return events
    .slice()
    .sort((a, b) => parseCalendarDate(a.start).getTime() - parseCalendarDate(b.start).getTime())
}

// ------------------------
// Formatting helpers
// ------------------------
export function formatEventDate(dateString: string): string {
  const date = parseCalendarDate(dateString)
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

/**
 * ✅ IMPORTANT:
 * If the event has no time (all-day event), return "" so your UI can hide it.
 * This prevents displaying "12:00 AM".
 */
export function formatEventTime(dateString: string): string {
  if (!hasTime(dateString)) return ""

  const date = parseCalendarDate(dateString)
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}