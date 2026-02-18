import Image from "next/image"
import { Clock } from "lucide-react"
import { useGoogleCalendarEvents, getUpcomingServices, type CalendarEvent } from "@/lib/google-calendar-events"

export function Services() {
  const { events, isLoading } = useGoogleCalendarEvents()
  const services: CalendarEvent[] = getUpcomingServices(events, 6)

  const getServiceImage = (service: CalendarEvent) => {
    const text = `${service.title ?? ""} ${service.description ?? ""}`.toLowerCase()

    // Holy Qurbana / Holy Communion
    if (text.includes("qurbana") || text.includes("communion") || text.includes("holy qurbana") || text.includes("holy communion")) {
      return "/NEW Holy Communion YT Thumbnail.png"
    }

    // Praise & Worship
    if (text.includes("praise") && text.includes("worship")) {
      return "/NEW Praise and Worship YT Thumbnail.png"
    }

    return "/placeholder.svg"
  }

  return (
    <section id="services" className="py-20 lg:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-accent text-sm uppercase tracking-widest mb-3">Join Us</p>
          <h2 className="font-serif text-3xl md:text-4xl text-foreground">Our Services</h2>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading services...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No upcoming services scheduled.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="group bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Service Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={getServiceImage(service)}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Service Info */}
                <div className="p-6">
                  <h3 className="font-serif text-xl text-foreground mb-2 group-hover:text-accent transition-colors">
                    {service.title}
                  </h3>

                  {service.description ? (
                    <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                  ) : null}

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-accent" />
                      <span className="text-muted-foreground">Service:</span>
                      <span className="text-foreground font-medium">
                        {new Date(service.start).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
