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

          {/* Campaign Goal */}
          <div className="max-w-3xl mx-auto mb-16">
            <div className="bg-card border border-border rounded-2xl p-8 md:p-10 shadow-sm text-center">
              <p className="text-sm uppercase tracking-widest text-accent mb-3">
                Raised So Far
              </p>

              <h2 className="font-serif text-5xl md:text-6xl text-foreground mb-3">
                $620,000
              </h2>

              <p className="text-muted-foreground mb-8">
                Toward our <span className="font-semibold text-foreground">$3,000,000</span> campaign goal
              </p>

              {/* Progress Graph */}
              <div className="w-full h-7 rounded-full bg-secondary overflow-hidden mb-5">
                <div className="h-full w-[21%] bg-accent rounded-full transition-all duration-700" />
              </div>

              <div className="flex justify-between text-sm text-muted-foreground mb-10">
                <span>$0</span>
                <span>$3,000,000 Goal</span>
              </div>

              {/* GPS Section */}
              <div className="bg-background/70 border border-border rounded-2xl p-8 max-w-3xl mx-auto">
                <p className="text-accent font-medium mb-6 text-center">
                  Your G.P.S to guide the way:
                </p>

                <div className="space-y-4 text-left text-muted-foreground">
                  <p>
                    <span className="font-semibold text-foreground">GIVE:</span> Every contribution, big or small, will make a difference.
                  </p>

                  <p>
                    <span className="font-semibold text-foreground">PRAY:</span> Keep our campaign, leadership, and church family in your prayers.
                  </p>

                  <p>
                    <span className="font-semibold text-foreground">SPREAD the word:</span> Share our campaign with your family, friends, and community so others can join us in this mission.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-10">

            <div className="bg-card border border-border rounded-2xl p-8 md:p-10 shadow-sm">
  <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-5 text-center">
    WHY WE ARE RAISING FUNDS
  </h2>

  <div className="space-y-6 text-muted-foreground text-base md:text-lg leading-relaxed text-center">
    <p>
      Our goal is to raise <span className="font-semibold text-foreground">$3,000,000</span>, which will help us complete the purchase of our facility and ensure Redeemer has a lasting home for generations to come.
    </p>

    <p>
      This is not just a building campaign — this is a mission to establish a house of worship where faith can grow, families can gather, and lives can be transformed through the love of Christ.
    </p>

    {/* Fundraising Areas */}
    <div className="space-y-4 text-left max-w-3xl mx-auto">
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
                      Donate via Credit Card
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
                  <p>For all stock transfers, please contact our treasurer or trustees.</p>
                </div>

                <div>
                  <p className="font-semibold text-foreground">Wire Transfer</p>
                  <p>For all wire transfers, please contact our treasurer or trustees.</p>
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