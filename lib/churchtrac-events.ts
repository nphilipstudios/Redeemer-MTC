"use client"

import { useEffect, useState } from "react"

export interface ChurchEvent {
  id: string
  title: string
  startDate: Date
  endDate: Date
  location?: string
  description?: string
}

export function useChurchTrac() {
  const [events, setEvents] = useState<ChurchEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
    // Refresh every 5 minutes
    const interval = setInterval(fetchEvents, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  async function fetchEvents() {
    try {
      const response = await fetch("/api/google-calendar")
      const data = await response.json()

      if (data.events) {
        const parsedEvents = data.events.map((event: any) => ({
          id: event.id,
          title: event.title,
          startDate: new Date(event.start),
          endDate: new Date(event.end),
          location: event.location || "",
          description: event.description || "",
        }))
        setEvents(parsedEvents)
      }
    } catch (error) {
      console.error("Failed to fetch calendar events:", error)
    } finally {
      setLoading(false)
    }
  }

  return { events, loading }
}

// Filter services (Holy Communion, ACTS, Praise & Worship)
export function filterServices(events: ChurchEvent[]): ChurchEvent[] {
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)

  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  return events.filter((event) => {
    const eventDate = new Date(event.startDate)
    const title = event.title.toLowerCase()

    // Must be a service
    const isService =
      title.includes("holy communion") ||
      title.includes("acts") ||
      (title.includes("praise") && title.includes("worship"))

    // Must be in current month
    const isCurrentMonth = eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear

    // Must be today or in the future (remove 1 day after)
    const isNotOld = eventDate >= tomorrow

    return isService && isCurrentMonth && isNotOld
  })
}

// Filter events (exclude services, Bible Study, Prayer Call)
export function filterEvents(events: ChurchEvent[]): ChurchEvent[] {
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)

  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  return events.filter((event) => {
    const eventDate = new Date(event.startDate)
    const title = event.title.toLowerCase()

    // Exclude services
    const isService =
      title.includes("holy communion") ||
      title.includes("acts") ||
      (title.includes("praise") && title.includes("worship"))

    // Exclude recurring weekly events
    const isRecurring = title.includes("bible study") || title.includes("prayer call")

    // Must be in current month
    const isCurrentMonth = eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear

    // Must be today or in the future (remove 1 day after)
    const isNotOld = eventDate >= tomorrow

    return !isService && !isRecurring && isCurrentMonth && isNotOld
  })
}

// Get all events for calendar (no filtering by date)
export function getAllEvents(events: ChurchEvent[]): ChurchEvent[] {
  return events
}
