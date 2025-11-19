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
    const { name, email, phone, service, date, time, notes } = await req.json();
    
    console.log('Appointment booking received:', { name, email, phone, service, date, time });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Save appointment to database
    const { data: appointment, error: dbError } = await supabase
      .from('appointments')
      .insert({
        patient_name: name,
        patient_email: email,
        patient_phone: phone,
        service: service,
        appointment_date: date,
        appointment_time: time,
        notes: notes || null,
        source: 'booking_form',
        status: 'pending'
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }

    console.log('Appointment saved to database:', appointment.id);

    // Send to n8n webhook for WhatsApp notification
    const n8nWebhook = Deno.env.get('N8N_WEBHOOK_URL');
    
    if (!n8nWebhook) {
      console.warn('N8N_WEBHOOK_URL not configured. Please add it to send WhatsApp notifications.');
    } else {
      console.log('Sending to n8n webhook for WhatsApp notification...');
      
      const webhookResponse = await fetch(n8nWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'appointment_booking',
          appointment_id: appointment.id,
          patient: {
            name,
            email,
            phone,
          },
          appointment: {
            service,
            date,
            time,
            notes: notes || 'No additional notes'
          },
          timestamp: new Date().toISOString(),
          clinic: {
            name: 'Dr. Yousif Smile Builder',
            phone: '+96561112299'
          }
        }),
      });

      if (!webhookResponse.ok) {
        console.error('n8n webhook failed:', await webhookResponse.text());
      } else {
        console.log('n8n webhook triggered successfully');
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Appointment request received! You will receive a WhatsApp confirmation shortly.'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error processing appointment booking:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process appointment booking',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
