import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { triggerReturnToLobby } from "@/components/SplashScreen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const routeForUser = async (userId: string) => {
    const { data: roleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    if (roleRow) {
      navigate("/admin", { replace: true });
    } else {
      navigate("/pending", { replace: true });
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) routeForUser(data.session.user.id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/pending` },
        });
        if (error) throw error;
        toast.success("Account created", { description: "You're set as a Pending Applicant until an admin assigns your role." });
        if (data.session?.user) await routeForUser(data.session.user.id);
        else navigate("/pending", { replace: true });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.session?.user) await routeForUser(data.session.user.id);
      }
    } catch (err: any) {
      toast.error(err?.message || "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <button
        type="button"
        onClick={triggerReturnToLobby}
        className="fixed top-6 left-4 z-40 inline-flex items-center gap-2 rounded-full bg-background/70 backdrop-blur-md border border-primary/40 px-4 py-2 text-sm text-cream hover:text-primary hover:border-primary transition-colors"
      >
        <Home className="h-4 w-4" /> Return to Lobby
      </button>

      <div className="w-full max-w-md p-8 rounded-2xl bg-card border border-primary/30 shadow-elegant">
        <h1 className="font-serif text-3xl text-cream text-center mb-6">
          {mode === "signup" ? "Create account" : "Sign in"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-cream">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="bg-input" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-cream">Password</Label>
            <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="bg-input" />
          </div>
          <Button type="submit" variant="gold" size="lg" className="w-full" disabled={busy}>
            {busy ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {mode === "signin" ? (
              <>First time? <button type="button" onClick={() => setMode("signup")} className="text-primary hover:underline">Create an account</button></>
            ) : (
              <>Already have an account? <button type="button" onClick={() => setMode("signin")} className="text-primary hover:underline">Sign in</button></>
            )}
          </p>
        </form>
      </div>
    </div>
  );
};

export default Auth;
