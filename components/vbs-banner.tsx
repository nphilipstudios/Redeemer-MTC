import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CalendarDays, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"

const bannerHideAt = new Date("2026-08-02T00:00:00-04:00")

export function VbsBanner() {
  if (Date.now() >= bannerHideAt.getTime()) {
    return null
  }

  return (
    <section className="bg-card py-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="overflow-hidden rounded-xl border border-border bg-secondary shadow-sm">
          <div className="grid md:grid-cols-[240px_1fr] lg:grid-cols-[320px_1fr] items-center">
            <Link href="/vbs" className="relative block aspect-[16/9] md:aspect-auto md:h-full min-h-48 bg-background">
              <Image
                src="/vbs-illumination-station.png"
                alt="Illumination Station Vacation Bible School"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 320px, (min-width: 768px) 240px, 100vw"
              />
            </Link>

            <div className="p-6 md:p-8 lg:p-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-2 rounded-lg bg-accent/10 px-3 py-1.5 text-sm font-semibold text-accent">
                  <Sparkles className="w-4 h-4" />
                  2026 VBS
                </span>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <CalendarDays className="w-4 h-4 text-accent" />
                  July 30 - August 1
                </span>
              </div>

              <div className="grid lg:grid-cols-[1fr_auto] gap-6 lg:items-end">
                <div>
                  <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-3">
                    Illumination Station!
                  </h2>
                  <p className="text-muted-foreground leading-relaxed max-w-2xl">
                    Join Redeemer MTC for Vacation Bible School as children learn
                    about who Jesus really is. Registration is free and open now.
                  </p>
                </div>

                <Button asChild className="w-full sm:w-auto">
                  <Link href="/vbs">
                    View VBS Details
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
