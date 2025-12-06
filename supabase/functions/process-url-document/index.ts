import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// URL validation schema with SSRF protection
const urlSchema = z.string().url().refine((urlString) => {
  try {
    const parsed = new URL(urlString);
    
    // Only allow HTTPS
    if (parsed.protocol !== 'https:') {
      return false;
    }
    
    // Block localhost and common localhost aliases
    const blockedHosts = [
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
      '::1',
      '[::1]',
    ];
    if (blockedHosts.includes(parsed.hostname.toLowerCase())) {
      return false;
    }
    
    // Block private IP ranges
    const privateRanges = [
      /^10\./,                          // 10.0.0.0/8
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // 172.16.0.0/12
      /^192\.168\./,                    // 192.168.0.0/16
      /^169\.254\./,                    // Link-local
      /^100\.(6[4-9]|[7-9][0-9]|1[0-2][0-7])\./, // Carrier-grade NAT
      /^fc[0-9a-f]{2}:/i,               // IPv6 unique local
      /^fe80:/i,                        // IPv6 link-local
    ];
    if (privateRanges.some(regex => regex.test(parsed.hostname))) {
      return false;
    }
    
    // Block cloud metadata endpoints
    const metadataHosts = [
      '169.254.169.254',  // AWS/GCP/Azure metadata
      'metadata.google.internal',
      'metadata.google',
    ];
    if (metadataHosts.includes(parsed.hostname.toLowerCase())) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}, { message: 'Invalid URL or blocked for security reasons. Only HTTPS URLs to public hosts are allowed.' });

const inputSchema = z.object({
  url: urlSchema,
  title: z.string().trim().max(500).optional(),
  metadata: z.record(z.unknown()).optional(),
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Validate and sanitize input
    const rawInput = await req.json();
    const validationResult = inputSchema.safeParse(rawInput);
    
    if (!validationResult.success) {
      console.error('Validation failed:', validationResult.error.flatten());
      return new Response(
        JSON.stringify({ 
          error: 'Invalid input', 
          details: validationResult.error.flatten().fieldErrors 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    const { url, title, metadata } = validationResult.data;
    
    console.log('Processing URL document:', { url: url.substring(0, 100), title: title?.substring(0, 50) });

    // Fetch the web page content with realistic browser headers
    const pageResponse = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,fr;q=0.8,ar;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
    });

    if (!pageResponse.ok) {
      throw new Error(`Failed to fetch URL: ${pageResponse.status}`);
    }

    const html = await pageResponse.text();

    // Simple HTML to text extraction (remove tags)
    let content = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Extract title from HTML if not provided
    const extractedTitle = title || html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || url;

    if (!content) {
      throw new Error('No content extracted from URL');
    }

    console.log('Extracted content length:', content.length);

    // Store in medical_knowledge table
    const { data: knowledgeData, error: insertError } = await supabase
      .from('medical_knowledge')
      .insert({
        title: extractedTitle,
        content: content.substring(0, 50000), // Limit content size
        source_type: 'url',
        source_url: url,
        metadata: metadata || {},
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting knowledge:', insertError);
      throw insertError;
    }

    console.log('Successfully processed URL:', knowledgeData.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        id: knowledgeData.id,
        title: extractedTitle,
        contentLength: content.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in process-url-document:', error);
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
