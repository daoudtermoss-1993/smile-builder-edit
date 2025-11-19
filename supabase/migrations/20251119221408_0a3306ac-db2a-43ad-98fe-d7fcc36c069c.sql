-- Create appointments table for confirmed bookings
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  patient_name TEXT NOT NULL,
  patient_email TEXT NOT NULL,
  patient_phone TEXT,
  service TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  source TEXT DEFAULT 'booking_form',
  google_calendar_event_id TEXT,
  CONSTRAINT valid_status CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed'))
);

-- Enable RLS
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Anyone can insert appointments (for booking)
CREATE POLICY "Anyone can insert appointments"
  ON public.appointments
  FOR INSERT
  WITH CHECK (true);

-- Authenticated users can view all appointments
CREATE POLICY "Authenticated users can view appointments"
  ON public.appointments
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Authenticated users can update appointments
CREATE POLICY "Authenticated users can update appointments"
  ON public.appointments
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Create available time slots table
CREATE TABLE public.available_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.available_slots ENABLE ROW LEVEL SECURITY;

-- Anyone can view available slots
CREATE POLICY "Anyone can view available slots"
  ON public.available_slots
  FOR SELECT
  USING (is_active = true);

-- Authenticated users can manage slots
CREATE POLICY "Authenticated users can manage slots"
  ON public.available_slots
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Insert default working hours (Sunday to Thursday, 9 AM to 5 PM)
INSERT INTO public.available_slots (day_of_week, start_time, end_time) VALUES
  (0, '09:00', '17:00'), -- Sunday
  (1, '09:00', '17:00'), -- Monday
  (2, '09:00', '17:00'), -- Tuesday
  (3, '09:00', '17:00'), -- Wednesday
  (4, '09:00', '17:00'); -- Thursday

-- Create function to get available time slots for a specific date
CREATE OR REPLACE FUNCTION public.get_available_slots(check_date DATE)
RETURNS TABLE (
  slot_time TIME,
  is_available BOOLEAN
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  day_num INTEGER;
BEGIN
  -- Get day of week (0 = Sunday, 6 = Saturday)
  day_num := EXTRACT(DOW FROM check_date);
  
  RETURN QUERY
  WITH time_series AS (
    SELECT generate_series(
      (SELECT MIN(start_time) FROM available_slots WHERE day_of_week = day_num AND is_active = true),
      (SELECT MAX(end_time) FROM available_slots WHERE day_of_week = day_num AND is_active = true),
      '30 minutes'::interval
    )::TIME as slot_time
  ),
  booked_slots AS (
    SELECT appointment_time
    FROM appointments
    WHERE appointment_date = check_date
    AND status IN ('pending', 'confirmed')
  )
  SELECT 
    ts.slot_time,
    CASE WHEN bs.appointment_time IS NULL THEN true ELSE false END as is_available
  FROM time_series ts
  LEFT JOIN booked_slots bs ON ts.slot_time = bs.appointment_time
  WHERE EXISTS (
    SELECT 1 FROM available_slots
    WHERE day_of_week = day_num
    AND is_active = true
    AND ts.slot_time >= start_time
    AND ts.slot_time < end_time
  )
  ORDER BY ts.slot_time;
END;
$$;