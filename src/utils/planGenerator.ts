import { Week } from '../components/PlanView';
import i18n from '../i18n/config';

interface UserGoal {
  distance: string;
  customDistance?: string;
  targetTime?: string;
  weeks: number;
  sessionsPerWeek: number;
  trainingDays: string[];
  level: string;
  language: string;
}

export const generatePlanWithAI = async (goal: UserGoal): Promise<Week[]> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('API Key not configured, using mock plan');
    return generateMockPlan();
  }

  // Ensure i18n is in the correct language (should be already, but to be safe)
  if (i18n.language !== goal.language) {
    await i18n.changeLanguage(goal.language);
  }

  const t = i18n.t;

  // Translate keys to human readable strings for the prompt
  const levelLabel = t(`levels.${goal.level}`);
  const distanceLabel = goal.distance === 'OTHER' && goal.customDistance
    ? goal.customDistance
    : t(`distances.${goal.distance}`);
  const daysLabels = goal.trainingDays.map(d => t(`days.${d}`)).join(', ');

  // Normalize language to 'fr' or 'en'
  const lang = goal.language.startsWith('fr') ? 'fr' : 'en';
  console.log('Generating plan in language:', lang, 'from', goal.language);

  // Construct prompt based on language
  let prompt = '';

  if (lang === 'fr') {
    prompt = `Tu es un coach de course à pied expert.
Profil du coureur :
- Niveau : ${levelLabel}
- Objectif : ${distanceLabel}
${goal.targetTime ? `- Temps visé : ${goal.targetTime}` : ''}
- Disponibilités : ${goal.sessionsPerWeek} séances par semaine, les ${daysLabels}.
- Durée du plan : ${goal.weeks} semaines.

RÈGLES STRICTES :
1. ANALYSE DE COHÉRENCE : Vérifie d'abord si l'objectif est réaliste pour le niveau déclaré.
   - Exemple irréaliste : Débutant visant un Marathon en 2h30.
   - Exemple irréaliste : 5km en 3h (trop lent).
   - Si l'objectif est irréaliste ou dangereux, génère un JSON avec une seule semaine et une seule séance dont la description est : "ERREUR : [Explication du problème et conseil pour une saisie réaliste]".

2. FORMAT DE RÉPONSE : Réponds UNIQUEMENT avec un JSON valide (pas de markdown, pas de texte avant ou après) suivant cette structure EXACTE :
{
  "weeks": [
    {
      "number": 1,
      "sessions": [
        {
          "day": "${t('days.MONDAY')}",
          "type": "Repos",
          "description": "Repos complet",
          "completed": false
        },
        {
          "day": "${t('days.WEDNESDAY')}",
          "type": "Endurance",
          "description": "45 min allure fondamentale",
          "completed": false
        }
      ]
    }
  ]
}

3. CONTENU DU PLAN :
   - Si l'objectif est réaliste, construis un plan progressif sur ${goal.weeks} semaines.
   - Respecte scrupuleusement les jours d'entraînement : ${daysLabels}.
   - Intègre le temps visé (${goal.targetTime || 'finir la course'}) dans les allures des séances spécifiques.
   - UTILISE LE FRANÇAIS pour tout le contenu.`;
  } else {
    // English Prompt
    prompt = `You are an expert running coach.
Runner Profile:
- Level: ${levelLabel}
- Goal: ${distanceLabel}
${goal.targetTime ? `- Target Time: ${goal.targetTime}` : ''}
- Availability: ${goal.sessionsPerWeek} sessions per week, on ${daysLabels}.
- Plan Duration: ${goal.weeks} weeks.

STRICT RULES:
1. CONSISTENCY CHECK: First check if the goal is realistic for the declared level.
   - Unrealistic example: Beginner aiming for a Marathon in 2h30.
   - Unrealistic example: 5km in 3h (too slow).
   - If the goal is unrealistic or dangerous, generate a JSON with a single week and a single session where the description is: "ERROR: [Explanation of the problem and advice for realistic input]".

2. RESPONSE FORMAT: Respond ONLY with valid JSON (no markdown, no text before or after) following this EXACT structure:
{
  "weeks": [
    {
      "number": 1,
      "sessions": [
        {
          "day": "${t('days.MONDAY')}",
          "type": "Rest",
          "description": "Complete rest",
          "completed": false
        },
        {
          "day": "${t('days.WEDNESDAY')}",
          "type": "Endurance",
          "description": "45 min easy run",
          "completed": false
        }
      ]
    }
  ]
}

3. PLAN CONTENT:
   - If the goal is realistic, build a progressive plan over ${goal.weeks} weeks.
   - Strictly respect the training days: ${daysLabels}.
   - Integrate the target time (${goal.targetTime || 'finish the race'}) into the specific session paces.
   - USE ENGLISH for all content.`;
  }

  console.log('Attempting to generate plan with Gemini...');
  console.log('API Key present:', !!apiKey);
  console.log('Language:', goal.language);

  let modelName = 'models/gemini-pro'; // Fallback

  try {
    console.log('Fetching available models...');
    const modelsResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);

    if (modelsResponse.ok) {
      const modelsData = await modelsResponse.json();
      // Find a suitable model
      const validModel = modelsData.models?.find((m: any) =>
        m.name.includes('gemini') &&
        m.supportedGenerationMethods?.includes('generateContent')
      );

      if (validModel) {
        modelName = validModel.name;
        console.log('Selected Model:', modelName);
      }
    }
  } catch (e) {
    console.error('Failed to list models:', e);
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent`;

  try {
    const response = await fetch(`${endpoint}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Details:', errorText);
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates[0]?.content?.parts[0]?.text;

    if (!text) {
      throw new Error('No response from API');
    }

    // Extract JSON from potential markdown code blocks
    let jsonText = text.trim();
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    }

    const parsed = JSON.parse(jsonText);
    return parsed.weeks;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    console.log('Falling back to mock plan');
    return generateMockPlan();
  }
};

export const generateMockPlan = (): Week[] => {
  return [
    {
      number: 1,
      sessions: [
        { day: 'Lundi', type: 'Repos', description: 'Repos complet', completed: false },
        { day: 'Mercredi', type: 'Endurance', description: '45 min allure fondamentale', completed: false },
        { day: 'Samedi', type: 'Sortie Longue', description: '1h15 allure libre', completed: false },
      ]
    }
  ];
};
