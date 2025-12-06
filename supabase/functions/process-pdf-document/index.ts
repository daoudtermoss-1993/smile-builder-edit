import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { encodeBase64 } from "https://deno.land/std@0.224.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    // Get the JWT token from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Create client with user's token to verify identity
    const userSupabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await userSupabase.auth.getUser();
    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Check if user has admin role using service role client
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: hasAdminRole, error: roleError } = await supabase
      .rpc('has_role', { _user_id: user.id, _role: 'admin' });
    
    if (roleError || !hasAdminRole) {
      console.error('Role check failed:', roleError);
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { filePath, title, metadata } = await req.json();
    
    console.log('Processing PDF document (admin verified):', { filePath: filePath?.substring(0, 50), title: title?.substring(0, 50) });

    // Download the PDF from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('medical-documents')
      .download(filePath);

    if (downloadError) {
      console.error('Error downloading file:', downloadError);
      throw new Error('Failed to download PDF file');
    }

    // Convert to base64 safely for large files
    const arrayBuffer = await fileData.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const base64Pdf = encodeBase64(uint8Array);

    const apiKey = Deno.env.get('PDF_CO_API_KEY');
    if (!apiKey) {
      throw new Error('PDF_CO_API_KEY is required. Please add your PDF.co API key in secrets.');
    }

    // Step 1: Upload file to PDF.co temporary storage
    const uploadResponse = await fetch('https://api.pdf.co/v1/file/upload/base64', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        file: base64Pdf,
        name: filePath,
      }),
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('PDF upload failed:', errorText);
      throw new Error(`Failed to upload PDF to PDF.co: ${errorText}`);
    }

    const uploadData = await uploadResponse.json();
    const uploadedFileUrl = uploadData.url;

    if (!uploadedFileUrl) {
      throw new Error('Failed to get uploaded file URL from PDF.co');
    }

    console.log('PDF uploaded successfully, URL:', uploadedFileUrl);

    // Step 2: Convert PDF to text using the uploaded file URL
    const pdfParseResponse = await fetch('https://api.pdf.co/v1/pdf/convert/to/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        url: uploadedFileUrl,
        inline: true,
      }),
    });

    if (!pdfParseResponse.ok) {
      const errorText = await pdfParseResponse.text();
      console.error('PDF parsing failed:', errorText);
      throw new Error(`Failed to parse PDF content: ${errorText}`);
    }

    const pdfData = await pdfParseResponse.json();
    const content = pdfData.text || pdfData.body || '';

    if (!content || !content.trim()) {
      throw new Error('No content extracted from PDF');
    }

    console.log('Extracted content length:', content.length);

    // Store in medical_knowledge table
    const { data: knowledgeData, error: insertError } = await supabase
      .from('medical_knowledge')
      .insert({
        title,
        content: content.substring(0, 50000), // Limit content size
        source_type: 'pdf',
        file_path: filePath,
        metadata: metadata || {},
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting knowledge:', insertError);
      throw insertError;
    }

    console.log('Successfully processed PDF:', knowledgeData.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        id: knowledgeData.id,
        contentLength: content.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in process-pdf-document:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
