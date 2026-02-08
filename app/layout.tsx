import type React from "react"
import type { Metadata } from "next"
import { DM_Sans, Playfair_Display } from "next/font/google"
import Script from "next/script"
import "./globals.css"

const _dmSans = DM_Sans({ subsets: ["latin"] })
const _playfair = Playfair_Display({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Redeemer MTC | Lighted to Lighten",
  description: "A welcoming community of faith in Christ - Worship, Mission, Outreach, Fellowship",
  icons: {
    icon: "/yt cross.png",
    shortcut: "yt cross.png",
    apple: "yt cross.png",
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
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-TEZWRD4TZV"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-TEZWRD4TZV');
          `}
        </Script>

        {/* Userback */}
        <Script id="userback-widget" strategy="afterInteractive">
          {`
            window.Userback = window.Userback || {};
            Userback.access_token = "A-SY3S1mMdUoUAIJHvf8qGHWovJ";
            (function(d) {
              var s = d.createElement('script');
              s.async = true;
              s.src = 'https://static.userback.io/widget/v1.js';
              (d.head || d.body).appendChild(s);
            })(document);
          `}
        </Script>
      </head>

      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}