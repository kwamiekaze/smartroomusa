import { useState } from "react";
import { Menu, X, Home } from "lucide-react";
import { useLocation } from "react-router-dom";
import { WeatherPill } from "@/components/WeatherPill";
import { triggerReturnToLobby } from "@/components/SplashScreen";

const links = [
  { href: "/rooms", label: "Rooms" },
  { href: "/?tour=1", label: "Book a Room" },
  { href: "/auth", label: "Sign in" },
  { href: "/#requirements", label: "Move-In" },
  { href: "/#cost", label: "Pricing" },
  { href: "/#included", label: "Included" },
  { href: "/#experience", label: "Experience" },
  { href: "/#faq", label: "FAQ" },
  { href: "tel:4049973763", label: "Contact Us" },
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
            {links.map((l) => {
              const isRooms = l.href === "/rooms";
              const isBook = l.label === "Book a Room";
              return (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => {
                    if (isRooms && pathname === "/") {
                      e.preventDefault();
                      window.dispatchEvent(new CustomEvent("rooms-intro:open"));
                    }
                    if (isBook && pathname === "/") {
                      e.preventDefault();
                      window.dispatchEvent(new CustomEvent("tour:open"));
                    }
                    setOpen(false);
                  }}
                  className={`py-2 transition-smooth ${l.label === "Contact Us" ? "text-primary font-semibold hover:underline" : "text-cream hover:text-primary"}`}
                >
                  {l.label}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
