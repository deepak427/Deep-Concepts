import { useLearningStore } from '@/lib/learningState';
import { Trophy, Star, Award } from 'lucide-react';
import { PixelCard } from '@/components/shared/PixelCard';

export function AchievementsView() {
  const { achievements } = useLearningStore();

  return (
    <div className="min-h-screen bg-void-950 pt-20 pb-24">
      <div className="container space-y-8">
        <PixelCard variant="glow" padding="lg">
          <div className="flex items-center gap-4 mb-6">
            <Trophy className="w-8 h-8 text-energy-400" />
            <div>
              <h1 className="text-2xl md:text-3xl font-display text-energy-400 uppercase tracking-widest">
                Achievements
              </h1>
              <p className="text-slate-400">Your quantum computing milestones</p>
            </div>
          </div>

          {achievements.length === 0 ? (
            <div className="text-center py-12">
              <Award className="w-16 h-16 mx-auto mb-4 text-slate-600" />
              <p className="font-display text-slate-500 mb-2">No achievements yet</p>
              <p className="text-sm text-slate-600">Complete modules to unlock achievements</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map(achievement => (
                <PixelCard key={achievement.id} variant="interactive" padding="md">
                  <div className="text-center">
                    <div className="text-4xl mb-3">{achievement.icon}</div>
                    <h3 className="font-display text-energy-400 text-lg mb-2">
                      {achievement.title}
                    </h3>
                    <p className="text-slate-400 text-sm mb-3">
                      {achievement.description}
                    </p>
                    <div className="flex items-center justify-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < 3 ? 'text-energy-400 fill-current' : 'text-slate-600'}`}
                        />
                      ))}
                    </div>
                  </div>
                </PixelCard>
              ))}
            </div>
          )}
        </PixelCard>
      </div>
    </div>
  );
}