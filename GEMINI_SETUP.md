# Configuration de l'API Gemini

## Étape 1 : Obtenir votre clé API (GRATUIT)

1. Rendez-vous sur : **https://aistudio.google.com/apikey**
2. Connectez-vous avec votre compte Google
3. Cliquez sur "Create API Key"
4. Copiez la clé générée (elle ressemble à : `AIzaSy...`)

## Étape 2 : Configurer l'application

1. Ouvrez le fichier `.env` dans le dossier `CoachRunning/coach-app/`
2. Collez votre clé API :
   ```
   VITE_GEMINI_API_KEY=AIzaSy_VOTRE_CLE_ICI
   ```
3. Sauvegardez le fichier

## Étape 3 : Redémarrer l'application

```bash
# Si l'app est déjà lancée, arrêtez-la (Ctrl+C) puis :
npm run dev
```

## Fonctionnement

- **Avec clé API** : L'application utilisera Gemini pour générer des plans personnalisés
- **Sans clé API** : L'application utilisera un plan de démonstration (fallback automatique)

## Limites Gratuites

- **60 requêtes/minute**
- **1500 requêtes/jour**
- Largement suffisant pour une utilisation personnelle !

## Sécurité

⚠️ **IMPORTANT** : Ne partagez JAMAIS votre clé API publiquement (GitHub, etc.)

Le fichier `.env` est ignoré par Git (vérifié dans `.gitignore`)
