"use client"

import Link from "next/link"
import { Clock, BookOpen } from "lucide-react"
import {
  useGoogleCalendarEvents,
  formatEventDate,
  formatEventTime,
} from "@/lib/google-calendar-events"
import { services as allServices } from "@/lib/events-data"

// Helper: Filter services and keep up to 'limit' upcoming
function getUpcomingServicesContinuous(events: any[], limit: number) {
  const now = new Date()

  // Filter only service-type events
  const services = events
    .filter(event => {
      const title = event.title.toLowerCase()
      return (
        title.includes("holy communion") ||
        title.includes("acts") ||
        (title.includes("praise") && title.includes("worship"))
      )
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())

  // Keep events that are within 24 hours after their start
  const visible = services.filter(event => {
    const eventStart = new Date(event.start)
    const cutoff = new Date(eventStart.getTime() + 24 * 60 * 60 * 1000)
    return cutoff >= now
  })

  // If fewer than limit, add future services beyond the visible ones
  if (visible.length >= limit) return visible.slice(0, limit)

  const needed = limit - visible.length
  const extras = services
    .filter(event => !visible.includes(event) && new Date(event.start) > now)
    .slice(0, needed)

  return [...visible, ...extras]
}

export function ServiceTeasers() {
  const { events, isLoading, error } = useGoogleCalendarEvents()

  const services = getUpcomingServicesContinuous(events, 3)

  const getServiceData = (eventTitle: string) => {
    const titleLower = eventTitle.toLowerCase()

    if (titleLower.includes("holy communion")) {
      return allServices.find(s =>
        s.name.toLowerCase().includes("holy communion")
      ) || null
    } else if (titleLower.includes("praise") && titleLower.includes("worship")) {
      return allServices.find(s =>
        s.name.toLowerCase().includes("praise & worship")
      ) || null
    } else if (titleLower.includes("acts worship")) {
      return allServices.find(s =>
        s.name.toLowerCase().includes("acts worship")
      ) || null
    } else {
      return null
    }
  }

  if (isLoading) {
    return (
      <section className="py-16 bg-background text-center">
        <p className="text-muted-foreground">Loading services...</p>
      </section>
    )
  }

  if (error || services.length === 0) {
    return (
      <section className="py-16 bg-background text-center">
        <p className="text-muted-foreground">No upcoming services scheduled.</p>
      </section>
    )
  }

  return (
    <section className="py-16 bg-background">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-accent text-sm uppercase tracking-widest mb-3">
            Worship With Us
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-foreground">
            Join Us for Worship
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service) => {
            const isSunday = new Date(service.start).getDay() === 0
            const matchedService = getServiceData(service.title)
            const displayTitle = matchedService
              ? matchedService.name
              : service.title

            return (
              <div
                key={service.id}
                className="group bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-300 relative p-5"
              >
                {/* Date badge */}
                <div className="absolute top-3 left-3 bg-card/90 backdrop-blur-sm rounded-lg px-3 py-1.5">
                  <span className="text-accent font-semibold text-sm">
                    {formatEventDate(service.start)}
                  </span>
                </div>

                <h3 className="font-serif text-lg text-foreground mb-4 mt-8 group-hover:text-accent transition-colors">
                  {displayTitle}
                </h3>

                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                  {isSunday && (
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-accent" />
                      <span>Sunday School: 10:30 AM</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-accent" />
                    <span>
                      {isSunday ? "11:30 AM" : formatEventTime(service.start)}
                    </span>
                  </div>

                  {service.location && (
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-accent" />
                      <span>
                        {service.location.includes("Redeemer")
                          ? "Redeemer MTC"
                          : service.location}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/services"
            className="inline-flex items-center text-accent hover:text-accent/80 font-medium transition-colors"
          >
            View All Services
            <span className="ml-2">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}