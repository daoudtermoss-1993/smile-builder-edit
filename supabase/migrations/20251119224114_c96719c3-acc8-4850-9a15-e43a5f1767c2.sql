-- Fix get_available_slots to use generate_series on timestamps (supported in Postgres)
DROP FUNCTION IF EXISTS public.get_available_slots(date);

CREATE OR REPLACE FUNCTION public.get_available_slots(check_date date)
RETURNS TABLE(slot_time time without time zone, is_available boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  day_num INTEGER;
BEGIN
  -- Map day of week: 0=Sunday -> 6, 1=Monday -> 0, etc.
  day_num := CASE 
    WHEN EXTRACT(DOW FROM check_date) = 0 THEN 6  -- Sunday -> 6
    ELSE EXTRACT(DOW FROM check_date) - 1          -- Monday=0, Tuesday=1, ...
  END;
  
  RETURN QUERY
  WITH bounds AS (
    SELECT 
      MIN(start_time) AS min_time,
      MAX(end_time)   AS max_time
    FROM available_slots
    WHERE day_of_week = day_num
      AND is_active = true
  ),
  time_series AS (
    SELECT 
      generate_series(
        (TIMESTAMP '2000-01-01' + bounds.min_time),
        (TIMESTAMP '2000-01-01' + bounds.max_time - INTERVAL '30 minutes'),
        INTERVAL '30 minutes'
      )::time AS slot_time
    FROM bounds
    WHERE bounds.min_time IS NOT NULL AND bounds.max_time IS NOT NULL
  ),
  booked_slots AS (
    SELECT appointment_time
    FROM appointments
    WHERE appointment_date = check_date
      AND status IN ('pending', 'confirmed')
  )
  SELECT 
    ts.slot_time,
    CASE WHEN bs.appointment_time IS NULL THEN true ELSE false END AS is_available
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