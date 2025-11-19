# Guide d'édition - Dr. Yousif German Website

## 📸 Comment modifier les images

### Hero Section (Image principale)
**Fichier:** `src/pages/Index.tsx`
```typescript
// Ligne 9: Changez le chemin de l'image hero
import heroImage from "@/assets/hero-dental.jpg";
```
**Pour changer:** Remplacez le fichier `src/assets/hero-dental.jpg` par votre nouvelle image.

### Photo du docteur
**Fichier:** `src/pages/Index.tsx`
```typescript
// Ligne 10: Changez le chemin de l'image du docteur
import doctorImage from "@/assets/doctor-portrait.jpg";
```
**Pour changer:** Remplacez le fichier `src/assets/doctor-portrait.jpg` par votre nouvelle photo.

---

## ✏️ Comment modifier les textes

### Section Hero (En-tête principal)
**Fichier:** `src/pages/Index.tsx` (lignes 20-25)
```typescript
<Hero
  backgroundImage={heroImage}
  title="Dr. Yousif German"              // 👈 Changez le titre ici
  subtitle="Advanced dental care..."     // 👈 Changez le sous-titre ici
  badge="Dentist"                        // 👈 Changez le badge ici
/>
```

### Section About (À propos)
**Fichier:** `src/pages/Index.tsx` (lignes 29-38)
```typescript
<About
  doctorImage={doctorImage}
  doctorName="Dr. Yousif German"        // 👈 Nom du docteur
  description="With years of experience..." // 👈 Description
  stats={{
    years: "15+",      // 👈 Années d'expérience
    patients: "5000+", // 👈 Nombre de patients
    treatments: "10000+" // 👈 Nombre de traitements
  }}
/>
```

### Section Contact
**Fichier:** `src/pages/Index.tsx` (lignes 50-55)
```typescript
<Contact
  address="Kuwait City, Kuwait"         // 👈 Adresse
  phone="+965 XXXX XXXX"                // 👈 Téléphone
  email="info@dryousifgerman.com"       // 👈 Email
  hours="Sat-Thu: 9AM-8PM"              // 👈 Horaires
/>
```

---

## 🎨 Comment modifier les couleurs

**Fichier:** `src/index.css` (lignes 8-20)
```css
:root {
  /* Changez ces valeurs HSL pour modifier les couleurs */
  --vibe-purple: 259 83% 68%;   /* Violet principal */
  --vibe-pink: 330 82% 68%;     /* Rose */
  --vibe-blue: 213 94% 68%;     /* Bleu */
  /* ... */
}
```

---

## 🌐 Comment modifier les services

**Fichier:** `src/components/Services.tsx`

Trouvez le tableau `services` et modifiez ou ajoutez des services:
```typescript
const services = [
  {
    icon: <Stethoscope className="w-8 h-8" />,
    title: "Dental Implants",           // 👈 Titre
    description: "Permanent solution...", // 👈 Description
  },
  // Ajoutez plus de services ici
];
```

---

## 💬 Configuration du Chatbot

### Modifier les questions fréquentes (FAQ)
**Fichier:** `src/components/Chatbot.tsx` (lignes 12-17)
```typescript
const FAQ = [
  { 
    q: "Quels sont vos horaires?",    // 👈 Question
    a: "Du samedi au jeudi, 9h-20h"   // 👈 Réponse
  },
  // Ajoutez plus de Q&A ici
];
```

### Configuration du webhook n8n
Pour connecter le chatbot à n8n:
1. Créez un webhook dans n8n
2. Dans la console du navigateur, tapez:
```javascript
localStorage.setItem("n8n_webhook_url", "https://votre-webhook-n8n.com")
```

---

## 📊 Base de données des leads

Les informations collectées sont stockées dans la table `leads`:
- **name**: Nom du contact
- **email**: Email
- **phone**: Téléphone/WhatsApp
- **message**: Message du chatbot
- **source**: Source (chatbot/formulaire)
- **created_at**: Date de création

**Accès:** Utilisez le Cloud tab dans Lovable pour voir vos leads.

---

## 🔧 Structure des classes CSS réutilisables

- `.vibe-title` - Titres avec gradient
- `.vibe-sub` - Sous-titres avec opacité
- `.vibe-btn` - Boutons avec effet hover
- `.vibe-card` - Cartes avec glassmorphism
- `.vibe-section` - Sections avec animation fade-in
- `.vibe-glow` - Effet glow/lueur

**Fichier:** `src/index.css` (lignes 38-120)

---

## 📱 Workflow n8n recommandé

1. **Trigger**: Webhook (reçoit les données du chatbot)
2. **Action 1**: Envoyer email de notification
3. **Action 2**: Envoyer message WhatsApp
4. **Action 3**: Créer entrée dans CRM (Airtable/Google Sheets)

**Structure des données envoyées:**
```json
{
  "name": "Nom du contact",
  "email": "email@example.com",
  "phone": "+965XXXXXXXX",
  "message": "Historique conversation",
  "timestamp": "2025-01-19T..."
}
```

---

## 🚀 Déploiement

Pour publier vos modifications:
1. Cliquez sur **Publish** (coin supérieur droit)
2. Cliquez sur **Update** pour déployer les changements frontend

**Note:** Les edge functions et la base de données se déploient automatiquement!

---

## 🆘 Support

Pour toute question:
- Documentation Lovable: https://docs.lovable.dev
- Support: support@lovable.dev