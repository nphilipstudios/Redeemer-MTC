"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Clock, MapPin } from "lucide-react"
import {
  useGoogleCalendarEvents,
  formatEventDate,
  formatEventTime,
  isServiceEvent,   // ✅ changed
  prettyLocation,   // ✅ optional, but recommended for Redeemer -> Redeemer MTC
} from "@/lib/google-calendar-events"

export default function EventsPage() {
  const { events, isLoading, error } = useGoogleCalendarEvents()

  // ✅ FUTURE events only
  // ✅ Includes recurring weekly events (because API has singleEvents=true)
  // ✅ Excludes services (service detection is now DESCRIPTION-based)
  const now = new Date()
  const upcomingEvents = events
    .filter((e) => !isServiceEvent(e)) // ✅ changed (no title param)
    .filter((e) => new Date(e.start) >= now)
    .slice()
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 6)

  const getEventGroup = (title: string) => {
    const t = title.toLowerCase()
    if (t.includes("youth")) return { name: "Youth", color: "bg-yellow-400 text-yellow-800" }
    if (t.includes("men")) return { name: "Men's", color: "bg-blue-500 text-white" }
    if (t.includes("women")) return { name: "Women's", color: "bg-purple-500 text-white" }
    if (t.includes("bible study") || t.includes("prayer call"))
      return { name: "Recurring", color: "bg-orange-500 text-white" }
    if (t.includes("missions")) return { name: "Missions", color: "bg-green-500 text-white" }
    if (t.includes("music")) return { name: "Music", color: "bg-red-500 text-white" }
    if (t.includes("prayer meeting")) return { name: "Prayer Meeting", color: "bg-blue-900 text-white" }
    return { name: "Other", color: "bg-lime-500 text-black" }
  }

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
              <p className="text-muted-foreground">
                No upcoming events scheduled.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {upcomingEvents.map((event) => {
                const eventGroup = getEventGroup(event.title)

                return (
                  <div
                    key={event.id}
                    className="bg-card rounded-xl border border-border p-5 hover:shadow-lg transition-all relative"
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
                    <h3 className="font-serif text-lg text-foreground mb-3 mt-8">
                      {event.title}
                    </h3>

                    {/* Time, Location, Description */}
                    <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-accent" />
                        <span>{formatEventTime(event.start)}</span>
                      </div>

                      {event.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-accent" />
                          <span>{prettyLocation(event.location)}</span>
                        </div>
                      )}

                      {event.description && (
                        <p className="mt-2 text-sm leading-relaxed line-clamp-3">
                          {event.description.split("\n")[0]}
                        </p>
                      )}
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