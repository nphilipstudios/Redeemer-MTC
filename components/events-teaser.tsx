"use client"

import Link from "next/link"
import { Clock, MapPin, ArrowRight } from "lucide-react"
import { useChurchTrac, filterEvents } from "@/lib/churchtrac-events"

export function EventsTeaser() {
  const { events, loading } = useChurchTrac()
  const upcomingEvents = filterEvents(events).slice(0, 3)

  if (loading) {
    return (
      <section className="py-16 lg:py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      </section>
    )
  }

  if (upcomingEvents.length === 0) {
    return null
  }

  return (
    <section className="py-16 lg:py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center pb-8">
  <p className="text-accent text-sm uppercase tracking-widest mb-2">What's Happening</p>
  <h2 className="font-serif text-3xl md:text-4xl text-foreground">Upcoming Events</h2>
</div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map((event, i) => (
            <div
              key={i}
              className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all group cursor-pointer p-5 relative"
            >
              <div className="absolute top-4 left-4 bg-accent/10 rounded-lg px-3 py-1.5">
                <span className="text-accent font-semibold text-sm">
                  {event.startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>

              <div className="pt-10">
                <h3 className="font-serif text-xl text-foreground mb-3 group-hover:text-accent transition-colors">
                  {event.title}
                </h3>
                <div className="flex flex-col gap-1.5 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-accent" />
                    <span className="text-muted-foreground">
                      {event.startDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                    </span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-accent" />
                      <span className="text-muted-foreground">{event.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors font-medium"
          >
            View All Events <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
