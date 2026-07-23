"use client"

import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { QuickLinks } from "@/components/quick-links"
import { ServiceTeasers } from "@/components/service-teasers"
import { EventsTeaser } from "@/components/events-teaser"
import { VbsBanner } from "@/components/vbs-banner"
import { Footer } from "@/components/footer"
import { Heart, Users, Globe, HandHeart } from "lucide-react"

const values = [
  {
    icon: Heart,
    title: "Worship",
    description: "Glorifying God through heartfelt praise and reverent worship in spirit and truth.",
  },
  {
    icon: Globe,
    title: "Mission",
    description: "Sharing the love of Christ with our community and beyond through service and outreach.",
  },
  {
    icon: Users,
    title: "Fellowship",
    description: "Building genuine relationships and supporting one another on our faith journey.",
  },
  {
    icon: HandHeart,
    title: "Outreach",
    description: "Extending God's love to those in need through compassionate service and community support.",
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <VbsBanner />
      <QuickLinks />

      {/* Services Section */}
      <ServiceTeasers />

      {/* Events Section */} 
      <EventsTeaser />

      {/* Core Values Section */}
      <section className="py-16 lg:py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground text-center mb-12">
            Our Core Values
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <div
                key={i}
                className="bg-card rounded-xl p-6 border border-border hover:border-accent/30 hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <value.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-serif text-xl text-foreground mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
