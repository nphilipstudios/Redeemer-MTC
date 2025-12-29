"use client"

import { useEffect, useState } from "react"

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  location?: string
  start: string
  end: string
}

// ------------------------
// Hook: fetch from API
// ------------------------
export function useGoogleCalendarEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function fetchEvents() {
      try {
        setIsLoading(true)
        const response = await fetch("/api/google-calendar", { cache: "no-store" })
        const data = await response.json()

        if (!mounted) return

        if (data?.error) {
          setError(String(data.error))
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
// Title classification
// ------------------------
export function isServiceTitle(title: string) {
  const t = title.toLowerCase()
  return (
    t.includes("holy communion") ||
    t.includes("acts") ||
    (t.includes("praise") && t.includes("worship"))
  )
}

// ------------------------
// Time helpers
// ------------------------
function safeDate(value: string) {
  const d = new Date(value)
  return isNaN(d.getTime()) ? null : d
}

/**
 * Visible rule for SERVICES:
 * show if upcoming OR ended within the last `hoursAfterEnd` hours.
 */
export function isVisibleHoursAfterEnd(event: CalendarEvent, hoursAfterEnd = 6) {
  const now = new Date()

  const start = safeDate(event.start)
  const end = safeDate(event.end) || start

  if (!start) return false // can't time it => don't show

  const effectiveEnd = end ?? start
  const cutoff = new Date(effectiveEnd.getTime() + hoursAfterEnd * 60 * 60 * 1000)

  return start >= now || cutoff >= now
}

/**
 * Generic: remove events older than `minutesPast` minutes (default 24 hours),
 * then sort ascending by start.
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
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
}

// ------------------------
// Outputs used by components/pages
// ------------------------

/**
 * Get up to `limit` upcoming (uses 24h past buffer like your original).
 */
export function getContinuousUpcoming(events: CalendarEvent[], limit: number) {
  return filterFutureEvents(events).slice(0, limit)
}

/**
 * SERVICES ONLY.
 * ✅ Automatically disappears 6 hours after it ENDED.
 */
export function getUpcomingServices(events: CalendarEvent[], hoursAfterEnd = 6) {
  return events
    .filter((e) => isServiceTitle(e.title))
    .filter((e) => isVisibleHoursAfterEnd(e, hoursAfterEnd))
    .slice()
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
}

/**
 * EVENTS (non-services).
 * ✅ Never includes services.
 * ✅ Recurring (Bible Study / Prayer Call) stays included.
 * Uses the same 24h past buffer behavior as your original.
 */
export function getUpcomingEvents(events: CalendarEvent[]) {
  return filterFutureEvents(events).filter((e) => !isServiceTitle(e.title))
}

/**
 * All events, sorted (no filtering).
 */
export function getAllEvents(events: CalendarEvent[]) {
  return events.slice().sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
}

// ------------------------
// Formatting helpers
// ------------------------
export function formatEventDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function formatEventTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}