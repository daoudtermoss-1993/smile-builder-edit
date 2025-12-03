-- Remove duplicate RLS policy for leads
DROP POLICY IF EXISTS "Authenticated users can view leads" ON public.leads;