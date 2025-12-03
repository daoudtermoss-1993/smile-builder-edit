-- Fix RLS policies for leads table - restrict to admin only
DROP POLICY IF EXISTS "Authenticated users can view leads" ON public.leads;
DROP POLICY IF EXISTS "Leads are viewable by authenticated users" ON public.leads;
DROP POLICY IF EXISTS "Users can view leads" ON public.leads;

-- Create admin-only policy for viewing leads
CREATE POLICY "Only admins can view leads" 
ON public.leads 
FOR SELECT 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'));

-- Keep insert policy for public lead submission
DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;
CREATE POLICY "Anyone can insert leads" 
ON public.leads 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Only admins can update/delete leads
DROP POLICY IF EXISTS "Only admins can update leads" ON public.leads;
CREATE POLICY "Only admins can update leads" 
ON public.leads 
FOR UPDATE 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Only admins can delete leads" ON public.leads;
CREATE POLICY "Only admins can delete leads" 
ON public.leads 
FOR DELETE 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'));