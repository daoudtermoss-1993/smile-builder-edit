-- Create table for tracking site visitors
CREATE TABLE IF NOT EXISTS public.site_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
  visit_count INTEGER NOT NULL DEFAULT 1,
  unique_visitors INTEGER NOT NULL DEFAULT 1,
  page_views INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(visit_date)
);

-- Enable RLS
ALTER TABLE public.site_analytics ENABLE ROW LEVEL SECURITY;

-- Policy for admins to view analytics
CREATE POLICY "Admins can view analytics"
ON public.site_analytics
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create function to increment visitor count
CREATE OR REPLACE FUNCTION public.increment_visitor_count()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.site_analytics (visit_date, visit_count, unique_visitors, page_views)
  VALUES (CURRENT_DATE, 1, 1, 1)
  ON CONFLICT (visit_date)
  DO UPDATE SET
    visit_count = site_analytics.visit_count + 1,
    page_views = site_analytics.page_views + 1,
    updated_at = NOW();
END;
$$;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_site_analytics_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_site_analytics_updated_at
BEFORE UPDATE ON public.site_analytics
FOR EACH ROW
EXECUTE FUNCTION public.update_site_analytics_timestamp();