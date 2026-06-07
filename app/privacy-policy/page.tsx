import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Privacy Policy | Redeemer MTC",
  description:
    "Privacy policy for the Redeemer Mar Thoma Church website.",
}

const sections = [
  {
    title: "Information We Collect",
    content: [
      "Redeemer Mar Thoma Church is a non-profit church in Waldwick, New Jersey. Our website is primarily informational, and we do not collect personal information for targeting, advertising, remarketing, or selling to third parties.",
      "If you choose to contact us, submit a prayer request, or otherwise communicate with us through a form or linked service, we may receive the information you provide, such as your name, email address, phone number, message, or prayer request details.",
    ],
  },
  {
    title: "How We Use Information",
    content: [
      "We use information you voluntarily provide to respond to messages, receive and support prayer requests, communicate with you when appropriate, and carry out church-related ministry and administrative purposes.",
      "We do not use personal information from this website for advertising profiles, targeted advertising, or remarketing.",
    ],
  },
  {
    title: "Donations and Building Fund Links",
    content: [
      "Our website includes links that allow visitors to give financially, including support for the Rock of Redeemer building fund. Donation transactions may be handled by third-party services. Those services may collect payment and contact information needed to process your gift and provide receipts.",
      "Redeemer MTC does not receive full payment card details through this website. Please review the privacy practices of any third-party donation platform you use.",
    ],
  },
  {
    title: "Prayer Requests",
    content: [
      "Prayer request links or forms may collect the information you choose to share so that church leaders or ministry teams can pray and respond as appropriate.",
      "Please avoid submitting highly sensitive personal information unless you are comfortable sharing it with the church for prayer and pastoral follow-up.",
    ],
  },
  {
    title: "Cookie Usage",
    content: [
      "We use Google Analytics to understand general website traffic and improve our site. Google Analytics may use cookies or similar technologies to collect usage information, such as pages visited, browser type, approximate location, and referring sites. We do not use Google Analytics for advertising or remarketing.",
    ],
  },
  {
    title: "Third-Party Websites",
    content: [
      "Our website may link to external websites, forms, maps, social media pages, video platforms, donation services, and other tools. These third-party services are governed by their own privacy policies and practices.",
    ],
  },
  {
    title: "Information Sharing",
    content: [
      "We do not sell personal information. We may share information only when needed for church operations, ministry follow-up, service providers that help operate our website or communications, or when required by law.",
    ],
  },
  {
    title: "Contact Us",
    content: [
      "If you have questions about this privacy policy or how information submitted through this website is handled, please contact Redeemer MTC.",
    ],
  },
]

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen">
      <Header />

      <section className="pt-32 pb-16 bg-primary">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-accent text-sm uppercase tracking-widest mb-3">
            Website Privacy
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-primary-foreground mb-4">
            Privacy Policy
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            How Redeemer MTC handles information shared through our website.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-background">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="mb-10 text-muted-foreground leading-relaxed">
            <p>Last updated: June 7, 2026</p>
          </div>

          <div className="space-y-10">
            {sections.map((section) => (
              <section key={section.title} className="space-y-4">
                <h2 className="font-serif text-2xl md:text-3xl text-foreground">
                  {section.title}
                </h2>
                <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                  {section.content.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-12 rounded-lg border border-border bg-card p-6">
            <p className="text-muted-foreground leading-relaxed">
              You can reach us through the{" "}
              <Link href="/contact" className="text-accent hover:underline">
                contact page
              </Link>{" "}
              or by email at{" "}
              <a
                href="mailto:info@redeemermtc.org"
                className="text-accent hover:underline"
              >
                info@redeemermtc.org
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
