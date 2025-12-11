import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const supabaseClient = createClient(supabaseUrl, serviceRoleKey);

    const body = await req.json().catch(() => null as unknown);

    const appointment_id =
      body && typeof body === "object" && "appointment_id" in body
        ? (body as { appointment_id?: unknown }).appointment_id
        : undefined;

    if (!appointment_id || typeof appointment_id !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing or invalid appointment_id" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    console.log("Doctor confirmation requested for appointment:", appointment_id);

    // Fetch the appointment details
    const { data: appointment, error: fetchError } = await supabaseClient
      .from("appointments")
      .select(
        "id, patient_name, patient_email, patient_phone, service, appointment_date, appointment_time, notes, status",
      )
      .eq("id", appointment_id)
      .single();

    if (fetchError) {
      console.error("Error fetching appointment:", fetchError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch appointment" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (!appointment) {
      return new Response(
        JSON.stringify({ error: "Appointment not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Accept both 'pending' and 'pending_doctor' statuses
    if (appointment.status !== "pending_doctor" && appointment.status !== "pending") {
      console.warn(
        `Appointment ${appointment_id} is not in pending status (current: ${appointment.status})`,
      );
      return new Response(
        JSON.stringify({
          error: "Appointment is not awaiting doctor confirmation",
          status: appointment.status,
        }),
        {
          status: 409,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Update status directly to confirmed when doctor confirms
    const { data: updatedAppointment, error: updateError } = await supabaseClient
      .from("appointments")
      .update({ status: "confirmed" })
      .eq("id", appointment_id)
      .in("status", ["pending", "pending_doctor"])
      .select()
      .single();

    if (updateError) {
      console.error("Error updating appointment status:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update appointment status" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (!updatedAppointment) {
      console.warn(
        `Appointment ${appointment_id} could not be updated to confirmed (possibly already processed)`,
      );
      return new Response(
        JSON.stringify({
          error: "Appointment already processed",
        }),
        {
          status: 409,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const n8nWebhook = Deno.env.get("N8N_WEBHOOK_URL");

    if (!n8nWebhook) {
      console.warn("N8N_WEBHOOK_URL not configured. WhatsApp notification disabled.");
      return new Response(
        JSON.stringify({
          success: true,
          warning: "N8N webhook not configured. Status updated but no WhatsApp message sent.",
          status: "confirmed",
          appointment: updatedAppointment,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    console.log("Sending doctor confirmation event to n8n webhook...");

    try {
      const webhookResponse = await fetch(n8nWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "appointment_confirmed",
          appointment_id,
          status: "confirmed",
          patient: {
            name: appointment.patient_name,
            email: appointment.patient_email,
            phone: appointment.patient_phone,
          },
          appointment: {
            service: appointment.service,
            date: appointment.appointment_date,
            time: appointment.appointment_time,
            notes: appointment.notes ?? "No additional notes",
          },
          timestamp: new Date().toISOString(),
          clinic: {
            name: "Dr. Yousif Smile Builder",
            phone: "+96561112299",
          },
        }),
      });

      if (!webhookResponse.ok) {
        const errorText = await webhookResponse.text();
        console.error("n8n doctor confirmation webhook failed:", errorText.substring(0, 200));
      } else {
        console.log("n8n doctor confirmation notification sent successfully");
      }
    } catch (webhookError) {
      console.error(
        "n8n doctor confirmation webhook error:",
        webhookError instanceof Error ? webhookError.message : "Unknown error",
      );
      // Do not fail the overall request if webhook fails
    }

    return new Response(
      JSON.stringify({
        success: true,
        status: "confirmed",
        appointment: updatedAppointment,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error in notify-patient-confirmation:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
