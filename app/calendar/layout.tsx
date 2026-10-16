import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Calendar | Redeemer MTC",
  description:
    "Browse the Redeemer MTC church calendar for services, events, ministry meetings, and community gatherings.",
}

export default function CalendarLayout({ children }: { children: ReactNode }) {
  return children
}
