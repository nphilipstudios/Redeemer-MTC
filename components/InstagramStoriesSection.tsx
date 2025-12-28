"use client"

export function InstagramStoriesSection() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-10">
      <p className="text-accent uppercase tracking-widest text-sm mb-2">Follow Us</p>
      <h2 className="font-serif text-3xl text-foreground">Instagram Stories</h2>
<p className="text-muted-foreground mt-2 px-4 py-3">
  See the latest updates from our community on Instagram
</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Instagram Account */}
          <div className="bg-card rounded-xl overflow-hidden border border-border p-4">
            <h2 className="font-serif text-lg text-foreground mb-4 text-center">Redeemer MTC</h2>
            <div className="w-full h-[650px] overflow-auto">
              <iframe
                src="https://widgets.sociablekit.com/instagram-stories/iframe/25633305"
                width="100%"
                height="100%"
                style={{ border: "none" }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                scrolling="yes"
                title="Redeemer MTC"
              ></iframe>
            </div>
          </div>

          {/* Right Instagram Account */}
          <div className="bg-card rounded-xl overflow-hidden border border-border p-4">
            <h2 className="font-serif text-lg text-foreground mb-4 text-center">Youth Fellowship</h2>
            <div className="w-full h-[650px] overflow-auto">
              <iframe
                src="https://widgets.sociablekit.com/instagram-stories/iframe/25633306"
                width="100%"
                height="100%"
                style={{ border: "none" }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                scrolling="yes"
                title="Youth Fellowship"
              ></iframe>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}