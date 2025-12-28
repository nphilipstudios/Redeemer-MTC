"use client"

import { useState, useEffect } from "react"

export interface CalendarEvent {
  id: string
  title: string
  description: string
  location: string
  start: string
  end: string
}

export function useGoogleCalendarEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEvents() {
      try {
        setIsLoading(true)
        const response = await fetch("/api/google-calendar")
        const data = await response.json()

        if (data.error) {
          setError(data.error)
          setEvents([])
        } else {
          setEvents(data.events || [])
        }
      } catch (err) {
        setError("Failed to load calendar events")
        setEvents([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
    const interval = setInterval(fetchEvents, 5 * 60 * 1000) // Refresh every 5 minutes
    return () => clearInterval(interval)
  }, [])

  return { events, isLoading, error }
}

// Helper: remove events older than 24 hours and sort ascending
function filterFutureEvents(events: CalendarEvent[]) {
  const now = new Date()
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  return events
    .filter(event => new Date(event.start) >= oneDayAgo)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
}

// Get up to `limit` upcoming events/services with 24h removal
export function getContinuousUpcoming(events: CalendarEvent[], limit: number) {
  const filtered = filterFutureEvents(events)
  return filtered.slice(0, limit)
}

// Filter services (Holy Communion, ACTS, Praise & Worship)
export function getUpcomingServices(events: CalendarEvent[]) {
  return filterFutureEvents(events).filter(event => {
    const title = event.title.toLowerCase()
    return (
      title.includes("holy communion") ||
      title.includes("acts") ||
      (title.includes("praise") && title.includes("worship"))
    )
  })
}

// Filter events (exclude services and recurring like Bible Study / Prayer)
export function getUpcomingEvents(events: CalendarEvent[]) {
  return filterFutureEvents(events).filter(event => {
    const title = event.title.toLowerCase()
    const isService =
      title.includes("holy communion") ||
      title.includes("acts") ||
      (title.includes("praise") && title.includes("worship"))
    const isRecurring =
      title.includes("bible study") || title.includes("prayer call")
    return !isService && !isRecurring
  })
}

// Get all events for calendar (no filtering)
export function getAllEvents(events: CalendarEvent[]) {
  return events.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
}

// Helpers to format date/time
export function formatEventDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function formatEventTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
}