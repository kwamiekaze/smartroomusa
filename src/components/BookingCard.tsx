import { useEffect, useState } from "react";
import { Mail, Phone, Calendar, MessageSquare, FileText, UserCheck, PhoneCall, Save, CheckCircle2, Circle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  Booking,
  BookingStatus,
  REQUIREMENTS,
  RequirementKey,
  STAFF_STATUSES,
  STATUS_LABEL,
  STATUS_STYLE,
} from "@/lib/bookingWorkflow";

export interface StaffMember {
  user_id: string;
  email: string;
}

const UNASSIGNED = "__unassigned";

interface Props {
  booking: Booking;
  /** Admin only: list of approved staff, enables assignment control. */
  staff?: StaffMember[];
  onChanged: (b: Booking) => void;
}

export const BookingCard = ({ booking: b, staff, onChanged }: Props) => {
  const isAdminView = !!staff;
  const [reqs, setReqs] = useState<Record<RequirementKey, boolean>>(() => pickReqs(b));
  const [status, setStatus] = useState<BookingStatus>(b.status);
  const [notes, setNotes] = useState(b.staff_notes || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setReqs(pickReqs(b));
    setStatus(b.status);
    setNotes(b.staff_notes || "");
  }, [b]);

  const met = REQUIREMENTS.filter((r) => reqs[r.key]).length;
  const allMet = met === REQUIREMENTS.length;
  const dirty =
    status !== b.status ||
    (notes || "") !== (b.staff_notes || "") ||
    REQUIREMENTS.some((r) => reqs[r.key] !== b[r.key]);
  const assignee = staff?.find((s) => s.user_id === b.assigned_to);
  const canFollowUp = !!b.assigned_to;

  const update = async (patch: Partial<Booking>, success: string) => {
    setSaving(true);
    const { data, error } = await supabase.from("bookings").update(patch).eq("id", b.id).select("*").single();
    setSaving(false);
    if (error) { toast.error(error.message); return false; }
    onChanged(data as Booking);
    toast.success(success);
    return true;
  };

  const assign = (value: string) => {
    const to = value === UNASSIGNED ? null : value;
    if (to === b.assigned_to) return;
    const who = staff?.find((s) => s.user_id === to)?.email;
    update({ assigned_to: to }, to ? `Assigned to ${who}` : "Booking unassigned");
  };

  const save = () => {
    if (status === "booked" && !allMet) {
      toast.error("All move-in requirements must be checked before marking as Booked.");
      return;
    }
    update({ ...reqs, status, staff_notes: notes || null }, "Follow-up saved");
  };

  const logContact = () => {
    const patch: Partial<Booking> = { last_contacted_at: new Date().toISOString() };
    if (b.status === "assigned") patch.status = "contacted";
    update(patch, "Contact logged");
  };

  const statusOptions: BookingStatus[] = isAdminView
    ? (["new", "assigned", ...STAFF_STATUSES] as BookingStatus[])
    : Array.from(new Set([b.status, ...STAFF_STATUSES]));

  return (
    <article className="p-6 rounded-xl bg-card border border-border/60 hover:border-primary/50 transition">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="font-serif text-2xl text-cream">{b.name}</h2>
          <p className="text-xs uppercase tracking-[0.2em] text-primary mt-1">
            {b.source === "tour" ? "Tour request" : "Booking"} · {new Date(b.created_at).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.2em] border ${STATUS_STYLE[b.status]}`}>
            {STATUS_LABEL[b.status]}
          </span>
          {b.room_id && (
            <span className="px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.2em] border border-primary/40 text-primary">
              Room: {b.room_id}
            </span>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 text-sm">
        <Field icon={<Mail className="h-4 w-4" />} label="Email">
          <a href={`mailto:${b.email}`} className="text-cream hover:text-primary break-all">{b.email}</a>
        </Field>
        <Field icon={<Phone className="h-4 w-4" />} label="Phone">
          <a href={`tel:${b.phone}`} className="text-cream hover:text-primary">{b.phone}</a>
        </Field>
        {b.movein_date && (
          <Field icon={<Calendar className="h-4 w-4" />} label="Move-in"><span className="text-cream">{b.movein_date}</span></Field>
        )}
        {b.income && (
          <Field icon={<FileText className="h-4 w-4" />} label="Proof of income (stated)"><span className="text-cream">{b.income}</span></Field>
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

      {isAdminView && (
        <div className="mt-5 p-4 rounded-lg border border-primary/30 bg-background/40 grid sm:grid-cols-[auto_1fr] gap-3 items-center">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <UserCheck className="h-4 w-4 text-primary" /> Assigned staff
          </div>
          <Select value={b.assigned_to || UNASSIGNED} onValueChange={assign} disabled={saving}>
            <SelectTrigger className="bg-input"><SelectValue placeholder="Assign to staff…" /></SelectTrigger>
            <SelectContent>
              <SelectItem value={UNASSIGNED}>Unassigned (hidden from staff)</SelectItem>
              {staff!.map((s) => (
                <SelectItem key={s.user_id} value={s.user_id}>{s.email}</SelectItem>
              ))}
              {b.assigned_to && !assignee && (
                <SelectItem value={b.assigned_to} disabled>Former staff member</SelectItem>
              )}
            </SelectContent>
          </Select>
          {staff!.length === 0 && (
            <p className="sm:col-span-2 text-xs text-muted-foreground">
              No approved staff yet. Approve a user with the Staff role in the Users tab.
            </p>
          )}
          {b.assigned_at && (
            <p className="sm:col-span-2 text-xs text-muted-foreground">
              Assigned {new Date(b.assigned_at).toLocaleString()}
              {assignee ? ` to ${assignee.email}` : ""}
            </p>
          )}
        </div>
      )}

      {canFollowUp && (
        <div className="mt-5 pt-5 border-t border-border/40">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Move-in requirements · <span className={allMet ? "text-emerald-400" : "text-primary"}>{met}/{REQUIREMENTS.length} met</span>
            </p>
            <p className="text-xs text-muted-foreground">
              {b.last_contacted_at ? `Last contacted ${new Date(b.last_contacted_at).toLocaleString()}` : "Not contacted yet"}
            </p>
          </div>
          <div className="h-1.5 rounded-full bg-background/60 overflow-hidden mb-4">
            <div className="h-full bg-gradient-gold transition-all" style={{ width: `${(met / REQUIREMENTS.length) * 100}%` }} />
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {REQUIREMENTS.map((r) => (
              <label
                key={r.key}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${reqs[r.key] ? "border-emerald-500/40 bg-emerald-500/5" : "border-border/40 bg-background/40 hover:border-primary/40"}`}
              >
                <Checkbox
                  checked={reqs[r.key]}
                  onCheckedChange={(v) => setReqs((p) => ({ ...p, [r.key]: v === true }))}
                  className="mt-0.5"
                />
                <span>
                  <span className="block text-sm text-cream">{r.label}</span>
                  <span className="block text-xs text-muted-foreground">{r.hint}</span>
                </span>
              </label>
            ))}
          </div>

          <div className="mt-4 grid sm:grid-cols-[220px_1fr] gap-3">
            <Select value={status} onValueChange={(v) => setStatus(v as BookingStatus)}>
              <SelectTrigger className="bg-input"><SelectValue /></SelectTrigger>
              <SelectContent>
                {statusOptions.map((s) => (
                  <SelectItem key={s} value={s} disabled={s === "booked" && !allMet}>
                    {STATUS_LABEL[s]}{s === "booked" && !allMet ? " (requirements needed)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Follow-up notes (calls, documents received, payment method…)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-input"
              rows={2}
            />
          </div>

          <div className="mt-3 flex flex-wrap justify-end gap-2">
            <Button variant="outline" onClick={logContact} disabled={saving} className="border-primary/40 text-cream">
              <PhoneCall className="h-4 w-4 mr-1.5" /> Log contact
            </Button>
            <Button variant="gold" onClick={save} disabled={saving || !dirty}>
              <Save className="h-4 w-4 mr-1.5" /> Save follow-up
            </Button>
          </div>
        </div>
      )}

      {isAdminView && !canFollowUp && (
        <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Circle className="h-3.5 w-3.5" /> Not visible to any staff until assigned.
        </p>
      )}
      {isAdminView && canFollowUp && b.status === "booked" && (
        <p className="mt-3 flex items-center gap-2 text-xs text-emerald-400">
          <CheckCircle2 className="h-3.5 w-3.5" /> All requirements met · guest booked.
        </p>
      )}
    </article>
  );
};

function pickReqs(b: Booking) {
  return Object.fromEntries(REQUIREMENTS.map((r) => [r.key, !!b[r.key]])) as Record<RequirementKey, boolean>;
}

const Field = ({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) => (
  <div className="flex items-start gap-2">
    <span className="text-primary mt-0.5">{icon}</span>
    <div className="min-w-0">
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <div className="mt-0.5">{children}</div>
    </div>
  </div>
);
