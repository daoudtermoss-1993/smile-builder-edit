import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, service, date, time, notes } = await req.json();
    
    console.log('Booking received:', { name, email, phone, service, date, time });

    // Here you can add email/WhatsApp notification logic
    // For now, we'll just log the booking
    
    // Example: Send to n8n webhook if configured
    const n8nWebhook = Deno.env.get('N8N_WEBHOOK_URL');
    if (n8nWebhook) {
      await fetch(n8nWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'booking',
          data: { name, email, phone, service, date, time, notes },
          timestamp: new Date().toISOString()
        }),
      });
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Booking received successfully. We will contact you soon!'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error processing booking:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process booking' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
