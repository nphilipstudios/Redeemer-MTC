import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Heart, Users, Globe, HandHeart } from "lucide-react"
import Image from "next/image"

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

const missionPoints = [
  "To be the repository of the divine doctrines revealed by Jesus Christ and proclaimed by His Apostle.",
  "To maintain these doctrines in their purity.",
  "To promote the spiritual life through the administration of sacraments and by the ministry of the WORD.",
  "To make disciples of all nations by the proclamation of the Gospel to all the world, and through the administration of Holy Baptism in the name of the True God.",
]

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Header />
  {/* Hero Section */}
  <section className="pt-32 pb-16 bg-primary">
    <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
      <p className="text-accent text-sm uppercase tracking-widest mb-3">About Us</p>
      <h1 className="font-serif text-4xl md:text-5xl text-primary-foreground mb-4">About Us</h1>
      <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
        Learn about who we are and what we believe, and where to find us.
      </p>
    </div>
  </section>

{/* Mission Section */}
<section className="py-8 lg:py-12 bg-background">
  <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
    <h2 className="text-accent text-sm uppercase trwacking-[0.3em] mb-6">OUR MISSION</h2>
    <div className="space-y-4">
      {missionPoints.map((point, i) => (
        <p key={i} className="text-foreground text-lg leading-relaxed">{point}</p>
      ))}
    </div>
  </div>
</section>

     {/* Who We Are */}
<section className="py-16 lg:py-24 text-white w-full" style={{ backgroundColor: '#2596be' }}>
  <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
    <h2 className="text-sm uppercase tracking-[0.3em] mb-8">WHO WE ARE</h2>
    <div className="space-y-6 text-white/90 text-lg leading-relaxed">
      <p>
        We are a parish of the Diocese of North America of the Mar Thoma Church located in Northern NJ.
        The name "Mar Thoma" translates to Saint Thomas, who was one of the twelve disciples of Jesus Christ that
        came to the Malabar Coast of India in A.D. 52.
      </p>
      <p>
        We share the burden of proclaiming the Gospel through Worship, Missions, Outreach, and Fellowship. Prayer
        is deeply rooted in our worship and the visible source of power for our faith in action.
      </p>
      <p>
        We are faithful stewards, taking care of God's creation, referencing the Holy Bible as inspired, inerrant,
        sufficient, and the final authority over our beliefs and actions.
      </p>
      <p>
        Our congregation was inaugurated on October 1st, 2017, led by Rt. Rev. Dr. Isaac Mar Philoxenos, Diocesan Bishop,
        and Rev. Denny Philip, Diocesan Secretary. Started with 43 families/individuals, currently pastored by
        Rev. Jess M. George.
      </p>
    </div>
  </div>
</section>

      <section className="py-16 lg:py-24 bg-background">
  <div className="max-w-4xl mx-auto px-6 lg:px-8">
    <h2 className="font-serif text-2xl md:text-3xl text-foreground text-center mb-12">OUR VICAR</h2>
    
    <div className="bg-white border border-border rounded-xl shadow-lg p-8 flex flex-col md:flex-row items-center gap-8">
<div className="w-full md:w-1/3 relative aspect-[3/3]">
  <Image
    src="/IMG_0859.jpeg"
    alt="Rev. Jess M. George"
    fill
    className="object-cover rounded-lg"
    priority
  />
</div>

      {/* Text content */}
      <div className="w-full md:w-2/3 text-foreground">
        <h3 className="font-semibold text-xl mb-2">Rev. Jess M. George</h3>
        <p className="text-muted-foreground leading-relaxed">
          Rev. Jess M. George is a young, vibrant, and energetic leader, focused on the spiritual needs of the church.
          He is mission-oriented and intent on making the church relevant to the community that it is placed in.
          He, as well as Justeena Kochamma, are a blessing to our parish, and we look forward to growing under their leadership.
        </p>
      </div>
    </div>
  </div>
  
</section>


      <Footer />
    </main>
  )
}