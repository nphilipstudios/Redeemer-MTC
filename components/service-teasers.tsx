"use client"

import Link from "next/link"
import { Clock, BookOpen, MapPin } from "lucide-react"
import {
  useGoogleCalendarEvents,
  getUpcomingServices,
  formatEventDate,
  formatEventTime,
  type CalendarEvent,
} from "@/lib/google-calendar-events"
import { services as allServices } from "@/lib/events-data"

export function ServiceTeasers() {
  const { events, isLoading, error } = useGoogleCalendarEvents()

  // ✅ Services ONLY, disappear 6 hours after END (matches Services page)
  const services: CalendarEvent[] = getUpcomingServices(events, 6).slice(0, 3)

  const getServiceData = (eventTitle: string) => {
    const titleLower = eventTitle.toLowerCase()

    if (titleLower.includes("holy communion")) {
      return (
        allServices.find((s) => s.name.toLowerCase().includes("holy communion")) ||
        null
      )
    } else if (titleLower.includes("praise") && titleLower.includes("worship")) {
      return (
        allServices.find((s) =>
          s.name.toLowerCase().includes("praise & worship")
        ) || null
      )
    } else if (titleLower.includes("acts worship")) {
      return (
        allServices.find((s) => s.name.toLowerCase().includes("acts worship")) ||
        null
      )
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

  // ✅ Layout rules:
  // - 1 service: centered
  // - 2 services: two columns, centered as a pair (no empty middle column)
  // - 3+ services: normal responsive layout (back to original)
  const gridClassName = [
    "grid gap-5 justify-center",
    services.length === 1 && "grid-cols-1",
    services.length === 2 && "grid-cols-2",
    services.length >= 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  ]
    .filter(Boolean)
    .join(" ")

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

        <div className={gridClassName}>
          {services.map((service) => {
            const startDate = new Date(service.start)
            const isSunday = startDate.getDay() === 0

            const matchedService = getServiceData(service.title)
            const displayTitle = matchedService ? matchedService.name : service.title

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

                  {service.location ? (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-accent" />
                      <span>
                        {service.location.includes("Redeemer")
                          ? "Redeemer MTC"
                          : service.location}
                      </span>
                    </div>
                  ) : null}
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