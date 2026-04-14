import { Button } from "@/components/ui/button"
import { Heart, MapPin, Video } from "lucide-react"
import { CreditCard, DollarSign } from "lucide-react"


const quickLinks = [
  { label: "Prayer Requests", icon: Heart, href: "https://forms.gle/p25KxZx1LvQ5xkCbA" },
  { label: "Live Stream", icon: Video, href: "https://youtube.com/@redeemermtc/live" },
  { label: "Directions", icon: MapPin, href: "https://maps.app.goo.gl/dg88Q9TYsnqWdHEt6" },
  { label: "Give", icon: DollarSign, href: "https://redeemermtc.churchtrac.com/give" }
]

export function QuickLinks() {
  return (
    <section className="py-16 bg-card">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-4">
          {quickLinks.map((link, i) => (
            <a
              key={i}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                className="w-48 flex flex-col items-center gap-3 py-8 h-auto border-border hover:border-accent hover:bg-accent/5 transition-all group bg-transparent"
              >
                <link.icon className="w-6 h-6 text-accent group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-foreground">{link.label}</span>
              </Button>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}