import React, { useState } from 'react';
import { Play } from 'lucide-react';

interface TrainingFormData {
    distance: string;
    targetTime: string;
    weeks: number;
    sessionsPerWeek: number;
    trainingDays: string[];
    level: string;
}

interface TrainingFormProps {
    onSubmit: (data: TrainingFormData) => void;
}

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const DISTANCES = ['5km', '10km', 'Semi-marathon', 'Marathon', 'Autre'];
const LEVELS = [
    'Débutant (reprise ou 1ère fois)',
    'Occasionnel (1-2 sorties/sem)',
    'Régulier (2-3 sorties/sem)',
    'Confirmé (3-4 sorties/sem + compétitions)',
    'Expert (5+ sorties/sem)'
];

export const TrainingForm: React.FC<TrainingFormProps> = ({ onSubmit }) => {
    const [formData, setFormData] = useState<TrainingFormData>({
        distance: '',
        targetTime: '',
        weeks: 8,
        sessionsPerWeek: 3,
        trainingDays: [],
        level: ''
    });

    const handleDayToggle = (day: string) => {
        setFormData(prev => ({
            ...prev,
            trainingDays: prev.trainingDays.includes(day)
                ? prev.trainingDays.filter(d => d !== day)
                : [...prev.trainingDays, day]
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.distance && formData.trainingDays.length > 0 && formData.level) {
            onSubmit(formData);
        }
    };

    const isValid = formData.distance && formData.trainingDays.length === formData.sessionsPerWeek && formData.level;
    const dayCountMismatch = formData.trainingDays.length > 0 && formData.trainingDays.length !== formData.sessionsPerWeek;

    return (
        <div className="max-w-2xl mx-auto p-6 pb-40">
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                    Bienvenue ! 👋
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Je suis votre coach de running. Détaillez votre objectif en remplissant les champs suivants :
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Niveau */}
                <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        Niveau *
                    </label>
                    <select
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                        className="w-full p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Sélectionnez votre niveau</option>
                        {LEVELS.map(l => (
                            <option key={l} value={l}>{l}</option>
                        ))}
                    </select>
                </div>

                {/* Distance */}
                <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        Distance cible *
                    </label>
                    <select
                        value={formData.distance}
                        onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                        className="w-full p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Sélectionnez une distance</option>
                        {DISTANCES.map(d => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                </div>

                {/* Temps cible */}
                <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        Temps cible (optionnel)
                    </label>
                    <input
                        type="text"
                        value={formData.targetTime}
                        onChange={(e) => setFormData({ ...formData, targetTime: e.target.value })}
                        placeholder="Ex: 1h45min, 45min, 3h30..."
                        className="w-full p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Nombre de semaines */}
                <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        Nombre de semaines : {formData.weeks}
                    </label>
                    <input
                        type="range"
                        min="4"
                        max="16"
                        value={formData.weeks}
                        onChange={(e) => setFormData({ ...formData, weeks: parseInt(e.target.value) })}
                        className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>4 sem</span>
                        <span>16 sem</span>
                    </div>
                </div>

                {/* Séances par semaine */}
                <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        Séances par semaine : {formData.sessionsPerWeek}
                    </label>
                    <input
                        type="range"
                        min="2"
                        max="6"
                        value={formData.sessionsPerWeek}
                        onChange={(e) => setFormData({ ...formData, sessionsPerWeek: parseInt(e.target.value) })}
                        className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>2/sem</span>
                        <span>6/sem</span>
                    </div>
                </div>

                {/* Jours d'entraînement */}
                <div>
                    <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                        Jours d'entraînement * (sélectionnez {formData.sessionsPerWeek})
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {DAYS.map(day => (
                            <button
                                key={day}
                                type="button"
                                onClick={() => handleDayToggle(day)}
                                className={`p-3 rounded-lg font-bold transition-all ${formData.trainingDays.includes(day)
                                    ? 'bg-blue-700 dark:bg-blue-600 text-white shadow-xl scale-105 border-2 border-blue-900 dark:border-blue-300'
                                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-gray-300 dark:border-gray-600'
                                    }`}
                            >
                                {day}
                            </button>
                        ))}
                    </div>
                    {dayCountMismatch && (
                        <p className="mt-2 text-sm text-orange-600 dark:text-orange-400">
                            ⚠️ Vous avez sélectionné {formData.trainingDays.length} jour{formData.trainingDays.length > 1 ? 's' : ''},
                            mais {formData.sessionsPerWeek} séance{formData.sessionsPerWeek > 1 ? 's' : ''} par semaine.
                        </p>
                    )}
                </div>

                {/* Submit - Floating Button */}
                <div className="pb-32"> {/* Spacer to ensure content isn't hidden behind button */}
                    <button
                        type="submit"
                        disabled={!isValid}
                        className={`btn-floating p-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform ${isValid
                            ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white hover:scale-105'
                            : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                            }`}
                    >
                        <Play size={24} fill="currentColor" />
                        {isValid ? "Générer mon plan" : "Remplissez les champs *"}
                    </button>
                </div>
            </form>
        </div>
    );
};
