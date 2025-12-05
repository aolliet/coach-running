import React, { useState } from 'react';
import { Calendar, ChevronRight, Share2, Check } from 'lucide-react';
import { UserGoal } from '../store/useStore';
import { useTranslation } from 'react-i18next';

export interface Session {
    day: string;
    type: string;
    description: string;
    completed: boolean;
}

export interface Week {
    number: number;
    sessions: Session[];
}

interface PlanViewProps {
    plan: Week[];
    goal?: UserGoal | null;
}

const GoalSummary: React.FC<{ goal: UserGoal }> = ({ goal }) => {
    const { t } = useTranslation();
    return (
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-700 dark:to-blue-600 rounded-xl p-4 text-white shadow-lg mb-4">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🏃</span>
                <h3 className="font-bold text-lg">
                    {goal.distance === 'OTHER' && goal.customDistance ? goal.customDistance : t(`distances.${goal.distance}`)}
                    {goal.targetTime && ` - ${goal.targetTime}`}
                </h3>
            </div>
            <div className="flex gap-4 text-sm opacity-90">
                <span>📅 {t('form.weeks', { count: goal.weeks })}</span>
                <span>💪 {t('form.sessionsPerWeek', { count: goal.sessionsPerWeek })}</span>
            </div>
        </div>
    );
};

const ExportButton: React.FC<{ plan: Week[]; goal?: UserGoal | null }> = ({ plan, goal }) => {
    const [copied, setCopied] = useState(false);
    const { t } = useTranslation();

    const exportPlan = () => {
        let text = '';

        if (goal) {
            const distanceLabel = goal.distance === 'OTHER' && goal.customDistance ? goal.customDistance : t(`distances.${goal.distance}`);
            text += `🏃 ${t('plan.title')} - ${distanceLabel}${goal.targetTime ? ` - ${goal.targetTime}` : ''}\n`;
            text += `📅 ${t('form.weeks', { count: goal.weeks })} - ${t('form.sessionsPerWeek', { count: goal.sessionsPerWeek })}\n\n`;
        } else {
            text += `🏃 ${t('plan.exportTitle')}\n\n`;
        }

        plan.forEach(week => {
            text += `${t('common.week')} ${week.number} :\n`;
            week.sessions.forEach(session => {
                text += `- ${session.day} : ${session.type}\n  ${session.description}\n`;
            });
            text += '\n';
        });

        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <button
            onClick={exportPlan}
            className="w-full mb-4 py-3 px-4 rounded-xl bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all flex items-center justify-center gap-2 font-medium text-gray-700 dark:text-gray-300"
        >
            {copied ? (
                <>
                    <Check size={20} className="text-green-600" />
                    <span className="text-green-600">{t('common.copied')}</span>
                </>
            ) : (
                <>
                    <Share2 size={20} />
                    <span>{t('common.copy')}</span>
                </>
            )}
        </button>
    );
};



const CsvExportButton: React.FC<{ plan: Week[]; goal?: UserGoal | null }> = ({ plan, goal }) => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [startDate, setStartDate] = useState('');
    const { t } = useTranslation();

    const parseSessionDetails = (description: string) => {
        // Extract duration (e.g., "45 min", "1h30", "1h15")
        const durationMatch = description.match(/(\d+h\d+|\d+h|\d+\s*min)/i);
        const duration = durationMatch ? durationMatch[0] : '';

        // Extract pace with time - look for patterns like:
        // - "allure fondamentale" or "easy run" or "tempo"
        // - Time patterns: "5:40/km", "5:40", "à 5:40/km"
        let pace = '';
        let paceTime = '';

        // First look for explicit pace descriptions
        const paceDescMatch = description.match(/(allure\s+\w+|easy\s+run|tempo|race\s+pace|fondamentale|course|seuil)/i);
        if (paceDescMatch) {
            pace = paceDescMatch[0];
        }

        // Then look for time patterns near the pace description
        const paceTimeMatch = description.match(/(\d+:\d+)\s*(?:\/\s*km|min\s*\/\s*km)?/i);
        if (paceTimeMatch) {
            paceTime = paceTimeMatch[1] + '/km';
        }

        // Combine pace description with time if both exist
        const finalPace = pace && paceTime ? `${pace} (${paceTime})` : pace || paceTime;

        // Extract recovery info - be more specific to avoid confusion with pace times
        // Look for: "30/30", "récup 2 min", "recovery 90s", "30s récup", "2' récup"
        let recovery = '';

        // Pattern 1: X/Y format (e.g., "30/30", "400/200")
        const xyRecovery = description.match(/(\d+)\s*\/\s*(\d+)(?!\s*km)/i);
        if (xyRecovery) {
            recovery = `${xyRecovery[1]}/${xyRecovery[2]}`;
        } else {
            // Pattern 2: Explicit recovery mentions
            const recoveryMatch = description.match(/(?:récup(?:ération)?|recovery)\s*:?\s*(\d+\s*(?:min|s|'|"))/i) ||
                description.match(/(\d+\s*(?:min|s|'|"))\s*(?:récup(?:ération)?|recovery)/i);
            if (recoveryMatch) {
                recovery = recoveryMatch[1] || recoveryMatch[0];
            }
        }

        return { duration, pace: finalPace, recovery };
    };

    const exportToCsv = () => {
        if (!startDate) {
            setShowDatePicker(true);
            return;
        }

        const start = new Date(startDate);
        const csvRows = [];

        // Header
        csvRows.push([
            t('plan.csvWeek'),
            t('plan.csvDay'),
            t('plan.csvType'),
            t('plan.csvPace'),
            t('plan.csvRecovery'),
            t('plan.csvDuration'),
            t('plan.csvDetails')
        ].join(','));

        // Data rows
        let currentDate = new Date(start);
        plan.forEach(week => {
            week.sessions.forEach(session => {
                const { duration, pace, recovery } = parseSessionDetails(session.description);
                const dateStr = currentDate.toLocaleDateString();

                csvRows.push([
                    week.number,
                    `"${dateStr} (${session.day})"`,
                    `"${session.type}"`,
                    `"${pace}"`,
                    `"${recovery}"`,
                    `"${duration}"`,
                    `"${session.description}"`
                ].join(','));

                currentDate.setDate(currentDate.getDate() + 1);
            });
        });

        const csvContent = csvRows.join('\n');
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `training-plan-${startDate}.csv`;
        link.click();

        setShowDatePicker(false);
    };

    return (
        <>
            <button
                onClick={() => setShowDatePicker(true)}
                className="w-full mb-4 py-3 px-4 rounded-xl bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all flex items-center justify-center gap-2 font-medium text-gray-700 dark:text-gray-300"
            >
                <Share2 size={20} />
                <span>{t('plan.exportCsv')}</span>
            </button>

            {showDatePicker && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 animate-fadeIn">
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        {t('plan.startDate')}
                    </label>
                    <div className="flex flex-col gap-3">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDatePicker(false)}
                                className="flex-1 py-2 px-4 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                            >
                                {t('plan.cancel')}
                            </button>
                            <button
                                onClick={exportToCsv}
                                disabled={!startDate}
                                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${startDate
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                                    : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                    }`}
                            >
                                {t('plan.export')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

const SessionCard: React.FC<{ session: Session }> = ({ session }) => {
    const [isExpanded, setIsExpanded] = React.useState(true);

    return (
        <div
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        >
            <div className={`p-2 rounded-lg mt-1 ${session.completed ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
                <Calendar size={18} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-gray-900 dark:text-white">{session.day}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 shrink-0 ml-2">{session.type}</span>
                </div>
                <p className={`text-sm text-gray-500 dark:text-gray-400 transition-all ${isExpanded ? 'whitespace-pre-wrap' : 'line-clamp-2'}`}>
                    {session.description}
                </p>
            </div>
            <ChevronRight
                size={16}
                className={`text-gray-300 dark:text-gray-600 transition-transform mt-1 shrink-0 ${isExpanded ? 'rotate-90' : ''}`}
            />
        </div>
    );
};

export const PlanView: React.FC<PlanViewProps> = ({ plan, goal }) => {
    const { t } = useTranslation();
    return (
        <div className="space-y-4 pb-20">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 px-2">{t('plan.title')}</h2>

            {goal && <GoalSummary goal={goal} />}
            <ExportButton plan={plan} goal={goal} />
            <CsvExportButton plan={plan} goal={goal} />

            {plan.map((week) => (
                <div key={week.number} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 border-b border-blue-100 dark:border-blue-900/30 flex justify-between items-center">
                        <h3 className="font-semibold text-blue-800 dark:text-blue-300">{t('common.week')} {week.number}</h3>
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">{week.sessions.length} {t('common.sessions')}</span>
                    </div>
                    <div className="divide-y divide-gray-50 dark:divide-gray-800">
                        {week.sessions.map((session, idx) => (
                            <SessionCard key={idx} session={session} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
