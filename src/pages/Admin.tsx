import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, LogOut, Check, X, UserCog, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { triggerReturnToLobby } from "@/components/SplashScreen";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { BookingCard, StaffMember } from "@/components/BookingCard";
import { Booking, fetchBookings } from "@/lib/bookingWorkflow";

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
  const [filter, setFilter] = useState<BookingFilter>("all");

  const loadBookings = async () => {
    try { setBookings(await fetchBookings()); }
    catch (e) { toast.error((e as Error)?.message || "Failed to load bookings"); }
  };

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

      await Promise.all([loadBookings(), loadProfiles()]);
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
  const staff: StaffMember[] = profiles
    .filter((p) => p.status === "approved" && p.assigned_role === "staff")
    .map((p) => ({ user_id: p.user_id, email: p.email }));
  const unassignedCount = bookings.filter((b) => !b.assigned_to).length;
  const filtered = bookings.filter((b) => FILTERS[filter].test(b));
  const onBookingChanged = (nb: Booking) => setBookings((list) => list.map((x) => (x.id === nb.id ? nb : x)));

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
          <p className="text-muted-foreground mt-1">Manage member access and assign booking requests to staff for follow-up.</p>
        </div>

        <Tabs defaultValue="users">
          <TabsList className="mb-6">
            <TabsTrigger value="users">
              Users {pendingCount > 0 && <span className="ml-2 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px]">{pendingCount}</span>}
            </TabsTrigger>
            <TabsTrigger value="bookings">
              Bookings ({bookings.length})
              {unassignedCount > 0 && <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-500 text-background text-[10px]">{unassignedCount} unassigned</span>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UserList profiles={profiles} onApprove={approveUser} onReject={rejectUser} />
          </TabsContent>

          <TabsContent value="bookings">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div className="flex flex-wrap gap-2">
                {(Object.keys(FILTERS) as BookingFilter[]).map((k) => {
                  const count = bookings.filter((b) => FILTERS[k].test(b)).length;
                  return (
                    <button
                      key={k}
                      onClick={() => setFilter(k)}
                      className={`px-3 py-1.5 rounded-full text-xs border transition ${filter === k ? "bg-primary text-primary-foreground border-primary" : "border-border/60 text-muted-foreground hover:text-cream hover:border-primary/50"}`}
                    >
                      {FILTERS[k].label} · {count}
                    </button>
                  );
                })}
              </div>
              <Button variant="outline" size="sm" onClick={loadBookings} className="border-primary/40 text-cream">
                <RefreshCw className="h-4 w-4 mr-1.5" /> Refresh
              </Button>
            </div>
            {filtered.length === 0 ? (
              <div className="p-10 rounded-xl border border-border/60 bg-card text-center text-muted-foreground">
                {bookings.length === 0 ? "No submissions yet." : "Nothing in this view."}
              </div>
            ) : (
              <div className="grid gap-4">
                {filtered.map((b) => (
                  <BookingCard key={b.id} booking={b} staff={staff} onChanged={onBookingChanged} />
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

      {profile.assigned_role !== "admin" && (
        <div className={`grid gap-3 items-start ${profile.status === "approved" ? "sm:grid-cols-[1fr_auto]" : "sm:grid-cols-[1fr_auto_auto]"}`}>
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
          {profile.status === "approved" ? (
            <Button variant="outline" onClick={() => onApprove(profile, role)} disabled={!role || role === profile.assigned_role} className="border-primary/40 text-cream">
              <UserCog className="h-4 w-4 mr-1.5" /> Change role
            </Button>
          ) : (
            <>
              <Button variant="gold" onClick={() => onApprove(profile, role)} disabled={!role}>
                <Check className="h-4 w-4 mr-1.5" /> Approve
              </Button>
              <Button variant="outline" onClick={() => setShowReject((s) => !s)} className="border-destructive/50 text-destructive">
                <X className="h-4 w-4 mr-1.5" /> Reject
              </Button>
            </>
          )}
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

type BookingFilter = "all" | "unassigned" | "assigned" | "booked";

const FILTERS: Record<BookingFilter, { label: string; test: (b: Booking) => boolean }> = {
  all: { label: "All", test: () => true },
  unassigned: { label: "Unassigned", test: (b) => !b.assigned_to },
  assigned: { label: "With staff", test: (b) => !!b.assigned_to && !["booked", "closed", "not_qualified"].includes(b.status) },
  booked: { label: "Booked", test: (b) => b.status === "booked" },
};

export default Admin;
