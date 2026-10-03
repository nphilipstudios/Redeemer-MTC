import { NextResponse } from "next/server"
import { parseICalEvents } from "@/lib/ical-events"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const DEFAULT_ICAL_URL = "https://www.churchtrac.com/ical?ui=E6511E07"
const headers = { "Cache-Control": "no-store" }

export async function GET() {
  const feedUrl = process.env.CALENDAR_ICAL_URL?.trim() || DEFAULT_ICAL_URL

  try {
    const url = new URL(feedUrl)
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      throw new Error("Unsupported feed protocol")
    }
  } catch {
    return NextResponse.json(
      { error: "Invalid CALENDAR_ICAL_URL", events: [] },
      { status: 500, headers }
    )
  }

  try {
    const response = await fetch(feedUrl, {
      cache: "no-store",
      // ChurchTrac rejects Node's default wildcard Accept-Language header.
      headers: { Accept: "text/calendar", "Accept-Language": "en-US" },
      signal: AbortSignal.timeout(15_000),
    })

    if (!response.ok) {
      console.error("Calendar feed returned HTTP", response.status)
      return NextResponse.json(
        { error: "Failed to fetch calendar events", events: [] },
        { status: 502, headers }
      )
    }

    const events = parseICalEvents(await response.text())
    return NextResponse.json({ events }, { headers })
  } catch {
    // Avoid logging the feed URL or upstream content, which may contain tokens.
    console.error("Unable to fetch or parse calendar feed")
    return NextResponse.json(
      { error: "Failed to fetch calendar events", events: [] },
      { status: 502, headers }
    )
  }
}
