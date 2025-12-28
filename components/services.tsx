import Image from "next/image"
import { Clock, Users } from "lucide-react"

const services = [
  {
    name: "Holy Communion Worship Service",
    time: "11:30 AM",
    sundaySchool: "10:30 AM",
    description: "Weekly worship with communion",
    image: "/church-worship-service-with-congregation-and-commu.jpg",
  },
  {
    name: "Praise & Worship Service",
    time: "11:30 AM",
    sundaySchool: "10:30 AM",
    description: "Contemporary praise and worship",
    image: "/church-praise-worship-service-with-people-singing.jpg",
  },
  {
    name: "Christmas Carol Service",
    time: "5:00 PM",
    date: "December 20",
    description: "Annual Christmas celebration with carols and play",
    image: "/christmas-carol-service-at-church-with-candles-and.jpg",
  },
  {
    name: "Christmas Holy Communion Service",
    time: "9:00 AM",
    date: "December 25",
    description: "Special Christmas morning worship",
    image: "/christmas-morning-church-service-with-nativity-and.jpg",
  },
]

export function Services() {
  return (
    <section id="services" className="py-20 lg:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-accent text-sm uppercase tracking-widest mb-3">Join Us</p>
          <h2 className="font-serif text-3xl md:text-4xl text-foreground">Our Services</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <div
              key={i}
              className="group bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* Service Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={service.image || "/placeholder.svg"}
                  alt={service.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {service.date && (
                  <div className="absolute top-4 left-4 bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {service.date}
                  </div>
                )}
              </div>

              {/* Service Info */}
              <div className="p-6">
                <h3 className="font-serif text-xl text-foreground mb-2 group-hover:text-accent transition-colors">
                  {service.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">{service.description}</p>

                <div className="flex flex-col gap-2">
                  {service.sundaySchool && (
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-accent" />
                      <span className="text-muted-foreground">Sunday School:</span>
                      <span className="text-foreground font-medium">{service.sundaySchool}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-accent" />
                    <span className="text-muted-foreground">Service:</span>
                    <span className="text-foreground font-medium">{service.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
