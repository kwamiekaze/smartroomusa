import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, LogOut, Mail, Phone, Calendar, MessageSquare, FileText, Check, X, UserCog } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { triggerReturnToLobby } from "@/components/SplashScreen";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

interface Profile {
  id: string;
  user_id: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  assigned_role: string | null;
  rejection_reason: string | null;
  created_at: string;
  reviewed_at: string | null;
}

const ROLES = ["applicant", "tenant", "landlord", "staff"] as const;

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [userEmail, setUserEmail] = useState<string>("");

  const loadProfiles = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setProfiles((data || []) as Profile[]);
  };

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth", { replace: true }); return; }
      setUserEmail(session.user.email || "");

      const { data: roleRow } = await supabase
        .from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin").maybeSingle();
      if (!mounted) return;
      if (!roleRow) {
        navigate("/pending", { replace: true });
        return;
      }
      setIsAdmin(true);

      const [{ data: rows, error }, _] = await Promise.all([
        supabase.from("bookings").select("*").order("created_at", { ascending: false }),
        loadProfiles(),
      ]);
      if (error) toast.error(error.message);
      else if (mounted) setBookings((rows || []) as Booking[]);
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

  const approveUser = async (p: Profile, role: string) => {
    if (!role) { toast.error("Please assign a role first."); return; }
    const { error } = await supabase
      .from("profiles")
      .update({ status: "approved", assigned_role: role, reviewed_at: new Date().toISOString(), rejection_reason: null })
      .eq("id", p.id);
    if (error) { toast.error(error.message); return; }
    toast.success(`${p.email} approved as ${role}`);
    loadProfiles();
  };

  const rejectUser = async (p: Profile, reason: string) => {
    const { error } = await supabase
      .from("profiles")
      .update({ status: "rejected", rejection_reason: reason || null, reviewed_at: new Date().toISOString() })
      .eq("id", p.id);
    if (error) { toast.error(error.message); return; }
    try {
      await supabase.functions.invoke("send-rejection-email", { body: { email: p.email, reason } });
    } catch { /* non-fatal */ }
    toast.success(`${p.email} rejected — notification email sent`);
    loadProfiles();
  };

  if (loading) {
    return <div className="min-h-screen grid place-items-center bg-background text-cream">Loading…</div>;
  }
  if (!isAdmin) return null;

  const pendingCount = profiles.filter((p) => p.status === "pending").length;

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
          <h1 className="font-serif text-4xl text-cream">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage bookings and member access.</p>
        </div>

        <Tabs defaultValue="users">
          <TabsList className="mb-6">
            <TabsTrigger value="users">
              Users {pendingCount > 0 && <span className="ml-2 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px]">{pendingCount}</span>}
            </TabsTrigger>
            <TabsTrigger value="bookings">Bookings ({bookings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UserList profiles={profiles} onApprove={approveUser} onReject={rejectUser} />
          </TabsContent>

          <TabsContent value="bookings">
            {bookings.length === 0 ? (
              <div className="p-10 rounded-xl border border-border/60 bg-card text-center text-muted-foreground">
                No submissions yet.
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
                        <Field icon={<Calendar className="h-4 w-4" />} label="Move-in"><span className="text-cream">{b.movein_date}</span></Field>
                      )}
                      {b.income && (
                        <Field icon={<FileText className="h-4 w-4" />} label="Proof of income"><span className="text-cream">{b.income}</span></Field>
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
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

const UserList = ({ profiles, onApprove, onReject }: {
  profiles: Profile[];
  onApprove: (p: Profile, role: string) => void;
  onReject: (p: Profile, reason: string) => void;
}) => {
  if (profiles.length === 0) {
    return (
      <div className="p-10 rounded-xl border border-border/60 bg-card text-center text-muted-foreground">
        No users yet.
      </div>
    );
  }
  return (
    <div className="grid gap-4">
      {profiles.map((p) => (
        <UserRow key={p.id} profile={p} onApprove={onApprove} onReject={onReject} />
      ))}
    </div>
  );
};

const UserRow = ({ profile, onApprove, onReject }: {
  profile: Profile;
  onApprove: (p: Profile, role: string) => void;
  onReject: (p: Profile, reason: string) => void;
}) => {
  const [role, setRole] = useState<string>(profile.assigned_role || "");
  const [reason, setReason] = useState<string>("");
  const [showReject, setShowReject] = useState(false);

  const statusColor = profile.status === "approved"
    ? "border-primary/50 text-primary"
    : profile.status === "rejected"
    ? "border-destructive/50 text-destructive"
    : "border-amber-500/50 text-amber-400";

  return (
    <article className="p-6 rounded-xl bg-card border border-border/60">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="font-serif text-xl text-cream">{profile.email}</h3>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-1">
            Joined {new Date(profile.created_at).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.2em] border ${statusColor}`}>
            {profile.status === "pending" ? "Pending Applicant" : profile.status}
          </span>
          {profile.assigned_role && (
            <span className="px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.2em] border border-primary/40 text-primary">
              {profile.assigned_role}
            </span>
          )}
        </div>
      </div>

      {profile.status !== "approved" && profile.assigned_role !== "admin" && (
        <div className="grid sm:grid-cols-[1fr_auto_auto] gap-3 items-start">
          <div className="flex items-center gap-2">
            <UserCog className="h-4 w-4 text-primary" />
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="bg-input"><SelectValue placeholder="Assign role…" /></SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button variant="gold" onClick={() => onApprove(profile, role)} disabled={!role}>
            <Check className="h-4 w-4 mr-1.5" /> Approve
          </Button>
          <Button variant="outline" onClick={() => setShowReject((s) => !s)} className="border-destructive/50 text-destructive">
            <X className="h-4 w-4 mr-1.5" /> Reject
          </Button>
        </div>
      )}

      {showReject && profile.status !== "approved" && (
        <div className="mt-4 space-y-2">
          <Textarea
            placeholder="Optional message explaining the rejection (sent to user via email)…"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="bg-input"
            rows={3}
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => { setShowReject(false); setReason(""); }}>Cancel</Button>
            <Button variant="destructive" onClick={() => { onReject(profile, reason); setShowReject(false); setReason(""); }}>
              Confirm rejection & email user
            </Button>
          </div>
        </div>
      )}

      {profile.status === "rejected" && profile.rejection_reason && (
        <div className="mt-4 p-3 rounded-lg bg-background/60 border border-border/40">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Rejection reason sent</p>
          <p className="text-cream/90 text-sm whitespace-pre-wrap">{profile.rejection_reason}</p>
        </div>
      )}
    </article>
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
