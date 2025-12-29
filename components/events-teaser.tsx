"use client"

import Link from "next/link"
import { ArrowRight, CalendarDays, MapPin } from "lucide-react"
import {
  useGoogleCalendarEvents,
  type CalendarEvent,
} from "@/lib/google-calendar-events"

// ---------- date helpers ----------
function startOfWeek(date: Date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const day = d.getDay() // Sunday = 0
  d.setDate(d.getDate() - day)
  return d
}

function endOfWeek(date: Date) {
  const s = startOfWeek(date)
  const e = new Date(s)
  e.setDate(e.getDate() + 6)
  e.setHours(23, 59, 59, 999)
  return e
}

function startOfMonth(date: Date) {
  const d = new Date(date.getFullYear(), date.getMonth(), 1)
  d.setHours(0, 0, 0, 0)
  return d
}

function endOfMonth(date: Date) {
  const d = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  d.setHours(23, 59, 59, 999)
  return d
}

function inRange(d: Date, min: Date, max: Date) {
  const t = d.getTime()
  return t >= min.getTime() && t <= max.getTime()
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function fmtMonthDay(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function fmtDayShort(d: Date) {
  return d.toLocaleDateString("en-US", { weekday: "short" })
}

function fmtTime(d: Date) {
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
}

// ---------- classification ----------
function isRecurringLike(title: string) {
  const t = title.toLowerCase()
  return t.includes("bible study") || t.includes("prayer call")
}

// ✅ NEVER show services in EventsTeaser (you already have ServiceTeasers)
function isServiceTitle(title: string) {
  const t = title.toLowerCase()
  return (
    t.includes("holy communion") ||
    t.includes("acts") ||
    (t.includes("praise") && t.includes("worship"))
  )
}

// ---------- chip UI ----------
function EventChip({ event }: { event: CalendarEvent }) {
  const startDate = new Date(event.start)
  const today = new Date()
  const todayRing = isSameDay(startDate, today)
  const recurring = isRecurringLike(event.title)

  return (
    <div
      className={[
        "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm",
        "bg-card hover:bg-secondary/60 border-border transition-colors",
        todayRing ? "ring-2 ring-accent/50" : "",
      ].join(" ")}
      title={event.location ? `${event.title} • ${event.location}` : event.title}
    >
      {/* dots */}
      <span className="inline-flex items-center gap-1">
        {recurring ? <span className="w-2 h-2 rounded-full bg-blue-400" /> : null}
        <span className="w-2 h-2 rounded-full bg-accent/70" />
      </span>

      <span className="text-accent font-semibold">{fmtMonthDay(startDate)}</span>
      <span className="text-muted-foreground">{fmtTime(startDate)}</span>

      <span className="text-foreground font-medium truncate max-w-[18rem]">
        {event.title}
      </span>

      {event.location ? (
        <span className="hidden md:inline-flex items-center gap-1 text-muted-foreground">
          <MapPin className="w-3.5 h-3.5" />
          <span className="truncate max-w-[12rem]">
            {event.location.includes("Redeemer") ? "Redeemer MTC" : event.location}
          </span>
        </span>
      ) : null}
    </div>
  )
}

function ChipSection({
  title,
  subtitle,
  events,
  emptyText,
}: {
  title: string
  subtitle?: string
  events: CalendarEvent[]
  emptyText: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/40 p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="font-serif text-xl text-foreground">{title}</h3>
          {subtitle ? (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          ) : null}
        </div>
        <CalendarDays className="w-5 h-5 text-accent mt-1" />
      </div>

      {events.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyText}</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {events.map((e) => (
            <EventChip key={e.id} event={e} />
          ))}
        </div>
      )}
    </div>
  )
}

export function EventsTeaser() {
  const { events, isLoading, error } = useGoogleCalendarEvents()

  if (isLoading) {
    return (
      <section className="py-16 lg:py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      </section>
    )
  }

  if (error || !events?.length) return null

  const now = new Date()
  const weekStart = startOfWeek(now)
  const weekEnd = endOfWeek(now)
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)

  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)

  // ✅ includes recurring events (we do NOT exclude them)
  // ✅ excludes services (so it never duplicates ServiceTeasers)
  const upcomingAll = (events as CalendarEvent[])
    .filter((e) => !isServiceTitle(e.title))
    .filter((e) => {
      const startDate = new Date(e.start)
      return startDate.getTime() >= oneHourAgo.getTime()
    })
    .slice()
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())

  const thisWeek = upcomingAll.filter((e) =>
    inRange(new Date(e.start), weekStart, weekEnd)
  )
  const thisMonth = upcomingAll.filter((e) =>
    inRange(new Date(e.start), monthStart, monthEnd)
  )

  if (thisWeek.length === 0 && thisMonth.length === 0) return null

  return (
    <section className="py-16 lg:py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center pb-8">
          <p className="text-accent text-sm uppercase tracking-widest mb-2">
            What&apos;s Happening
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-foreground">
            Upcoming Events
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <ChipSection
            title="This Week"
            subtitle={`${fmtDayShort(weekStart)} ${fmtMonthDay(
              weekStart
            )} – ${fmtDayShort(weekEnd)} ${fmtMonthDay(weekEnd)}`}
            events={thisWeek}
            emptyText="No events scheduled for this week."
          />

          <ChipSection
            title="This Month"
            subtitle={now.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
            events={thisMonth}
            emptyText="No events scheduled for this month."
          />
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