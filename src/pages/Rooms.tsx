import { useRef, useState } from "react";
import { Home, Phone, MapPin, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Reveal } from "@/components/Reveal";
import { TourModal } from "@/components/TourModal";

import { rooms, type Room } from "@/data/rooms";

function RoomGallery({ room }: { room: Room }) {
  const imgs = (room.images && room.images.length > 0)
    ? room.images
    : (room.imageUrl ? [room.imageUrl] : []);
  const [i, setI] = useState(0);
  const touchStartX = useRef<number | null>(null);

  if (imgs.length === 0) {
    return (
      <div className="absolute inset-0 grid place-items-center marble-texture">
        <div className="text-center px-6">
          <Home className="h-8 w-8 text-primary mx-auto mb-3" strokeWidth={1.5} />
          <p className="text-xs uppercase tracking-[0.3em] text-cream/80">Room photo coming soon</p>
        </div>
      </div>
    );
  }

  const go = (n: number) => setI((i + n + imgs.length) % imgs.length);

  return (
    <div
      className="absolute inset-0"
      onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchStartX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        touchStartX.current = null;
      }}
    >
      {imgs.map((src, idx) => (
        <img
          key={src}
          src={src}
          alt={`${room.name} — photo ${idx + 1} of ${imgs.length}`}
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${idx === i ? "opacity-100" : "opacity-0"}`}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        />
      ))}

      {imgs.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); go(-1); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 grid place-items-center rounded-full bg-background/60 backdrop-blur-md border border-primary/30 text-cream hover:bg-background/80 hover:text-primary transition-colors opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); go(1); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 grid place-items-center rounded-full bg-background/60 backdrop-blur-md border border-primary/30 text-cream hover:bg-background/80 hover:text-primary transition-colors opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {imgs.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Go to photo ${idx + 1}`}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setI(idx); }}
                className={`h-1.5 rounded-full transition-all ${idx === i ? "w-5 bg-primary" : "w-1.5 bg-cream/50 hover:bg-cream/80"}`}
              />
            ))}
          </div>

          <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-[0.2em] bg-background/70 backdrop-blur-md border border-primary/30 text-cream/90">
            {i + 1} / {imgs.length}
          </div>
        </>
      )}
    </div>
  );
}

const PHONE_DISPLAY = "(404) 997-3763";
const PHONE_HREF = "tel:4049973763";

const Rooms = () => {
  const [tourOpen, setTourOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <TourModal open={tourOpen} onClose={() => setTourOpen(false)} />


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
                  <div className="relative aspect-[4/3] overflow-hidden bg-gradient-wood">
                    <RoomGallery room={room} />
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] bg-background/70 backdrop-blur-md border border-primary/40 text-primary z-10">
                      {room.availability}
                    </div>
                  </div>

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
                      <Button
                        variant="gold"
                        size="sm"
                        className="flex-1"
                        onClick={() => setTourOpen(true)}
                      >
                        <CalendarIcon className="h-4 w-4 mr-1.5" /> Schedule Tour
                      </Button>
                      <Button asChild variant="outline" size="sm" className="flex-1 border-primary/40 text-cream hover:bg-primary/10">
                        <a href={PHONE_HREF}>
                          <Phone className="h-4 w-4 mr-1.5" /> Call Now
                        </a>
                      </Button>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <p className="mt-14 text-center text-sm text-muted-foreground">
            Don't see what you're looking for? Call us at
            <br />
            <a href={PHONE_HREF} className="text-primary hover:underline">{PHONE_DISPLAY}</a>.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Rooms;
