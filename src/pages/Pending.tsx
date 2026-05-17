import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, LogOut, Clock, XCircle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { triggerReturnToLobby } from "@/components/SplashScreen";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Profile {
  status: "pending" | "approved" | "rejected";
  assigned_role: string | null;
  rejection_reason: string | null;
  email: string;
}

const ROLE_LABEL: Record<string, string> = {
  applicant: "Applicant",
  tenant: "Tenant",
  landlord: "Landlord",
  staff: "Staff",
  admin: "Administrator",
};

const Pending = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth", { replace: true });
        return;
      }
      const { data: roleRow } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (roleRow) {
        navigate("/admin", { replace: true });
        return;
      }
      const { data, error } = await supabase
        .from("profiles")
        .select("status, assigned_role, rejection_reason, email")
        .eq("user_id", session.user.id)
        .maybeSingle();
      if (!mounted) return;
      if (error) toast.error(error.message);
      setProfile((data as Profile) ?? { status: "pending", assigned_role: null, rejection_reason: null, email: session.user.email || "" });
      setLoading(false);
    };
    load();
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

  const status = profile?.status ?? "pending";

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <button
        type="button"
        onClick={triggerReturnToLobby}
        className="fixed top-6 left-4 z-40 inline-flex items-center gap-2 rounded-full bg-background/70 backdrop-blur-md border border-primary/40 px-4 py-2 text-sm text-cream hover:text-primary hover:border-primary transition-colors"
      >
        <Home className="h-4 w-4" /> Return to Lobby
      </button>

      <div className="w-full max-w-lg p-10 rounded-2xl bg-card border border-primary/30 shadow-elegant text-center">
        {status === "pending" && (
          <>
            <Clock className="h-12 w-12 text-primary mx-auto mb-4" strokeWidth={1.5} />
            <h1 className="font-serif text-3xl text-cream mb-2">Pending Applicant</h1>
            <p className="text-muted-foreground">
              Welcome, <span className="text-cream">{profile?.email}</span>. Your account is awaiting review by a SmartRoomUSA administrator. You'll be notified by email once a role has been assigned.
            </p>
          </>
        )}
        {status === "approved" && (
          <>
            <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" strokeWidth={1.5} />
            <h1 className="font-serif text-3xl text-cream mb-2">Account Approved</h1>
            <p className="text-muted-foreground">
              You've been assigned the role of <span className="text-primary font-medium">{ROLE_LABEL[profile?.assigned_role || ""] || profile?.assigned_role}</span>.
            </p>
          </>
        )}
        {status === "rejected" && (
          <>
            <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" strokeWidth={1.5} />
            <h1 className="font-serif text-3xl text-cream mb-2">Application Not Approved</h1>
            {profile?.rejection_reason && (
              <div className="mt-4 p-4 rounded-lg bg-background/60 border border-border/40 text-left">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Reason</p>
                <p className="text-cream/90 whitespace-pre-wrap">{profile.rejection_reason}</p>
              </div>
            )}
          </>
        )}

        <Button variant="outline" onClick={signOut} className="mt-8 border-primary/40 text-cream">
          <LogOut className="h-4 w-4 mr-1.5" /> Sign out
        </Button>
      </div>
    </div>
  );
};

export default Pending;
