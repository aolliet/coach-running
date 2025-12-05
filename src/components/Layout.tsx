import React, { useEffect, useState } from 'react';
import { Moon, Sun, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [darkMode, setDarkMode] = useState(false);
    const { i18n } = useTranslation();

    useEffect(() => {
        const isDark = localStorage.getItem('darkMode') === 'true';
        setDarkMode(isDark);
        if (isDark) {
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem('darkMode', String(newMode));
        document.documentElement.classList.toggle('dark');
    };

    const toggleLanguage = () => {
        const newLang = i18n.language === 'fr' ? 'en' : 'fr';
        i18n.changeLanguage(newLang);
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-colors">
            <header className="bg-white dark:bg-gray-900 shadow-sm p-4 sticky top-0 z-10 flex items-center justify-between transition-colors border-b border-gray-100 dark:border-gray-800">
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.02em', fontWeight: 800 }}>
                    CoachRunning
                </h1>
                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-semibold text-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 min-w-[70px] justify-center"
                    >
                        <Globe size={18} className="dark:text-white" />
                        <span>{i18n.language.toUpperCase()}</span>
                    </button>
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        aria-label="Toggle dark mode"
                    >
                        {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-600" />}
                    </button>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto p-4 relative">
                {children}
            </main>
        </div>
    );
};
