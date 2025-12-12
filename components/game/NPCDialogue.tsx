import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle } from 'lucide-react';
import type { NPC } from '@/types/game';
import { useLearningStore } from '@/lib/learningState';

interface NPCDialogueProps {
    npc: NPC;
    onClose: () => void;
    startDialogueId?: string;
}

export function NPCDialogue({ npc, onClose, startDialogueId }: NPCDialogueProps) {
    const [currentDialogueId, setCurrentDialogueId] = useState(startDialogueId || npc.dialogues[0]?.id);
    const [isTyping, setIsTyping] = useState(true);
    const [displayedText, setDisplayedText] = useState('');

    // Find current dialogue object
    const currentDialogue = npc.dialogues.find(d => d.id === currentDialogueId);

    // Stats for relationship (could be pulled from store)
    const { npcRelationships } = useLearningStore();
    const relationship = npcRelationships[npc.id] || 0;

    // Typewriter effect
    useEffect(() => {
        if (!currentDialogue) return;

        setDisplayedText('');
        setIsTyping(true);
        let index = 0;
        const text = currentDialogue.text;

        const interval = setInterval(() => {
            if (index < text.length) {
                setDisplayedText(prev => prev + text.charAt(index));
                index++;
            } else {
                setIsTyping(false);
                clearInterval(interval);
            }
        }, 30); // Speed of typing

        return () => clearInterval(interval);
    }, [currentDialogue]);

    const handleChoice = (nextId: string) => {
        if (nextId === 'CLOSE') {
            onClose();
        } else {
            setCurrentDialogueId(nextId);
        }
    };

    if (!currentDialogue) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed inset-x-0 bottom-0 z-50 p-4 sm:bottom-8 sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-4xl"
            >
                <div className="bg-slate-900/95 backdrop-blur-md rounded-t-2xl sm:rounded-2xl p-4 sm:p-6 relative flex flex-col sm:flex-row gap-4 sm:gap-6 border-l-4 border-l-synapse-500 shadow-[0_0_50px_rgba(192,132,252,0.2)] max-h-[80vh] overflow-y-auto border border-slate-700">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 sm:top-4 sm:right-4 text-slate-400 hover:text-white transition-colors z-10 p-1"
                        aria-label="Close dialogue"
                    >
                        <X size={20} className="sm:w-6 sm:h-6" />
                    </button>

                    {/* NPC Avatar Section */}
                    <div className="flex flex-row sm:flex-col items-center sm:items-center flex-shrink-0 gap-3 sm:gap-0 sm:w-32">
                        <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-synapse-400 flex items-center justify-center text-2xl sm:text-4xl shadow-lg relative flex-shrink-0"
                        >
                            {npc.avatar}
                            {/* Emotion Indicator */}
                            <div className={`absolute bottom-0 right-0 w-4 h-4 sm:w-6 sm:h-6 rounded-full border-2 border-slate-900 ${currentDialogue.emotion === 'excited' ? 'bg-energy-500' :
                                    currentDialogue.emotion === 'grumpy' ? 'bg-red-500' :
                                        currentDialogue.emotion === 'happy' ? 'bg-green-500' :
                                            currentDialogue.emotion === 'confused' ? 'bg-orange-500' :
                                                currentDialogue.emotion === 'nervous' ? 'bg-purple-500' :
                                                    currentDialogue.emotion === 'wise' ? 'bg-blue-500' :
                                                        'bg-slate-500'
                                }`} />
                        </motion.div>
                        
                        <div className="flex-1 sm:flex-none sm:w-full">
                            <h3 className="font-display font-bold text-base sm:text-lg text-white text-left sm:text-center leading-tight sm:mt-2">
                                {npc.name}
                            </h3>
                            <p className="text-xs text-synapse-300 font-medium text-left sm:text-center">{npc.title}</p>

                            {/* Relationship Meter */}
                            <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 sm:mt-3 overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
                                    style={{ width: `${relationship}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Dialogue Content */}
                    <div className="flex-1 flex flex-col min-w-0">
                        <div className="flex-1 min-h-[60px] sm:min-h-[80px] text-base sm:text-lg text-slate-100 font-light leading-relaxed mb-4">
                            {displayedText}
                            {isTyping && <span className="inline-block w-2 h-4 sm:h-5 ml-1 bg-quantum-400 animate-pulse" />}
                        </div>

                        {/* Choices */}
                        {!isTyping && (
                            <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 sm:justify-end">
                                {currentDialogue.choices ? (
                                    currentDialogue.choices.map((choice, idx) => (
                                        <motion.button
                                            key={idx}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            onClick={() => handleChoice(choice.nextDialogue)}
                                            className="px-4 py-3 sm:px-5 sm:py-2 rounded-lg bg-slate-800/50 hover:bg-synapse-500/20 border border-slate-700 hover:border-synapse-400 text-slate-200 hover:text-white transition-all text-sm font-medium flex items-center gap-2 group min-h-[44px] justify-center sm:justify-start"
                                        >
                                            <MessageCircle size={16} className="text-synapse-400 group-hover:text-synapse-300 flex-shrink-0" />
                                            <span className="text-center sm:text-left">{choice.text}</span>
                                        </motion.button>
                                    ))
                                ) : (
                                    <motion.button
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        onClick={onClose}
                                        className="px-6 py-3 sm:py-2 rounded-lg bg-quantum-600 hover:bg-quantum-500 text-white font-medium transition-colors min-h-[44px]"
                                    >
                                        Continue
                                    </motion.button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
