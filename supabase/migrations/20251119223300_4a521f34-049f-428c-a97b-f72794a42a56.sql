-- Mettre à jour la fonction get_available_slots pour utiliser 0=Lundi
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
  -- Convertir le jour de la semaine: 0=Dimanche devient 6, 1=Lundi devient 0, etc.
  day_num := CASE 
    WHEN EXTRACT(DOW FROM check_date) = 0 THEN 6  -- Dimanche -> 6
    ELSE EXTRACT(DOW FROM check_date) - 1          -- Lundi=0, Mardi=1, etc.
  END;
  
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