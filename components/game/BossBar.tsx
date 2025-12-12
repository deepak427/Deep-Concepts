// Boss Battle Health Bar Component

import { motion } from 'framer-motion';
import type { Boss } from '@/constants/bosses';

interface BossBarProps {
  boss: Boss;
  bossHealth: number;
  bossMaxHealth: number;
  explorerHealth: number;
  explorerMaxHealth: number;
  turn: 'explorer' | 'boss';
}

export function BossBar({
  boss,
  bossHealth,
  bossMaxHealth,
  explorerHealth,
  explorerMaxHealth,
  turn
}: BossBarProps) {
  const bossHealthPercent = (bossHealth / bossMaxHealth) * 100;
  const explorerHealthPercent = (explorerHealth / explorerMaxHealth) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-gray-900/95 to-transparent p-4 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        {/* Boss Health */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{boss.avatar}</span>
              <div>
                <h3 className="text-xl font-bold text-red-400">{boss.name}</h3>
                <p className="text-sm text-gray-400">{boss.title}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-mono text-red-400">
                {bossHealth} / {bossMaxHealth}
              </div>
              {turn === 'boss' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-yellow-400"
                >
                  ⚡ Boss Turn
                </motion.div>
              )}
            </div>
          </div>
          
          {/* Boss Health Bar */}
          <div className="relative h-6 bg-gray-800 rounded-full overflow-hidden border-2 border-red-900">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-600 to-red-400"
              initial={{ width: '100%' }}
              animate={{ width: `${bossHealthPercent}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                x: ['-100%', '200%']
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear'
              }}
            />
          </div>
        </div>

        {/* Explorer Health */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🧑‍🔬</span>
              <div>
                <h3 className="text-lg font-bold text-blue-400">Explorer</h3>
                <p className="text-xs text-gray-400">Quantum Adventurer</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-mono text-blue-400">
                {explorerHealth} / {explorerMaxHealth}
              </div>
              {turn === 'explorer' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-green-400"
                >
                  ⚡ Your Turn
                </motion.div>
              )}
            </div>
          </div>
          
          {/* Explorer Health Bar */}
          <div className="relative h-4 bg-gray-800 rounded-full overflow-hidden border-2 border-blue-900">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 to-blue-400"
              initial={{ width: '100%' }}
              animate={{ width: `${explorerHealthPercent}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
