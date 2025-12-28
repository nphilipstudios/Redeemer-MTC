import type React from "react"
import type { Metadata } from "next"
import { DM_Sans, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _dmSans = DM_Sans({ subsets: ["latin"] })
const _playfair = Playfair_Display({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Redeemer MTC | Lighted to Lighten",
  description: "A welcoming community of faith in Christ - Worship, Mission, Outreach, Fellowship",
  icons: {
    icon: '/yt cross.png', // put your favicon file in the public folder
    shortcut: 'yt cross.png', // optional
    apple: 'yt cross.png' // optional, for Apple devices
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}


