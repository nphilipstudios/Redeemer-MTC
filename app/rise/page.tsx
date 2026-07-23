import type { Metadata } from "next"
import Image from "next/image"
import {
  CalendarDays,
  Clock,
  ExternalLink,
  MapPin,
  Mic2,
  Ticket,
} from "lucide-react"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"

const registrationUrl = "https://form.fillout.com/t/aNQ5T8jyXCus"
const directionsUrl =
  "https://maps.google.com/?q=Redeemer%20MTC%20136%20Wyckoff%20Ave%20Waldwick%20NJ"

export const metadata: Metadata = {
  title: "RISE: The Time is Now | Redeemer MTC",
  description:
    "Join Redeemer MTC for RISE: The Time is Now, a Back to School Praise Night with Rev. Abraham Kuruvilla on August 14 at 6:30pm.",
  openGraph: {
    title: "RISE: The Time is Now",
    description:
      "Back to School Praise Night with Rev. Abraham Kuruvilla at Redeemer MTC in Waldwick, NJ.",
    images: [
      {
        url: "/rise-logo.png",
        width: 1600,
        height: 893,
        alt: "RISE: The Time is Now",
      },
    ],
  },
}

export default function RisePage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-16 lg:pb-20 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_0.9fr] gap-10 lg:gap-14 items-center">
            <div className="text-center lg:text-left">
              <p className="text-accent text-sm uppercase tracking-widest mb-3">
                Back to School Praise Night
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-5">
                RISE: The Time is Now
              </h1>
              <blockquote className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-8">
                &ldquo;And do this, understanding the present time: The hour has
                already come for you to wake up from your slumber.&rdquo;
              </blockquote>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Button asChild size="lg" className="text-base">
                  <a href={registrationUrl} target="_blank" rel="noreferrer">
                    Register Online
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-base">
                  <a href={directionsUrl} target="_blank" rel="noreferrer">
                    Get Directions
                    <MapPin className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-lg">
              <Image
                src="/rise-logo.png"
                alt="RISE: The Time is Now"
                width={1600}
                height={893}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-secondary">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <CalendarDays className="w-6 h-6 text-accent" />
              </div>
              <h2 className="font-serif text-2xl text-foreground mb-4">
                Date
              </h2>
              <p className="font-semibold text-foreground">August 14</p>
              <div className="mt-3 flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4 text-accent" />
                <span>6:30pm</span>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Mic2 className="w-6 h-6 text-accent" />
              </div>
              <h2 className="font-serif text-2xl text-foreground mb-4">
                Speaker
              </h2>
              <p className="font-semibold text-foreground">
                Rev. Abraham Kuruvilla
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Ticket className="w-6 h-6 text-accent" />
              </div>
              <h2 className="font-serif text-2xl text-foreground mb-4">
                Cost
              </h2>
              <p className="text-3xl font-semibold text-foreground">Free</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-accent" />
              </div>
              <h2 className="font-serif text-2xl text-foreground mb-4">
                Location
              </h2>
              <p className="font-semibold text-foreground">Redeemer MTC</p>
              <p className="text-muted-foreground leading-relaxed">
                136 Wyckoff Ave
                <br />
                Waldwick, NJ
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-background">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-accent text-sm uppercase tracking-widest mb-3">
            Registration
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-5">
            Register for RISE Online
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            Join us for a free evening of worship and encouragement as students
            and families prepare for the school year.
          </p>
          <Button asChild size="lg" className="text-base">
            <a href={registrationUrl} target="_blank" rel="noreferrer">
              Register Online
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  )
}
