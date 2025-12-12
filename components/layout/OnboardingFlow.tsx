import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearningStore } from '@/lib/learningState';
import type { UserProfile } from '@/types/learning';

interface SelfAssessmentQuestion {
  id: string;
  question: string;
  options: { value: number; label: string }[];
}

const SELF_ASSESSMENT_QUESTIONS: SelfAssessmentQuestion[] = [
  {
    id: 'q1',
    question: 'How familiar are you with quantum computing concepts?',
    options: [
      { value: 0, label: 'Never heard of it' },
      { value: 1, label: 'Heard of it, but don\'t understand it' },
      { value: 2, label: 'Understand basic concepts' },
      { value: 3, label: 'Comfortable with quantum mechanics' }
    ]
  },
  {
    id: 'q2',
    question: 'Have you worked with quantum algorithms or circuits before?',
    options: [
      { value: 0, label: 'No experience' },
      { value: 1, label: 'Read about them' },
      { value: 2, label: 'Experimented with simulators' },
      { value: 3, label: 'Built quantum programs' }
    ]
  },
  {
    id: 'q3',
    question: 'What\'s your background in mathematics and physics?',
    options: [
      { value: 0, label: 'High school level' },
      { value: 1, label: 'Some college courses' },
      { value: 2, label: 'Undergraduate degree' },
      { value: 3, label: 'Graduate level or higher' }
    ]
  }
];

const PROFILE_OPTIONS: Array<{
  type: UserProfile['type'];
  label: string;
  description: string;
}> = [
    {
      type: 'developer',
      label: 'Developer',
      description: 'I want to build quantum applications'
    },
    {
      type: 'student',
      label: 'Student',
      description: 'I\'m learning quantum computing'
    },
    {
      type: 'founder',
      label: 'Founder',
      description: 'I want to understand quantum for my business'
    },
    {
      type: 'researcher',
      label: 'Researcher',
      description: 'I\'m exploring quantum computing research'
    }
  ];

interface OnboardingFlowProps {
  onComplete: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState<'welcome' | 'assessment' | 'profile'>('welcome');
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<string, number>>({});
  const [selectedProfile, setSelectedProfile] = useState<UserProfile['type'] | null>(null);
  const completeOnboarding = useLearningStore(state => state.completeOnboarding);

  const handleAssessmentAnswer = (questionId: string, value: number) => {
    setAssessmentAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleAssessmentComplete = () => {
    if (Object.keys(assessmentAnswers).length === SELF_ASSESSMENT_QUESTIONS.length) {
      setStep('profile');
    }
  };

  const handleProfileSelect = (profileType: UserProfile['type']) => {
    setSelectedProfile(profileType);
  };

  const handleComplete = () => {
    if (!selectedProfile) return;

    const totalScore = Object.values(assessmentAnswers).reduce((sum, val) => sum + val, 0);
    const profile: UserProfile = {
      type: selectedProfile,
      onboardingCompleted: true,
      selfAssessmentScore: totalScore
    };

    completeOnboarding(profile);
    onComplete();
  };

  const allQuestionsAnswered = Object.keys(assessmentAnswers).length === SELF_ASSESSMENT_QUESTIONS.length;

  return (
    <div className="fixed inset-0 bg-void-950 flex items-center justify-center p-4 z-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#1e293b_0%,_#020617_100%)] opacity-80" />
      <div className="absolute inset-0 bg-[url('/scanline.png')] opacity-5 bg-repeat-y bg-[length:100%_4px] pointer-events-none" />

      <AnimatePresence mode="wait">
        {step === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-void-900 border-2 border-void-700 p-8 max-w-2xl w-full shadow-[8px_8px_0_rgba(0,0,0,0.5)] relative z-10"
          >
            <h1 className="text-4xl font-display text-white mb-6 uppercase tracking-wide text-shadow-sm text-center">
              System_Output: Welcome
            </h1>
            <p className="text-lg font-mono text-slate-400 mb-8 text-center leading-relaxed">
              &gt; INITIALIZING_USER_PROTOCOL...
              <br />
              &gt; PERSONALIZATION_REQUIRED.
            </p>
            <button
              onClick={() => setStep('assessment')}
              className="w-full bg-quantum-600 border-2 border-quantum-400 text-void-950 py-4 px-6 font-display uppercase tracking-wider text-lg shadow-[4px_4px_0_rgba(34,211,238,0.3)] hover:bg-quantum-500 hover:translate-y-[-2px] hover:shadow-[6px_6px_0_rgba(34,211,238,0.3)] active:translate-y-0 active:shadow-none transition-all"
            >
              Initiate_Assessment
            </button>
          </motion.div>
        )}

        {step === 'assessment' && (
          <motion.div
            key="assessment"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-void-900 border-2 border-void-700 p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-[8px_8px_0_rgba(0,0,0,0.5)] relative z-10 custom-scrollbar"
          >
            <h2 className="text-3xl font-display text-white mb-2 uppercase tracking-wide">
              Self_Assessment_Log
            </h2>
            <p className="font-mono text-slate-500 mb-8 border-b-2 border-void-800 pb-4">
              &gt; CALIBRATING_DIFFICULTY_PARAMETERS...
            </p>

            <div className="space-y-8">
              {SELF_ASSESSMENT_QUESTIONS.map((q, index) => (
                <div key={q.id} className="space-y-4">
                  <h3 className="text-lg font-mono text-slate-300">
                    <span className="text-quantum-500 mr-2">[{index + 1}]</span>
                    {q.question}
                  </h3>
                  <div className="space-y-2 pl-4">
                    {q.options.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleAssessmentAnswer(q.id, option.value)}
                        className={`w-full text-left p-4 border-2 transition-all font-mono text-sm ${assessmentAnswers[q.id] === option.value
                            ? 'border-quantum-500 bg-quantum-900/20 text-quantum-400 shadow-[2px_2px_0_rgba(34,211,238,0.2)]'
                            : 'border-void-700 text-slate-500 hover:border-quantum-500 hover:text-slate-300 bg-void-950'
                          }`}
                      >
                        {assessmentAnswers[q.id] === option.value && (
                          <span className="text-quantum-500 mr-2">&gt;</span>
                        )}
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleAssessmentComplete}
              disabled={!allQuestionsAnswered}
              className={`w-full mt-8 py-4 px-6 font-display uppercase tracking-wider text-lg transition-all border-2 ${allQuestionsAnswered
                  ? 'bg-quantum-600 border-quantum-400 text-void-950 shadow-[4px_4px_0_rgba(34,211,238,0.3)] hover:bg-quantum-500 hover:translate-y-[-2px]'
                  : 'bg-void-800 border-void-600 text-void-600 cursor-not-allowed'
                }`}
            >
              Proceed_Next_Step
            </button>
          </motion.div>
        )}

        {step === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-void-900 border-2 border-void-700 p-8 max-w-3xl w-full shadow-[8px_8px_0_rgba(0,0,0,0.5)] relative z-10"
          >
            <h2 className="text-3xl font-display text-white mb-2 uppercase tracking-wide">
              Select_Profile_Class
            </h2>
            <p className="font-mono text-slate-500 mb-8 border-b-2 border-void-800 pb-4">
              &gt; OPTIMIZING_LEARNING_PATH...
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {PROFILE_OPTIONS.map((profile) => (
                <button
                  key={profile.type}
                  onClick={() => handleProfileSelect(profile.type)}
                  className={`p-6 border-2 text-left transition-all ${selectedProfile === profile.type
                      ? 'border-quantum-500 bg-quantum-900/20 shadow-[4px_4px_0_rgba(34,211,238,0.2)]'
                      : 'border-void-700 hover:border-quantum-500 hover:bg-void-800 bg-void-950'
                    }`}
                >
                  <h3 className={`text-xl font-display mb-2 uppercase tracking-wide ${selectedProfile === profile.type ? 'text-quantum-400' : 'text-slate-300'
                    }`}>
                    {profile.label}
                  </h3>
                  <p className="text-xs font-mono text-slate-500">
                    &gt; {profile.description}
                  </p>
                </button>
              ))}
            </div>

            <button
              onClick={handleComplete}
              disabled={!selectedProfile}
              className={`w-full py-4 px-6 font-display uppercase tracking-wider text-lg transition-all border-2 ${selectedProfile
                  ? 'bg-quantum-600 border-quantum-400 text-void-950 shadow-[4px_4px_0_rgba(34,211,238,0.3)] hover:bg-quantum-500 hover:translate-y-[-2px]'
                  : 'bg-void-800 border-void-600 text-void-600 cursor-not-allowed'
                }`}
            >
              Start_Simulation
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
