import type React from "react"
import type { Metadata } from "next"
import { DM_Sans, Playfair_Display } from "next/font/google"
import { headers } from "next/headers"
import Script from "next/script"
import "./globals.css"

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://redeemermtc.org"
const googleAnalyticsId = process.env.NEXT_PUBLIC_GA_ID?.trim()

function googleAnalyticsScript(id: string) {
  const safeId = JSON.stringify(id)

  return `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', ${safeId});
  `
}

export const metadata: Metadata = {
  title: "Redeemer MTC",
  metadataBase: new URL(siteUrl),
  description:
    "A welcoming community of faith in Christ - Worship, Mission, Outreach, Fellowship",
  icons: {
    icon: "/yt cross.png",
    shortcut: "/yt cross.png",
    apple: "/yt cross.png",
  },
  openGraph: {
    title: "Redeemer MTC",
    siteName: "Redeemer MTC",
    description:
      "A welcoming community of faith in Christ - Worship, Mission, Outreach, Fellowship",
    type: "website",
    images: [
      {
        url: "/yt banner.png",
        width: 1200,
        height: 630,
        alt: "Redeemer MTC",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Redeemer MTC",
    description:
      "A welcoming community of faith in Christ - Worship, Mission, Outreach, Fellowship",
    images: ["/yt banner.png"],
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const nonce = (await headers()).get("x-nonce") ?? undefined

  return (
    <html lang="en">
      <head>
        {googleAnalyticsId && (
          <>
            <Script
              nonce={nonce}
              src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(googleAnalyticsId)}`}
              strategy="afterInteractive"
            />
            <Script
              id="google-analytics"
              nonce={nonce}
              strategy="afterInteractive"
            >
              {googleAnalyticsScript(googleAnalyticsId)}
            </Script>
          </>
        )}
      </head>

      <body className={`${dmSans.variable} ${playfair.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
