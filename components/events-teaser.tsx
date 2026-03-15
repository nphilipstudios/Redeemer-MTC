"use client"

import Link from "next/link"
import { ArrowRight, CalendarDays, MapPin } from "lucide-react"
import {
  useGoogleCalendarEvents,
  type CalendarEvent,
} from "@/lib/google-calendar-events"

import { getEventGroup } from "@/lib/eventgroup"

// ---------- date helpers ----------
function startOfWeek(date: Date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const day = d.getDay() // Sun=0
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

function addDays(date: Date, days: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
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

function safeDate(value?: string) {
  if (!value) return null
  const d = new Date(value)
  return isNaN(d.getTime()) ? null : d
}

function isRecurringLike(e: CalendarEvent) {
  const text = `${e.title ?? ""} ${e.description ?? ""}`.toLowerCase()
  return text.includes("bible study") || text.includes("prayer call")
}


function eventAnchorId(e: CalendarEvent) {
  const base = `${e.id || e.title || "event"}-${(e.start || "").slice(0, 10)}`
  const slug = base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

  return `event-${slug || "event"}`
}

// ---------- UI pieces ----------
function EventChip({ event }: { event: CalendarEvent }) {
  const startDate = safeDate(event.start)
  if (!startDate) return null

  const endDate = safeDate(event.end) || startDate
  const now = new Date()

  // ✅ Only "past" AFTER the event has ENDED
  const isPast = endDate.getTime() < now.getTime()
  const todayRing = isSameDay(startDate, now)

  const groupInfo = (getEventGroup as any)(event)
  const dotColor =
    (typeof groupInfo?.color === "string"
      ? groupInfo.color.split(" ").find((c: string) => c.startsWith("bg-"))
      : null) || "bg-accent"

  const strike = isPast ? "line-through opacity-70" : ""
  const containerTone = isPast
    ? "bg-card/50 border-border/50 text-muted-foreground"
    : "bg-card hover:bg-secondary/60 border-border"

  return (
    <Link
      href={`/events#${eventAnchorId(event)}`}
      className={[
        "inline-flex max-w-full min-w-0 items-center gap-2 rounded-full border px-3 py-2 text-sm transition-colors",
        containerTone,
        todayRing ? "ring-2 ring-accent/50" : "",
        "cursor-pointer",
      ].join(" ")}
      title={event.location ? `${event.title} • ${event.location}` : event.title}
      aria-label={`View event: ${event.title}`}
    >
      {/* dot (color by event type) */}
      <span
        className={["w-2 h-2 rounded-full", dotColor, isPast ? "opacity-40" : ""].join(
          " "
        )}
      />

      {/* strike through DATE + TIME + TITLE */}
      <span className={`text-accent font-semibold ${strike}`}>
        {fmtMonthDay(startDate)}
      </span>

      <span className={`text-muted-foreground ${strike}`}>
        {fmtTime(startDate)}
      </span>

      <span
        className={`font-medium truncate min-w-0 max-w-[18rem] ${strike} ${
          isPast ? "" : "text-foreground"
        }`}
      >
        {event.title}
      </span>

      {event.location ? (
        <span
          className={`hidden md:inline-flex min-w-0 items-center gap-1 text-muted-foreground ${strike}`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span className="truncate max-w-[12rem]">{event.location}</span>
        </span>
      ) : null}
    </Link>
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
<div className="rounded-2xl border border-border bg-card p-6">
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
          {events.map((e, idx) => (
            <EventChip key={(e.id || e.title) + "-" + idx} event={e} />
          ))}
        </div>
      )}
    </div>
  )
}

export function EventsTeaser() {
  const { events, isLoading, error } = useGoogleCalendarEvents()

  const now = new Date()
  const weekStart = startOfWeek(now)
  const weekEnd = endOfWeek(now)
  const nextSevenDaysStart = new Date(now)
  const nextSevenDaysEnd = addDays(now, 7)
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)

  // ✅ For teasers only, include services too
  const teaserEvents = events || []

  // ✅ NEXT 7 DAYS = rolling window from right now
  const thisWeek = teaserEvents
    .filter((e) => {
      const s = safeDate(e.start)
      return !!s && s.getTime() >= nextSevenDaysStart.getTime()
    })
    .filter((e) => {
      const s = safeDate(e.start)!
      return s.getTime() <= nextSevenDaysEnd.getTime()
    })
    .sort((a, b) => safeDate(a.start)!.getTime() - safeDate(b.start)!.getTime())

  // ✅ THIS MONTH = upcoming only for the rest of the current month
  const thisMonth = teaserEvents
    .filter((e) => {
      const s = safeDate(e.start)
      return !!s && inRange(s, monthStart, monthEnd) && s.getTime() >= now.getTime()
    })
    .sort((a, b) => safeDate(a.start)!.getTime() - safeDate(b.start)!.getTime())

  return (
    <section className="py-16 lg:py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header always shows */}
        <div className="text-center pb-8">
          <p className="text-accent text-sm uppercase tracking-widest mb-2">
            What&apos;s Happening
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-foreground">
            Upcoming Events
          </h2>

          {isLoading ? (
            <p className="text-sm text-muted-foreground mt-3">Loading events…</p>
          ) : error ? (
            <p className="text-sm text-muted-foreground mt-3">
              Couldn&apos;t load events right now.
            </p>
          ) : null}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <ChipSection
            title="Next 7 Days"
            subtitle={`${fmtDayShort(nextSevenDaysStart)} ${fmtMonthDay(
              nextSevenDaysStart
            )} – ${fmtDayShort(nextSevenDaysEnd)} ${fmtMonthDay(nextSevenDaysEnd)}`}
            events={isLoading || error ? [] : thisWeek}
            emptyText={
              isLoading
                ? "Loading…"
                : error
                ? "Unable to load events."
                : "No events scheduled in the next 7 days."
            }
          />

          <ChipSection
            title="This Month"
            subtitle={now.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
            events={isLoading || error ? [] : thisMonth}
            emptyText={
              isLoading
                ? "Loading…"
                : error
                ? "Unable to load events."
                : "No events scheduled for this month."
            }
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