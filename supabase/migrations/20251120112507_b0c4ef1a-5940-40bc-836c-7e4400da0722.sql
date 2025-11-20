-- ============================================
-- COMPREHENSIVE SECURITY FIX MIGRATION
-- ============================================

-- 1. CREATE RATE LIMITING TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL, -- IP address or user ID
  action TEXT NOT NULL, -- e.g., 'booking', 'lead', 'voice_session'
  attempt_count INTEGER NOT NULL DEFAULT 1,
  first_attempt_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_attempt_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  blocked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier_action 
ON public.rate_limits(identifier, action);

CREATE INDEX IF NOT EXISTS idx_rate_limits_last_attempt 
ON public.rate_limits(last_attempt_at);

-- Enable RLS on rate_limits (admin only access)
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Only admins can view rate limits
CREATE POLICY "Admins can view rate limits"
ON public.rate_limits FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. FIX APPOINTMENTS TABLE RLS POLICIES
-- ============================================

-- Drop the dangerous public insert policy
DROP POLICY IF EXISTS "Anyone can insert appointments" ON public.appointments;

-- Add secure policy: Only authenticated users can insert appointments
-- (Edge function will use service role to bypass this)
CREATE POLICY "Authenticated users can create appointments"
ON public.appointments FOR INSERT
TO authenticated
WITH CHECK (true);

-- Keep existing admin policies
-- (Already exists: Admins can view all, update all, delete all)

-- 3. FIX AVAILABLE_SLOTS TABLE RLS POLICIES
-- ============================================

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can manage slots" ON public.available_slots;

-- Restrict modifications to admin only
CREATE POLICY "Admins can manage all slots"
ON public.available_slots FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Public read access already exists: "Anyone can view available slots"

-- 4. FIX LEADS TABLE RLS POLICIES
-- ============================================

-- Enable RLS if not already enabled
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Drop any overly permissive policies
DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;

-- Only authenticated users can insert leads
CREATE POLICY "Authenticated users can create leads"
ON public.leads FOR INSERT
TO authenticated
WITH CHECK (true);

-- Admins can view all leads
CREATE POLICY "Admins can view all leads"
ON public.leads FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 5. CREATE RATE LIMITING FUNCTION
-- ============================================

CREATE OR REPLACE FUNCTION public.check_rate_limit(
  _identifier TEXT,
  _action TEXT,
  _max_attempts INTEGER DEFAULT 5,
  _time_window_minutes INTEGER DEFAULT 60
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_record RECORD;
  v_window_start TIMESTAMP WITH TIME ZONE;
BEGIN
  v_window_start := now() - (_time_window_minutes || ' minutes')::INTERVAL;
  
  -- Get existing rate limit record
  SELECT * INTO v_record
  FROM public.rate_limits
  WHERE identifier = _identifier
    AND action = _action
  FOR UPDATE;
  
  -- If blocked, check if block expired
  IF v_record.blocked_until IS NOT NULL AND v_record.blocked_until > now() THEN
    RETURN FALSE; -- Still blocked
  END IF;
  
  -- If record doesn't exist or is outside time window, create new
  IF v_record IS NULL OR v_record.last_attempt_at < v_window_start THEN
    INSERT INTO public.rate_limits (identifier, action, attempt_count, first_attempt_at, last_attempt_at)
    VALUES (_identifier, _action, 1, now(), now())
    ON CONFLICT (id) DO NOTHING;
    RETURN TRUE;
  END IF;
  
  -- Increment attempt count
  IF v_record.attempt_count >= _max_attempts THEN
    -- Block for 1 hour
    UPDATE public.rate_limits
    SET blocked_until = now() + INTERVAL '1 hour',
        last_attempt_at = now()
    WHERE id = v_record.id;
    RETURN FALSE; -- Rate limit exceeded
  ELSE
    -- Increment counter
    UPDATE public.rate_limits
    SET attempt_count = attempt_count + 1,
        last_attempt_at = now()
    WHERE id = v_record.id;
    RETURN TRUE; -- Within limit
  END IF;
END;
$$;

-- 6. CREATE CLEANUP FUNCTION FOR OLD RATE LIMIT RECORDS
-- ============================================

CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete records older than 7 days
  DELETE FROM public.rate_limits
  WHERE last_attempt_at < now() - INTERVAL '7 days';
END;
$$;

-- Add comment explaining the security improvements
COMMENT ON TABLE public.rate_limits IS 'Rate limiting table to prevent abuse of public endpoints. Tracks attempts by IP address or user ID.';
COMMENT ON FUNCTION public.check_rate_limit IS 'Checks if an action is rate limited. Returns TRUE if allowed, FALSE if blocked.';
COMMENT ON FUNCTION public.cleanup_old_rate_limits IS 'Cleans up rate limit records older than 7 days. Should be run periodically.';