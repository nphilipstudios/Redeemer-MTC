"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, MapPin, Clock } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

const ministryDetails: Record<
  string,
  {
    title: string
    description: string
    fullDescription: string
    image: string
    meetingTime?: string
    location?: string
    contact?: string
    events?: { title: string; date: string; time: string }[]
  }
> = {
  Music: {
    title: "Music Ministry",
    description: "Serve through music, sound, and media",
    fullDescription:
      "Our Music Ministry creates an atmosphere where people can encounter God through music, sound, and visual media. Whether you're a vocalist, instrumentalist, or tech-savvy individual, there's a place for you to serve and use your gifts for God's glory.",
    image: "/Music Img.png",
    meetingTime: "Wednesdays at 7:00 PM",
    location: "Sanctuary",
  },
  youth: {
    title: "Youth Ministry",
    description: "Programs for teens to grow in faith",
    fullDescription:
      "Our Youth Ministry is dedicated to helping teenagers navigate life with faith at the center. Through weekly gatherings, retreats, and service projects, we create a safe space for teens to ask questions, build friendships, and grow closer to God.",
    image: "/Youth Img.png",
    meetingTime: "Fridays at 6:30 PM",
    location: "DTD",
  },
  men: {
    title: "Men's Ministry",
    description: "Building godly men",
    fullDescription:
      "Our Men's Ministry is committed to helping men become the spiritual leaders God has called them to be. Through Bible studies, fellowship events, and accountability groups, we encourage men to grow in faith, family, and service.",
    image: "/Men Img.png",
    meetingTime: "Saturdays at 8:00 AM",
    location: "DTD",
  },
  children: {
    title: "Children's Ministry",
    description: "Nurturing young hearts in faith",
    fullDescription:
      "Our Children's Ministry is dedicated to nurturing young hearts in faith. Through age-appropriate activities, Bible stories, and interactive lessons, we help children understand God's love and develop a strong foundation in their faith.",
    image: "/Children Img.png",
    meetingTime: "Sundays at 10:30 AM",
    location: "Gymnasium",
  },
  women: {
    title: "Women's Ministry",
    description: "Encouraging and equipping women",
    fullDescription:
      "Our Women's Ministry creates opportunities for women of all ages to connect, grow, and serve together. Through Bible studies, events, and mentoring relationships, we encourage women to deepen their faith and support one another.",
    image: "/Women Img.png",
    meetingTime: "Saturdays at 10:00 AM",
    location: "DTD",
  },
  prayer: {
    title: "Prayer Ministry",
    description: "Praying for the church and community",
    fullDescription:
      "Our Prayer Ministry is dedicated to lifting up our church, community, and the world in prayer. Through intercessory prayer, prayer warriors, and organized prayer meetings, we seek to align our hearts with God's will and bring His presence into every area of our lives.",
    image: "/Prayer Img.png",
    meetingTime: "Saturdays at 8:00 AM",
    location: "Via Zoom",
  },
}

const ministryColorMap: Record<string, string> = {
  youth: "bg-yellow-400",
  men: "bg-blue-500",
  women: "bg-purple-500",
  children: "bg-green-500",
}

export default async function MinistryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const ministry = ministryDetails[slug]

  if (!ministry) {
    notFound()
  }

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16">
        <div className="absolute inset-0 z-0">
          <img src={ministry.image || "/placeholder.svg"} alt={ministry.title} className="w-full h-full object-cover filter blur-[0.5px]" />
          <div className="absolute inset-0 bg-primary/80" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-12">
          <div className="bg-white text-black p-8 rounded-xl shadow-lg w-full lg:w-2/3">
            <Link href="/ministries" className="inline-flex items-center gap-2 text-black hover:text-accent transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Ministries
            </Link>

            <h1 className="font-serif text-4xl md:text-5xl mb-2">{ministry.title}</h1>
            <p className="text-lg">{ministry.description}</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h2 className="font-serif text-2xl text-foreground mb-4">About This Ministry</h2>
              <p className="text-muted-foreground leading-relaxed mb-8">{ministry.fullDescription}</p>

              {ministry.events && ministry.events.length > 0 && (
                <>
                  <h3 className="font-serif text-xl text-foreground mb-4">Upcoming Events</h3>
                  <div className="space-y-4">
                    {ministry.events.map((event, i) => {
                      // Apply ministry color if youth/men/women
                      const color = ministryColorMap[slug] || "bg-red-500"
                      return (
                        <div key={i} className={`bg-card rounded-lg p-4 border border-border`}>
                          <span className={`text-xs uppercase tracking-wider font-medium ${color} px-1 py-0.5 rounded`}>
                            {slug.charAt(0).toUpperCase() + slug.slice(1)} Ministry
                          </span>
                          <h4 className="font-medium text-foreground mt-1 mb-2">{event.title}</h4>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4 text-accent" />
                              {event.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-accent" />
                              {event.time}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Sidebar */}
            <div>
              <div className="bg-card rounded-xl p-6 border border-border sticky top-24">
                <h3 className="font-serif text-xl text-foreground mb-4">Details</h3>
                <div className="space-y-4 mb-6">
                  {ministry.meetingTime && (
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-accent mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Meeting Time</p>
                        <p className="text-sm text-muted-foreground">{ministry.meetingTime}</p>
                      </div>
                    </div>
                  )}
                  {ministry.location && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-accent mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Location</p>
                        <p className="text-sm text-muted-foreground">{ministry.location}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}