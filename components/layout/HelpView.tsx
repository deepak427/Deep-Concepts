import { HelpCircle, Book, MessageSquare, ExternalLink } from 'lucide-react';
import { PixelCard } from '@/components/shared/PixelCard';
import { PixelButton } from '@/components/shared/PixelButton';

export function HelpView() {
  const helpSections = [
    {
      title: 'What Is This?',
      icon: <Book className="w-6 h-6" />,
      items: [
        '🎮 Interactive quantum computing learning game',
        '🏝️ Explore 6 quantum islands with unique concepts',
        '🧑‍🔬 Meet NPCs who guide your learning journey',
        '🏆 Earn XP, achievements, and unlock new areas',
        '🔬 Hands-on simulations and visual demonstrations'
      ]
    },
    {
      title: 'How To Play',
      icon: <HelpCircle className="w-6 h-6" />,
      items: [
        '1️⃣ Start at the Quantum Hub (main map)',
        '2️⃣ Click on islands to enter learning modules',
        '3️⃣ Complete interactive demos and quizzes',
        '4️⃣ Talk to NPCs for guidance and quests',
        '5️⃣ Track progress in Dashboard tab',
        '6️⃣ Unlock achievements and new content'
      ]
    },
    {
      title: 'Learning Path',
      icon: <MessageSquare className="w-6 h-6" />,
      items: [
        '🔵 Bits vs Qubits - Foundation concepts',
        '🌊 Superposition - Wave-like behavior',
        '🔗 Entanglement - Quantum correlations',
        '⚡ Quantum Gates - Building circuits',
        '🏛️ Algorithms - Quantum speedup',
        '❄️ Hardware - Real-world challenges'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-void-950 pt-20 pb-24">
      <div className="container space-y-8">
        <PixelCard variant="glow" padding="lg">
          <div className="flex items-center gap-4 mb-6">
            <HelpCircle className="w-8 h-8 text-synapse-400" />
            <div>
              <h1 className="text-2xl md:text-3xl font-display text-synapse-400 uppercase tracking-widest">
                Help & Tutorial
              </h1>
              <p className="text-slate-400">Learn how to use DeepConcepts: Quantum Computing</p>
            </div>
          </div>

          {/* What is this app? */}
          <div className="mb-8 p-6 bg-void-900 border-l-4 border-l-synapse-500">
            <h2 className="text-xl font-display text-synapse-400 mb-4 uppercase tracking-wider">
              🎯 What Is DeepConcepts?
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed mb-4">
              This is an <strong>interactive educational game</strong> that teaches quantum computing concepts through:
            </p>
            <ul className="space-y-2 text-slate-400">
              <li>• <strong>Visual simulations</strong> - See quantum states in action</li>
              <li>• <strong>Hands-on experiments</strong> - Manipulate qubits and circuits</li>
              <li>• <strong>Gamified learning</strong> - Earn XP, achievements, and progress</li>
              <li>• <strong>Story-driven exploration</strong> - Meet NPCs and complete quests</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpSections.map((section, index) => (
              <PixelCard key={index} variant="interactive" padding="md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-synapse-400">{section.icon}</div>
                  <h3 className="font-display text-synapse-400 text-lg uppercase tracking-wider">
                    {section.title}
                  </h3>
                </div>
                <ul className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-slate-400 text-sm hover:text-slate-300 cursor-pointer transition-colors">
                      • {item}
                    </li>
                  ))}
                </ul>
              </PixelCard>
            ))}
          </div>

          {/* Quick Start Guide */}
          <div className="mt-8 p-6 bg-gradient-to-r from-quantum-900/20 to-synapse-900/20 border-2 border-quantum-500/30">
            <h2 className="text-xl font-display text-quantum-400 mb-4 uppercase tracking-wider">
              🚀 Quick Start (First Time Users)
            </h2>
            <div className="space-y-3 text-slate-300">
              <div className="flex items-start gap-3">
                <span className="bg-quantum-500 text-void-950 px-2 py-1 text-xs font-bold">1</span>
                <span>Go to <strong>Settings</strong> → Click <strong>"Reset Progress"</strong> → Confirm</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-quantum-500 text-void-950 px-2 py-1 text-xs font-bold">2</span>
                <span>Refresh the page - you'll see the <strong>onboarding tutorial</strong></span>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-quantum-500 text-void-950 px-2 py-1 text-xs font-bold">3</span>
                <span>Meet <strong>Dr. Qubit</strong> and try the interactive demos</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-quantum-500 text-void-950 px-2 py-1 text-xs font-bold">4</span>
                <span>Choose your starting island and begin learning!</span>
              </div>
            </div>
          </div>

          {/* Navigation Tips */}
          <div className="mt-6 p-6 bg-void-900 border-l-4 border-l-energy-500">
            <h3 className="text-lg font-display text-energy-400 mb-3 uppercase tracking-wider">
              🧭 Navigation Tips
            </h3>
            <ul className="space-y-2 text-slate-400">
              <li>• <strong>Hub Tab</strong> - Main quantum realm map</li>
              <li>• <strong>Dashboard Tab</strong> - Track your progress and achievements</li>
              <li>• <strong>Settings Tab</strong> - Reset progress, export data, audio settings</li>
              <li>• <strong>Mobile</strong> - Use bottom navigation bar</li>
            </ul>
          </div>
        </PixelCard>
      </div>
    </div>
  );
}