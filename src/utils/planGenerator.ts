import { Week } from '../components/PlanView';

const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

interface UserGoal {
    distance: string;
    targetTime?: string;
    weeks: number;
    sessionsPerWeek: number;
    trainingDays: string[];
    level: string;
}

export const generatePlanWithAI = async (goal: UserGoal): Promise<Week[]> => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
        console.warn('API Key not configured, using mock plan');
        return generateMockPlan();
    }

    const prompt = `Tu es un coach de course à pied expert.
Profil du coureur :
- Niveau : ${goal.level}
- Objectif : ${goal.distance}
${goal.targetTime ? `- Temps visé : ${goal.targetTime}` : ''}
- Disponibilités : ${goal.sessionsPerWeek} séances par semaine, les ${goal.trainingDays.join(', ')}.
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
          "day": "Lundi",
          "type": "Repos",
          "description": "Repos complet",
          "completed": false
        },
        {
          "day": "Mercredi",
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
   - Respecte scrupuleusement les jours d'entraînement : ${goal.trainingDays.join(', ')}.
   - Intègre le temps visé (${goal.targetTime || 'finir la course'}) dans les allures des séances spécifiques.`;

    console.log('Attempting to generate plan with Gemini...');
    console.log('API Key present:', !!apiKey);

    let modelName = 'models/gemini-pro'; // Fallback

    try {
        console.log('Fetching available models...');
        const modelsResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);

        if (modelsResponse.ok) {
            const modelsData = await modelsResponse.json();
            console.log('Available Models:', modelsData);

            // Find a suitable model
            const validModel = modelsData.models?.find((m: any) =>
                m.name.includes('gemini') &&
                m.supportedGenerationMethods?.includes('generateContent')
            );

            if (validModel) {
                modelName = validModel.name;
                console.log('Selected Model:', modelName);
            } else {
                console.warn('No suitable Gemini model found in list, using fallback:', modelName);
            }
        } else {
            console.error('Failed to list models:', modelsResponse.status);
        }
    } catch (e) {
        console.error('Failed to list models:', e);
    }

    // Construct URL with the selected model
    // Note: modelName usually comes as 'models/gemini-pro', so we don't need to add 'models/' prefix if it's already there
    // But the endpoint expects: https://.../v1beta/{modelName}:generateContent
    // If modelName is 'models/gemini-pro', the URL should be .../v1beta/models/gemini-pro:generateContent

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent`;
    console.log('Using Endpoint:', endpoint);

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
        console.log('Raw API Response:', data);

        const text = data.candidates[0]?.content?.parts[0]?.text;

        if (!text) {
            throw new Error('No response from API');
        }

        // Extract JSON from potential markdown code blocks
        let jsonText = text.trim();
        if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        }

        console.log('Parsed JSON text:', jsonText);

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
        },
        {
            number: 2,
            sessions: [
                { day: 'Lundi', type: 'Repos', description: 'Repos complet', completed: false },
                { day: 'Mercredi', type: 'Fractionné', description: '20 min échauffement + 10x30/30 + 10 min retour au calme', completed: false },
                { day: 'Samedi', type: 'Sortie Longue', description: '1h30 avec 2x10 min allure course', completed: false },
            ]
        },
        {
            number: 3,
            sessions: [
                { day: 'Lundi', type: 'Repos', description: 'Repos complet', completed: false },
                { day: 'Mercredi', type: 'Endurance', description: '50 min allure fondamentale', completed: false },
                { day: 'Samedi', type: 'Sortie Longue', description: '1h45 allure libre', completed: false },
            ]
        }
    ];
};
