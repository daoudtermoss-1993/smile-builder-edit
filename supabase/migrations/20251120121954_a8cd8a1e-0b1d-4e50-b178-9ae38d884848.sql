-- Fix security warning: Add search_path to trigger function
CREATE OR REPLACE FUNCTION public.update_site_analytics_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;