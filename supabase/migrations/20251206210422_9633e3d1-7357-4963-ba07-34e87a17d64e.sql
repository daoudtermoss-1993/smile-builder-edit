-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Admins can delete page content" ON public.page_content;
DROP POLICY IF EXISTS "Admins can insert page content" ON public.page_content;
DROP POLICY IF EXISTS "Admins can update page content" ON public.page_content;
DROP POLICY IF EXISTS "Anyone can view page content" ON public.page_content;

-- Recreate policies as PERMISSIVE (default)
CREATE POLICY "Anyone can view page content" 
ON public.page_content 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert page content" 
ON public.page_content 
FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update page content" 
ON public.page_content 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete page content" 
ON public.page_content 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));