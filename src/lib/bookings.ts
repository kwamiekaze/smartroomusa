import { supabase } from "@/integrations/supabase/client";

export interface BookingSubmission {
  name: string;
  phone: string;
  email: string;
  movein?: string;
  income?: string;
  message?: string;
  source?: "booking_form" | "tour";
  roomId?: string;
}

/**
 * Persists a booking to the database and triggers the notification email.
 * Returns the inserted booking id on success.
 */
export async function submitBooking(payload: BookingSubmission) {
  const { data, error } = await supabase
    .from("bookings")
    .insert({
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      movein_date: payload.movein || null,
      income: payload.income || null,
      message: payload.message || null,
      source: payload.source || "booking_form",
      room_id: payload.roomId || null,
    })
    .select("id")
    .single();

  if (error) throw error;

  // Fire-and-forget email (don't block UX on failure)
  supabase.functions
    .invoke("send-booking-email", {
      body: { id: data.id, ...payload },
    })
    .then(({ error: emailErr }) => {
      if (emailErr) console.warn("Notification email failed", emailErr);
    });

  return data.id as string;
}
