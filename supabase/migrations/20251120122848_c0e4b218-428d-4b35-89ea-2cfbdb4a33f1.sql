-- Fix appointment booking for public users (non-authenticated)
-- The current policy requires authentication which prevents public bookings

DROP POLICY IF EXISTS "Authenticated users can create appointments" ON public.appointments;

-- Allow anyone (authenticated or not) to create appointments
CREATE POLICY "Anyone can create appointments"
ON public.appointments
FOR INSERT
WITH CHECK (true);