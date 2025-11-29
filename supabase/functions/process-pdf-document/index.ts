import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { filePath, title, metadata } = await req.json();
    
    console.log('Processing PDF document:', { filePath, title });

    // Download the PDF from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('medical-documents')
      .download(filePath);

    if (downloadError) {
      console.error('Error downloading file:', downloadError);
      throw new Error('Failed to download PDF file');
    }

    // Convert to base64 for PDF parsing API
    const arrayBuffer = await fileData.arrayBuffer();
    const base64Pdf = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

    // Parse PDF using a free PDF parsing service (pdf.co or similar)
    const pdfParseResponse = await fetch('https://api.pdf.co/v1/pdf/convert/to/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': Deno.env.get('PDF_CO_API_KEY') || 'demo', // Free tier available
      },
      body: JSON.stringify({
        file: base64Pdf,
        inline: true,
      }),
    });

    if (!pdfParseResponse.ok) {
      console.error('PDF parsing failed:', await pdfParseResponse.text());
      throw new Error('Failed to parse PDF content');
    }

    const pdfData = await pdfParseResponse.json();
    const content = pdfData.text || pdfData.body || '';

    if (!content) {
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
