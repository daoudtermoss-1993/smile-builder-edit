# Configuration de l'Admin - Dr. Yousif Smile Builder

## Création du premier compte administrateur

Pour créer votre compte administrateur et accéder au dashboard :

### Étape 1 : Créer un compte utilisateur

1. Allez sur la page d'authentification : `/auth`
2. Cliquez sur "Don't have an account? Sign up"
3. Remplissez les informations :
   - **Nom complet** : Dr. Yousif German
   - **Email** : votre-email@example.com
   - **Mot de passe** : (minimum 6 caractères)
4. Cliquez sur "Sign Up"

### Étape 2 : Attribuer le rôle admin dans la base de données

Une fois votre compte créé, vous devez vous attribuer le rôle admin via le backend Lovable Cloud :

1. **Ouvrez le Backend** (cliquez sur le bouton ci-dessous)
2. Allez dans **Database → Tables → user_roles**
3. Cliquez sur **Insert row**
4. Remplissez les champs :
   - **user_id** : Copiez votre ID utilisateur depuis la table `profiles` (même email)
   - **role** : Sélectionnez **admin**
5. Cliquez sur **Save**

### Étape 3 : Accéder au Dashboard

1. Déconnectez-vous et reconnectez-vous
2. Le bouton "Admin" apparaîtra dans la navigation
3. Cliquez dessus ou allez sur `/admin`

## Fonctionnalités du Dashboard Admin

### 📊 Statistiques en temps réel
- Total des rendez-vous
- Rendez-vous en attente
- Rendez-vous confirmés
- Créneaux bloqués

### 🔍 Recherche et filtres
- Recherche par nom, email ou téléphone
- Filtres par statut (tous, en attente, confirmé, bloqué, annulé)

### ✅ Gestion des rendez-vous
- **Confirmer** : Valider un rendez-vous en attente
- **Annuler** : Annuler un rendez-vous
- **Supprimer** : Effacer définitivement un rendez-vous

### 🔄 Mises à jour en temps réel
Le dashboard se met à jour automatiquement quand :
- Un patient réserve un rendez-vous
- Un rendez-vous est modifié
- Un créneau est bloqué/débloqué

## Bloquer des créneaux horaires

Pour bloquer un créneau spécifique (ex: 10h-10h30 le 21 novembre) :

1. Allez dans **Backend → Database → appointments**
2. Cliquez sur **Insert row**
3. Remplissez :
   - `appointment_date` : 2025-11-21
   - `appointment_time` : 10:00:00
   - `status` : **blocked**
   - `patient_name` : "Blocked by admin"
   - `patient_email` : "admin@clinic.com"
   - `patient_phone` : "+96561112299"
   - `service` : "Blocked"

Le créneau sera automatiquement indisponible pour les patients !

## Sécurité

✅ **Authentification requise** : Seuls les utilisateurs connectés avec le rôle "admin" peuvent accéder au dashboard

✅ **Stockage sécurisé des rôles** : Les rôles sont stockés dans une table séparée avec RLS (Row Level Security)

✅ **Validation server-side** : Tous les rôles sont vérifiés côté serveur via la fonction `has_role()`

## Support

Si vous rencontrez des problèmes :
1. Vérifiez que votre compte a bien le rôle "admin" dans `user_roles`
2. Déconnectez-vous et reconnectez-vous
3. Videz le cache de votre navigateur

---

🎯 **Prochaines étapes recommandées** :
- Ajouter des rappels automatiques WhatsApp 24h avant le rendez-vous
- Créer un système de liste d'attente automatique
- Exporter les rendez-vous en CSV/Excel
