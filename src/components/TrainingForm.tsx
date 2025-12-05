import React, { useState } from 'react';
import { Play, Info, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store/useStore';

interface TrainingFormData {
    distance: string;
    customDistance: string;
    targetTime: string;
    weeks: number;
    sessionsPerWeek: number;
    trainingDays: string[];
    level: string;
}

interface TrainingFormProps {
    onSubmit: (data: TrainingFormData) => void;
}

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
const DISTANCES = ['5KM', '10KM', 'HALF_MARATHON', 'MARATHON', 'OTHER'];
const LEVELS = ['BEGINNER', 'OCCASIONAL', 'REGULAR', 'CONFIRMED', 'EXPERT'];

const Tooltip: React.FC<{ text: string }> = ({ text }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div
            className="relative inline-flex items-center ml-2 align-middle"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            <Info
                size={16}
                className={`transition-colors cursor-help ${isVisible ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500'}`}
            />
            {isVisible && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl z-[100] animate-fadeIn">
                    <span className="block whitespace-normal leading-relaxed text-center">{text}</span>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                </div>
            )}
        </div>
    );
};

export const TrainingForm: React.FC<TrainingFormProps> = ({ onSubmit }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState<TrainingFormData>({
        distance: '',
        customDistance: '',
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

    const isDistanceValid = formData.distance !== 'OTHER' || (formData.distance === 'OTHER' && formData.customDistance.trim().length > 0);
    const isValid = formData.distance && isDistanceValid && formData.trainingDays.length === formData.sessionsPerWeek && formData.level;
    const dayCountMismatch = formData.trainingDays.length > 0 && formData.trainingDays.length !== formData.sessionsPerWeek;

    return (
        <div className="max-w-2xl mx-auto p-6 pb-40">
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                    {t('form.welcome')}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {t('form.intro')}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Niveau */}
                <div>
                    <label className="flex items-center text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        {t('form.level')}
                        <Tooltip text={t('form.tooltips.level')} />
                    </label>
                    <select
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                        className="w-full p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">{t('form.selectLevel')}</option>
                        {LEVELS.map(l => (
                            <option key={l} value={l}>{t(`levels.${l}`)}</option>
                        ))}
                    </select>
                </div>

                {/* Distance */}
                <div>
                    <label className="flex items-center text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        {t('form.distance')}
                        <Tooltip text={t('form.tooltips.distance')} />
                    </label>
                    <div className="space-y-3">
                        <select
                            value={formData.distance}
                            onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                            className="w-full p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">{t('form.selectDistance')}</option>
                            {DISTANCES.map(d => (
                                <option key={d} value={d}>{t(`distances.${d}`)}</option>
                            ))}
                        </select>

                        {formData.distance === 'OTHER' && (
                            <input
                                type="text"
                                value={formData.customDistance}
                                onChange={(e) => setFormData({ ...formData, customDistance: e.target.value })}
                                placeholder={t('form.otherDistancePlaceholder')}
                                className="w-full p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 animate-fadeIn"
                                required
                            />
                        )}
                    </div>
                </div>

                {/* Temps cible */}
                <div>
                    <label className="flex items-center text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        {t('form.targetTime')}
                        <Tooltip text={t('form.tooltips.time')} />
                    </label>
                    <input
                        type="text"
                        value={formData.targetTime}
                        onChange={(e) => setFormData({ ...formData, targetTime: e.target.value })}
                        placeholder={t('form.targetTimePlaceholder')}
                        className="w-full p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Nombre de semaines */}
                <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        {t('form.weeks', { count: formData.weeks })}
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
                        <span>{t('form.weeksMin')}</span>
                        <span>{t('form.weeksMax')}</span>
                    </div>
                </div>

                {/* Séances par semaine */}
                <div>
                    <label className="flex items-center text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        {t('form.sessionsPerWeek', { count: formData.sessionsPerWeek })}
                        <Tooltip text={t('form.tooltips.sessions')} />
                    </label>
                    <input
                        type="range"
                        min="2"
                        max="7"
                        value={formData.sessionsPerWeek}
                        onChange={(e) => setFormData({ ...formData, sessionsPerWeek: parseInt(e.target.value) })}
                        className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>{t('form.sessionsMin')}</span>
                        <span>{t('form.sessionsMax')}</span>
                    </div>
                </div>

                {/* Jours d'entraînement */}
                <div>
                    <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                        {t('form.trainingDays', { count: formData.sessionsPerWeek })}
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
                                {t(`days.${day}`)}
                            </button>
                        ))}
                    </div>
                    {dayCountMismatch && (
                        <p className="mt-2 text-sm text-orange-600 dark:text-orange-400">
                            {t('form.dayMismatch', { days: formData.trainingDays.length, sessions: formData.sessionsPerWeek, plural: formData.trainingDays.length > 1 ? 's' : '' })}
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
                        {isValid ? t('form.submit') : t('form.fillRequired')}
                    </button>
                </div>
            </form>
        </div>
    );
};
