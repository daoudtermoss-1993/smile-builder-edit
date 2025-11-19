-- Create leads table for storing chatbot and form submissions
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  source TEXT DEFAULT 'chatbot',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert leads (public form)
CREATE POLICY "Anyone can insert leads"
ON public.leads
FOR INSERT
WITH CHECK (true);

-- Create policy for viewing leads (authenticated users only)
CREATE POLICY "Authenticated users can view leads"
ON public.leads
FOR SELECT
USING (auth.role() = 'authenticated');

-- Create index for performance
CREATE INDEX idx_leads_created_at ON public.leads(created_at DESC);