import { useState } from "react";
import { Menu, X, Home } from "lucide-react";
import { useLocation } from "react-router-dom";
import { WeatherPill } from "@/components/WeatherPill";
import { triggerReturnToLobby } from "@/components/SplashScreen";

const links = [
  { href: "/#requirements", label: "Move-In" },
  { href: "/#cost", label: "Pricing" },
  { href: "/#included", label: "Included" },
  { href: "/rooms", label: "Rooms" },
  { href: "/#experience", label: "Experience" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#booking", label: "Book a Room" },
  { href: "/admin", label: "Admin" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const onRooms = pathname.startsWith("/rooms");

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        {onRooms ? (
          <button
            type="button"
            onClick={triggerReturnToLobby}
            className="inline-flex items-center gap-2 rounded-full bg-background/70 backdrop-blur-md border border-primary/40 px-4 py-2 text-sm text-cream hover:text-primary hover:border-primary transition-colors shadow-card"
            aria-label="Return to lobby"
          >
            <Home className="h-4 w-4" /> Return to Lobby
          </button>
        ) : (
          <WeatherPill />
        )}
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
            <a href="tel:4049973763" onClick={() => setOpen(false)} className="text-primary py-2">Call (404) 997-3763</a>
          </div>
        </div>
      )}
    </header>
  );
};
