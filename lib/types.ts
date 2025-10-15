export type ProjectStatus = 'active' | 'completed' | 'archived';

export type ProjectStage = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export const STAGE_NAMES: Record<ProjectStage, string> = {
  0: 'Inicialización',
  1: 'Discovery',
  2: 'Diseño',
  3: 'Setup',
  4: 'Backend',
  5: 'Frontend',
  6: 'Testing',
  7: 'Deploy',
  8: 'Docs',
};

export interface Project {
  id: string;
  name: string;
  description: string;
  overview?: string;  // Descripción detallada para análisis de IA
  createdAt: string;
  updatedAt: string;
  status: ProjectStatus;
  currentStage: ProjectStage;
  tags: string[];
}

export interface Prompt {
  id: string;
  projectId: string;
  originalPrompt: string;        // Prompt original del usuario
  improvedPrompt: string | null; // Prompt mejorado por Claude API
  claudePlan: string;            // Plan/respuesta de Claude Code
  timestamp: string;
  stage: ProjectStage;
  tokens?: number;
  model?: string;
  executionNotes?: string;       // Notas sobre cómo fue la ejecución del plan
  notesUpdatedAt?: string;       // Fecha de última actualización de notas
}

// Para compatibilidad con prompts antiguos
export interface LegacyPrompt {
  id: string;
  projectId: string;
  content: string;
  response: string;
  timestamp: string;
  stage: ProjectStage;
  tokens?: number;
}

export interface ProjectWithPrompts extends Project {
  prompts: Prompt[];
}

// Checklist types
export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  isCustom: boolean; // Para diferenciar las tareas personalizadas
}

export interface ProjectChecklist {
  projectId: string;
  stage: ProjectStage;
  items: ChecklistItem[];
  updatedAt: string;
}

// Planner types
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'blocked';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface PlanTask {
  id: string;
  stageId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  startDate?: string;
  endDate?: string;
  estimatedDays?: number;
  notes: string;
  completedAt?: string;
  dependencies: string[];  // IDs of other tasks
}

export interface PlanStage {
  id: string;
  stage: ProjectStage;
  tasks: PlanTask[];
  estimatedDuration: number;  // Days
  actualDuration?: number;
  startDate?: string;
  endDate?: string;
}

export interface ProjectPlan {
  id: string;
  projectId: string;
  overview: string;
  generatedAt: string;
  updatedAt: string;
  stages: PlanStage[];
}
