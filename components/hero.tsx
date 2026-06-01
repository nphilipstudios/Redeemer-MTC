import Image from "next/image"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-start pt-24 overflow-hidden">
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/IMG_7432.JPG"
          alt="Redeemer MTC group photo"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center translate-y-20 filter blur-[0.5px]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-primary/40" />
      </div>

      {/* Text Box */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 mt-20">
        <div className="max-w-2xl bg-white p-10 rounded-xl shadow-2xl">
          <p className="text-black text-sm uppercase tracking-widest mb-4">
            Welcome to Redeemer MTC
          </p>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-black leading-tight mb-6">
            Lighted to Lighten
          </h1>

          <p className="text-black text-lg md:text-xl leading-relaxed max-w-xl">
            A welcoming community of faith. Join us for worship, fellowship, and
            service as we grow together in Christ.
          </p>
        </div>
      </div>
    </section>
  )
}
