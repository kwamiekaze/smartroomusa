import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, LogOut, Mail, Phone, Calendar, MessageSquare, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { triggerReturnToLobby } from "@/components/SplashScreen";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Booking {
  id: string;
  name: string;
  phone: string;
  email: string;
  movein_date: string | null;
  income: string | null;
  message: string | null;
  source: string;
  room_id: string | null;
  created_at: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth", { replace: true });
        return;
      }
      setUserEmail(session.user.email || "");

      const { data: roleRow } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!mounted) return;

      if (!roleRow) {
        toast.error("This account does not have admin access.");
        await supabase.auth.signOut();
        navigate("/auth", { replace: true });
        return;
      }

      setIsAdmin(true);

      const { data: rows, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        toast.error(error.message);
      } else if (mounted) {
        setBookings((rows || []) as Booking[]);
      }
      if (mounted) setLoading(false);
    };

    init();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate("/auth", { replace: true });
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth", { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background text-cream">Loading…</div>
    );
  }
  if (!isAdmin) return null;

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
          <h1 className="font-serif text-4xl text-cream">Bookings</h1>
          <p className="text-muted-foreground mt-1">{bookings.length} total submission{bookings.length === 1 ? "" : "s"}</p>
        </div>

        {bookings.length === 0 ? (
          <div className="p-10 rounded-xl border border-border/60 bg-card text-center text-muted-foreground">
            No submissions yet. New booking and tour requests will appear here.
          </div>
        ) : (
          <div className="grid gap-4">
            {bookings.map((b) => (
              <article key={b.id} className="p-6 rounded-xl bg-card border border-border/60 hover:border-primary/50 transition">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <h2 className="font-serif text-2xl text-cream">{b.name}</h2>
                    <p className="text-xs uppercase tracking-[0.2em] text-primary mt-1">
                      {b.source === "tour" ? "Tour request" : "Booking"} · {new Date(b.created_at).toLocaleString()}
                    </p>
                  </div>
                  {b.room_id && (
                    <span className="px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.2em] border border-primary/40 text-primary">
                      Room: {b.room_id}
                    </span>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <Field icon={<Mail className="h-4 w-4" />} label="Email">
                    <a href={`mailto:${b.email}`} className="text-cream hover:text-primary">{b.email}</a>
                  </Field>
                  <Field icon={<Phone className="h-4 w-4" />} label="Phone">
                    <a href={`tel:${b.phone}`} className="text-cream hover:text-primary">{b.phone}</a>
                  </Field>
                  {b.movein_date && (
                    <Field icon={<Calendar className="h-4 w-4" />} label="Move-in">
                      <span className="text-cream">{b.movein_date}</span>
                    </Field>
                  )}
                  {b.income && (
                    <Field icon={<FileText className="h-4 w-4" />} label="Proof of income">
                      <span className="text-cream">{b.income}</span>
                    </Field>
                  )}
                </div>

                {b.message && (
                  <div className="mt-4 p-4 rounded-lg bg-background/60 border border-border/40">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                      <MessageSquare className="h-3.5 w-3.5" /> Message
                    </div>
                    <p className="text-cream/90 whitespace-pre-wrap">{b.message}</p>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const Field = ({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) => (
  <div className="flex items-start gap-2">
    <span className="text-primary mt-0.5">{icon}</span>
    <div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <div className="mt-0.5">{children}</div>
    </div>
  </div>
);

export default Admin;
