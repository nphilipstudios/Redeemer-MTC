"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Clock, BookOpen } from "lucide-react"
import { useGoogleCalendarEvents, getUpcomingServices, formatEventDate, formatEventTime, CalendarEvent } from "@/lib/google-calendar-events"
import { services as allServices } from "@/lib/events-data"

function getContinuousUpcomingWith24h(events: CalendarEvent[], limit: number): CalendarEvent[] {
  const now = new Date()

  const filtered = events
    .filter(event => {
      const eventDate = new Date(event.start)
      const cutoff = new Date(eventDate)
      cutoff.setDate(cutoff.getDate() + 1)
      return now < cutoff
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())

  if (filtered.length >= limit) return filtered.slice(0, limit)

  const needed = limit - filtered.length
  const extras = events
    .filter(event => new Date(event.start) > now && !filtered.includes(event))
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, needed)

  return [...filtered, ...extras]
}

export default function ServicesPage() {
  const { events, isLoading, error } = useGoogleCalendarEvents()
  const upcomingServices: CalendarEvent[] = getContinuousUpcomingWith24h(getUpcomingServices(events), 6)

  const getServiceData = (eventTitle: string) => {
    const titleLower = eventTitle.toLowerCase()
    if (titleLower.includes("holy communion")) {
      return allServices.find(s => s.name.toLowerCase().includes("holy communion")) || null
    } else if (titleLower.includes("praise") && titleLower.includes("worship")) {
      return allServices.find(s => s.name.toLowerCase().includes("praise & worship")) || null
    } else if (titleLower.includes("acts worship")) {
      return allServices.find(s => s.name.toLowerCase().includes("acts worship")) || null
    } else {
      return null
    }
  }

  return (
    <main className="min-h-screen">
      <Header />
      <section className="pt-32 pb-20 lg:pb-28 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-accent text-sm uppercase tracking-widest mb-3">Worship With Us</p>
            <h1 className="font-serif text-4xl md:text-5xl text-foreground">Join Us for Worship</h1>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading services...</p>
            </div>
          ) : error || upcomingServices.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No upcoming services scheduled.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {upcomingServices.map(service => {
                const isSunday = new Date(service.start).getDay() === 0
                const matchedService = getServiceData(service.title)

                const displayTitle = matchedService?.name || service.title
                const displayImage = matchedService?.image || "/placeholder.svg?height=144&width=400"

                return (
                  <div
                    key={service.id}
                    className="group bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all duration-300 relative"
                  >
                    <div className="absolute top-3 left-3 z-10 bg-card/90 backdrop-blur-sm rounded-lg px-3 py-1.5">
                      <span className="text-accent font-semibold text-sm">{formatEventDate(service.start)}</span>
                    </div>

                    <div className="relative h-36 overflow-hidden bg-secondary">
                      <img
                        src={displayImage}
                        alt={displayTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="p-4">
                      <h3 className="font-serif text-lg text-foreground mb-3 group-hover:text-accent transition-colors">
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
                          <span>{isSunday ? "11:30 AM" : formatEventTime(service.start)}</span>
                        </div>

                        {service.location && (
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-accent" />
                            <span>{service.location.includes("Redeemer") ? "Redeemer MTC" : service.location}</span>
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