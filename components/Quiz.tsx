import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import { QuizData } from '../types';

interface QuizProps {
  data: QuizData;
  onComplete: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ data, onComplete }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selectedId) return;
    setIsSubmitted(true);
    const selected = data.options.find(o => o.id === selectedId);
    if (selected?.isCorrect) {
      onComplete();
    }
  };

  const getOptionStyle = (optId: string, isCorrect: boolean) => {
    if (!isSubmitted) {
      return selectedId === optId 
        ? 'border-cyan-500 bg-cyan-900/20' 
        : 'border-slate-700 hover:bg-slate-800';
    }
    if (optId === selectedId) {
      return isCorrect 
        ? 'border-green-500 bg-green-900/20' 
        : 'border-red-500 bg-red-900/20';
    }
    if (isCorrect && isSubmitted) return 'border-green-500 border-dashed';
    return 'border-slate-700 opacity-50';
  };

  return (
    <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 mt-8">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">Check Your Understanding</h3>
      <p className="text-slate-300 mb-6">{data.question}</p>
      
      <div className="space-y-3">
        {data.options.map((opt) => (
          <div 
            key={opt.id}
            onClick={() => !isSubmitted && setSelectedId(opt.id)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all flex justify-between items-center ${getOptionStyle(opt.id, opt.isCorrect)}`}
          >
            <span>{opt.text}</span>
            {isSubmitted && opt.id === selectedId && (
                opt.isCorrect ? <CheckCircle size={20} className="text-green-500" /> : <XCircle size={20} className="text-red-500" />
            )}
          </div>
        ))}
      </div>

      {!isSubmitted ? (
         <button 
           onClick={handleSubmit}
           disabled={!selectedId}
           className="mt-6 w-full py-3 rounded-lg font-bold bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
         >
           Check Answer
         </button>
      ) : (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-slate-800 rounded-lg border border-slate-600"
        >
            <p className="text-sm font-medium text-slate-200">
                {data.options.find(o => o.id === selectedId)?.explanation}
            </p>
        </motion.div>
      )}
    </div>
  );
};