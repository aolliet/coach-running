import create from 'zustand';
import { persist } from 'zustand/middleware';
import { Week } from '../components/PlanView';

export interface UserGoal {
    distance: string;
    customDistance?: string;
    targetTime?: string;
    weeks: number;
    sessionsPerWeek: number;
    trainingDays: string[];
}

interface AppState {
    activeTab: 'form' | 'plan';
    plan: Week[] | null;
    currentGoal: UserGoal | null;
    setActiveTab: (tab: 'form' | 'plan') => void;
    setPlan: (plan: Week[] | null) => void;
    setCurrentGoal: (goal: UserGoal) => void;
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            activeTab: 'form',
            plan: null,
            currentGoal: null,
            setActiveTab: (tab) => set({ activeTab: tab }),
            setPlan: (plan) => set({ plan }),
            setCurrentGoal: (goal) => set({ currentGoal: goal }),
        }),
        {
            name: 'coach-running-storage',
        }
    )
);
