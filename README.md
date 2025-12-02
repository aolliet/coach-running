# 🏃 CoachRunning

Application PWA moderne de coaching running with AI-powered training plans.

## ✨ Fonctionnalités

- 🤖 **Génération de plans via IA** : Plans personnalisés générés par Google Gemini
- 📅 **Formulaire intelligent** : Validation automatique (jours = séances/semaine)
- 💾 **Sauvegarde automatique** : Objectifs et plans persistés localement
- 📤 **Export** : Copie du plan au format texte
- 🌙 **Dark Mode** : Thème sombre avec transition fluide
- ✨ **UI Moderne** : Glassmorphism, animations, design responsive

## 🚀 Installation

```bash
npm install
```

## ⚙️ Configuration

1. Obtenez une clé API Gemini sur [Google AI Studio](https://aistudio.google.com/apikey)
2. Créez un fichier `.env` à partir de `.env.example`
3. Ajoutez votre clé : `VITE_GEMINI_API_KEY=votre_clé`

Voir [GEMINI_SETUP.md](./GEMINI_SETUP.md) pour plus de détails.

## 🏗️ Développement

```bash
npm run dev
```

L'application sera disponible sur `http://localhost:3000`

## 📦 Build

```bash
npm run build
```

## 🛠️ Technologies

- React + TypeScript
- Vite
- Zustand (state management)
- Google Gemini AI
- Vanilla CSS (utilitaires)
- Lucide React (icônes)

## 📱 PWA

L'application est conçue comme une PWA (Progressive Web App) et peut être installée sur mobile.

## 📄 Licence

MIT
