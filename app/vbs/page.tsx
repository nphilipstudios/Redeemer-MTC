import type { Metadata } from "next"
import Image from "next/image"
import { CalendarDays, Clock, ExternalLink, MapPin, Sparkles } from "lucide-react"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"

const registrationUrl = "https://form.fillout.com/t/3dbjYbcb34us"

const schedule = [
  {
    day: "Thursday",
    date: "July 30",
    time: "3pm - 7pm",
  },
  {
    day: "Friday",
    date: "July 31",
    time: "3pm - 7pm",
  },
  {
    day: "Saturday",
    date: "August 1",
    time: "9am - 1pm",
  },
]

export const metadata: Metadata = {
  title: "2026 Vacation Bible School | Redeemer MTC",
  description:
    "Register for Redeemer MTC 2026 Vacation Bible School: Illumination Station, July 30 through August 1 in Waldwick, NJ.",
  openGraph: {
    title: "Redeemer MTC 2026 Vacation Bible School",
    description:
      "Illumination Station: Shining a light on who Jesus really is. Join us July 30 through August 1 at Redeemer MTC.",
    images: [
      {
        url: "/vbs-illumination-station.png",
        width: 1200,
        height: 806,
        alt: "Illumination Station Vacation Bible School",
      },
    ],
  },
}

export default function VbsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-16 lg:pb-20 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center">
            <div className="text-center lg:text-left">
              <p className="text-accent text-sm uppercase tracking-widest mb-3">
                Vacation Bible School
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-5">
                Redeemer MTC 2026 VBS
              </h1>
              <div className="inline-flex items-center gap-2 rounded-lg bg-accent/10 px-4 py-2 text-accent font-semibold mb-5">
                <Sparkles className="w-4 h-4" />
                <span>Illumination Station!</span>
              </div>
              <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-3">
                Shining a light on who Jesus really is
              </p>
              <p className="font-serif text-2xl text-foreground mb-8">
                John 8:12
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Button asChild size="lg" className="text-base">
                  <a href={registrationUrl} target="_blank" rel="noreferrer">
                    Register Online
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-base">
                  <a href="https://maps.google.com/?q=Redeemer%20MTC%20136%20Wyckoff%20Ave%20Waldwick%20NJ" target="_blank" rel="noreferrer">
                    Get Directions
                    <MapPin className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-lg">
              <Image
                src="/vbs-illumination-station.png"
                alt="Illumination Station Vacation Bible School"
                width={1200}
                height={806}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-secondary">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <CalendarDays className="w-6 h-6 text-accent" />
              </div>
              <h2 className="font-serif text-2xl text-foreground mb-4">
                Dates
              </h2>
              <div className="space-y-4">
                {schedule.map((item) => (
                  <div key={item.day} className="border-t border-border pt-4 first:border-t-0 first:pt-0">
                    <p className="font-semibold text-foreground">
                      {item.day}, {item.date}
                    </p>
                    <p className="text-muted-foreground">{item.time}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-accent" />
              </div>
              <h2 className="font-serif text-2xl text-foreground mb-4">
                Cost
              </h2>
              <p className="text-3xl font-semibold text-foreground">Free</p>
              <p className="text-muted-foreground mt-3">
                Registration is open online for all VBS participants.
              </p>
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
            Ready to Join?
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-5">
            Register for VBS Online
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            Join Redeemer MTC for three days of worship, learning, and fellowship
            as children discover who Jesus really is.
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
