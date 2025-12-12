import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ModuleData } from '../types';
import { Quiz } from './learning/Quiz';
import { MasteryIndicator } from './learning/MasteryIndicator';
import { IntroComparison } from './interactives/IntroComparison';
import { BitsVsQubits } from './interactives/BitsVsQubits';
import { EntanglementDemo } from './interactives/EntanglementDemo';
import { GroverDemo } from './interactives/GroverDemo';
import { useLearningStore } from '../lib/learningState';
import { useXPNotification } from '../lib/xpContext';
import { XP_REWARDS } from '../lib/xpSystem';
import { Star } from 'lucide-react';

interface ModuleViewProps {
  module: ModuleData;
  onModuleComplete: () => void;
  onNext: () => void;
  isLastModule: boolean;
}

export const ModuleView: React.FC<ModuleViewProps> = ({ module, onModuleComplete, onNext, isLastModule }) => {
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showCompletionSummary, setShowCompletionSummary] = useState(false);
  const [selfRating, setSelfRating] = useState<number | null>(null);
  const [showRetrievalPractice, setShowRetrievalPractice] = useState(false);

  const { modules, setSelfRating: recordSelfRating, completeInteraction, addXP } = useLearningStore();
  const { showXPGain } = useXPNotification();
  const moduleProgress = modules[module.id];
  const masteryLevel = moduleProgress?.masteryLevel || 0;
  const isCompleted = moduleProgress?.completed || false;
  const [wasCompleted, setWasCompleted] = useState(isCompleted);

  // Reset quiz state when module changes
  useEffect(() => {
    setQuizCompleted(false);
    setShowCompletionSummary(false);
    setSelfRating(null);
    setShowRetrievalPractice(false);
  }, [module.id]);

  const handleQuizPass = () => {
    setQuizCompleted(true);
    setShowCompletionSummary(true);
  };

  const handleSelfRatingSubmit = () => {
    if (selfRating !== null) {
      recordSelfRating(module.id, selfRating);

      // Check if mastery threshold is met and module just completed
      if (masteryLevel >= 70 && !wasCompleted) {
        // Award module completion XP
        addXP(XP_REWARDS.MODULE_COMPLETE, 'module-completion');
        showXPGain(XP_REWARDS.MODULE_COMPLETE, 'module-completion');
        setWasCompleted(true);
        onModuleComplete();
      }
    }
  };

  // Track module completion for XP award
  useEffect(() => {
    if (isCompleted && !wasCompleted) {
      setWasCompleted(true);
    }
  }, [isCompleted, wasCompleted]);

  const handleRetrievalPracticeComplete = () => {
    setShowRetrievalPractice(false);
    completeInteraction(module.id, 'retrieval-practice');
    // Award XP for retrieval practice
    addXP(XP_REWARDS.REVIEW_COMPLETE, 'retrieval-practice');
    showXPGain(XP_REWARDS.REVIEW_COMPLETE, 'retrieval-practice');
  };

  // Learning objectives for the module
  const getLearningObjectives = () => {
    return module.keyTakeaways.map((takeaway, idx) => ({
      id: `objective-${idx}`,
      text: takeaway
    }));
  };

  const renderInteractive = () => {
    switch (module.id) {
      case 'intro': return <IntroComparison />;
      case 'bits-qubits': return <BitsVsQubits />;
      case 'entanglement': return <EntanglementDemo />;
      case 'algorithm': return <GroverDemo />;
      case 'superposition':
        return (
          <div className="my-8 p-6 bg-void-900 border-2 border-void-800 flex flex-col items-center shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
            <div className="h-32 w-full flex items-center justify-center overflow-hidden bg-void-950 border border-void-800 relative">
              <div className="absolute inset-0 bg-[url('/scanline.png')] opacity-10 bg-repeat-y bg-[length:100%_4px] pointer-events-none" />
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="w-full h-1 bg-cyan-500/50 absolute"
              />
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                className="w-full h-1 bg-purple-500/50 absolute"
              />
              <p className="relative z-10 bg-void-900 px-4 py-1 text-xs font-mono text-slate-400 border border-void-700">VISUALIZING_INTERFERENCE</p>
            </div>
          </div>
        );
      case 'gates':
        return (
          <div className="my-8 p-6 bg-void-900 border-2 border-void-800 text-center shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
            <div className="flex justify-center gap-4 mb-4">
              {['X', 'H', 'Z'].map(g => (
                <div key={g} className="w-12 h-12 bg-void-950 border-2 border-quantum-500 flex items-center justify-center font-display text-quantum-400 shadow-[2px_2px_0_rgba(34,211,238,0.3)] hover:translate-y-[-2px] hover:shadow-[4px_4px_0_rgba(34,211,238,0.3)] transition-all cursor-default">
                  {g}
                </div>
              ))}
            </div>
            <p className="text-xs font-mono text-slate-400 max-w-md mx-auto">&gt; NOTE: Quantum Gates act like musical notes, changing the qubit phase.</p>
          </div>
        );
      case 'hardware':
        return (
          <div className="my-8 p-6 bg-void-900 border-2 border-void-800 flex flex-col items-center shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
            <div className="w-32 h-48 bg-void-950 border-2 border-void-700 relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-slate-900 via-transparent to-amber-900/20" />
              <motion.div
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="text-[10px] text-amber-500 font-mono absolute bottom-4 bg-void-900 px-2 border border-amber-900/50"
              >
                TEMP: 15mK
              </motion.div>
            </div>
            <p className="mt-4 text-xs font-mono text-slate-400">&gt; SYSTEM: DILUTION_FRIDGE</p>
          </div>
        );
      default: return null;
    }
  };

  return (
    <motion.div
      key={module.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-3xl mx-auto px-6 py-10"
    >
      <header className="mb-8 border-b-2 border-void-800 pb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h2 className="text-xs font-mono text-quantum-400 uppercase tracking-widest mb-2 bg-void-900 inline-block px-2 py-1 border border-void-800">
              Module: {module.shortTitle}
            </h2>
            <h1 className="text-4xl font-display text-white mb-4 uppercase tracking-wide text-shadow-sm">{module.title}</h1>
            <p className="text-lg text-slate-400 font-light leading-relaxed border-l-2 border-void-700 pl-4">
              {module.description}
            </p>
          </div>
          {moduleProgress && (
            <div className="flex-shrink-0">
              <MasteryIndicator masteryLevel={masteryLevel} size="medium" showLabel={true} />
            </div>
          )}
        </div>
      </header>

      <section className="mb-10">
        <div className="bg-void-900 p-6 border-2 border-void-800 shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
          <h3 className="font-display text-slate-200 mb-4 uppercase tracking-wide border-b border-void-800 pb-2">Key_Concepts</h3>
          <ul className="space-y-3">
            {module.keyTakeaways.map((point, idx) => (
              <li key={idx} className="flex items-start gap-3 text-slate-300 font-mono text-sm">
                <span className="text-quantum-500 mt-1">&gt;</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        {renderInteractive()}
      </section>

      {/* Retrieval Practice after interactive */}
      {showRetrievalPractice && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="bg-void-900 border-2 border-quantum-500/50 p-6 shadow-[4px_4px_0_rgba(34,211,238,0.2)]">
            <h3 className="text-lg font-display text-quantum-300 mb-4 uppercase tracking-wide flex items-center gap-2">
              <span className="text-xl">⚡</span> Quick_Check: Verify_Data
            </h3>
            <Quiz
              moduleId={module.id}
              questions={[{
                id: `retrieval-${module.id}`,
                question: module.quiz.question,
                options: module.quiz.options.map(opt => opt.text),
                correctAnswer: module.quiz.options.findIndex(opt => opt.isCorrect),
                explanation: module.quiz.options.find(opt => opt.isCorrect)?.explanation || '',
                requiresConfidence: true
              }]}
              onComplete={handleRetrievalPracticeComplete}
            />
          </div>
        </motion.section>
      )}

      <section className="mb-12">
        <Quiz
          moduleId={module.id}
          questions={[{
            id: `quiz-${module.id}`,
            question: module.quiz.question,
            options: module.quiz.options.map(opt => opt.text),
            correctAnswer: module.quiz.options.findIndex(opt => opt.isCorrect),
            explanation: module.quiz.options.find(opt => opt.isCorrect)?.explanation || '',
            requiresConfidence: true
          }]}
          onComplete={handleQuizPass}
        />
      </section>

      {/* Module Completion Summary */}
      {showCompletionSummary && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="bg-void-900 border-2 border-emerald-500/50 p-8 shadow-[4px_4px_0_rgba(16,185,129,0.3)] relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/scanline.png')] opacity-10 bg-repeat-y bg-[length:100%_4px] pointer-events-none" />

            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="w-12 h-12 bg-emerald-900/40 border-2 border-emerald-500 flex items-center justify-center shadow-[2px_2px_0_rgba(16,185,129,0.3)]">
                <span className="text-2xl text-emerald-400">✓</span>
              </div>
              <h3 className="text-2xl font-display text-emerald-400 uppercase tracking-wide">Module_Buffered_Successfully</h3>
            </div>

            <div className="mb-6 relative z-10">
              <h4 className="text-sm font-mono text-slate-400 mb-3 uppercase tracking-wider">
                &gt; KNOWLEDGE_ACQUISITION_LOG:
              </h4>
              <ul className="space-y-2 border-l-2 border-void-800 pl-4 py-2 bg-void-950/50">
                {getLearningObjectives().map((objective) => (
                  <li key={objective.id} className="flex items-start gap-3 text-slate-300 font-mono text-sm">
                    <span className="text-emerald-500 mt-0.5">[OK]</span>
                    <span>{objective.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Self-Rating Widget */}
            <div className="bg-void-950 border border-void-800 p-6 mb-6 relative z-10">
              <h4 className="text-sm font-display text-slate-200 mb-4 uppercase tracking-wide">
                Subjective_Understanding_Rating
              </h4>
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setSelfRating(rating)}
                    className={`
                      flex-1 py-3 font-mono text-sm transition-all border-2
                      ${selfRating === rating
                        ? 'bg-quantum-600 border-quantum-400 text-void-950 shadow-[2px_2px_0_rgba(34,211,238,0.3)] translate-y-[-2px]'
                        : 'bg-void-900 border-void-700 text-slate-400 hover:bg-void-800 hover:border-void-600'
                      }
                    `}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <Star
                        size={16}
                        fill={selfRating && selfRating >= rating ? 'currentColor' : 'none'}
                        className="stroke-2"
                      />
                      <span className="text-[10px]">{rating}</span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase">
                <span>&lt; REINFORCEMENT_NEEDED</span>
                <span>OPTIMAL_COMPREHENSION &gt;</span>
              </div>
            </div>

            {/* Mastery Status and Suggestions */}
            <div className="mb-6 relative z-10">
              <div className="flex items-center gap-4 mb-4 bg-void-900 p-3 border border-void-800">
                <MasteryIndicator masteryLevel={masteryLevel} size="small" showLabel={false} />
                <div className="flex-1">
                  <p className="text-xs font-mono text-slate-300 uppercase">
                    Current_Mastery: {Math.round(masteryLevel)}%
                  </p>
                  <div className="w-full bg-void-950 h-2 mt-1 border border-void-700">
                    <div
                      className="h-full bg-quantum-500 relative"
                      style={{ width: `${masteryLevel}%` }}
                    >
                      <div className="absolute inset-0 bg-[url('/scanline.png')] opacity-30 bg-repeat-y bg-[length:100%_2px]" />
                    </div>
                  </div>
                  {masteryLevel < 50 && (
                    <p className="text-[10px] text-yellow-500 font-mono mt-1">
                      ! ALERT: MIN_MASTERY_THRESHOLD (50%) NOT MET
                    </p>
                  )}
                </div>
              </div>

              {/* Low Mastery Suggestions */}
              {masteryLevel < 50 && (
                <div className="bg-yellow-900/20 border-2 border-yellow-600/50 p-4">
                  <h5 className="text-xs font-bold text-yellow-400 mb-2 uppercase tracking-wide">
                    &gt; IMPROVEMENT_PROTOCOLS:
                  </h5>
                  <ul className="space-y-1 text-xs font-mono text-slate-400">
                    <li>- RE_RUN_SIMULATION</li>
                    <li>- REVIEW_CORE_CONCEPTS</li>
                    <li>- RETAKE_ASSESSMENT (Note: Confidence impacts score)</li>
                    {selfRating && selfRating <= 2 && (
                      <li>- MARKED_FOR_REVIEW_QUEUE</li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 relative z-10">
              {selfRating !== null && (
                <button
                  onClick={handleSelfRatingSubmit}
                  className={`
                    flex-1 py-3 font-display uppercase tracking-wider text-sm border-2 shadow-[4px_4px_0_rgba(0,0,0,0.5)] transition-all
                    ${masteryLevel >= 70
                      ? 'bg-quantum-600 border-quantum-400 text-void-950 hover:bg-quantum-500 active:translate-y-1 active:shadow-none'
                      : 'bg-void-800 border-void-600 text-slate-400 hover:bg-void-700'
                    }
                  `}
                >
                  {masteryLevel >= 70 ? 'Proceed_Next_Module' : 'Save_Progress_&_Exit'}
                </button>
              )}
            </div>
          </div>
        </motion.section>
      )}

      {quizCompleted && masteryLevel >= 70 && selfRating !== null && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-end"
        >
          <button
            onClick={onNext}
            className="group flex items-center gap-3 bg-quantum-600 border-2 border-quantum-400 text-void-950 px-8 py-4 font-display uppercase tracking-wider text-sm shadow-[6px_6px_0_rgba(34,211,238,0.3)] hover:bg-quantum-500 active:translate-y-1 active:shadow-none transition-all"
          >
            {isLastModule ? "Complete_Protocol" : "Next_Module"}
            <span className="group-hover:translate-x-1 transition-transform">&gt;</span>
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};