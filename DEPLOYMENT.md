# Déploiement sur Vercel et Génération APK

## Étape 1 : Déploiement Vercel

### Option A - Via GitHub (recommandé)
1. Votre code est déjà sur GitHub : https://github.com/aolliet/coach-running
2. Allez sur [vercel.com](https://vercel.com)
3. Cliquez sur "New Project"
4. Importez `aolliet/coach-running`
5. Configuration détectée automatiquement :
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. **Variables d'environnement** : Ajoutez `VITE_GEMINI_API_KEY` avec votre clé
7. Cliquez sur "Deploy"

### Option B - Via CLI
```bash
npm install -g vercel
vercel login
vercel
```

⏱️ Le déploiement prend ~2 minutes.

## Étape 2 : Génération APK avec PWA Builder

1. Une fois déployé, copiez l'URL (ex: `https://coach-running.vercel.app`)
2. Allez sur [pwabuilder.com](https://www.pwabuilder.com/)
3. Collez votre URL Vercel
4. Cliquez sur "Start"
5. PWA Builder analyse votre app
6. Allez dans "Package for Stores" > "Android"
7. Configurez :
   - **Package ID** : `com.coachrunning.app`
   - **App name** : CoachRunning
   - **Version** : 1.0.0
8. Téléchargez l'APK généré

## Étape 3 : Installation sur Android

1. Transférez l'APK sur votre téléphone
2. Activez "Sources inconnues" dans Paramètres > Sécurité
3. Installez l'APK

> [!IMPORTANT]
> N'oubliez pas d'ajouter `VITE_GEMINI_API_KEY` dans les variables d'environnement Vercel !
