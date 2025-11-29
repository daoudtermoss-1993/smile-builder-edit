-- Enable pgvector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Create storage bucket for medical documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('medical-documents', 'medical-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Create table for storing documents and their metadata
CREATE TABLE IF NOT EXISTS public.medical_knowledge (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('pdf', 'url')),
  source_url TEXT,
  file_path TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.medical_knowledge ENABLE ROW LEVEL SECURITY;

-- Only admins can manage documents
CREATE POLICY "Admins can manage medical knowledge"
ON public.medical_knowledge
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create full-text search index for French content
CREATE INDEX medical_knowledge_content_search_idx ON public.medical_knowledge 
USING gin(to_tsvector('french', title || ' ' || content));

-- RLS policy for storage bucket - only admins
CREATE POLICY "Admins can upload medical documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'medical-documents' 
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can read medical documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'medical-documents' 
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete medical documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'medical-documents' 
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update medical documents"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'medical-documents' 
  AND public.has_role(auth.uid(), 'admin')
);

-- Function to search medical knowledge using full-text search
CREATE OR REPLACE FUNCTION public.search_medical_knowledge(
  search_query TEXT,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  source_type TEXT,
  source_url TEXT,
  rank REAL
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    mk.id,
    mk.title,
    mk.content,
    mk.source_type,
    mk.source_url,
    ts_rank(
      to_tsvector('french', mk.title || ' ' || mk.content),
      plainto_tsquery('french', search_query)
    ) AS rank
  FROM medical_knowledge mk
  WHERE to_tsvector('french', mk.title || ' ' || mk.content) @@ plainto_tsquery('french', search_query)
  ORDER BY rank DESC
  LIMIT match_count;
END;
$$;