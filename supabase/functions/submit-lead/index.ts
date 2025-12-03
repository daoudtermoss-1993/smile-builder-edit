import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// SECURITY: Validation schema for lead data
const leadSchema = z.object({
  name: z.string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" }),
  
  email: z.string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" })
    .toLowerCase(),
  
  phone: z.string()
    .trim()
    .regex(/^\+?[0-9]{8,15}$/, { message: "Invalid phone number format" })
    .min(8)
    .max(20),
  
  message: z.string()
    .trim()
    .max(2000, { message: "Message must be less than 2000 characters" })
    .optional()
    .transform(val => val || null),
  
  source: z.string()
    .trim()
    .max(50)
    .optional()
    .default('chatbot')
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // SECURITY: Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    
    console.log(`Lead submission from IP: ${clientIP.substring(0, 10)}***`);

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // SECURITY: Check rate limit (max 10 leads per hour per IP)
    const { data: rateLimitCheck, error: rateLimitError } = await supabase
      .rpc('check_rate_limit', {
        _identifier: clientIP,
        _action: 'lead_submission',
        _max_attempts: 10,
        _time_window_minutes: 60
      });

    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError.message);
    } else if (rateLimitCheck === false) {
      console.warn(`Rate limit exceeded for IP: ${clientIP.substring(0, 10)}***`);
      return new Response(
        JSON.stringify({ 
          error: 'Too many submissions. Please try again later.',
          details: 'Rate limit exceeded.'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 429 
        }
      );
    }

    // SECURITY: Parse and validate input
    const rawData = await req.json();
    let validatedData;
    
    try {
      validatedData = leadSchema.parse(rawData);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        const firstError = validationError.errors[0];
        console.warn('Validation failed:', firstError.message);
        return new Response(
          JSON.stringify({ 
            error: 'Invalid input data',
            details: firstError.message
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400 
          }
        );
      }
      throw validationError;
    }

    // SECURITY: Sanitized logging (no PII)
    console.log('Valid lead submission:', { 
      hasName: !!validatedData.name,
      hasEmail: !!validatedData.email,
      hasPhone: !!validatedData.phone,
      source: validatedData.source
    });

    // Save lead to database
    const { data: lead, error: dbError } = await supabase
      .from('leads')
      .insert({
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        message: validatedData.message,
        source: validatedData.source
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError.message);
      throw dbError;
    }

    console.log('Lead created:', lead.id);

    // Send to n8n webhook if configured
    const n8nWebhook = Deno.env.get('N8N_WEBHOOK_URL');
    
    if (n8nWebhook) {
      console.log('Sending lead to n8n webhook...');
      
      try {
        const webhookResponse = await fetch(n8nWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'lead_capture',
            lead_id: lead.id,
            name: validatedData.name,
            email: validatedData.email,
            phone: validatedData.phone,
            message: validatedData.message,
            source: validatedData.source,
            timestamp: new Date().toISOString()
          }),
        });

        if (!webhookResponse.ok) {
          const errorText = await webhookResponse.text();
          console.error('n8n webhook failed:', errorText.substring(0, 200));
        } else {
          console.log('n8n notification sent successfully');
        }
      } catch (webhookError) {
        console.error('n8n webhook error:', webhookError instanceof Error ? webhookError.message : 'Unknown error');
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Thank you! We will contact you soon.'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error processing lead:', error instanceof Error ? error.message : 'Unknown error');
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process submission',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});