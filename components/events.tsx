import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const events = [
  {
    date: "Dec 13",
    title: "Christmas Caroling",
    time: "6:00 PM",
    image: "/people-caroling-at-night-with-christmas-lights.jpg",
  },
  {
    date: "Dec 20",
    title: "Christmas Carol Service",
    time: "5:00 PM",
    image: "/beautiful-christmas-church-service-with-candles.jpg",
  },
  {
    date: "Dec 25",
    title: "Christmas Day Service",
    time: "9:00 AM",
    image: "/christmas-morning-church-service-with-nativity.jpg",
  },
]

export function Events() {
  return (
    <section id="events" className="py-20 lg:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <p className="text-accent text-sm uppercase tracking-widest mb-3">Upcoming</p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground">Events</h2>
          </div>
          <Button variant="outline" className="mt-4 md:mt-0 gap-2 border-border hover:border-accent bg-transparent">
            View All
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {events.map((event, i) => (
            <div
              key={i}
              className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all group cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.image || "/placeholder.svg"}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg px-3 py-1">
                  <span className="text-accent font-medium text-sm">{event.date}</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-serif text-xl text-foreground mb-1 group-hover:text-accent transition-colors">
                  {event.title}
                </h3>
                <p className="text-muted-foreground text-sm">{event.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
