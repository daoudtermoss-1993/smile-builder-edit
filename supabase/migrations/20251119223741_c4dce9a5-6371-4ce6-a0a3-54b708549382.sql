-- Fix get_available_slots function to properly generate time series
DROP FUNCTION IF EXISTS public.get_available_slots(date);

CREATE OR REPLACE FUNCTION public.get_available_slots(check_date date)
RETURNS TABLE(slot_time time, is_available boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  day_num INTEGER;
BEGIN
  -- Convert day of week: 0=Sunday becomes 6, 1=Monday becomes 0, etc.
  day_num := CASE 
    WHEN EXTRACT(DOW FROM check_date) = 0 THEN 6  -- Sunday -> 6
    ELSE EXTRACT(DOW FROM check_date) - 1          -- Monday=0, Tuesday=1, etc.
  END;
  
  RETURN QUERY
  WITH time_series AS (
    SELECT (
      '2000-01-01'::timestamp + 
      (generate_series(0, 
        EXTRACT(EPOCH FROM (
          (SELECT MAX(end_time) FROM available_slots WHERE day_of_week = day_num AND is_active = true) - 
          (SELECT MIN(start_time) FROM available_slots WHERE day_of_week = day_num AND is_active = true)
        ))::integer / 1800) * interval '30 minutes'
      )
    )::time + (SELECT MIN(start_time) FROM available_slots WHERE day_of_week = day_num AND is_active = true) as slot_time
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