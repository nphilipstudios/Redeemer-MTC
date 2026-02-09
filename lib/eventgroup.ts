import type { CalendarEvent } from "@/lib/google-calendar-events"

export type EventGroup = {
  name:
    | "Sunday Service"
    | "Youth"
    | "Men's"
    | "Women's"
    | "Recurring"
    | "Missions"
    | "Music"
    | "Prayer Meeting"
    | "Other"
  color: string
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function hasWord(text: string, word: string) {
  return new RegExp(`\\b${escapeRegex(word)}\\b`, "i").test(text)
}

function haystack(eventOrText: CalendarEvent | string) {
  if (typeof eventOrText === "string") return eventOrText.toLowerCase()
  return `${eventOrText.title ?? ""} ${eventOrText.description ?? ""}`.toLowerCase()
}

export function getEventGroup(eventOrText: CalendarEvent | string): EventGroup {
  const t = haystack(eventOrText)

  // Sunday Service / Worship / Communion
  if (
    t.includes("sunday service") ||
    t.includes("holy communion") ||
    t.includes("communion") ||
    (t.includes("praise") && t.includes("worship")) ||
    (t.includes("acts") && t.includes("worship")) ||
    (t.includes("acts") && t.includes("service"))
  ) {
    return { name: "Sunday Service", color: "bg-accent text-white" }
  }

  if (t.includes("youth")) return { name: "Youth", color: "bg-yellow-400 text-yellow-800" }

  // women first so "women" never becomes "men"
  if (hasWord(t, "women") || t.includes("women's") || t.includes("womens") || hasWord(t, "woman")) {
    return { name: "Women's", color: "bg-purple-500 text-white" }
  }

  if (hasWord(t, "men") || t.includes("men's") || t.includes("mens")) {
    return { name: "Men's", color: "bg-blue-500 text-white" }
  }

  if (t.includes("bible study") || t.includes("prayer call")) {
    return { name: "Recurring", color: "bg-orange-500 text-white" }
  }

  if (t.includes("missions") || t.includes("feed my starving children") || t.includes("father's cupboard")) {
    return { name: "Missions", color: "bg-green-500 text-white" }
  }

  if (t.includes("music")) return { name: "Music", color: "bg-red-500 text-white" }

  if (t.includes("prayer meeting") || (t.includes("prayer") && !t.includes("prayer call"))) {
    return { name: "Prayer Meeting", color: "bg-blue-900 text-white" }
  }

  return { name: "Other", color: "bg-lime-500 text-black" }
}
