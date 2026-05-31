import type React from "react"
import type { Metadata } from "next"
import { DM_Sans, Playfair_Display } from "next/font/google"
import Script from "next/script"
import "./globals.css"

const _dmSans = DM_Sans({ subsets: ["latin"] })
const _playfair = Playfair_Display({ subsets: ["latin"] })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://redeemermtc.org"

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
      </head>

      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}