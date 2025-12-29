"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useState } from "react"
import { ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react"
import { useChurchTrac } from "@/lib/churchtrac-events"

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
]

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const { events, loading } = useChurchTrac()

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDay = firstDay.getDay()

  const days: (number | null)[] = []
  for (let i = 0; i < startingDay; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(i)

  const getDotColor = (category: string) => {
    switch (category) {
      case "Sunday Service": return "bg-accent"
      case "Recurring": return "bg-orange-500"
      case "Men's": return "bg-blue-500"
      case "Women's": return "bg-purple-500"
      case "Youth": return "bg-yellow-400"
      case "Missions": return "bg-green-500"
      case "Music": return "bg-red-500"
      case "Prayer Meeting": return "bg-blue-900"
      default: return "bg-lime-500"
    }
  }

  const isTodayDayNumber = (day: number) => {
    const now = new Date()
    return now.getFullYear() === year && now.getMonth() === month && now.getDate() === day
  }

  const getEventsForDay = (day: number) => {
    const targetDate = new Date(year, month, day)
    targetDate.setHours(0, 0, 0, 0)

    return events
      .map((e) => {
        const titleLower = e.title.toLowerCase()
        let category: string = "Other"
        let recurring = false

        if (titleLower.includes("service") || titleLower.includes("communion") || titleLower.includes("worship")) {
          category = "Sunday Service"
        } else if (titleLower.includes("bible study") || titleLower.includes("saturday morning prayer call")) {
          category = "Recurring"
          recurring = true
        } else if (titleLower.includes("men")) category = "Men's"
        else if (titleLower.includes("women")) category = "Women's"
        else if (titleLower.includes("youth")) category = "Youth"
        else if (titleLower.includes("music")) category = "Music"
        else if (titleLower.includes("prayer")) category = "Prayer Meeting"
        else if (titleLower.includes("feed my starving children") || titleLower.includes("father's cupboard")) category = "Missions"
        else category = "Other"

        return {
          ...e,
          startDate: new Date(e.startDate),
          category,
          recurring,
        }
      })
      .filter((e) => {
        const d = new Date(e.startDate)
        d.setHours(0, 0, 0, 0)
        return d.getTime() === targetDate.getTime()
      })
  }

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
    setSelectedDay(null)
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
    setSelectedDay(null)
  }

  const selectedData = selectedDay ? getEventsForDay(selectedDay) : []

  return (
    <main className="min-h-screen">
      <Header />

      <section className="pt-32 pb-20 lg:pb-28 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-accent text-sm uppercase tracking-widest mb-3">
              Plan Your Visit
            </p>
            <h1 className="font-serif text-4xl md:text-5xl text-foreground">
              Church Calendar
            </h1>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading calendar...</p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Calendar Grid */}
              <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={prevMonth}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                    aria-label="Previous month"
                  >
                    <ChevronLeft className="w-5 h-5 text-foreground" />
                  </button>

                  <h2 className="font-serif text-2xl text-foreground">
                    {monthNames[month]} {year}
                  </h2>

                  <button
                    onClick={nextMonth}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                    aria-label="Next month"
                  >
                    <ChevronRight className="w-5 h-5 text-foreground" />
                  </button>
                </div>

                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div
                      key={day}
                      className="text-center text-sm font-medium text-muted-foreground py-2"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, i) => {
                    if (day === null) return <div key={i} className="aspect-square" />

                    const dayEvents = getEventsForDay(day)
                    const isSelected = selectedDay === day
                    const isSunday = new Date(year, month, day).getDay() === 0

                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedDay(day)}
                        className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-all relative ${
                          isSelected
                            ? "bg-accent text-white"
                            : isTodayDayNumber(day)
                            ? "bg-secondary/70 ring-2 ring-accent/30 text-foreground hover:bg-secondary/80"
                            : isSunday
                            ? "bg-accent/10 text-foreground hover:bg-accent/20"
                            : "hover:bg-secondary text-foreground"
                        }`}
                      >
                        <span className={isSelected ? "font-bold" : ""}>{day}</span>

                        {dayEvents.length > 0 && (
                          <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                            {dayEvents.map((e, idx) => (
                              <span
                                key={idx}
                                className={`w-1.5 h-1.5 rounded-full ${getDotColor(e.category)}`}
                              />
                            ))}
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-border text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-accent" />
                    Sunday Service
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-orange-500" />
                    Recurring
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500" />
                    Men&apos;s
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-purple-500" />
                    Women&apos;s
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-yellow-400" />
                    Youth
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500" />
                    Music
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500" />
                    Missions
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-900" />
                    Prayer Meeting
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-lime-500" />
                    Other
                  </div>
                </div>
              </div>

              {/* Selected Day Details */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-serif text-xl text-foreground mb-4">
                  {selectedDay ? `${monthNames[month]} ${selectedDay}, ${year}` : "Select a day"}
                </h3>

                {selectedData.length > 0 ? (
                  <div className="space-y-4">
                    {selectedData.map((event, i) => (
                      <div
                        key={i}
                        className={`p-4 rounded-lg border ${
                          event.category === "Sunday Service"
                            ? "border-accent bg-accent/10"
                            : event.category === "Recurring"
                            ? "border-orange-500 bg-orange-500/10"
                            : event.category === "Men's"
                            ? "border-blue-500 bg-blue-500/10"
                            : event.category === "Women's"
                            ? "border-purple-500 bg-purple-500/10"
                            : event.category === "Youth"
                            ? "border-yellow-400 bg-yellow-400/10"
                            : event.category === "Missions"
                            ? "border-green-500 bg-green-500/10"
                            : event.category === "Prayer Meeting"
                            ? "border-blue-900 bg-blue-900/10"
                            : event.category === "Music"
                            ? "border-red-500 bg-red-500/10"
                            : "border-lime-500 bg-lime-500/10"
                        }`}
                      >
                        {event.recurring && (
                          <span className="text-xs uppercase tracking-wider font-medium">
                            Recurring
                          </span>
                        )}
                        {!event.recurring && event.category !== "Other" && (
                          <span className="text-xs uppercase tracking-wider font-medium">
                            {event.category}
                          </span>
                        )}

                        <h4 className="font-serif text-lg text-foreground mt-1">
                          {event.title}
                        </h4>

                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>
                            {event.startDate.toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>

                        {event.location && (
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{event.location}</span>
                          </div>
                        )}

                        {event.description && (
                          <p className="mt-2 text-sm text-muted-foreground">
                            {event.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No events scheduled for this day.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}