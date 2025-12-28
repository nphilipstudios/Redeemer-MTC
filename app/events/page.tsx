"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Clock, MapPin } from "lucide-react"
import { getContinuousUpcoming } from "@/lib/event-window"
import {
  useGoogleCalendarEvents,
  getUpcomingEvents,
  formatEventDate,
  formatEventTime,
} from "@/lib/google-calendar-events"

export default function EventsPage() {
  const { events, isLoading, error } = useGoogleCalendarEvents()

  // Filter events and get up to 6 upcoming events, removing any more than 24h past
  const upcomingEvents = getContinuousUpcoming(getUpcomingEvents(events), 6)

  // Determine event group and corresponding color
  const getEventGroup = (title: string) => {
    const t = title.toLowerCase()
    if (t.includes("youth")) return { name: "Youth", color: "bg-yellow-400 text-yellow-800" }
    if (t.includes("men")) return { name: "Men's", color: "bg-blue-500 text-white" }
    if (t.includes("women")) return { name: "Women's", color: "bg-purple-500 text-white" }
    if (t.includes("sunday service") || t.includes("worship") || t.includes("communion")) return { name: "Sunday Service", color: "bg-accent text-white" }
    if (t.includes("bible study") || t.includes("prayer call")) return { name: "Recurring", color: "bg-orange-500 text-white" }
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
            <p className="text-accent text-sm uppercase tracking-widest mb-3">Upcoming</p>
            <h1 className="font-serif text-4xl md:text-5xl text-foreground">Events</h1>
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
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {upcomingEvents.map((event) => {
                const eventGroup = getEventGroup(event.title)

                return (
                  <div
                    key={event.id}
                    className="bg-card rounded-xl border border-border p-5 hover:shadow-lg transition-all relative"
                  >
                    {/* Date + Event Group */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-green-200 transition-all cursor-pointer">
                        {formatEventDate(event.start)}
                      </span>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium uppercase ${eventGroup.color}`}>
                        {eventGroup.name}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif text-lg text-foreground mb-3 mt-8">{event.title}</h3>

                    {/* Time and Location */}
                    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-accent" />
                        <span>{formatEventTime(event.start)}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-accent" />
                          <span>{event.location}</span>
                        </div>
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