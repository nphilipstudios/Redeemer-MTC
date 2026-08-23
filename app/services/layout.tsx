import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Services | Redeemer MTC",
  description:
    "View upcoming worship services and Sunday School information at Redeemer Mar Thoma Church.",
}

export default function ServicesLayout({ children }: { children: ReactNode }) {
  return children
}
