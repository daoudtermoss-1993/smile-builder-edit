import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // SECURITY: Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    
    console.log(`Voice session request from IP: ${clientIP.substring(0, 10)}***`);

    // Initialize Supabase client with service role for rate limiting
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // SECURITY: Check rate limit (max 10 voice sessions per hour per IP)
    const { data: rateLimitCheck, error: rateLimitError } = await supabase
      .rpc('check_rate_limit', {
        _identifier: clientIP,
        _action: 'voice_session',
        _max_attempts: 10,
        _time_window_minutes: 60
      });

    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError.message);
      // Continue anyway if rate limit check fails (fail open for availability)
    } else if (rateLimitCheck === false) {
      console.warn(`Voice session rate limit exceeded for IP: ${clientIP.substring(0, 10)}***`);
      return new Response(
        JSON.stringify({ 
          error: 'Too many voice session requests. Please try again later.',
          details: 'Rate limit exceeded. Maximum 10 sessions per hour allowed.'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 429 
        }
      );
    }

    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
    
    if (!ELEVENLABS_API_KEY) {
      console.error('ELEVENLABS_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Voice assistant service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get agent ID from request body
    const { agentId } = await req.json().catch(() => ({ agentId: null }));
    
    if (!agentId) {
      console.warn('Agent ID missing in request');
      return new Response(
        JSON.stringify({ error: 'Agent ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating signed URL for voice session');

    // Generate signed URL from ElevenLabs
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
      {
        method: "GET",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', response.status);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to generate voice session',
          details: `ElevenLabs API returned ${response.status}`
        }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('Voice session signed URL generated successfully');

    return new Response(
      JSON.stringify({ signedUrl: data.signed_url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in elevenlabs-session:', error instanceof Error ? error.message : 'Unknown error');
    return new Response(
      JSON.stringify({ 
        error: 'Failed to create voice session',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
