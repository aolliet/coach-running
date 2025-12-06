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
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-3 rounded-lg shadow-2xl z-[100] animate-fadeIn bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700">
                    <span className="block text-center text-sm">{text}</span>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white dark:border-t-gray-900" />
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
        <div className="w-full max-w-4xl mx-auto pb-44 px-4 sm:px-6">
            <div className="text-center mb-8 pt-4">
                <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                    {t('form.welcome')}
                </h2>
                <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
                    {t('form.intro')}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="">
                {/* Niveau */}
                <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <label className="flex items-center text-lg font-semibold mb-3 text-gray-800 dark:text-white">
                        {t('form.level')} *
                        <Tooltip text={t('form.tooltips.level')} />
                    </label>
                    <select
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                        className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white transition-all outline-none text-base cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                        required
                    >
                        <option value="">{t('form.selectLevel')}</option>
                        {LEVELS.map(l => (
                            <option key={l} value={l}>{t(`levels.${l}`)}</option>
                        ))}
                    </select>
                </div>

                {/* Distance et Temps */}
                <div className="grid md:grid-cols-2 gap-6 mt-8">
                    <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <label className="flex items-center text-lg font-semibold mb-3 text-gray-800 dark:text-white">
                            {t('form.distance')}
                            <Tooltip text={t('form.tooltips.distance')} />
                        </label>
                        <div className="space-y-3">
                            <select
                                value={formData.distance}
                                onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                                className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white transition-all outline-none text-base cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
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
                                    className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 transition-all outline-none text-base animate-fadeIn"
                                    required
                                />
                            )}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <label className="flex items-center text-lg font-semibold mb-3 text-gray-800 dark:text-white">
                            {t('form.targetTime')}
                            <Tooltip text={t('form.tooltips.time')} />
                        </label>
                        <input
                            type="text"
                            value={formData.targetTime}
                            onChange={(e) => setFormData({ ...formData, targetTime: e.target.value })}
                            placeholder={t('form.targetTimePlaceholder')}
                            className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 transition-all outline-none text-base"
                        />
                    </div>
                </div>

                {/* Weeks and Sessions */}
                <div className="grid md:grid-cols-2 gap-6 mt-8">
                    <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <label className="block text-lg font-semibold mb-3 text-gray-800 dark:text-white">
                            {t('form.weeks', { count: formData.weeks })}
                        </label>
                        <input
                            type="range"
                            min="4"
                            max="16"
                            value={formData.weeks}
                            onChange={(e) => setFormData({ ...formData, weeks: parseInt(e.target.value) })}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
                        />
                        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">
                            <span>{t('form.weeksMin')}</span>
                            <span>{t('form.weeksMax')}</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <label className="flex items-center text-lg font-semibold mb-3 text-gray-800 dark:text-white">
                            {t('form.sessionsPerWeek', { count: formData.sessionsPerWeek })}
                            <Tooltip text={t('form.tooltips.sessions')} />
                        </label>
                        <input
                            type="range"
                            min="2"
                            max="7"
                            value={formData.sessionsPerWeek}
                            onChange={(e) => setFormData({ ...formData, sessionsPerWeek: parseInt(e.target.value) })}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
                        />
                        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">
                            <span>{t('form.sessionsMin')}</span>
                            <span>{t('form.sessionsMax')}</span>
                        </div>
                    </div>
                </div>

                {/* Training Days */}
                <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 mt-8">
                    <label className="block text-lg font-semibold mb-6 text-gray-800 dark:text-white">
                        {t('form.trainingDays', { count: formData.sessionsPerWeek })}
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                        {DAYS.map(day => (
                            <button
                                key={day}
                                type="button"
                                onClick={() => handleDayToggle(day)}
                                className={`p-3 rounded-lg font-bold transition-all text-sm border-2 shadow-sm ${formData.trainingDays.includes(day)
                                    ? 'bg-blue-700 dark:bg-blue-600 text-white border-blue-900 dark:border-blue-300 shadow-md transform scale-105'
                                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {t(`days.${day}`)}
                            </button>
                        ))}
                    </div>
                    {dayCountMismatch && (
                        <p className="mt-4 text-sm text-orange-600 dark:text-orange-400 flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-100 dark:border-orange-900/30">
                            <Info size={18} className="shrink-0" />
                            {t('form.dayMismatch', { days: formData.trainingDays.length, sessions: formData.sessionsPerWeek, plural: formData.trainingDays.length > 1 ? 's' : '' })}
                        </p>
                    )}
                </div>

                {/* Submit */}
                <div className="pb-48 flex justify-center w-full px-4">
                    <button
                        type="submit"
                        disabled={!isValid}
                        className={`btn-floating py-5 px-6 w-[95%] md:w-[800px] max-w-5xl rounded-full font-bold text-xl flex items-center justify-center gap-3 transition-all transform shadow-2xl ${isValid
                            ? 'bg-blue-700 hover:bg-blue-800 text-white hover:scale-[1.02]'
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
