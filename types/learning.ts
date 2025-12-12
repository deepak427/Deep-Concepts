// Generic learning system types

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  category: 'interaction' | 'mastery' | 'challenge' | 'persistence';
}

export interface QuizResult {
  questionId: string;
  correct: boolean;
  confidenceLevel?: 'low' | 'medium' | 'high';
  timestamp: Date;
}

export interface ReviewItem {
  moduleId: string;
  conceptId: string;
  reason: 'incorrect' | 'low-confidence' | 'spaced-repetition';
  priority: number;
  nextReviewDate: Date;
}

export interface ConfidenceRating {
  questionId: string;
  level: 'low' | 'medium' | 'high';
  wasCorrect: boolean;
}

export interface UserProfile {
  type: 'developer' | 'student' | 'founder' | 'researcher';
  onboardingCompleted: boolean;
  selfAssessmentScore: number;
}

export interface ModuleProgress {
  completed: boolean;
  masteryLevel: number; // 0-100
  interactionsCompleted: string[];
  quizResults: QuizResult[];
  confidenceRatings: ConfidenceRating[];
  selfRating: number; // 1-5
  lastVisited: Date;
}

export interface AudioConfig {
  soundEffects: {
    enabled: boolean;
    volume: number; // 0-1
  };
  music: {
    enabled: boolean;
    volume: number; // 0-1
    currentTrack?: string;
  };
  ambient: {
    enabled: boolean;
    volume: number; // 0-1
  };
}

export interface LearningState {
  userProfile: UserProfile;
  xp: number;
  level: number;
  achievements: Achievement[];
  modules: Record<string, ModuleProgress>;
  reviewQueue: ReviewItem[];
  lastSessionDate?: Date;
  audioConfig: AudioConfig;
}

export interface LearningActions {
  addXP: (amount: number, source: string) => void;
  unlockAchievement: (id: string) => void;
  updateModuleMastery: (moduleId: string) => void;
  addToReviewQueue: (item: ReviewItem) => void;
  completeInteraction: (moduleId: string, interactionId: string) => void;
  recordQuizResult: (moduleId: string, result: QuizResult) => void;
  recordConfidenceRating: (moduleId: string, rating: ConfidenceRating) => void;
  setSelfRating: (moduleId: string, rating: number) => void;
  completeOnboarding: (profile: UserProfile) => void;
  removeFromReviewQueue: (moduleId: string, conceptId: string) => void;
  updateLastSession: () => void;
  checkSpacedRepetition: () => void;
  updateAudioConfig: (config: Partial<AudioConfig>) => void;
}

export type LearningStore = LearningState & LearningActions;
