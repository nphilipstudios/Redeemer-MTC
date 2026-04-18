import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function RockOfRedeemerPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-20 lg:pb-28">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          {/* Logo */}
          <div className="mb-12">
            <div className="max-w-xl mx-auto h-60 md:h-72 overflow-hidden flex justify-center">
              <img
                src="/Redeemer Logo copy.jpg"
                alt="Redeemer Mar Thoma Church logo"
                className="w-full h-full object-cover object-center scale-102"
              />
            </div>
          </div>

          {/* Page Heading */}
          <div className="text-center mb-14">
            <p className="text-accent text-sm uppercase tracking-widest mb-3">
              Rock of Redeemer
            </p>
            <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-5">
              Redeemer Mar Thoma Church Fundraising Appeal
            </h1>
          </div>

          {/* Main Content */}
          <div className="space-y-10">
            <div className="bg-card border border-border rounded-2xl p-8 md:p-10 shadow-sm">
              <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-5 text-center">
                OUR MISSION:
              </h2>
              <div className="space-y-4 text-muted-foreground text-base md:text-lg leading-relaxed text-center">
                <p>
                  To be the repository of the divine doctrines revealed by Jesus Christ and proclaimed by His Apostles.
                </p>
                <p>
                  To maintain these doctrines in their purity.
                </p>
                <p>
                  To promote the spiritual life through the administration of sacraments and by the ministry of the WORD.
                </p>
                <p>
                  To make disciples of all nations by the proclamation of the Gospel to all the world and through the administration of Holy Baptism in the name of the True God.
                </p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8 md:p-10 shadow-sm">
              <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-5 text-center">
                WHO WE ARE:
              </h2>
              <div className="space-y-5 text-muted-foreground text-base md:text-lg leading-relaxed text-center">
                <p>
                  We are a parish of the Diocese of North America of the Mar Thoma Church, located in Northern NJ. The name “Mar Thoma” translates to Saint Thomas, one of the twelve disciples of Jesus Christ, who came to the Malabar Coast of India in A.D. 52.
                </p>
                <p>
                  As a community of believers, we share the mission of proclaiming the Gospel through Worship, Missions, Outreach, and Fellowship. We are a prayerful community, deeply rooted in worship, recognizing prayer as the visible source of power for our faith in action. We are also faithful Stewards, entrusted with the responsibility of caring for God’s creation.
                </p>
                <p>
                  We uphold the Holy Bible as inspired by God, inerrant, sufficient, and the final authority over our beliefs and actions.
                </p>
                <p>
                  Our congregation was inaugurated on October 1st, 2017, in a blessed Holy Communion service led by Rt. Rev. Dr. Isaac Mar Philoxenos, Diocesan Bishop, and Rev. Denny Philip, Diocesan Secretary.
                </p>
                <p>
                  The congregation started with 43 families/individuals and is currently pastored by Rev. Jess M. George, worshiping at Christ Community Church in Waldwick, NJ.
                </p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8 md:p-10 shadow-sm">
              <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-5 text-center">
                WHY WE ARE RAISING FUNDS:
              </h2>
              <div className="space-y-5 text-muted-foreground text-base md:text-lg leading-relaxed text-center">
                <p>
                  As we continue to grow in faith and service, we seek financial support for these two primary areas:
                </p>

                <div className="space-y-4">
                  <div className="border border-border rounded-xl p-5 bg-background/60">
                    <p className="font-semibold text-foreground mb-2">
                      1. Purchasing a Church Building
                    </p>
                    <p>
                      Securing a permanent place of worship to serve as the foundation for our congregation’s spiritual growth and community outreach.
                    </p>
                  </div>

                  <div className="border border-border rounded-xl p-5 bg-background/60">
                    <p className="font-semibold text-foreground mb-2">
                      2. Capital Improvements
                    </p>
                    <p>
                      Ensuring our place of worship remains a beacon of faith by funding building maintenance, facility upgrades, and future expansion.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Ways to Give */}
        <div className="max-w-4xl mx-auto px-6 lg:px-8 mt-16">
          <div className="bg-card border border-border rounded-2xl p-8 md:p-10 shadow-sm">
            <h3 className="font-serif text-xl md:text-2xl text-foreground mb-6 text-center">
              Ways to Give
            </h3>

            <div className="text-muted-foreground text-base md:text-lg leading-relaxed">
              <p className="mb-4 font-medium text-foreground">Different Ways to Donate:</p>
              <ul className="list-disc pl-6 space-y-1 mb-6">
                <li>Personal Check</li>
                <li>Zelle</li>
                <li>Credit Card</li>
                <li>Appreciated Stock Transfer</li>
                <li>Wire Transfer</li>
              </ul>

              <div className="space-y-5">
                <div>
                  <p className="font-semibold text-foreground">Personal Check</p>
                  <p>
                    Make checks payable to "Redeemer MTC" and include "Church purchase fund" in the memo field.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-foreground">Zelle</p>
                  <p>Send donations to treasurer@redeemermtc.org</p>
                </div>

                <div>
                  <p className="font-semibold text-foreground">Credit Card</p>
                  <p>
                    <a
                      href="https://redeemermtc.churchtrac.com/give"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent underline"
                    >
                      Donate via Credit Card (Go to Giving Page)
                    </a>
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-foreground">Stock Transfer</p>
                  <p>
                    Donating long‑term*, appreciated, and unhedged stocks is an excellent way to maximize your charitable giving. Because Redeemer MTC is a tax‑exempt nonprofit, we can sell donated stocks without incurring taxes on embedded gains.
                  </p>
                  <p>
                    You receive a charitable deduction based on the fair market value of the donated securities.
                  </p>
                  <p>For all stock transfers, please contact our trustees.</p>
                </div>

                <div>
                  <p className="font-semibold text-foreground">Wire Transfer</p>
                  <p>For all wire transfers, please contact our trustees.</p>
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