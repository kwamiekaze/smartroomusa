import { supabase } from "@/integrations/supabase/client";

export interface Booking {
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
  assigned_to: string | null;
  assigned_at: string | null;
  status: BookingStatus;
  req_id_verified: boolean;
  req_income_verified: boolean;
  req_week_rent_paid: boolean;
  req_deposit_paid: boolean;
  req_admin_fee_paid: boolean;
  staff_notes: string | null;
  last_contacted_at: string | null;
  updated_at: string;
}

export type BookingStatus =
  | "new"
  | "assigned"
  | "contacted"
  | "in_progress"
  | "qualified"
  | "not_qualified"
  | "booked"
  | "closed";

export type RequirementKey =
  | "req_id_verified"
  | "req_income_verified"
  | "req_week_rent_paid"
  | "req_deposit_paid"
  | "req_admin_fee_paid";

/** Mirrors the move-in requirements shown on the public site. */
export const REQUIREMENTS: { key: RequirementKey; label: string; hint: string }[] = [
  { key: "req_id_verified", label: "Valid Identification", hint: "Government-issued photo ID verified" },
  { key: "req_income_verified", label: "Proof of Income", hint: "Pay stub, offer letter or income statement" },
  { key: "req_week_rent_paid", label: "One Week Rent", hint: "First week paid up front" },
  { key: "req_deposit_paid", label: "$200 Security Deposit", hint: "Refundable deposit collected" },
  { key: "req_admin_fee_paid", label: "$89 Admin & Application Fee", hint: "One-time fee collected" },
];

export const STATUS_LABEL: Record<BookingStatus, string> = {
  new: "New · Unassigned",
  assigned: "Assigned",
  contacted: "Guest Contacted",
  in_progress: "Collecting Requirements",
  qualified: "Qualified",
  not_qualified: "Not Qualified",
  booked: "Booked",
  closed: "Closed",
};

/** Statuses a staff member may move a booking to. */
export const STAFF_STATUSES: BookingStatus[] = [
  "contacted",
  "in_progress",
  "qualified",
  "not_qualified",
  "booked",
  "closed",
];

export const STATUS_STYLE: Record<BookingStatus, string> = {
  new: "border-amber-500/50 text-amber-400",
  assigned: "border-sky-400/50 text-sky-300",
  contacted: "border-sky-400/50 text-sky-300",
  in_progress: "border-primary/50 text-primary",
  qualified: "border-emerald-500/50 text-emerald-400",
  not_qualified: "border-destructive/50 text-destructive",
  booked: "border-emerald-500/60 text-emerald-300",
  closed: "border-border text-muted-foreground",
};

export const requirementsMet = (b: Booking) => REQUIREMENTS.filter((r) => b[r.key]).length;
export const allRequirementsMet = (b: Booking) => requirementsMet(b) === REQUIREMENTS.length;

export async function fetchBookings() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as Booking[];
}

/** Returns the dashboard route for a signed-in user. */
export async function dashboardRouteFor(userId: string): Promise<"/admin" | "/staff" | "/pending"> {
  const { data: roleRow } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (roleRow) return "/admin";
  const { data: profile } = await supabase
    .from("profiles")
    .select("status, assigned_role")
    .eq("user_id", userId)
    .maybeSingle();
  if (profile?.status === "approved" && profile?.assigned_role === "staff") return "/staff";
  return "/pending";
}
