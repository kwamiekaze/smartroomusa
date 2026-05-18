GRANT INSERT ON public.bookings TO anon, authenticated;
GRANT SELECT (id) ON public.bookings TO anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;