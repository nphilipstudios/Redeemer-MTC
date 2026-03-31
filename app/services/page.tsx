"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { Clock, BookOpen, MapPin } from "lucide-react"
import {
  useGoogleCalendarEvents,
  getUpcomingServices,
  isSundaySchoolEvent,
  prettyLocation,
  formatEventDate,
  formatEventTime,
  prettyTitle,
  type CalendarEvent,
} from "@/lib/google-calendar-events"

function getServiceImage(service: CalendarEvent) {
  const text = `${service.title ?? ""} ${service.description ?? ""}`.toLowerCase()

  if (text.includes("qurbana") || text.includes("communion") || text.includes("holy communion") || text.includes("holy qurbana")) {
    return "/NEW Holy Communion YT Thumbnail.png"
  }

  if (text.includes("praise") && text.includes("worship")) {
    return "/NEW Praise and Worship YT Thumbnail.png"
  }

  if (text.includes("acts")) {
    return "/NEW ACTS Worship YT Thumbnail.png" // ✅ make sure this filename exists exactly in /public
  }


  return "/placeholder.svg"
}

export default function ServicesPage() {
  const { events, isLoading, error } = useGoogleCalendarEvents()

  // ✅ services only, auto-hide 6 hours after END
  const services: CalendarEvent[] = getUpcomingServices(events, 6).slice(0, 6)

  // optional: Sunday School exists anywhere in calendar (description-based)
  const hasSundaySchool = events.some((e) => isSundaySchoolEvent(e))

  return (
    <main className="min-h-screen">
      <Header />

      <section className="pt-32 pb-20 lg:pb-28 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-accent text-sm uppercase tracking-widest mb-3">
              Worship With Us
            </p>
            <h1 className="font-serif text-4xl md:text-5xl text-foreground">
              Join Us for Worship
            </h1>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading services...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Unable to load services right now.</p>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No upcoming services scheduled.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((service) => {
                const startDate = new Date(service.start)
                const isSunday = startDate.getDay() === 0

                return (
                  <div
                    key={service.id}
                    className="group bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all duration-300 relative"
                  >
                    <div className="absolute top-3 left-3 z-10 bg-card/90 backdrop-blur-sm rounded-lg px-3 py-1.5">
                      <span className="text-accent font-semibold text-sm">
                        {formatEventDate(service.start)}
                      </span>
                    </div>

                    <div className="relative h-36 overflow-hidden bg-secondary">
                      <Image
                        src={getServiceImage(service)}
                        alt={prettyTitle(service.title)}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="p-4">
                      {/* ✅ Title EXACTLY from Google Calendar */}
                      <h3 className="font-serif text-lg text-foreground mb-3 group-hover:text-accent transition-colors">
                        {prettyTitle(service.title)}
                      </h3>

                      <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                        {/* ✅ Sunday School only if calendar includes it */}
                        {isSunday && hasSundaySchool && (
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-accent" />
                            <span>Sunday School</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-accent" />
                          {formatEventTime(service.start) ? (
                            <span>{formatEventTime(service.start)}</span>
                          ) : (
                            <span className="italic">Time TBD</span>
                          )}
                        </div>

                        {service.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-accent" />
                            <span>{prettyLocation(service.location)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}