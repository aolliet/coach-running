import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { TrainingForm } from './components/TrainingForm';
import { PlanView } from './components/PlanView';
import { useStore } from './store/useStore';
import { generatePlanWithAI } from './utils/planGenerator';
import { Calendar, Target } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function App() {
  const { t, i18n } = useTranslation();
  const { activeTab, plan, currentGoal, setActiveTab, setPlan, setCurrentGoal } = useStore();
  const [isGenerating, setIsGenerating] = useState(false);

  // Always start on the form tab
  useEffect(() => {
    setActiveTab('form');
  }, []);

  const handleFormSubmit = async (formData: any) => {
    setActiveTab('plan');
    setCurrentGoal(formData);
    setPlan(null); // Clear plan before generation
    setIsGenerating(true);

    try {
      const newPlan = await generatePlanWithAI({
        distance: formData.distance,
        customDistance: formData.customDistance,
        targetTime: formData.targetTime,
        weeks: formData.weeks,
        sessionsPerWeek: formData.sessionsPerWeek,
        trainingDays: formData.trainingDays,
        level: formData.level,
        language: i18n.language
      });

      setPlan(newPlan);
    } catch (error) {
      console.error('Error generating plan:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col h-full pb-16">
        {activeTab === 'form' ? (
          <TrainingForm onSubmit={handleFormSubmit} />
        ) : (
          <div className="h-full overflow-y-auto">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">{t('form.generating')}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">{t('form.generatingSub')}</p>
              </div>
            ) : plan ? (
              <PlanView plan={plan} goal={currentGoal} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <p className="text-gray-500 dark:text-gray-400">{t('form.noPlan')}</p>
                <button onClick={() => setActiveTab('form')} className="mt-4 text-blue-600 dark:text-blue-400 font-medium">{t('form.createPlan')}</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation - Glassmorphism */}
      <div className="fixed bottom-0 left-0 right-0 glass flex justify-around p-4 z-40 transition-all">
        <button
          onClick={() => setActiveTab('form')}
          className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 ${activeTab === 'form' ? 'nav-item-active font-bold' : 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        >
          <Target size={24} strokeWidth={activeTab === 'form' ? 2.5 : 2} />
          <span className={`${activeTab === 'form' ? 'block' : 'hidden'} text-sm`}>{t('nav.goal')}</span>
        </button>
        <button
          onClick={() => setActiveTab('plan')}
          className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 ${activeTab === 'plan' ? 'nav-item-active font-bold' : 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        >
          <Calendar size={24} strokeWidth={activeTab === 'plan' ? 2.5 : 2} />
          <span className={`${activeTab === 'plan' ? 'block' : 'hidden'} text-sm`}>{t('nav.plan')}</span>
        </button>
      </div>
    </Layout >
  )
}

export default App
