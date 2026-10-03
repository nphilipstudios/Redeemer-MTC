"use client"

import Link from "next/link"
import { Calendar, Clock, MapPin } from "lucide-react"
import {
  useCalendarEvents,
  formatEventDate,
  formatEventTime,
  hasTime,
  prettyLocation,
  prettyTitle,
} from "@/lib/calendar-events"
import { getUpcomingMinistryEvents } from "@/lib/ministry-events"

export function MinistryEvents({ slug }: { slug: string }) {
  const { events, isLoading, error } = useCalendarEvents()
  const ministryEvents = getUpcomingMinistryEvents(events, slug)

  return (
    <section aria-labelledby="ministry-events-heading" className="border-t border-border pt-8">
      <h2 id="ministry-events-heading" className="font-serif text-2xl text-foreground mb-6">Upcoming Events</h2>
      <div aria-live="polite">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading events...</p>
        ) : error ? (
          <p className="text-sm text-muted-foreground">Couldn&apos;t load events right now. Please try again later.</p>
        ) : ministryEvents.length === 0 ? (
          <p className="text-sm text-muted-foreground">No upcoming events scheduled for this ministry.</p>
        ) : (
          <ul className="space-y-4">
            {ministryEvents.map((event) => (
              <li key={event.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                <h3 className="font-medium text-foreground mb-2 break-words">{prettyTitle(event.title)}</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 shrink-0 text-accent" aria-hidden="true" />
                    <span>{formatEventDate(event.start)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 shrink-0 text-accent" aria-hidden="true" />
                    <span>{hasTime(event.start) ? formatEventTime(event.start) : "All day"}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 shrink-0 text-accent mt-0.5" aria-hidden="true" />
                      <span className="break-words">{prettyLocation(event.location)}</span>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Link href="/events" className="inline-block mt-6 text-sm font-medium text-accent hover:text-accent/80 transition-colors">
        View all events →
      </Link>
    </section>
  )
}
