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

// ================================================
// V2.0 TYPES - 8-Module System
// ================================================

// M-001: Validaciones (Idea Validator)
export interface Validation {
  id: string;
  projectId: string;
  rawIdea: string;
  targetMarket: string;
  verdict: 'go' | 'validate_more' | 'no_go';
  confidenceScore?: number;
  marketAnalysis: Record<string, any>;
  problemAnalysis?: string;
  solutionProposal?: string;
  adaptationsNeeded?: any[];
  barriers?: any[];
  stackRecommendation: Record<string, any>;
  coreFeatures: any[];
  outOfScope?: any[];
  estimatedWeeks?: number;
  estimatedBudget?: number;
  validatedBy?: string;
  validationDate: string;
  markdownOutput?: string;
  createdAt: string;
  status: 'draft' | 'approved';  // Estado de la validación
  source: 'ai' | 'manual';       // Origen de la validación
}

// M-002: Product Plans (Product Manager)
export interface ProductPlan {
  id: string;
  projectId: string;
  validationId?: string;
  problemStatement: string;
  solutionStatement: string;
  valueProposition: string;
  persona: Record<string, any>;
  userJourney?: any[];
  successMetrics: any[];
  techStack: Record<string, any>;
  dependencies?: Record<string, any>;
  estimatedTimelineDays?: number;
  milestones?: any[];
  createdBy?: string;
  createdAt: string;
  approvedAt?: string;
  markdownOutput?: string;
  status: 'draft' | 'approved';  // Estado del plan
  source: 'ai' | 'manual';       // Origen del plan
}

// M-005: Features (Tickets & Kanban)
export interface Feature {
  id: string; // F-001, F-002, etc.
  projectId: string;
  planId?: string;
  name: string;
  description?: string;
  userStory: string;
  priority: 'P0' | 'P1' | 'P2';
  riceScore?: Record<string, any>;
  dependencies?: string[];
  blocksFeatures?: string[];
  status: 'todo' | 'in_progress' | 'testing' | 'done';
  acceptanceCriteria: any[];
  estimatedHours?: number;
  actualHours?: number;
  assignedTo?: string;
  notes?: string;
  gitCommits?: string[];
  createdAt: string;
  updatedAt?: string; // Auto-updated by trigger
  startedAt?: string;
  completedAt?: string;
  deployedToStagingAt?: string;
  deployedToProductionAt?: string;
}

// M-004: Designs (UX/UI Designer)
export interface Design {
  id: string;
  projectId: string;
  planId?: string;
  designSystem: Record<string, any>;
  screens?: any[];
  components?: any[];
  styleGuideUrl?: string;
  designedBy?: string;
  createdAt: string;
  approvedAt?: string;
}

// M-006: Project Metrics (Dashboard)
export interface ProjectMetrics {
  id: string;
  projectId: string;
  velocity?: number;
  avgFeatureHours?: number;
  estimationAccuracy?: number;
  burndownData?: any[];
  raciData?: Record<string, any>;
  completionPercentage?: number;
  featuresCompleted?: number;
  featuresTotal?: number;
  deploysCount?: number;
  lastDeployAt?: string;
  recordedAt: string;
}

// M-008: Tools (Hub de Herramientas)
export interface Tool {
  id: string;
  name: string;
  category: 'design' | 'api' | 'deployment' | 'development' | 'latam' | 'inspiration';
  url: string;
  description?: string;
  iconName?: string;
  requiresApiKey?: boolean;
  apiKeyPlaceholder?: string;
  supportedCountries?: string[];
  createdAt: string;
}

// M-008: Project Tools (Many-to-Many)
export interface ProjectTool {
  projectId: string;
  toolId: string;
  apiKeyConfigured?: boolean;
  notes?: string;
  isFavorite?: boolean;
  addedAt: string;
}

// M-009: Idea Mixer - Ideas y Combinaciones
export interface IdeaIntegration {
  nombre: string;
  api: string;
  documentacion: string;
  complejidad: 'baja' | 'media' | 'alta';
}

export interface IdeaSkill {
  skill: string;
  nivelNecesario: 'junior' | 'mid' | 'senior';
  tenemos: boolean;
}

export interface IdeaTiempoEstimado {
  diseño: number;      // semanas
  desarrollo: number;  // semanas
  testing: number;     // semanas
}

export interface Idea {
  id: string;                    // IDEA-001, IDEA-002...
  userId?: string;               // Owner de la idea
  nombre?: string;               // Nombre descriptivo (ej: "Bonds Fintech", "Booking App - Barberías")

  // DEMANDA (Problema → Mercado)
  problema: string;
  mercadoObjetivo: string;
  urgencia: 'baja' | 'media' | 'alta' | 'crítica';
  tamañoMercado?: string;
  evidenciaDemanda?: string;

  // OFERTA (Solución → Herramientas)
  solucion: string;
  herramientasDisponibles?: string[];
  integracionesNecesarias?: IdeaIntegration[];
  informacionRequerida?: string[];

  // ANÁLISIS TÉCNICO
  complejidadTecnica: 1 | 2 | 3 | 4 | 5;
  skillsRequeridos?: IdeaSkill[];
  tiempoEstimado?: IdeaTiempoEstimado;
  bloqueadores?: string[];

  // METADATA
  tags?: string[];
  categoria?: string;            // fintech, saas, marketplace, etc.
  notas?: string;
  favorita?: boolean;

  createdAt: string;
  updatedAt?: string;
}

export interface IdeaCombination {
  id: string;
  userId?: string;
  ideaIds: string[];             // IDs de las ideas combinadas

  // RESULTADO DEL ANÁLISIS
  veredicto?: 'VIABLE' | 'NO_VIABLE';
  confianza?: number;            // 0-100
  analisisCompleto?: any;        // Todo el análisis de Claude

  createdAt: string;
}
