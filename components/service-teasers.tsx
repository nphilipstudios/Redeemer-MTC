"use client"

import Link from "next/link"
import { Clock, BookOpen, MapPin } from "lucide-react"
import {
  useGoogleCalendarEvents,
  getUpcomingServices,
  formatEventDate,
  formatEventTime,
  prettyTitle,
  type CalendarEvent,
} from "@/lib/google-calendar-events"
import { services as allServices } from "@/lib/events-data"

// ✅ Sunday School only if it appears in DESCRIPTION
function parseSundaySchoolFromDescription(desc?: string) {
  if (!desc) return null
  const text = desc.toLowerCase()
  if (!text.includes("sunday school")) return null

  // Optional: pull a time like "Sunday School: 10:30 AM"
  const match = desc.match(
    /sunday\s*school[^0-9]*?(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm))/,
  )
  const time = match?.[1] ? match[1].toUpperCase() : null
  return { time }
}

function prettyLocation(location?: string) {
  if (!location) return ""
  return location.toLowerCase().includes("redeemer") ? "Redeemer MTC" : location
}

export function ServiceTeasers() {
  const { events, isLoading, error } = useGoogleCalendarEvents()

  // ✅ Services ONLY, disappear 6 hours after END
  const services: CalendarEvent[] = getUpcomingServices(events, 6).slice(0, 3)

  const getServiceData = (eventTitle: string) => {
    const titleLower = (eventTitle || "").toLowerCase()

    if (titleLower.includes("holy communion")) {
      return (
        allServices.find((s) => s.name.toLowerCase().includes("holy communion")) ||
        null
      )
    }
    if (titleLower.includes("praise") && titleLower.includes("worship")) {
      return (
        allServices.find((s) =>
          s.name.toLowerCase().includes("praise & worship"),
        ) || null
      )
    }
    if (titleLower.includes("acts worship")) {
      return (
        allServices.find((s) => s.name.toLowerCase().includes("acts worship")) ||
        null
      )
    }
    return null
  }

  if (isLoading) {
    return (
      <section className="py-16 bg-background text-center">
        <p className="text-muted-foreground">Loading services...</p>
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
          {error ? (
            <p className="text-sm text-muted-foreground mt-3">
              Couldn&apos;t load services right now.
            </p>
          ) : null}
        </div>

        {/* ✅ Keep section visible even if none */}
        {error || services.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No upcoming services scheduled.
          </p>
        ) : (
          <div className="grid grid-cols-12 gap-5">
            {services.map((service) => {
              const matchedService = getServiceData(service.title)
              const displayTitle = matchedService ? matchedService.name : service.title

              const sundaySchool = parseSundaySchoolFromDescription(service.description)

              // ✅ Layout rules that match what you asked:
              // 1 = big centered
              // 2 = two big cards filling the row
              // 3 = three equal cards filling the row
              const colClass =
                services.length === 1
                  ? "col-span-12 md:col-span-8 md:col-start-3"
                  : services.length === 2
                  ? "col-span-12 sm:col-span-6"
                  : "col-span-12 sm:col-span-6 lg:col-span-4"

              return (
                <div key={service.id} className={colClass}>
                  <div className="group bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-300 relative p-5 h-full">
                    {/* Date badge */}
                    <div className="absolute top-3 left-3 bg-card/90 backdrop-blur-sm rounded-lg px-3 py-1.5">
                      <span className="text-accent font-semibold text-sm">
                        {formatEventDate(service.start)}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg text-foreground mb-4 mt-8 group-hover:text-accent transition-colors">
                      {prettyTitle(displayTitle)}
                    </h3>

                    <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                      {/* ✅ Only show if description says Sunday School */}
                      {sundaySchool ? (
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-accent" />
                          <span>
                            Sunday School{sundaySchool.time ? `: ${sundaySchool.time}` : ""}
                          </span>
                        </div>
                      ) : null}

                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-accent" />
                        <span>{formatEventTime(service.start)}</span>
                      </div>

                      {service.location ? (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-accent" />
                          <span>{prettyLocation(service.location)}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

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