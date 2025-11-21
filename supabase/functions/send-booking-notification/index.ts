import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// SECURITY: Comprehensive validation schema
const appointmentSchema = z.object({
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
  
  service: z.string()
    .trim()
    .min(3, { message: "Service must be at least 3 characters" })
    .max(100, { message: "Service must be less than 100 characters" }),
  
  date: z.string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/, { message: "Invalid date format" })
    .refine((date) => {
      const d = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return d >= today;
    }, { message: "Date must be today or in the future" }),
  
  time: z.string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, { message: "Invalid time format" }),
  
  notes: z.string()
    .trim()
    .max(500, { message: "Notes must be less than 500 characters" })
    .optional()
    .transform(val => val || null)
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
    
    console.log(`Appointment booking request from IP: ${clientIP.substring(0, 10)}***`);

    // Initialize Supabase client with service role (bypasses RLS)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // SECURITY: Check rate limit (max 5 bookings per hour per IP)
    const { data: rateLimitCheck, error: rateLimitError } = await supabase
      .rpc('check_rate_limit', {
        _identifier: clientIP,
        _action: 'booking',
        _max_attempts: 5,
        _time_window_minutes: 60
      });

    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError.message);
      // Continue anyway if rate limit check fails (fail open for availability)
    } else if (rateLimitCheck === false) {
      console.warn(`Rate limit exceeded for IP: ${clientIP.substring(0, 10)}***`);
      return new Response(
        JSON.stringify({ 
          error: 'Too many booking attempts. Please try again later.',
          details: 'Rate limit exceeded. Maximum 5 bookings per hour allowed.'
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
      validatedData = appointmentSchema.parse(rawData);
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

    // SECURITY: Sanitized logging (no PII in logs)
    console.log('Valid appointment request:', { 
      service: validatedData.service, 
      date: validatedData.date, 
      time: validatedData.time,
      hasName: !!validatedData.name,
      hasEmail: !!validatedData.email,
      hasPhone: !!validatedData.phone
    });

    // SECURITY: Check for duplicate bookings within the same week (7 days)
    // This prevents the same patient from booking multiple appointments in a short time period
    const appointmentDate = new Date(validatedData.date);
    const weekStart = new Date(appointmentDate);
    weekStart.setDate(appointmentDate.getDate() - appointmentDate.getDay()); // Start of week (Sunday)
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // End of week (Saturday)

    const { data: existingAppointments, error: duplicateCheckError } = await supabase
      .from('appointments')
      .select('id, appointment_date, appointment_time, patient_name')
      .eq('patient_name', validatedData.name)
      .or(`patient_email.eq.${validatedData.email},patient_phone.eq.${validatedData.phone}`)
      .gte('appointment_date', weekStart.toISOString().split('T')[0])
      .lte('appointment_date', weekEnd.toISOString().split('T')[0])
      .in('status', ['pending', 'pending_doctor', 'pending_patient', 'confirmed']);

    if (duplicateCheckError) {
      console.error('Duplicate check error:', duplicateCheckError.message);
    } else if (existingAppointments && existingAppointments.length > 0) {
      console.warn(`Weekly duplicate booking attempt blocked for patient: ${validatedData.name.substring(0, 3)}***`);
      return new Response(
        JSON.stringify({ 
          error: 'You already have an appointment scheduled this week.',
          details: `An appointment for ${validatedData.name} is already booked on ${existingAppointments[0].appointment_date} at ${existingAppointments[0].appointment_time}. Patients can only book one appointment per week. Please contact the clinic if you need to reschedule.`
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 409 // Conflict
        }
      );
    }

    // SECURITY: Check for slot monopolization - max 3 appointments per contact in same time window (30 min)
    // This allows family bookings but prevents someone from blocking all consecutive slots
    const timeSlotStart = new Date(`2000-01-01 ${validatedData.time}`);
    const timeSlotEnd = new Date(timeSlotStart.getTime() + 30 * 60000); // +30 minutes
    
    const { data: nearbyAppointments, error: slotCheckError } = await supabase
      .from('appointments')
      .select('id, appointment_time')
      .or(`patient_email.eq.${validatedData.email},patient_phone.eq.${validatedData.phone}`)
      .eq('appointment_date', validatedData.date)
      .gte('appointment_time', timeSlotStart.toTimeString().substring(0, 8))
      .lte('appointment_time', timeSlotEnd.toTimeString().substring(0, 8))
      .in('status', ['pending', 'pending_doctor', 'pending_patient', 'confirmed']);

    if (slotCheckError) {
      console.error('Slot check error:', slotCheckError.message);
    } else if (nearbyAppointments && nearbyAppointments.length >= 3) {
      console.warn(`Slot monopolization attempt blocked for contact info`);
      return new Response(
        JSON.stringify({ 
          error: 'Too many consecutive appointments.',
          details: 'You already have 3 appointments in this time window. Please select a different time or contact the clinic directly for special arrangements.'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 429 // Too Many Requests
        }
      );
    }

    // Save appointment to database (service role bypasses RLS)
    const { data: appointment, error: dbError } = await supabase
      .from('appointments')
      .insert({
        patient_name: validatedData.name,
        patient_email: validatedData.email,
        patient_phone: validatedData.phone,
        service: validatedData.service,
        appointment_date: validatedData.date,
        appointment_time: validatedData.time,
        notes: validatedData.notes,
        source: 'booking_form',
        status: 'pending_doctor'
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError.message);
      throw dbError;
    }

    console.log('Appointment created:', appointment.id);

    // Send to n8n webhook for WhatsApp notification
    const n8nWebhook = Deno.env.get('N8N_WEBHOOK_URL');
    
    if (!n8nWebhook) {
      console.warn('N8N_WEBHOOK_URL not configured. WhatsApp notifications disabled.');
    } else {
      console.log('Sending notification to n8n webhook...');
      
      try {
        const webhookResponse = await fetch(n8nWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'appointment_booking',
            appointment_id: appointment.id,
            patient: {
              name: validatedData.name,
              email: validatedData.email,
              phone: validatedData.phone,
            },
            appointment: {
              service: validatedData.service,
              date: validatedData.date,
              time: validatedData.time,
              notes: validatedData.notes || 'No additional notes'
            },
            timestamp: new Date().toISOString(),
            clinic: {
              name: 'Dr. Yousif Smile Builder',
              phone: '+96561112299'
            }
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
        // Don't fail the request if webhook fails
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Appointment request received! You will receive a WhatsApp confirmation shortly.',
        appointment_id: appointment.id
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error processing appointment:', error instanceof Error ? error.message : 'Unknown error');
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
