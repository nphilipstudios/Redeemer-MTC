import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 top-20">
  <img
    src="/IMG_7432.JPG"
    alt="Church interior"
    className="w-full h-full object-cover filter blur-[0.5px]"
  />
  <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-primary/40" />
</div>

{/* Text Box */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="max-w-2xl bg-white p-10 rounded-xl shadow-2xl">
          <p className="text-black text-sm uppercase tracking-widest mb-4">Welcome to Redeemer MTC</p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-black leading-tight mb-6">
            Lighted to Lighten
          </h1>
          <p className="text-black text-lg md:text-xl leading-relaxed max-w-xl">
            A welcoming community of faith. Join us for worship, fellowship, and service as we grow together in Christ.
          </p>
        </div>
      </div>
    </section>
  )
}
