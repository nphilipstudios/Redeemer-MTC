"use client"

import Link from "next/link"
import { Clock, BookOpen, MapPin } from "lucide-react"
import {
  useGoogleCalendarEvents,
  getUpcomingServices,
  formatEventDate,
  formatEventTime,
  prettyLocation,
  prettyTitle,
  isSundaySchoolEvent,
  type CalendarEvent,
} from "@/lib/google-calendar-events"

export function ServiceTeasers() {
  const { events, isLoading, error } = useGoogleCalendarEvents()

  // ✅ services only, auto-hide 6 hours after END
  const services: CalendarEvent[] = getUpcomingServices(events, 6).slice(0, 3)

  if (isLoading) {
    return (
      <section className="py-16 bg-background text-center">
        <p className="text-muted-foreground">Loading services...</p>
      </section>
    )
  }

  // ✅ keep the section visible, show message
  if (error || services.length === 0) {
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

          <div className="text-center py-10">
            <p className="text-muted-foreground">
              {error ? "Unable to load services right now." : "No upcoming services scheduled."}
            </p>
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

  // ✅ Center rules without shrinking card widths:
  // - 1 item: max-w card centered
  // - 2 items: two cards centered as a pair
  // - 3 items: normal 3-col layout
  const wrapperClass =
    services.length === 1
      ? "flex justify-center"
      : services.length === 2
      ? "flex justify-center"
      : ""

  const gridClass =
    services.length === 1
      ? "w-full max-w-[420px]" // keeps same “big” feeling, not skinny
      : services.length === 2
      ? "grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-5xl"
      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"

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

        <div className={wrapperClass}>
          <div className={gridClass}>
            {services.map((service) => {
              const startDate = new Date(service.start)
              const isSunday = startDate.getDay() === 0

              // ✅ Sunday School ONLY if calendar has it (description-based)
              const sundaySchoolExists = isSunday && events.some((e) => isSundaySchoolEvent(e))

              return (
                <div
                  key={service.id}
                  className="group bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-300 relative p-5"
                >
                  <div className="absolute top-3 left-3 bg-card/90 backdrop-blur-sm rounded-lg px-3 py-1.5">
                    <span className="text-accent font-semibold text-sm">
                      {formatEventDate(service.start)}
                    </span>
                  </div>

                  {/* ✅ Title from Google Calendar EXACTLY */}
                  <h3 className="font-serif text-lg text-foreground mb-4 mt-8 group-hover:text-accent transition-colors">
                    {prettyTitle(service.title)}
                  </h3>

                  <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                    {sundaySchoolExists && (
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-accent" />
                        <span>Sunday School</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-accent" />
                      {/* ✅ If all-day event, formatEventTime returns "" so hide */}
                      {formatEventTime(service.start) ? (
                        <span>{formatEventTime(service.start)}</span>
                      ) : (
                        <span className="italic">Time TBD</span>
                      )}
                    </div>

                    {service.location ? (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-accent" />
                        <span>{prettyLocation(service.location)}</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>
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