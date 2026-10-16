"use client"


import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import { trackGoogleAnalyticsEvent } from "@/components/google-analytics"


export function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setFeedback(null)


    try {
      const res = await fetch("/api/google-calendar/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })


      const data = await res.json()


      if (res.ok) {
        trackGoogleAnalyticsEvent("generate_lead", {
          form_name: "contact",
          method: "contact_form",
        })
        setFeedback("Message sent successfully!")
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          message: "",
        })
      } else {
        trackGoogleAnalyticsEvent("contact_form_error", {
          form_name: "contact",
          status: res.status,
        })
        setFeedback(data.error || "Something went wrong.")
      }
    } catch (error) {
      console.error(error)
      trackGoogleAnalyticsEvent("contact_form_error", {
        form_name: "contact",
        status: "network_error",
      })
      setFeedback("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }


  return (
    <section id="contact" className="py-20 lg:py-28 bg-secondary">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Info */}
          <div>
            <p className="text-accent text-sm uppercase tracking-widest mb-3">
              Get In Touch
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6">
              We&apos;d Love to Hear From You
            </h2>
            <p className="text-muted-foreground text-lg mb-10">
              Have questions? Want to learn more about our community? We&apos;re
              here to help.
            </p>


            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Email</h3>
                  <a
                    href="mailto:info@redeemermtc.org"
                    className="text-muted-foreground hover:text-accent transition-colors"
                  >
                    info@redeemermtc.org
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                  <a href="tel:+12013005206" className="text-muted-foreground hover:text-accent transition-colors">
                    (201) 300-5206
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Address</h3>
                  <a href="https://maps.app.goo.gl/YJtfz5MUk6wxodEa6" className="text-muted-foreground hover:text-accent transition-colors">
                    136 Wyckoff Ave,
                    <br />
                    Waldwick, NJ 07463
                  </a>
                </div>
              </div>
            </div>
          </div>


          {/* Contact Form */}
          <div className="bg-card rounded-2xl p-8 border border-border">
            <h3 className="font-serif text-2xl mb-6">Send Us a Message</h3>


            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    First Name
                  </label>
                  <Input
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="h-12 rounded-lg bg-muted"
                  />
                </div>


                <div>
                  <label className="block text-sm font-medium mb-2">
                    Last Name
                  </label>
                  <Input
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="h-12 rounded-lg bg-muted"
                  />
                </div>
              </div>


              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="h-12 rounded-lg bg-muted"
                />
              </div>


              {/* Message */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Message
                </label>
                <Textarea
                  placeholder="How can we help you?"
                  rows={4}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="rounded-lg bg-muted resize-none"
                />
              </div>


              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white gap-2"
              >
                {loading ? "Sending..." : "Send Message"}
                <Send className="w-4 h-4" />
              </Button>


              {feedback && (
                <p
                  className={`text-sm text-center ${feedback.includes("success")
                      ? "text-green-600"
                      : "text-red-600"
                    }`}
                >
                  {feedback}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
