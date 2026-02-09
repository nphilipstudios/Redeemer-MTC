"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getEventGroup } from "@/lib/eventgroup"
import {
  useGoogleCalendarEvents,
  formatEventDate,
  formatEventTime,
  isServiceEvent,
  prettyLocation,
  type CalendarEvent,
} from "@/lib/google-calendar-events"
import { Clock, MapPin } from "lucide-react"

function hasExplicitTime(start: string) {
  // Google Calendar all-day events come through as YYYY-MM-DD (no "T").
  // Timed events come through as ISO datetime with "T".
  return typeof start === "string" && start.includes("T")
}

function extractFirstUrl(text?: string) {
  if (!text) return null
  const match = text.match(/https?:\/\/[^\s)]+/i)
  return match ? match[0] : null
}

function removeUrls(text?: string) {
  if (!text) return text
  return text
    .replace(/https?:\/\/[^\s)]+/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim()
}

function getDomain(url: string) {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

function norm(s?: string) {
  return (s ?? "").toLowerCase()
}

function getRecurringKey(e: CalendarEvent) {
  const text = `${e.title ?? ""} ${e.description ?? ""}`.toLowerCase()
  if (text.includes("prayer call")) return "prayer_call" as const
  if (text.includes("bible study")) return "bible_study" as const
  return null
}

function weekdayNameFromDate(d: Date) {
  return d.toLocaleDateString("en-US", { weekday: "long" })
}

function recurringLabelFor(event: CalendarEvent) {
  const d = new Date(event.start)
  const weekday = weekdayNameFromDate(d)
  const key = getRecurringKey(event)

  if (key === "prayer_call") return `Every ${weekday}`
  if (key === "bible_study") return `Every ${weekday}`
  return `Every ${weekday}`
}

export default function EventsPage() {
  const { events, isLoading, error } = useGoogleCalendarEvents()

  const now = new Date()

  const nonServiceUpcoming: CalendarEvent[] = events
    .filter((e) => !isServiceEvent(e))
    .filter((e) => new Date(e.start) >= now)
    .slice()
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())

  // Main grid: exclude recurring series instances (Bible Study / Prayer Call)
  const upcomingEvents: CalendarEvent[] = nonServiceUpcoming
    .filter((e) => !getRecurringKey(e))

  // Bottom section: show each recurring series ONCE (take the next upcoming instance)
  const recurringEvents: CalendarEvent[] = (() => {
    const seen = new Set<string>()
    const out: CalendarEvent[] = []

    for (const e of nonServiceUpcoming) {
      const key = getRecurringKey(e)
      if (!key) continue
      if (seen.has(key)) continue
      seen.add(key)
      out.push(e)
    }

    return out
  })()

  return (
    <main className="min-h-screen">
      <Header />

      <section className="pt-32 pb-16 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-accent text-sm uppercase tracking-widest mb-3">
              Upcoming
            </p>
            <h1 className="font-serif text-4xl md:text-5xl text-foreground">
              Events
            </h1>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading events...</p>
            </div>
          ) : error || upcomingEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No upcoming events scheduled.</p>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {upcomingEvents.map((event) => {
                  const eventGroup = getEventGroup(event)
                  const url = extractFirstUrl(event.description)

                  return (
                    <div
                      key={event.id}
                      className="bg-card rounded-xl border border-border p-5 hover:shadow-lg transition-all relative min-w-0"
                    >
                      {/* Date + Group */}
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-medium">
                          {formatEventDate(event.start)}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-lg text-xs font-medium uppercase ${eventGroup.color}`}
                        >
                          {eventGroup.name}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-serif text-lg text-foreground mb-3 mt-8 break-words line-clamp-2">
                        {event.title}
                      </h3>

                      {/* Time, Location, Description */}
                      <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                        {hasExplicitTime(event.start) ? (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-accent" />
                            <span>{formatEventTime(event.start)}</span>
                          </div>
                        ) : null}

                        {event.location ? (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-accent" />
                            <span className="truncate min-w-0">
                              {prettyLocation(event.location)}
                            </span>
                          </div>
                        ) : null}

                        {event.description ? (
                          <p className="mt-2 text-sm leading-relaxed line-clamp-3 break-words">
                            {removeUrls(event.description.split("\n")[0])}
                          </p>
                        ) : null}

                        {url ? (
                          <a
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 inline-flex w-fit items-center text-accent hover:text-accent/80 font-medium break-all"
                          >
                            {getDomain(url)} <span className="ml-2">→</span>
                          </a>
                        ) : null}
                      </div>
                    </div>
                  )
                })}
              </div>

              {recurringEvents.length > 0 ? (
                <div className="mt-2">
                  <h2 className="font-serif text-2xl text-foreground mb-6 text-center">
                    Weekly Events
                  </h2>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recurringEvents.map((event) => {
                      const eventGroup = getEventGroup(event)
                      const url = extractFirstUrl(event.description)

                      return (
                        <div
                          key={`${event.id}-recurring`}
                          className="bg-card rounded-xl border border-border p-5 hover:shadow-lg transition-all relative min-w-0"
                        >
                          {/* Recurring badge + Group */}
                          <div className="absolute top-3 left-3 flex items-center gap-2">
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-medium">
                              {recurringLabelFor(event)}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-lg text-xs font-medium uppercase ${eventGroup.color}`}
                            >
                              {eventGroup.name}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="font-serif text-lg text-foreground mb-3 mt-8 break-words line-clamp-2">
                            {event.title}
                          </h3>

                          {/* Time, Location, Description */}
                          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                            {hasExplicitTime(event.start) ? (
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-accent" />
                                <span>{formatEventTime(event.start)}</span>
                              </div>
                            ) : null}

                            {event.location ? (
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-accent" />
                                <span className="truncate min-w-0">
                                  {prettyLocation(event.location)}
                                </span>
                              </div>
                            ) : null}

                            {event.description ? (
                              <p className="mt-2 text-sm leading-relaxed line-clamp-3 break-words">
                                {removeUrls(event.description.split("\n")[0])}
                              </p>
                            ) : null}

                            {url ? (
                              <a
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-2 inline-flex w-fit items-center text-accent hover:text-accent/80 font-medium break-all"
                              >
                                {getDomain(url)} <span className="ml-2">→</span>
                              </a>
                            ) : null}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}