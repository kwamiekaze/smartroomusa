import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, LogOut, RefreshCw, Inbox } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { triggerReturnToLobby } from "@/components/SplashScreen";
import { Button } from "@/components/ui/button";
import { BookingCard } from "@/components/BookingCard";
import { Booking, dashboardRouteFor, fetchBookings } from "@/lib/bookingWorkflow";
import { toast } from "sonner";

type View = "active" | "done";
const DONE = ["booked", "closed", "not_qualified"];

const Staff = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [userEmail, setUserEmail] = useState("");
  const [view, setView] = useState<View>("active");

  const load = async () => {
    try {
      // RLS only returns bookings an admin has assigned to this staff member.
      setBookings(await fetchBookings());
    } catch (e) {
      toast.error((e as Error)?.message || "Failed to load assignments");
    }
  };

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth", { replace: true }); return; }
      const route = await dashboardRouteFor(session.user.id);
      if (!mounted) return;
      if (route !== "/staff") { navigate(route, { replace: true }); return; }
      setUserEmail(session.user.email || "");
      await load();
      if (mounted) setLoading(false);
    };
    init();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (!s) navigate("/auth", { replace: true });
    });
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, [navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth", { replace: true });
  };

  if (loading) {
    return <div className="min-h-screen grid place-items-center bg-background text-cream">Loading…</div>;
  }

  const active = bookings.filter((b) => !DONE.includes(b.status));
  const done = bookings.filter((b) => DONE.includes(b.status));
  const awaiting = bookings.filter((b) => b.status === "assigned").length;
  const shown = view === "active" ? active : done;
  const onChanged = (nb: Booking) => setBookings((list) => list.map((x) => (x.id === nb.id ? nb : x)));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-md border-b border-border/60">
        <div className="container flex items-center justify-between h-16">
          <button
            onClick={triggerReturnToLobby}
            className="inline-flex items-center gap-2 rounded-full bg-card border border-primary/40 px-4 py-2 text-sm text-cream hover:text-primary hover:border-primary transition"
          >
            <Home className="h-4 w-4" /> Return to Lobby
          </button>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs text-muted-foreground">{userEmail}</span>
            <Button variant="outline" size="sm" onClick={signOut} className="border-primary/40 text-cream">
              <LogOut className="h-4 w-4 mr-1.5" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-10">
        <div className="mb-8">
          <h1 className="font-serif text-4xl text-cream">Staff Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Follow up with your assigned guests and confirm every move-in requirement before booking.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6 max-w-xl">
          <Stat label="Assigned" value={bookings.length} />
          <Stat label="Awaiting first contact" value={awaiting} highlight={awaiting > 0} />
          <Stat label="Booked" value={bookings.filter((b) => b.status === "booked").length} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex gap-2">
            {([["active", `Active · ${active.length}`], ["done", `Completed · ${done.length}`]] as [View, string][]).map(([k, label]) => (
              <button
                key={k}
                onClick={() => setView(k)}
                className={`px-3 py-1.5 rounded-full text-xs border transition ${view === k ? "bg-primary text-primary-foreground border-primary" : "border-border/60 text-muted-foreground hover:text-cream hover:border-primary/50"}`}
              >
                {label}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={load} className="border-primary/40 text-cream">
            <RefreshCw className="h-4 w-4 mr-1.5" /> Refresh
          </Button>
        </div>

        {shown.length === 0 ? (
          <div className="p-10 rounded-xl border border-border/60 bg-card text-center text-muted-foreground">
            <Inbox className="h-10 w-10 text-primary/70 mx-auto mb-3" strokeWidth={1.5} />
            {view === "active"
              ? "No booking requests assigned to you yet. New requests appear here once an administrator assigns them."
              : "No completed follow-ups yet."}
          </div>
        ) : (
          <div className="grid gap-4">
            {shown.map((b) => (
              <BookingCard key={b.id} booking={b} onChanged={onChanged} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const Stat = ({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) => (
  <div className={`p-4 rounded-xl bg-card border ${highlight ? "border-primary/60" : "border-border/60"}`}>
    <p className="font-serif text-3xl text-cream">{value}</p>
    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">{label}</p>
  </div>
);

export default Staff;
