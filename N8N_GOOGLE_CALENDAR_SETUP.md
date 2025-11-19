# Configuration n8n → Google Calendar pour Dr. Yousif Smile Builder

## Vue d'ensemble
Ce guide vous montre comment configurer un workflow n8n automatique pour :
- Recevoir les réservations de rendez-vous
- Créer des événements Google Calendar automatiquement
- Envoyer des notifications WhatsApp au docteur et au patient
- Mettre à jour le statut des rendez-vous dans la base de données

---

## Étape 1 : Prérequis

### 1.1 Compte n8n
- Créez un compte gratuit sur [n8n.cloud](https://n8n.cloud) ou installez n8n localement
- Connectez-vous à votre instance n8n

### 1.2 Compte Google
- Vous avez besoin d'un compte Google avec accès à Google Calendar
- Assurez-vous que le calendrier est créé (ex: "Dr. Yousif Appointments")

### 1.3 WhatsApp Business API (Optionnel mais recommandé)
- Utilisez **Twilio** ou **WhatsApp Cloud API** (gratuit pour petits volumes)
- Configuration détaillée disponible dans `N8N_WHATSAPP_WORKFLOW.md`

---

## Étape 2 : Créer le Workflow n8n

### 2.1 Créer un nouveau workflow
1. Dans n8n, cliquez sur **"Create New Workflow"**
2. Nommez-le : `Dr Yousif - Appointment to Calendar`

### 2.2 Ajouter le Webhook Trigger
1. Ajoutez le node **"Webhook"**
   - **Webhook URL** : Copiez l'URL (sera utilisée plus tard)
   - **HTTP Method** : POST
   - **Response Mode** : Respond to Webhook
   - **Response Data** : First Entry JSON

2. Structure des données reçues :
```json
{
  "type": "appointment_booking",
  "appointment_id": "uuid-here",
  "patient": {
    "name": "Ahmed Hassan",
    "email": "ahmed@example.com",
    "phone": "+96512345678"
  },
  "appointment": {
    "service": "Teeth Cleaning",
    "date": "2025-01-20",
    "time": "10:00:00",
    "notes": "First visit"
  },
  "clinic": {
    "name": "Dr. Yousif Smile Builder",
    "phone": "+96561112299"
  },
  "timestamp": "2025-01-19T14:30:00Z"
}
```

---

## Étape 3 : Configurer Google Calendar

### 3.1 Ajouter le node Google Calendar
1. Après le Webhook, ajoutez **"Google Calendar"**
2. **Opération** : Create an Event

### 3.2 Authentification
1. Cliquez sur **"Connect My Account"**
2. Suivez le processus OAuth de Google
3. Autorisez n8n à accéder à votre calendrier

### 3.3 Configuration de l'événement
Mappez les champs comme suit :

- **Calendar** : Sélectionnez votre calendrier (ex: "Dr. Yousif Appointments")
- **Start** : `{{ $json.appointment.date }}T{{ $json.appointment.time }}`
- **End** : Calculer +30 minutes (ou durée personnalisée)
  ```
  {{ $now.plus(30, 'minutes').toISO() }}
  ```
- **Summary** (Titre) : 
  ```
  {{ $json.appointment.service }} - {{ $json.patient.name }}
  ```
- **Description** :
  ```
  Patient: {{ $json.patient.name }}
  Phone: {{ $json.patient.phone }}
  Email: {{ $json.patient.email }}
  Service: {{ $json.appointment.service }}
  Notes: {{ $json.appointment.notes }}
  
  Clinic: {{ $json.clinic.name }}
  ```
- **Location** : `Dr. Yousif Smile Builder, Kuwait`
- **Attendees** (optionnel) : `{{ $json.patient.email }}`

---

## Étape 4 : Envoyer notification WhatsApp au Docteur

### 4.1 Ajouter HTTP Request node (Twilio)
1. Ajoutez **"HTTP Request"** après Google Calendar
2. **Method** : POST
3. **URL** : 
   ```
   https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT_SID/Messages.json
   ```

### 4.2 Configuration Twilio
- **Authentication** : Basic Auth
  - Username : Votre `Account SID`
  - Password : Votre `Auth Token`

- **Body** (Form Data) :
  - `From` : Votre numéro WhatsApp Twilio (ex: `whatsapp:+14155238886`)
  - `To` : Numéro du docteur (ex: `whatsapp:+96561112299`)
  - `Body` :
    ```
    🦷 *Nouveau Rendez-vous*
    
    Patient: {{ $json.patient.name }}
    Téléphone: {{ $json.patient.phone }}
    
    Service: {{ $json.appointment.service }}
    Date: {{ $json.appointment.date }}
    Heure: {{ $json.appointment.time }}
    
    Notes: {{ $json.appointment.notes }}
    
    ✅ Ajouté à Google Calendar
    ```

---

## Étape 5 : Confirmer au Patient par WhatsApp

### 5.1 Ajouter un second HTTP Request
Similaire au node précédent mais :
- **To** : `whatsapp:{{ $json.patient.phone }}`
- **Body** :
  ```
  مرحباً {{ $json.patient.name }},
  
  ✅ تم تأكيد موعدك مع د. يوسف
  
  📅 التاريخ: {{ $json.appointment.date }}
  🕐 الوقت: {{ $json.appointment.time }}
  🦷 الخدمة: {{ $json.appointment.service }}
  
  📍 العنوان: Dr. Yousif Smile Builder, Kuwait
  📞 للاستفسار: +96561112299
  
  نتطلع لرؤيتك!
  ```

---

## Étape 6 : Mettre à jour la Base de Données

### 6.1 Ajouter node Supabase (ou HTTP Request)
1. Ajoutez un node **"HTTP Request"** à la fin
2. **Method** : PATCH
3. **URL** : 
   ```
   https://gpsgswlrgpupmcjrwiec.supabase.co/rest/v1/appointments?id=eq.{{ $json.appointment_id }}
   ```

### 6.2 Headers
- `apikey` : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (votre clé Supabase)
- `Authorization` : `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- `Content-Type` : `application/json`
- `Prefer` : `return=representation`

### 6.3 Body (JSON)
```json
{
  "status": "confirmed",
  "google_calendar_event_id": "{{ $node['Google Calendar'].json.id }}"
}
```

---

## Étape 7 : Configurer le Webhook dans Lovable

### 7.1 Copier l'URL du Webhook
1. Dans n8n, copiez l'URL du webhook du premier node
2. Format : `https://your-n8n-instance.app.n8n.cloud/webhook/appointment-booking`

### 7.2 Ajouter le Secret dans Lovable Cloud
1. Ouvrez votre projet dans Lovable
2. Allez dans **Cloud → Secrets**
3. Ajoutez un nouveau secret :
   - **Nom** : `N8N_WEBHOOK_URL`
   - **Valeur** : L'URL copiée depuis n8n

---

## Étape 8 : Tester le Workflow

### 8.1 Test depuis le site web
1. Ouvrez votre site : https://your-site.lovable.app
2. Allez à la section **"Book Appointment"**
3. Sélectionnez une date et un créneau disponible
4. Remplissez le formulaire et soumettez

### 8.2 Vérifications
✅ Le rendez-vous apparaît dans Google Calendar  
✅ Le docteur reçoit une notification WhatsApp  
✅ Le patient reçoit une confirmation WhatsApp  
✅ Le statut dans la base de données passe à "confirmed"

---

## Étape 9 : Gérer les Horaires d'Ouverture

### 9.1 Modifier les créneaux disponibles
Dans Lovable Cloud → Database → Table `available_slots` :

```sql
-- Voir les horaires actuels
SELECT * FROM available_slots;

-- Ajouter le vendredi (jour 5) de 9h à 13h
INSERT INTO available_slots (day_of_week, start_time, end_time) 
VALUES (5, '09:00', '13:00');

-- Désactiver un jour
UPDATE available_slots 
SET is_active = false 
WHERE day_of_week = 4; -- Jeudi
```

### 9.2 Jours de la semaine
- 0 = Dimanche
- 1 = Lundi
- 2 = Mardi
- 3 = Mercredi
- 4 = Jeudi
- 5 = Vendredi
- 6 = Samedi

---

## Étape 10 : Voir les Rendez-vous

### 10.1 Accès à la base de données
Dans Lovable Cloud → Database → Table `appointments` :

```sql
-- Voir tous les rendez-vous
SELECT * FROM appointments ORDER BY appointment_date DESC;

-- Voir les rendez-vous d'aujourd'hui
SELECT * FROM appointments 
WHERE appointment_date = CURRENT_DATE;

-- Voir les rendez-vous en attente
SELECT * FROM appointments 
WHERE status = 'pending';
```

---

## Dépannage

### Problème : L'événement n'apparaît pas dans Google Calendar
**Solution** :
- Vérifiez que le calendrier sélectionné est correct
- Assurez-vous que les dates/heures sont au bon format ISO
- Re-authentifiez le compte Google dans n8n

### Problème : WhatsApp ne fonctionne pas
**Solution** :
- Vérifiez les credentials Twilio
- Assurez-vous que le numéro de téléphone commence par `whatsapp:`
- Vérifiez que le numéro est au format international (+965...)

### Problème : Le statut n'est pas mis à jour
**Solution** :
- Vérifiez les headers Supabase (apikey et Authorization)
- Vérifiez que l'`appointment_id` est correct
- Consultez les logs dans Lovable Cloud → Database → Logs

---

## Workflow Visuel n8n Complet

```
[Webhook Trigger]
       ↓
[Google Calendar - Create Event]
       ↓
[HTTP Request - WhatsApp to Doctor]
       ↓
[HTTP Request - WhatsApp to Patient]
       ↓
[HTTP Request - Update Supabase Status]
```

---

## Coûts Estimés

- **n8n.cloud** : Gratuit jusqu'à 5000 exécutions/mois
- **Google Calendar API** : Gratuit
- **Twilio WhatsApp** : ~$0.005 par message
- **Lovable Cloud** : Selon votre plan

---

## Support

Pour toute question :
- Documentation n8n : https://docs.n8n.io
- Documentation Twilio : https://www.twilio.com/docs/whatsapp
- Support Lovable : https://docs.lovable.dev

✅ **Votre système de réservation automatique est maintenant opérationnel !**
