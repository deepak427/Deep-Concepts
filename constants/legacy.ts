// Legacy module data for backward compatibility
// This maintains the original MODULES export for components that haven't been updated yet

import type { ModuleData } from '@/types';
import { MODULE_CONTENT } from './modules';

// Convert new ModuleContent to legacy ModuleData format
export const MODULES: ModuleData[] = MODULE_CONTENT.map(module => ({
  id: module.id,
  title: module.title,
  shortTitle: module.shortTitle,
  description: module.description,
  keyTakeaways: module.keyTakeaways,
  quiz: module.quiz
}));
