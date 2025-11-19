# n8n WhatsApp Notification Workflow Setup

This workflow automatically sends WhatsApp notifications when patients submit appointment requests.

## Prerequisites

1. **n8n account**: Sign up at [n8n.io](https://n8n.io)
2. **WhatsApp Business API access** or use one of these integrations:
   - Twilio (easiest for testing)
   - WhatsApp Cloud API (official)
   - 360dialog
   - WATI

## Workflow Configuration

### Step 1: Create Webhook Trigger

1. In n8n, create a new workflow
2. Add a **Webhook** node as the trigger
3. Set the HTTP method to `POST`
4. Copy the webhook URL (e.g., `https://your-n8n.app.n8n.cloud/webhook/appointment-booking`)

### Step 2: Add Secret to Lovable

Add the n8n webhook URL as a secret:

```bash
Secret Name: N8N_WEBHOOK_URL
Secret Value: https://your-n8n.app.n8n.cloud/webhook/appointment-booking
```

### Step 3: Configure n8n Workflow

The webhook receives this data structure:

```json
{
  "type": "appointment_booking",
  "patient": {
    "name": "Patient Name",
    "email": "patient@example.com",
    "phone": "+96512345678"
  },
  "appointment": {
    "service": "Dental Implants",
    "date": "2025-12-01",
    "time": "10:00",
    "notes": "First time visit"
  },
  "timestamp": "2025-11-19T16:30:00.000Z",
  "clinic": {
    "name": "Dr. Yousif Smile Builder",
    "phone": "+96561112299"
  }
}
```

### Step 4: Add WhatsApp Notification Node

#### Option A: Using Twilio (Recommended for Testing)

1. Add **Twilio** node
2. Select operation: **Send WhatsApp Message**
3. Configure:
   - From: Your Twilio WhatsApp number (e.g., `whatsapp:+14155238886`)
   - To: `{{ "whatsapp:" + $json.patient.phone }}`
   - Message:
   ```
   🦷 *Dr. Yousif Smile Builder - Appointment Request*
   
   Hello Dr. German,
   
   New appointment request received:
   
   👤 *Patient:* {{ $json.patient.name }}
   📱 *Phone:* {{ $json.patient.phone }}
   📧 *Email:* {{ $json.patient.email }}
   
   🏥 *Service:* {{ $json.appointment.service }}
   📅 *Date:* {{ $json.appointment.date }}
   ⏰ *Time:* {{ $json.appointment.time }}
   
   📝 *Notes:* {{ $json.appointment.notes }}
   
   Please contact the patient to confirm.
   ```

#### Option B: Using WhatsApp Cloud API

1. Add **HTTP Request** node
2. Method: POST
3. URL: `https://graph.facebook.com/v18.0/YOUR_PHONE_NUMBER_ID/messages`
4. Authentication: Header Auth
   - Header Name: `Authorization`
   - Header Value: `Bearer YOUR_ACCESS_TOKEN`
5. Body (JSON):
```json
{
  "messaging_product": "whatsapp",
  "to": "{{ $json.patient.phone }}",
  "type": "template",
  "template": {
    "name": "appointment_notification",
    "language": {
      "code": "en"
    },
    "components": [
      {
        "type": "body",
        "parameters": [
          {
            "type": "text",
            "text": "{{ $json.patient.name }}"
          },
          {
            "type": "text",
            "text": "{{ $json.appointment.service }}"
          },
          {
            "type": "text",
            "text": "{{ $json.appointment.date }}"
          }
        ]
      }
    ]
  }
}
```

### Step 5: Add Patient Confirmation Message

Add another WhatsApp node to send confirmation to the patient:

**Message to Patient:**
```
🦷 *Appointment Request Received*

Thank you {{ $json.patient.name }}!

We have received your appointment request for:

🏥 *Service:* {{ $json.appointment.service }}
📅 *Date:* {{ $json.appointment.date }}
⏰ *Time:* {{ $json.appointment.time }}

✅ Our team will contact you shortly to confirm your appointment.

📞 *Clinic:* {{ $json.clinic.phone }}

See you soon!
Dr. Yousif Smile Builder
```

### Step 6: Optional - Add Email Notification

Add **Send Email** node for email backup:

- To: `dr.german@example.com` (your clinic email)
- Subject: `New Appointment: {{ $json.patient.name }} - {{ $json.appointment.date }}`
- Body: Use the same format as WhatsApp message

### Step 7: Optional - Save to Database

Add **Supabase** node to save the appointment:

1. Operation: Insert
2. Table: `appointments`
3. Fields:
   - patient_name: `{{ $json.patient.name }}`
   - patient_email: `{{ $json.patient.email }}`
   - patient_phone: `{{ $json.patient.phone }}`
   - service: `{{ $json.appointment.service }}`
   - appointment_date: `{{ $json.appointment.date }}`
   - appointment_time: `{{ $json.appointment.time }}`
   - notes: `{{ $json.appointment.notes }}`
   - status: `pending`

## Testing

1. Submit a test appointment through your website
2. Check n8n workflow execution logs
3. Verify WhatsApp messages are sent to both doctor and patient

## Troubleshooting

### Messages not sending?

1. Check n8n webhook URL is correctly configured as `N8N_WEBHOOK_URL` secret
2. Verify WhatsApp credentials in n8n nodes
3. Check n8n execution logs for errors
4. For Twilio: ensure your number is verified
5. For WhatsApp Cloud API: ensure your template is approved

### Webhook not triggering?

1. Check edge function logs in Lovable Cloud backend
2. Verify CORS headers are properly set
3. Test webhook URL directly with Postman

## Cost Considerations

- **Twilio**: ~$0.005 per WhatsApp message
- **WhatsApp Cloud API**: Free for first 1,000 conversations/month
- **n8n**: Free tier available (up to 5,000 workflow executions/month)

## Next Steps

1. Set up auto-response templates in WhatsApp
2. Add appointment reminders workflow
3. Integrate with calendar (Google Calendar, Outlook)
4. Add follow-up messages after appointments
