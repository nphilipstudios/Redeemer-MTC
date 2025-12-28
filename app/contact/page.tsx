import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Contact } from "@/components/contact"

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-primary">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-accent text-sm uppercase tracking-widest mb-3">Reach Out</p>
          <h1 className="font-serif text-4xl md:text-5xl text-primary-foreground mb-4">Contact Us</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            We'd love to hear from you. Get in touch with any questions or prayer requests.
          </p>
        </div>
      </section>

      <Contact />
      <Footer />
    </main>
  )
}
