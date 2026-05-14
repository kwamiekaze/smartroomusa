import { useState } from "react";
import { Phone, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { href: "#requirements", label: "Move-In" },
  { href: "#cost", label: "Pricing" },
  { href: "#included", label: "Included" },
  { href: "#experience", label: "Experience" },
  { href: "#faq", label: "FAQ" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/40">
      <div className="container flex h-16 items-center justify-between">
        <a href="#top" className="flex items-center gap-2 group">
          <span className="h-9 w-9 rounded-full bg-gradient-gold grid place-items-center font-serif text-primary-foreground font-bold shadow-gold">S</span>
          <span className="font-serif text-lg tracking-wide text-cream">
            Smart Room <span className="text-gradient-gold">USA</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-muted-foreground hover:text-primary transition-smooth">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {/* TODO: replace tel number */}
          <Button asChild variant="outlineGold" size="sm">
            <a href="tel:4040000000"><Phone /> Call Now</a>
          </Button>
          <Button asChild variant="gold" size="sm">
            <a href="#booking">Book a Room</a>
          </Button>
        </div>

        <button className="md:hidden text-cream p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-md animate-fade-in">
          <div className="container py-4 flex flex-col gap-3">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-cream py-2">{l.label}</a>
            ))}
            <div className="flex gap-2 pt-2">
              <Button asChild variant="outlineGold" size="sm" className="flex-1">
                <a href="tel:4040000000"><Phone /> Call</a>
              </Button>
              <Button asChild variant="gold" size="sm" className="flex-1">
                <a href="#booking" onClick={() => setOpen(false)}>Book</a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
