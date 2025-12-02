import React, { useState } from 'react';
import { Calendar, ChevronRight, Share2, Check } from 'lucide-react';
import { UserGoal } from '../store/useStore';

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
    return (
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-700 dark:to-blue-600 rounded-xl p-4 text-white shadow-lg mb-4">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🏃</span>
                <h3 className="font-bold text-lg">
                    {goal.distance}
                    {goal.targetTime && ` en ${goal.targetTime}`}
                </h3>
            </div>
            <div className="flex gap-4 text-sm opacity-90">
                <span>📅 {goal.weeks} semaines</span>
                <span>💪 {goal.sessionsPerWeek} séances/sem</span>
            </div>
        </div>
    );
};

const ExportButton: React.FC<{ plan: Week[]; goal?: UserGoal | null }> = ({ plan, goal }) => {
    const [copied, setCopied] = useState(false);

    const exportPlan = () => {
        let text = '';

        if (goal) {
            text += `🏃 Plan ${goal.distance}${goal.targetTime ? ` - ${goal.targetTime}` : ''}\n`;
            text += `📅 ${goal.weeks} semaines - ${goal.sessionsPerWeek} séances/sem\n\n`;
        } else {
            text += `🏃 Plan d'Entraînement\n\n`;
        }

        plan.forEach(week => {
            text += `Semaine ${week.number} :\n`;
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
                    <span className="text-green-600">Copié !</span>
                </>
            ) : (
                <>
                    <Share2 size={20} />
                    <span>Copier le plan</span>
                </>
            )}
        </button>
    );
};

const SessionCard: React.FC<{ session: Session }> = ({ session }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

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
    return (
        <div className="space-y-4 pb-20">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 px-2">Votre Plan d'Entraînement</h2>

            {goal && <GoalSummary goal={goal} />}
            <ExportButton plan={plan} goal={goal} />

            {plan.map((week) => (
                <div key={week.number} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 border-b border-blue-100 dark:border-blue-900/30 flex justify-between items-center">
                        <h3 className="font-semibold text-blue-800 dark:text-blue-300">Semaine {week.number}</h3>
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">{week.sessions.length} séances</span>
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
