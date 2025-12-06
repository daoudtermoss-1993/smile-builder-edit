-- Create a public bucket for site images
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-images', 'site-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to view images in the bucket
CREATE POLICY "Anyone can view site images"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-images');

-- Allow admins to upload images
CREATE POLICY "Admins can upload site images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'site-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow admins to update images
CREATE POLICY "Admins can update site images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'site-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow admins to delete images
CREATE POLICY "Admins can delete site images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'site-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);