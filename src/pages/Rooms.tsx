import { Home, Phone, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Reveal } from "@/components/Reveal";
import { rooms } from "@/data/rooms";

const PHONE_DISPLAY = "(404) 000-0000";
const PHONE_HREF = "tel:4040000000";

const Rooms = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section id="rooms" className="pt-28 pb-24 marble-texture">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-primary mb-4">
              <span className="h-px w-8 bg-primary/60" />
              Available Rooms
              <span className="h-px w-8 bg-primary/60" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-cream leading-tight">
              Our <span className="text-gradient-gold">Smart Rooms</span>
            </h1>
            <p className="mt-4 text-muted-foreground text-lg">
              Browse private rooms across Atlanta. Weekly rent, utilities and WiFi included, simple move-in.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room, i) => (
              <Reveal key={room.id} delay={(i % 6) * 60}>
                <article className="group h-full flex flex-col rounded-xl overflow-hidden bg-card border border-border/60 shadow-card hover:border-primary/50 hover:-translate-y-1 transition-luxe">
                  {/* Image / placeholder */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-gradient-wood">
                    {room.imageUrl ? (
                      <img
                        src={room.imageUrl}
                        alt={room.name}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-luxe"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center marble-texture">
                        <div className="text-center px-6">
                          <Home className="h-8 w-8 text-primary mx-auto mb-3" strokeWidth={1.5} />
                          <p className="text-xs uppercase tracking-[0.3em] text-cream/80">Room photo coming soon</p>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] bg-background/70 backdrop-blur-md border border-primary/40 text-primary">
                      {room.availability}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex flex-col flex-1 p-6">
                    <h3 className="font-serif text-2xl text-cream leading-tight">{room.name}</h3>
                    {room.location && (
                      <p className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                        <span>{room.location}</span>
                      </p>
                    )}

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-lg border border-border/60 p-3">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Weekly Rent</p>
                        <p className="mt-1 text-cream font-semibold text-sm">{room.weeklyRent}</p>
                      </div>
                      <div className="rounded-lg border border-border/60 p-3">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Move-In</p>
                        <p className="mt-1 text-cream font-semibold text-sm">{room.moveInCost}</p>
                      </div>
                    </div>

                    {room.amenities.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {room.amenities.map((a) => (
                          <span
                            key={a}
                            className="text-[11px] px-2.5 py-1 rounded-full border border-primary/30 text-cream/85 bg-background/40"
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="mt-4 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {room.description}
                    </p>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3 pt-2">
                      <Button asChild variant="gold" size="sm" className="flex-1">
                        <a href={room.sourceUrl || "#"} target="_blank" rel="noopener noreferrer">
                          View Details
                        </a>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="flex-1 border-primary/40 text-cream hover:bg-primary/10">
                        <a href={PHONE_HREF}>
                          <Phone className="h-4 w-4 mr-1.5" /> Call Now
                        </a>
                      </Button>
                    </div>

                    {room.sourceUrl && (
                      <a
                        href={room.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1 text-[11px] text-primary/80 hover:text-primary"
                      >
                        Source listing <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <p className="mt-14 text-center text-sm text-muted-foreground">
            Don't see what you're looking for? Call us at{" "}
            <a href={PHONE_HREF} className="text-primary hover:underline">{PHONE_DISPLAY}</a>.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Rooms;
