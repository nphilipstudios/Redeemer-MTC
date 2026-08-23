import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"

export const metadata: Metadata = {
  title: "About | Redeemer MTC",
  description:
    "Learn about Redeemer Mar Thoma Church, our mission, beliefs, parish history, and vicar.",
}

const missionPoints = [
  "To be the repository of the divine doctrines revealed by Jesus Christ and proclaimed by His Apostles.",
  "To maintain these doctrines in their purity.",
  "To promote spiritual life through the administration of the sacraments and the ministry of the Word.",
  "To make disciples of all nations through the proclamation of the Gospel and Holy Baptism.",
]

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-primary">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-accent text-sm uppercase tracking-widest mb-3">
            About Us
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-primary-foreground mb-4">
            About Our Parish
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Learn who we are, what we believe, and how we live out our faith.
          </p>
        </div>
      </section>

{/* Our Mission */}
<section className="py-12 lg:py-16 bg-background">
  <div className="max-w-4xl mx-auto px-6 lg:px-8">
    <div className="text-center mb-10">
      <h2 className="font-serif text-3xl md:text-4xl text-foreground">
        Our Mission
      </h2>
    </div>

<div className="grid md:grid-cols-2 gap-6 text-left">
  {missionPoints.map((point, i) => (
    <div
      key={i}
      className="bg-card border border-border rounded-lg p-6 text-muted-foreground text-base leading-relaxed shadow-sm text-center flex items-center justify-center"
    >
      {point}
    </div>
  ))}
</div>
  </div>
</section>

      {/* What We Believe */}
      <section className="py-12 lg:py-16 bg-secondary">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-accent text-sm uppercase tracking-[0.3em] mb-3">
              Our Faith
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground">
              What We Believe
            </h2>
          </div>

<div className="space-y-6 text-muted-foreground text-lg leading-relaxed text-center">           <p>
              We believe in the one true God, the Father Almighty, Maker of heaven
              and earth, and of all things visible and invisible.
            </p>

            <p>
              We believe in one Lord Jesus Christ, the only begotten Son of God,
              begotten of the Father before all worlds; Light of Light, very God
              of very God, begotten not made, being of one substance with the
              Father, by whom all things were made. For us and for our salvation,
              He came down from heaven and was incarnate by the Holy Spirit of
              the Virgin Mary and was made man.
            </p>

            <p>
              He was crucified for us under Pontius Pilate, suffered and was
              buried. On the third day He rose again, ascended into heaven, and
              sits at the right hand of the Father. He will come again with glory
              to judge both the living and the dead, and His Kingdom shall have
              no end.
            </p>

            <p>
              We believe in the Holy Spirit, the Lord and Giver of life, who
              proceeds from the Father, who with the Father and the Son together
              is worshiped and glorified, and who spoke through the prophets and
              apostles.
            </p>

            <p>
              We believe in one holy, catholic, and apostolic Church. We
              acknowledge one baptism for the remission of sins and look forward
              to the resurrection of the dead and the life of the world to come.
            </p>

            <p className="font-semibold text-foreground text-center">
              Amen.
            </p>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-12 lg:py-16 bg-background">
  <div className="max-w-4xl mx-auto px-6 lg:px-8">
    <div className="text-center mb-10">
      <p className="text-accent text-sm uppercase tracking-[0.3em] mb-3">
        Our Parish
      </p>
      <h2 className="font-serif text-3xl md:text-4xl text-foreground">
        Who We Are
      </h2>
    </div>

<div className="space-y-6 text-muted-foreground text-lg leading-relaxed text-center">
        <p>
        We are a parish of the Diocese of North America of the Mar Thoma Church
        located in Northern New Jersey. The name “Mar Thoma” translates to Saint
        Thomas, one of the twelve disciples of Jesus Christ, who came to the
        Malabar Coast of India in A.D. 52.
      </p>

      <p>
        We share the calling of proclaiming the Gospel through Worship, Mission,
        Outreach, and Fellowship. Prayer is deeply rooted in our worship and
        serves as the visible source of strength for our faith in action.
      </p>

      <p>
        We are faithful stewards of God’s creation and hold the Holy Bible as
        inspired, inerrant, sufficient, and the final authority for our beliefs
        and actions.
      </p>

      <p>
        Our congregation was inaugurated on October 1, 2017, under the
        leadership of Rt. Rev. Dr. Isaac Mar Philoxenos and Rev. Denny Philip.
        Beginning with 43 families and individuals, the parish is currently
        shepherded by Rev. Jess M. George.
      </p>
    </div>
  </div>
</section>

      {/* Our Vicar */}
<section className="py-12 lg:py-16 bg-secondary/60">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground text-center mb-12">
            Our Vicar
          </h2>

          <div className="bg-white border border-border rounded-xl shadow-lg p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/3 relative aspect-square">
              <Image
                src="/IMG_0859.jpeg"
                alt="Rev. Jess M. George"
                fill
                className="object-cover rounded-lg"
                priority
              />
            </div>

            <div className="w-full md:w-2/3 text-foreground">
              <h3 className="font-semibold text-xl mb-2">
                Rev. Jess M. George
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Rev. Jess M. George is a vibrant and mission-oriented leader
                focused on the spiritual growth of the church. He is committed
                to making the church relevant to the community it serves, and
                together with Justeena Kochamma, continues to be a blessing to
                our parish.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
