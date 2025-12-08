export type ModuleId = 
  | 'intro' 
  | 'bits-qubits' 
  | 'superposition' 
  | 'entanglement' 
  | 'gates' 
  | 'algorithm' 
  | 'hardware' 
  | 'applications';

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface QuizData {
  question: string;
  options: QuizOption[];
}

export interface ModuleData {
  id: ModuleId;
  title: string;
  shortTitle: string;
  description: string;
  keyTakeaways: string[];
  quiz: QuizData;
}

export interface UserProgress {
  completedModules: ModuleId[];
  currentModuleId: ModuleId;
}
