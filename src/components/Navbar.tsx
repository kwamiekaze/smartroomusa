import { useState } from "react";
import { Menu, X } from "lucide-react";
import { WeatherPill } from "@/components/WeatherPill";

const links = [
  { href: "/#requirements", label: "Move-In" },
  { href: "/#cost", label: "Pricing" },
  { href: "/#included", label: "Included" },
  { href: "/rooms", label: "Rooms" },
  { href: "/#experience", label: "Experience" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#booking", label: "Book a Room" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <WeatherPill />
        <button
          className="text-cream p-2 rounded-full bg-background/60 backdrop-blur-md border border-border/40"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/40 bg-background/95 backdrop-blur-md animate-fade-in">
          <div className="container py-4 flex flex-col gap-3">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-cream py-2 hover:text-primary transition-smooth">{l.label}</a>
            ))}
            <a href="tel:4040000000" onClick={() => setOpen(false)} className="text-primary py-2">Call (404) 000-0000</a>
          </div>
        </div>
      )}
    </header>
  );
};
