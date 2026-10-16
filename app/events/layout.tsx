import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Events | Redeemer MTC",
  description:
    "Explore upcoming church events, fellowship gatherings, Bible studies, and prayer meetings at Redeemer MTC.",
}

export default function EventsLayout({ children }: { children: ReactNode }) {
  return children
}
