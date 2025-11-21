import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { appointment_id, patient_response } = await req.json();

    console.log('Patient confirmation received:', { appointment_id, patient_response });

    if (!appointment_id || !patient_response) {
      return new Response(
        JSON.stringify({ error: 'Missing appointment_id or patient_response' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Determine new status based on patient response
    const newStatus = patient_response.toLowerCase() === 'oui' 
      ? 'confirmed' 
      : 'cancelled_by_patient';

    console.log(`Updating appointment ${appointment_id} to status: ${newStatus}`);

    // Update appointment status
    const { data, error } = await supabaseClient
      .from('appointments')
      .update({ status: newStatus })
      .eq('id', appointment_id)
      .eq('status', 'pending_patient') // Only update if still pending patient confirmation
      .select()
      .single();

    if (error) {
      console.error('Error updating appointment:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!data) {
      console.warn('No appointment updated - may have already been processed');
      return new Response(
        JSON.stringify({ message: 'Appointment not found or already processed' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Appointment updated successfully:', data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        status: newStatus,
        appointment: data 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in handle-patient-confirmation:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});