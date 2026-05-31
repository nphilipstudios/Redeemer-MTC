import { NextResponse } from "next/server"

const GOOGLE_CALENDAR_API_KEY = process.env.GOOGLE_CALENDAR_API_KEY || ""
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || ""

function isDateOnly(v: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(v)
}

function normalizeStart(raw: string) {
  // If date-only, set local midnight
  return isDateOnly(raw) ? `${raw}T00:00:00` : raw
}

function normalizeEnd(raw: string) {
  // Google end.date is exclusive for all-day events
  if (!isDateOnly(raw)) return raw
  const exclusive = new Date(`${raw}T00:00:00`)
  return new Date(exclusive.getTime() - 1).toISOString()
}

export async function GET() {
  try {
    if (!CALENDAR_ID) {
      return NextResponse.json(
        { error: "Missing GOOGLE_CALENDAR_ID", events: [] },
        { status: 500 }
      )
    }

    if (!GOOGLE_CALENDAR_API_KEY) {
      console.error("Missing GOOGLE_CALENDAR_API_KEY")
      return NextResponse.json(
        { error: "Missing GOOGLE_CALENDAR_API_KEY", events: [] },
        { status: 500 }
      )
    }

    const timeMin = new Date()
    timeMin.setMonth(timeMin.getMonth() - 2)

    const timeMax = new Date()
    timeMax.setMonth(timeMax.getMonth() + 6)

    const params = new URLSearchParams({
      key: GOOGLE_CALENDAR_API_KEY,
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      singleEvents: "true",   // ✅ expand recurring instances
      orderBy: "startTime",   // ✅ required w/ singleEvents
      maxResults: "2500",     // ✅ don’t cut off recurring
    })

    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      CALENDAR_ID
    )}/events?${params.toString()}`

    const response = await fetch(url, { cache: "no-store" })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Google Calendar API error:", response.status, errorText)

      return NextResponse.json(
        { error: "Failed to fetch calendar events", events: [] },
        { status: response.status }
      )
    }

    const data = await response.json()

    const formattedEvents = (data.items || [])
      .map((event: any) => {
        const startRaw: string | undefined = event.start?.dateTime || event.start?.date
        const endRaw: string | undefined = event.end?.dateTime || event.end?.date
        if (!startRaw || !endRaw) return null

        return {
          id: event.id,
          title: event.summary || "Untitled Event",
          description: event.description || "",
          location: event.location || "",
          start: normalizeStart(startRaw),
          end: normalizeEnd(endRaw),
        }
      })
      .filter(Boolean)

    return NextResponse.json({ events: formattedEvents })
  } catch (error) {
    console.error("Google Calendar fetch error:", error)

    return NextResponse.json(
      { error: "Failed to fetch calendar events", events: [] },
      { status: 500 }
    )
  }
}