-- Staff booking assignment
-- Admin assigns booking requests to approved Staff. Staff can ONLY see a
-- booking after it has been assigned to them, and can only update follow-up
-- fields (status, requirement checklist, notes). Assignment itself is admin-only.

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS assigned_by uuid,
  ADD COLUMN IF NOT EXISTS assigned_at timestamptz,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS req_id_verified boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS req_income_verified boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS req_week_rent_paid boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS req_deposit_paid boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS req_admin_fee_paid boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS staff_notes text,
  ADD COLUMN IF NOT EXISTS last_contacted_at timestamptz,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
ALTER TABLE public.bookings ADD CONSTRAINT bookings_status_check
  CHECK (status IN ('new','assigned','contacted','in_progress','qualified','not_qualified','booked','closed'));

CREATE INDEX IF NOT EXISTS idx_bookings_assigned_to ON public.bookings (assigned_to);

-- Approved staff check (security definer avoids RLS recursion on profiles)
CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = _user_id AND status = 'approved' AND assigned_role = 'staff'
  )
$$;

-- Staff: read only bookings assigned to them
DROP POLICY IF EXISTS "Staff can view assigned bookings" ON public.bookings;
CREATE POLICY "Staff can view assigned bookings"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (assigned_to = auth.uid() AND public.is_staff(auth.uid()));

-- Staff: update only bookings assigned to them (field limits enforced by trigger)
DROP POLICY IF EXISTS "Staff can update assigned bookings" ON public.bookings;
CREATE POLICY "Staff can update assigned bookings"
  ON public.bookings FOR UPDATE
  TO authenticated
  USING (assigned_to = auth.uid() AND public.is_staff(auth.uid()))
  WITH CHECK (assigned_to = auth.uid() AND public.is_staff(auth.uid()));

-- Guard + bookkeeping trigger
CREATE OR REPLACE FUNCTION public.bookings_before_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _is_admin boolean := auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin');
BEGIN
  IF NOT _is_admin THEN
    -- Staff may not reassign or alter the guest's original submission
    IF NEW.assigned_to IS DISTINCT FROM OLD.assigned_to
       OR NEW.assigned_by IS DISTINCT FROM OLD.assigned_by
       OR NEW.assigned_at IS DISTINCT FROM OLD.assigned_at
       OR NEW.name IS DISTINCT FROM OLD.name
       OR NEW.phone IS DISTINCT FROM OLD.phone
       OR NEW.email IS DISTINCT FROM OLD.email
       OR NEW.movein_date IS DISTINCT FROM OLD.movein_date
       OR NEW.income IS DISTINCT FROM OLD.income
       OR NEW.message IS DISTINCT FROM OLD.message
       OR NEW.source IS DISTINCT FROM OLD.source
       OR NEW.room_id IS DISTINCT FROM OLD.room_id
       OR NEW.created_at IS DISTINCT FROM OLD.created_at
       OR NEW.email_sent IS DISTINCT FROM OLD.email_sent
       OR NEW.email_error IS DISTINCT FROM OLD.email_error THEN
      RAISE EXCEPTION 'Staff can only update follow-up fields on assigned bookings';
    END IF;
    IF NEW.status IN ('new','assigned') AND NEW.status IS DISTINCT FROM OLD.status THEN
      RAISE EXCEPTION 'Staff cannot set status to %', NEW.status;
    END IF;
    IF NEW.status = 'booked' AND NOT (NEW.req_id_verified AND NEW.req_income_verified
        AND NEW.req_week_rent_paid AND NEW.req_deposit_paid AND NEW.req_admin_fee_paid) THEN
      RAISE EXCEPTION 'All move-in requirements must be met before marking as booked';
    END IF;
  END IF;

  -- Assignment bookkeeping
  IF NEW.assigned_to IS DISTINCT FROM OLD.assigned_to THEN
    IF NEW.assigned_to IS NULL THEN
      NEW.assigned_by := NULL;
      NEW.assigned_at := NULL;
      IF NEW.status = 'assigned' THEN NEW.status := 'new'; END IF;
    ELSE
      NEW.assigned_by := auth.uid();
      NEW.assigned_at := now();
      IF NEW.status = 'new' THEN NEW.status := 'assigned'; END IF;
    END IF;
  END IF;

  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS bookings_before_update ON public.bookings;
CREATE TRIGGER bookings_before_update
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.bookings_before_update();

-- Public inserts must never pre-assign or pre-qualify a booking
CREATE OR REPLACE FUNCTION public.bookings_before_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'admin') THEN
    NEW.assigned_to := NULL;
    NEW.assigned_by := NULL;
    NEW.assigned_at := NULL;
    NEW.status := 'new';
    NEW.req_id_verified := false;
    NEW.req_income_verified := false;
    NEW.req_week_rent_paid := false;
    NEW.req_deposit_paid := false;
    NEW.req_admin_fee_paid := false;
    NEW.staff_notes := NULL;
    NEW.last_contacted_at := NULL;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS bookings_before_insert ON public.bookings;
CREATE TRIGGER bookings_before_insert
  BEFORE INSERT ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.bookings_before_insert();

REVOKE EXECUTE ON FUNCTION public.bookings_before_update() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.bookings_before_insert() FROM PUBLIC, anon, authenticated;
