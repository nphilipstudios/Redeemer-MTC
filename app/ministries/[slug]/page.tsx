import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowLeft } from "lucide-react"
import { MinistryEvents } from "@/components/ministry-events"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

const ministryDetails: Record<
  string,
  {
    title: string
    description: string
    fullDescription: string
    image: string
  }
> = {
  Music: {
    title: "Music Ministry",
    description: "Serve through music, sound, and media",
    fullDescription:
      "Our Music Ministry creates an atmosphere where people can encounter God through music, sound, and visual media. Whether you're a vocalist, instrumentalist, or tech-savvy individual, there's a place for you to serve and use your gifts for God's glory.",
    image: "/Music Img.png",
  },
  youth: {
    title: "Youth Ministry",
    description: "Programs for teens to grow in faith",
    fullDescription:
      "Our Youth Ministry is dedicated to helping teenagers navigate life with faith at the center. Through weekly gatherings, retreats, and service projects, we create a safe space for teens to ask questions, build friendships, and grow closer to God.",
    image: "/Youth Img.png",
  },
  men: {
    title: "Men's Ministry",
    description: "Building godly men",
    fullDescription:
      "Our Men's Ministry is committed to helping men become the spiritual leaders God has called them to be. Through Bible studies, fellowship events, and accountability groups, we encourage men to grow in faith, family, and service.",
    image: "/Men Img.png",
  },
  children: {
    title: "Children's Ministry",
    description: "Nurturing young hearts in faith",
    fullDescription:
      "Our Children's Ministry is dedicated to nurturing young hearts in faith. Through age-appropriate activities, Bible stories, and interactive lessons, we help children understand God's love and develop a strong foundation in their faith.",
    image: "/Children Img.png",
  },
  women: {
    title: "Women's Ministry",
    description: "Encouraging and equipping women",
    fullDescription:
      "Our Women's Ministry creates opportunities for women of all ages to connect, grow, and serve together. Through Bible studies, events, and mentoring relationships, we encourage women to deepen their faith and support one another.",
    image: "/Women Img.png",
  },
  prayer: {
    title: "Prayer Ministry",
    description: "Praying for the church and community",
    fullDescription:
      "Our Prayer Ministry is dedicated to lifting up our church, community, and the world in prayer. Through intercessory prayer, prayer warriors, and organized prayer meetings, we seek to align our hearts with God's will and bring His presence into every area of our lives.",
    image: "/Prayer Img.png",
  },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const ministry = ministryDetails[slug]

  if (!ministry) {
    return {
      title: "Ministry Not Found | Redeemer MTC",
    }
  }

  return {
    title: `${ministry.title} | Redeemer MTC`,
    description: ministry.description,
    openGraph: {
      title: ministry.title,
      description: ministry.description,
      images: [
        {
          url: ministry.image,
          alt: ministry.title,
        },
      ],
    },
  }
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
          <Image
            src={ministry.image || "/placeholder.svg"}
            alt={ministry.title}
            fill
            sizes="100vw"
            className="object-cover filter blur-[0.5px]"
          />
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
            </div>

            {/* Sidebar */}
            <div>
              <MinistryEvents slug={slug} />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
