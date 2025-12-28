import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Users, Music, Baby, Coffee, Heart, Globe } from "lucide-react"
import Link from "next/link"

const ministries = [
  {
    slug: "Music",
    title: "Music Ministry",
    description: "Serve through music, sound, and media to create meaningful worship experiences.",
    image: "/Music Img.png",
  },
  {
    slug: "youth",
    title: "Youth Fellowship",
    description: "Engaging programs for teens to grow in faith and build lasting friendships.",
    image: "/Youth Img.png",
  },
  {
    slug: "children",
    title: "Children's Ministry",
    description: "Age-appropriate teaching and activities for our youngest members.",
    image: "/Children Img.png",
  },
  {
    slug: "men",
    title: "Men's Ministry",
    description: "Building godly men through fellowship, accountability, and service.",
    image: "/Men Img.png",
  },
  {
    slug: "women",
    title: "Women's Ministry",
    description: "Encouraging and equipping women to grow in their faith and relationships.",
    image: "/Women Img.png",
  },
  {
    slug: "prayer",
    title: "Prayer Ministry",
    description: "Praying for the church and community.",
    image: "/Prayer Img.png",
  },
]

export default function MinistriesPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-primary">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-accent text-sm uppercase tracking-widest mb-3">Get Involved</p>
          <h1 className="font-serif text-4xl md:text-5xl text-primary-foreground mb-4">Our Ministries</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Discover how you can serve, grow, and connect with others through our various ministry opportunities.
          </p>
        </div>
      </section>

      {/* Ministries Grid */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {ministries.map((ministry) => (
              <Link
                key={ministry.slug}
                href={`/ministries/${ministry.slug}`}
                className="group bg-card rounded-xl overflow-hidden border border-border hover:border-accent/30 hover:shadow-lg transition-all"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={ministry.image || "/placeholder.svg"}
                    alt={ministry.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-serif text-lg text-foreground group-hover:text-accent transition-colors">
                      {ministry.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{ministry.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
