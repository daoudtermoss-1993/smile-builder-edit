# Configuration du Voice Assistant ElevenLabs pour les Réservations

## Problème Actuel
Le voice assistant ElevenLabs doit être configuré pour collecter les informations de réservation et les envoyer au système du site.

## Solution : Configuration du Client Tool

### Étape 1 : Accéder à la Configuration de l'Agent

1. Connectez-vous à [ElevenLabs Dashboard](https://elevenlabs.io/)
2. Allez dans "Conversational AI" 
3. Sélectionnez votre agent (ID: `agent_0601k7f005mxfams7w22csdfvcdh`)
4. Cliquez sur "Tools" ou "Client Functions"

### Étape 2 : Créer le Client Tool `bookAppointment`

Configurez le tool avec ces paramètres EXACTS :

**Nom du Tool:** `bookAppointment`

**Description:**
```
Book a dental appointment for the patient. Collect all required information before calling this function.
```

**Type:** Client Tool (Client-side Function)

**Paramètres à configurer:**

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Patient's full name (2-100 characters, letters and spaces only)"
    },
    "email": {
      "type": "string",
      "description": "Patient's email address"
    },
    "phone": {
      "type": "string",
      "description": "Patient's phone number in international format (e.g., +96512345678)"
    },
    "date": {
      "type": "string",
      "description": "Appointment date in YYYY-MM-DD format (must be today or future date, max 6 months ahead)"
    },
    "time": {
      "type": "string",
      "description": "Appointment time in HH:MM format (e.g., 09:00, 14:30)"
    },
    "service": {
      "type": "string",
      "description": "Type of dental service requested (e.g., General Consultation, Teeth Cleaning, Root Canal)"
    }
  },
  "required": ["name", "email", "phone", "date", "time", "service"]
}
```

### Étape 3 : Configurer le Prompt de l'Agent

Dans la section "Agent Instructions", ajoutez :

```
You are Dr. Yousif German's dental assistant. Your role is to:

1. Greet patients warmly in Arabic or English
2. Answer questions about dental services, clinic hours, and location
3. Help patients book appointments

APPOINTMENT BOOKING PROCESS:
When a patient wants to book an appointment, collect these details in a conversational way:
- Full name
- Email address  
- Phone number (with country code, e.g., +965)
- Preferred date (format: YYYY-MM-DD, e.g., 2025-01-15)
- Preferred time (format: HH:MM, e.g., 10:00)
- Type of service (General Consultation, Teeth Cleaning, Root Canal, etc.)

IMPORTANT:
- Validate the phone number includes country code (+965 for Kuwait)
- Confirm the date is in the future and not more than 6 months ahead
- Clinic hours: Monday-Friday, 09:00-17:00
- After collecting all information, call the bookAppointment function
- Tell the patient their appointment is confirmed and they will receive WhatsApp confirmation

EXAMPLE CONVERSATION:
Patient: "I want to book an appointment"
You: "Of course! I'd be happy to help you book an appointment with Dr. Yousif German. May I have your full name please?"
Patient: "Ahmed Ali"
You: "Thank you Ahmed. What's your email address?"
...continue collecting information...
You: *calls bookAppointment function with all data*
You: "Perfect! Your appointment has been booked for [date] at [time]. You will receive a WhatsApp confirmation shortly. Is there anything else I can help you with?"
```

### Étape 4 : Tester la Connexion

1. Ouvrez le site web
2. Cliquez sur le bouton "Call" dans la section Contact
3. Dites : "I want to book an appointment"
4. Fournissez les informations demandées
5. Vérifiez dans la console du navigateur (F12) les logs :
   - 🎤 Voice Assistant: Appointment booking initiated
   - 📋 Parameters received
   - ✅ Validation successful
   - 📤 Calling send-booking-notification edge function
   - ✅ Appointment created successfully

6. Vérifiez dans le tableau de bord admin que la réservation apparaît avec :
   - Status: "pending_doctor"
   - Source: "voice_assistant"

## Flux Complet

```
Patient parle avec AI Voice Assistant
         ↓
AI collecte: name, email, phone, date, time, service
         ↓
AI appelle bookAppointment (client tool)
         ↓
Site valide les données (zod schema)
         ↓
Site appelle edge function send-booking-notification
         ↓
Edge function:
  - Vérifie rate limiting
  - Vérifie duplicatas
  - Insère dans Supabase (status: pending_doctor)
  - Envoie webhook n8n
         ↓
Docteur voit la réservation dans Admin Dashboard
         ↓
Docteur confirme → Status change à "confirmed"
         ↓
Patient reçoit WhatsApp de confirmation
```

## Dépannage

### Le tool n'est pas appelé
- Vérifiez que le tool est bien nommé `bookAppointment` (exact)
- Vérifiez que tous les paramètres sont "required" dans ElevenLabs
- Vérifiez le prompt de l'agent mentionne bien d'appeler la fonction

### Erreur de validation
- Vérifiez le format du téléphone : doit commencer par + et contenir 8-15 chiffres
- Vérifiez le format de la date : YYYY-MM-DD
- Vérifiez le format de l'heure : HH:MM

### L'appointment n'apparaît pas dans Admin
- Ouvrez la console (F12) et vérifiez les logs
- Vérifiez que l'edge function `send-booking-notification` est déployée
- Vérifiez les erreurs dans les logs de Supabase Edge Functions

### WhatsApp ne fonctionne pas
- Vérifiez que N8N_WEBHOOK_URL est configuré dans les secrets Supabase
- Vérifiez que le workflow n8n est actif et fonctionne
- Testez le webhook n8n manuellement avec un outil comme Postman

## Support

Si le problème persiste après avoir suivi ces étapes :
1. Vérifiez les logs dans la console du navigateur (F12)
2. Vérifiez les logs des Edge Functions dans Supabase
3. Vérifiez que l'agent ElevenLabs a bien le tool configuré
4. Testez manuellement le booking via le formulaire web pour confirmer que le backend fonctionne
