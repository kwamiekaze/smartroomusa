import { Phone, Calendar, Wifi, Zap, Home, Sofa, ChefHat, Bath, IdCard, FileCheck, DollarSign, Shield, FileText, Check, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import { HeroMedia } from "@/components/HeroMedia";
import { Reveal } from "@/components/Reveal";
import { Navbar } from "@/components/Navbar";
import { SplashScreen } from "@/components/SplashScreen";
import { TourModal } from "@/components/TourModal";
import { RoomsIntroModal } from "@/components/RoomsIntroModal";
import { useState } from "react";

const PHONE_DISPLAY = "(404) 997-3763";
const PHONE_HREF = "tel:4049973763";

const moveInRequirements = [
  { icon: IdCard, title: "Valid Identification", desc: "Government-issued photo ID required at move-in." },
  { icon: FileCheck, title: "Proof of Income", desc: "Recent pay stub, offer letter, or income statement." },
  { icon: DollarSign, title: "One Week Rent", desc: "Pay your first week up front to secure your room." },
  { icon: Shield, title: "$200 Security Deposit", desc: "Fully refundable deposit, returned after move-out." },
  { icon: FileText, title: "$89 Admin & Application Fee", desc: "One-time administrative & application processing fee." },
];

const included = [
  { icon: Wifi, title: "WiFi", desc: "High-speed internet throughout the entire home." },
  { icon: Zap, title: "Utilities", desc: "Electricity, water, and gas all included in your rent." },
  { icon: Home, title: "Common Areas", desc: "Welcoming shared spaces designed for comfort." },
  { icon: Sofa, title: "Living Room", desc: "Relax in a furnished, inviting living room." },
  { icon: ChefHat, title: "Kitchen", desc: "Full kitchen access for cooking your favorite meals." },
  { icon: Bath, title: "Bathroom", desc: "Clean, well-kept shared bathroom facilities." },
];

const terms = [
  "All rentals are final.",
  "Rents can transfer to another room free of charge within the first 24 hours of occupying.",
  "Deposits are refunded within 48 hours of moving out after proper move-out notice.",
  "All move-outs must be emailed and called in.",
];

const faqs = [
  {
    q: "How do I pay rent and how do I qualify to move into a smart room?",
    a: "All renters must have identification, show proof of income, and pay one week rent plus a $200 security deposit and an $89 administrative fee.",
  },
  { q: "Are rooms refundable?", a: "All rentals are final. Rents can transfer to another room free of charge within the first 24 hours of occupying." },
  { q: "How many people can live in a house?", a: "There is an average of 3 to 4 renters in every SmartRoomz House." },
  { q: "As a renter, what can I use in the house?", a: "Renters can use WiFi, utilities, common areas, the living room, kitchen, and bathroom." },
  { q: "How do I get my deposit back?", a: "All deposits are refunded within 48 hours of moving out. All move-outs must be emailed and called in." },
];

const trustChips = ["Weekly Rent Options", "Utilities Included", "WiFi Included", "Simple Move-In Process"];

const SectionTitle = ({ eyebrow, title, sub }: { eyebrow?: string; title: string; sub?: string }) => (
  <div className="text-center max-w-2xl mx-auto mb-14">
    {eyebrow && (
      <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-primary mb-4">
        <span className="h-px w-8 bg-primary/60" />
        {eyebrow}
        <span className="h-px w-8 bg-primary/60" />
      </div>
    )}
    <h2 className="font-serif text-4xl md:text-5xl text-cream leading-tight">{title}</h2>
    {sub && <p className="mt-4 text-muted-foreground text-lg">{sub}</p>}
  </div>
);

const Index = () => {
  const [tourOpen, setTourOpen] = useState(false);
  const [roomsOpen, setRoomsOpen] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      movein: String(fd.get("movein") || "").trim(),
      income: String(fd.get("income") || "").trim(),
      message: String(fd.get("message") || "").trim(),
      source: "booking_form" as const,
    };
    if (!payload.name || !payload.phone || !payload.email) {
      toast.error("Please complete the required fields.");
      return;
    }
    setSubmitting(true);
    try {
      const { submitBooking } = await import("@/lib/bookings");
      await submitBooking(payload);
      (e.target as HTMLFormElement).reset();
      toast.success("Booking request received", { description: "We'll reach out shortly to confirm your move-in." });
    } catch (err: any) {
      toast.error(err?.message || "Could not submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="top" className="min-h-screen bg-background text-foreground">
      <SplashScreen />
      <TourModal open={tourOpen} onClose={() => setTourOpen(false)} />
      <RoomsIntroModal open={roomsOpen} onClose={() => setRoomsOpen(false)} />
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-[100svh] flex flex-col overflow-hidden">
        <HeroMedia videoSrc="/hero.mp4" />

        <h1 className="sr-only">Premium smart room living in Atlanta</h1>

        <div className="flex-1" />

        {/* Schedule a Tour — calendar-shaped CTA, bottom-left */}
        <div className="absolute z-10 left-4 bottom-6 sm:left-6 sm:bottom-8 md:left-10 md:bottom-10">
          <button
            type="button"
            onClick={() => setTourOpen(true)}
            aria-label="Schedule a tour"
            className="group relative flex flex-col items-center w-20 sm:w-24 md:w-28 rounded-xl overflow-hidden bg-card/90 backdrop-blur-md border border-primary/50 shadow-gold hover:-translate-y-1 hover:shadow-glow transition-luxe"
          >
            <div className="w-full bg-gradient-gold py-1 flex items-center justify-center gap-1">
              <span className="h-1 w-0.5 rounded-full bg-primary-foreground/80" />
              <span className="text-[9px] sm:text-[10px] font-semibold tracking-widest text-primary-foreground uppercase">Tour</span>
              <span className="h-1 w-0.5 rounded-full bg-primary-foreground/80" />
            </div>
            <div className="px-2 py-1.5 sm:py-2 flex flex-col items-center">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary mb-0.5" />
              <span className="font-serif text-cream text-[11px] sm:text-xs leading-tight text-center">Schedule<br/>a Tour</span>
            </div>
          </button>
        </div>

        {/* Rooms — SR keychain CTA, bottom-right */}
        <div className="absolute z-10 right-4 bottom-6 sm:right-6 sm:bottom-8 md:right-10 md:bottom-10">
          <button
            type="button"
            onClick={() => setRoomsOpen(true)}
            aria-label="Browse rooms"
            className="group relative flex flex-col items-center w-20 sm:w-24 md:w-28 hover:-translate-y-1 transition-luxe"
          >
            <span aria-hidden className="h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full border-[2.5px] border-primary bg-transparent shadow-gold -mb-1.5 relative z-10" />
            <span aria-hidden className="h-2 w-[2px] bg-primary/70 -mb-1 z-10" />
            <div className="relative w-full rounded-2xl overflow-hidden border border-primary/60 shadow-gold bg-gradient-to-b from-[#1a0f08] via-[#3a2418] to-[#1a0f08] group-hover:shadow-glow transition-luxe">
              <div className="w-full bg-gradient-gold py-1 flex items-center justify-center">
                <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-primary-foreground">SR</span>
              </div>
              <div className="px-2 py-1.5 sm:py-2 flex flex-col items-center">
                <Key className="h-4 w-4 sm:h-5 sm:w-5 text-primary mb-0.5" strokeWidth={2} />
                <span className="font-serif text-cream text-[11px] sm:text-xs leading-tight text-center">Rooms</span>
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* REQUIREMENTS */}
      <section id="requirements" className="py-24 bg-gradient-section">
        <div className="container">
          <Reveal>
            <SectionTitle eyebrow="Move-In" title="What You Need To Move In" sub="A simple, transparent qualification process with no surprises." />
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {moveInRequirements.map((r, i) => (
              <Reveal key={r.title} delay={i * 80}>
                <div className="group h-full p-8 rounded-xl bg-card border border-border/60 shadow-card hover:border-primary/50 hover:-translate-y-1 transition-luxe">
                  <div className="h-14 w-14 rounded-lg bg-gradient-gold grid place-items-center mb-5 shadow-gold group-hover:scale-110 transition-smooth">
                    <r.icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <h3 className="font-serif text-2xl text-cream mb-2">{r.title}</h3>
                  <p className="text-muted-foreground">{r.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* COST */}
      <section id="cost" className="py-24 marble-texture">
        <div className="container">
          <Reveal>
            <SectionTitle eyebrow="Pricing" title="Simple Move-In Cost" sub="One week rent + $200 security deposit + $89 administrative fee & application fee." />
          </Reveal>
          <Reveal delay={100}>
            <div className="max-w-3xl mx-auto p-1 rounded-2xl bg-gradient-gold shadow-elegant">
              <div className="rounded-2xl bg-card p-6 sm:p-10 md:p-14 text-center">
                <p className="text-sm uppercase tracking-[0.25em] text-primary mb-4">Example Move-In</p>
                <p className="text-cream/85 text-base sm:text-lg leading-relaxed">
                  If monthly rent is <span className="text-cream font-semibold">$800</span>, you only pay
                  <span className="text-cream font-semibold"> $200 weekly</span> + <span className="text-cream font-semibold">$200 security deposit</span> + <span className="text-cream font-semibold">$89 administrative fee</span>.
                </p>
                <div className="my-8 gold-divider" />
                <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Total Move-In Cost</p>
                <p className="font-serif text-5xl sm:text-7xl md:text-8xl text-gradient-gold mt-2 tracking-tight whitespace-nowrap">$489.00</p>
                <Button onClick={() => setTourOpen(true)} variant="gold" size="lg" className="mt-8">
                  Reserve Your Room
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* INCLUDED */}
      <section id="included" className="py-24 bg-gradient-section">
        <div className="container">
          <Reveal>
            <SectionTitle eyebrow="Amenities" title="What Renters Can Use In The House" sub="Everything you need for comfortable shared living, included with every stay." />
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {included.map((it, i) => (
              <Reveal key={it.title} delay={i * 70}>
                <div className="group h-full p-8 rounded-xl bg-card border border-border/60 hover:border-primary/50 hover:-translate-y-1 transition-luxe shadow-card">
                  <it.icon className="h-10 w-10 text-primary mb-5 group-hover:scale-110 transition-smooth" strokeWidth={1.5} />
                  <h3 className="font-serif text-2xl text-cream mb-2">{it.title}</h3>
                  <p className="text-muted-foreground">{it.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="py-24 bg-gradient-wood relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.25),transparent_60%)]" />
        <div className="container relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <Reveal>
              <div>
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-primary mb-4">
                  <span className="h-px w-8 bg-primary/60" /> The Experience
                </div>
                <h2 className="font-serif text-4xl md:text-5xl text-cream leading-tight">
                  Comfortable <span className="text-gradient-gold">Shared Living</span>
                </h2>
                <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                  There is an average of <span className="text-champagne font-medium">3 to 4 renters</span> in every
                  SmartRoomz House, creating a manageable shared-living environment with access to common
                  household spaces.
                </p>
                <ul className="mt-8 space-y-3">
                  {["Quiet, well-maintained homes", "Respectful, vetted housemates", "Move-in ready spaces"].map((b) => (
                    <li key={b} className="flex items-center gap-3 text-cream/90">
                      <span className="h-6 w-6 rounded-full bg-gradient-gold grid place-items-center shrink-0">
                        <Check className="h-3.5 w-3.5 text-primary-foreground" />
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-gold opacity-20 blur-3xl rounded-full" />
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-primary/30 shadow-elegant">
                  <div className="h-full w-full marble-texture grid place-items-center">
                    <div className="text-center px-8">
                      <p className="font-serif text-7xl text-gradient-gold">3–4</p>
                      <p className="mt-2 text-sm uppercase tracking-[0.3em] text-cream/80">Renters per home</p>
                      <div className="my-6 gold-divider" />
                      <p className="font-serif italic text-2xl text-champagne">"A home that feels like home."</p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* TERMS */}
      <section className="py-24 bg-gradient-section">
        <div className="container">
          <Reveal>
            <SectionTitle eyebrow="Policies" title="Clear Rental Terms" sub="Refunds, transfers, and deposits made straightforward and fair." />
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {terms.map((t, i) => (
              <Reveal key={t} delay={i * 80}>
                <div className="h-full p-8 rounded-xl bg-card border-l-2 border-primary shadow-card hover:shadow-gold transition-smooth">
                  <p className="text-cream/90 text-lg leading-relaxed">{t}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 marble-texture">
        <div className="container max-w-3xl">
          <Reveal>
            <SectionTitle eyebrow="Questions" title="Frequently Asked" />
          </Reveal>
          <Reveal delay={100}>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border border-border/60 rounded-xl bg-card px-6 data-[state=open]:border-primary/50 transition-smooth">
                  <AccordionTrigger className="text-left font-serif text-lg md:text-xl text-cream hover:no-underline hover:text-primary py-5">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-5">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {/* BOOKING */}
      <section id="booking" className="py-24 bg-gradient-wood relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 blur-3xl rounded-full" />
        <div className="container relative max-w-2xl">
          <Reveal>
            <SectionTitle eyebrow="Reserve" title="Book Your Smart Room" sub="Tell us a bit about you and we'll confirm availability and walk you through next steps." />
          </Reveal>
          <Reveal delay={100}>
            <form onSubmit={handleSubmit} className="p-8 md:p-10 rounded-2xl bg-card border border-primary/30 shadow-elegant space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-cream">Full Name</Label>
                  <Input id="name" name="name" required placeholder="Jane Doe" className="bg-input border-border/60" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-cream">Phone Number</Label>
                  <Input id="phone" name="phone" type="tel" required placeholder="(555) 555-5555" className="bg-input border-border/60" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-cream">Email</Label>
                <Input id="email" name="email" type="email" required placeholder="you@email.com" className="bg-input border-border/60" />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="movein" className="text-cream">Desired Move-In Date</Label>
                  <Input id="movein" name="movein" type="date" required className="bg-input border-border/60" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="income" className="text-cream">Proof of Income</Label>
                  <Select name="income">
                    <SelectTrigger id="income" className="bg-input border-border/60">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paystub">Pay stub available</SelectItem>
                      <SelectItem value="offer">Offer letter</SelectItem>
                      <SelectItem value="bank">Bank statement</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-cream">Message</Label>
                <Textarea id="message" name="message" rows={4} placeholder="Anything we should know?" className="bg-input border-border/60" />
              </div>
              <Button type="submit" variant="gold" size="lg" className="w-full" disabled={submitting}>
                {submitting ? "Submitting…" : "Submit Booking Request"}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Or call us directly at <a href={PHONE_HREF} className="text-primary hover:underline">{PHONE_DISPLAY}</a>
              </p>
            </form>
          </Reveal>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 bg-background">
        <div className="container">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-primary/30 p-12 md:p-20 text-center shadow-elegant marble-texture">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.15),transparent_70%)]" />
              <div className="relative">
                <h2 className="font-serif text-4xl md:text-6xl text-cream leading-tight">
                  Ready To Move Into A <span className="text-gradient-gold">Smart Room?</span>
                </h2>
                <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
                  Start with a simple qualification process and weekly move-in pricing.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild variant="gold" size="xl">
                    <a href="#booking"><Calendar /> Book a Room</a>
                  </Button>
                  <Button asChild variant="outlineGold" size="xl">
                    <a href={PHONE_HREF}><Phone /> Call Now</a>
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/40 py-12 bg-background">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="h-9 w-9 rounded-full bg-gradient-gold grid place-items-center font-serif text-primary-foreground font-bold">S</span>
              <span className="font-serif text-lg text-cream">Smart Room <span className="text-gradient-gold">USA</span></span>
            </div>
            <p className="font-serif italic text-champagne">Come stay with us</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <a href={PHONE_HREF} className="hover:text-primary transition-smooth">{PHONE_DISPLAY}</a>
              <span>·</span>
              <span>© {new Date().getFullYear()} Smart Room USA</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
