import { NextResponse } from "next/server"

const GOOGLE_CALENDAR_API_KEY = "AIzaSyAVp8bZc4wX-GGwqNmxE_pIDZLGpEn5j9M"
const CALENDAR_ID =
  process.env.GOOGLE_CALENDAR_ID ||
  "0t69sj6mamgelh24g2uvmtu6mucm69gj@import.calendar.google.com"

export async function GET() {
  try {
    // Helpful sanity check (safe to keep)
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

    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      CALENDAR_ID
    )}/events?key=${GOOGLE_CALENDAR_API_KEY}&timeMin=${timeMin.toISOString()}&timeMax=${timeMax.toISOString()}&singleEvents=true&orderBy=startTime&maxResults=250`

    const response = await fetch(url, {
      cache: "no-store", // important for fresh events
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Google Calendar API error:", response.status, errorText)

      return NextResponse.json(
        { error: "Failed to fetch calendar events", events: [] },
        { status: response.status }
      )
    }

    const data = await response.json()

    const formattedEvents = (data.items || []).map((event: any) => ({
      id: event.id,
      title: event.summary || "Untitled Event",
      description: event.description || "",
      location: event.location || "",
      start: event.start?.dateTime || event.start?.date,
      end: event.end?.dateTime || event.end?.date,
    }))

    return NextResponse.json({ events: formattedEvents })
  } catch (error) {
    console.error("Google Calendar fetch error:", error)

    return NextResponse.json(
      { error: "Failed to fetch calendar events", events: [] },
      { status: 500 }
    )
  }
}