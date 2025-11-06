import { query, isPostgresConfigured } from './postgres';
import {
  Project,
  Prompt,
  Validation,
  ProductPlan,
  Feature,
  Design,
  ProjectMetrics,
  Tool,
  ProjectTool,
  Idea,
  IdeaCombination,
} from './types';

// Simple in-memory fallback for server-side (no localStorage available)
const inMemoryProjects = new Map<string, Project>();
const inMemoryPrompts = new Map<string, Prompt>();

const serverFallbackProjectStorage = {
  getAll: (): Project[] => Array.from(inMemoryProjects.values()),
  get: (id: string): Project | null => inMemoryProjects.get(id) || null,
  save: (project: Project): void => { inMemoryProjects.set(project.id, project); },
  delete: (id: string): void => { inMemoryProjects.delete(id); },
};

const serverFallbackPromptStorage = {
  getAll: (): Prompt[] => Array.from(inMemoryPrompts.values()),
  get: (id: string): Prompt | null => inMemoryPrompts.get(id) || null,
  getByProject: (projectId: string): Prompt[] =>
    Array.from(inMemoryPrompts.values()).filter(p => p.projectId === projectId),
  save: (prompt: Prompt): void => { inMemoryPrompts.set(prompt.id, prompt); },
  delete: (id: string): void => { inMemoryPrompts.delete(id); },
  deleteByProject: (projectId: string): void => {
    Array.from(inMemoryPrompts.entries()).forEach(([id, prompt]) => {
      if (prompt.projectId === projectId) inMemoryPrompts.delete(id);
    });
  },
};

// Database type definitions matching PostgreSQL schema
type DbProject = {
  id: string;
  name: string;
  description: string | null;
  created_at: Date;
  updated_at: Date;
  status: string;
  current_stage: number;
  tags: string[] | null;
};

type DbPrompt = {
  id: string;
  project_id: string;
  original_prompt: string;
  improved_prompt: string | null;
  claude_plan: string;
  timestamp: Date;
  stage: number;
  tokens: number | null;
  model: string | null;
  execution_notes: string | null;
  notes_updated_at: Date | null;
};

// Convert DB format to App format
const dbToProject = (db: DbProject): Project => ({
  id: db.id,
  name: db.name,
  description: db.description || '',
  createdAt: db.created_at.toISOString(),
  updatedAt: db.updated_at.toISOString(),
  status: db.status as Project['status'],
  currentStage: db.current_stage as Project['currentStage'],
  tags: db.tags || [],
});

const dbToPrompt = (db: DbPrompt): Prompt => ({
  id: db.id,
  projectId: db.project_id,
  originalPrompt: db.original_prompt,
  improvedPrompt: db.improved_prompt,
  claudePlan: db.claude_plan,
  timestamp: db.timestamp.toISOString(),
  stage: db.stage as Prompt['stage'],
  tokens: db.tokens || undefined,
  model: db.model || undefined,
  executionNotes: db.execution_notes || undefined,
  notesUpdatedAt: db.notes_updated_at?.toISOString() || undefined,
});

// Projects Storage with PostgreSQL fallback
export const projectStorage = {
  getAll: async (): Promise<Project[]> => {
    if (!isPostgresConfigured()) {
      console.warn('PostgreSQL not configured, using in-memory storage');
      return serverFallbackProjectStorage.getAll();
    }

    try {
      const result = await query<DbProject>(
        'SELECT * FROM projects ORDER BY updated_at DESC'
      );
      return result.rows.map(dbToProject);
    } catch (error) {
      console.error('PostgreSQL error, falling back to in-memory storage:', error);
      return serverFallbackProjectStorage.getAll();
    }
  },

  get: async (id: string): Promise<Project | null> => {
    if (!isPostgresConfigured()) {
      return serverFallbackProjectStorage.get(id);
    }

    try {
      const result = await query<DbProject>(
        'SELECT * FROM projects WHERE id = $1',
        [id]
      );
      return result.rows.length > 0 ? dbToProject(result.rows[0]) : null;
    } catch (error) {
      console.error('PostgreSQL error, falling back to in-memory storage:', error);
      return serverFallbackProjectStorage.get(id);
    }
  },

  save: async (project: Project): Promise<void> => {
    if (!isPostgresConfigured()) {
      return serverFallbackProjectStorage.save(project);
    }

    try {
      await query(
        `INSERT INTO projects (id, name, description, created_at, updated_at, status, current_stage, tags)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           description = EXCLUDED.description,
           updated_at = EXCLUDED.updated_at,
           status = EXCLUDED.status,
           current_stage = EXCLUDED.current_stage,
           tags = EXCLUDED.tags`,
        [
          project.id,
          project.name,
          project.description || null,
          project.createdAt,
          project.updatedAt,
          project.status,
          project.currentStage,
          project.tags || [],
        ]
      );
    } catch (error) {
      console.error('PostgreSQL error, falling back to in-memory storage:', error);
      serverFallbackProjectStorage.save(project);
    }
  },

  delete: async (id: string): Promise<void> => {
    if (!isPostgresConfigured()) {
      return serverFallbackProjectStorage.delete(id);
    }

    try {
      await query('DELETE FROM projects WHERE id = $1', [id]);
    } catch (error) {
      console.error('PostgreSQL error, falling back to in-memory storage:', error);
      serverFallbackProjectStorage.delete(id);
    }
  },
};

// Prompts Storage with PostgreSQL fallback
export const promptStorage = {
  getAll: async (): Promise<Prompt[]> => {
    if (!isPostgresConfigured()) {
      return serverFallbackPromptStorage.getAll();
    }

    try {
      const result = await query<DbPrompt>(
        'SELECT * FROM prompts ORDER BY timestamp ASC'
      );
      return result.rows.map(dbToPrompt);
    } catch (error) {
      console.error('PostgreSQL error, falling back to localStorage:', error);
      return serverFallbackPromptStorage.getAll();
    }
  },

  get: async (id: string): Promise<Prompt | null> => {
    if (!isPostgresConfigured()) {
      return serverFallbackPromptStorage.get(id);
    }

    try {
      const result = await query<DbPrompt>(
        'SELECT * FROM prompts WHERE id = $1',
        [id]
      );
      return result.rows.length > 0 ? dbToPrompt(result.rows[0]) : null;
    } catch (error) {
      console.error('PostgreSQL error, falling back to localStorage:', error);
      return serverFallbackPromptStorage.get(id);
    }
  },

  getByProject: async (projectId: string): Promise<Prompt[]> => {
    if (!isPostgresConfigured()) {
      return serverFallbackPromptStorage.getByProject(projectId);
    }

    try {
      const result = await query<DbPrompt>(
        'SELECT * FROM prompts WHERE project_id = $1 ORDER BY timestamp ASC',
        [projectId]
      );
      return result.rows.map(dbToPrompt);
    } catch (error) {
      console.error('PostgreSQL error, falling back to localStorage:', error);
      return serverFallbackPromptStorage.getByProject(projectId);
    }
  },

  save: async (prompt: Prompt): Promise<void> => {
    if (!isPostgresConfigured()) {
      return serverFallbackPromptStorage.save(prompt);
    }

    try {
      await query(
        `INSERT INTO prompts (id, project_id, original_prompt, improved_prompt, claude_plan, timestamp, stage, tokens, model, execution_notes, notes_updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (id) DO UPDATE SET
           project_id = EXCLUDED.project_id,
           original_prompt = EXCLUDED.original_prompt,
           improved_prompt = EXCLUDED.improved_prompt,
           claude_plan = EXCLUDED.claude_plan,
           timestamp = EXCLUDED.timestamp,
           stage = EXCLUDED.stage,
           tokens = EXCLUDED.tokens,
           model = EXCLUDED.model,
           execution_notes = EXCLUDED.execution_notes,
           notes_updated_at = EXCLUDED.notes_updated_at`,
        [
          prompt.id,
          prompt.projectId,
          prompt.originalPrompt,
          prompt.improvedPrompt || null,
          prompt.claudePlan,
          prompt.timestamp,
          prompt.stage,
          prompt.tokens || null,
          prompt.model || null,
          prompt.executionNotes || null,
          prompt.notesUpdatedAt || null,
        ]
      );
    } catch (error) {
      console.error('PostgreSQL error, falling back to localStorage:', error);
      serverFallbackPromptStorage.save(prompt);
    }
  },

  delete: async (id: string): Promise<void> => {
    if (!isPostgresConfigured()) {
      return serverFallbackPromptStorage.delete(id);
    }

    try {
      await query('DELETE FROM prompts WHERE id = $1', [id]);
    } catch (error) {
      console.error('PostgreSQL error, falling back to localStorage:', error);
      serverFallbackPromptStorage.delete(id);
    }
  },

  deleteByProject: async (projectId: string): Promise<void> => {
    if (!isPostgresConfigured()) {
      return serverFallbackPromptStorage.deleteByProject(projectId);
    }

    try {
      await query('DELETE FROM prompts WHERE project_id = $1', [projectId]);
    } catch (error) {
      console.error('PostgreSQL error, falling back to localStorage:', error);
      serverFallbackPromptStorage.deleteByProject(projectId);
    }
  },
};

// ================================================
// V2.0 STORAGE - 8-Module System
// ================================================

// Database type definitions for V2.0 tables
type DbValidation = {
  id: string;
  project_id: string;
  raw_idea: string;
  target_market: string;
  verdict: string;
  confidence_score: number | null;
  market_analysis: any;
  problem_analysis: string | null;
  solution_proposal: string | null;
  adaptations_needed: any | null;
  barriers: any | null;
  stack_recommendation: any;
  core_features: any;
  out_of_scope: any | null;
  estimated_weeks: number | null;
  estimated_budget: number | null;
  validated_by: string | null;
  validation_date: Date;
  markdown_output: string | null;
  created_at: Date;
  status: string;
  source: string;
};

type DbProductPlan = {
  id: string;
  project_id: string;
  validation_id: string | null;
  problem_statement: string;
  solution_statement: string;
  value_proposition: string;
  persona: any;
  user_journey: any | null;
  success_metrics: any;
  tech_stack: any;
  dependencies: any | null;
  estimated_timeline_days: number | null;
  milestones: any | null;
  created_by: string | null;
  created_at: Date;
  approved_at: Date | null;
  markdown_output: string | null;
  status: string;
  source: string;
};

type DbFeature = {
  id: string;
  project_id: string;
  plan_id: string | null;
  name: string;
  description: string | null;
  user_story: string;
  priority: string;
  rice_score: any | null;
  dependencies: string[] | null;
  blocks_features: string[] | null;
  status: string;
  acceptance_criteria: any;
  estimated_hours: number | null;
  actual_hours: number | null;
  assigned_to: string | null;
  notes: string | null;
  git_commits: string[] | null;
  created_at: Date;
  updated_at: Date | null;
  started_at: Date | null;
  completed_at: Date | null;
  deployed_to_staging_at: Date | null;
  deployed_to_production_at: Date | null;
};

type DbDesign = {
  id: string;
  project_id: string;
  plan_id: string | null;
  design_system: any;
  screens: any | null;
  components: any | null;
  style_guide_url: string | null;
  designed_by: string | null;
  created_at: Date;
  approved_at: Date | null;
};

type DbProjectMetrics = {
  id: string;
  project_id: string;
  velocity: number | null;
  avg_feature_hours: number | null;
  estimation_accuracy: number | null;
  burndown_data: any | null;
  raci_data: any | null;
  completion_percentage: number | null;
  features_completed: number | null;
  features_total: number | null;
  deploys_count: number | null;
  last_deploy_at: Date | null;
  recorded_at: Date;
};

type DbTool = {
  id: string;
  name: string;
  category: string;
  url: string;
  description: string | null;
  icon_name: string | null;
  requires_api_key: boolean | null;
  api_key_placeholder: string | null;
  supported_countries: string[] | null;
  created_at: Date;
};

type DbProjectTool = {
  project_id: string;
  tool_id: string;
  api_key_configured: boolean | null;
  notes: string | null;
  is_favorite: boolean | null;
  added_at: Date;
};

// Converters
const dbToValidation = (db: DbValidation): Validation => ({
  id: db.id,
  projectId: db.project_id,
  rawIdea: db.raw_idea,
  targetMarket: db.target_market,
  verdict: db.verdict as Validation['verdict'],
  confidenceScore: db.confidence_score || undefined,
  marketAnalysis: db.market_analysis,
  problemAnalysis: db.problem_analysis || undefined,
  solutionProposal: db.solution_proposal || undefined,
  adaptationsNeeded: db.adaptations_needed || undefined,
  barriers: db.barriers || undefined,
  stackRecommendation: db.stack_recommendation,
  coreFeatures: db.core_features,
  outOfScope: db.out_of_scope || undefined,
  estimatedWeeks: db.estimated_weeks || undefined,
  estimatedBudget: db.estimated_budget ? Number(db.estimated_budget) : undefined,
  validatedBy: db.validated_by || undefined,
  validationDate: db.validation_date.toISOString(),
  markdownOutput: db.markdown_output || undefined,
  createdAt: db.created_at.toISOString(),
  status: (db.status || 'draft') as Validation['status'],
  source: (db.source || 'ai') as Validation['source'],
});

const dbToProductPlan = (db: DbProductPlan): ProductPlan => ({
  id: db.id,
  projectId: db.project_id,
  validationId: db.validation_id || undefined,
  problemStatement: db.problem_statement,
  solutionStatement: db.solution_statement,
  valueProposition: db.value_proposition,
  persona: db.persona,
  userJourney: db.user_journey || undefined,
  successMetrics: db.success_metrics,
  techStack: db.tech_stack,
  dependencies: db.dependencies || undefined,
  estimatedTimelineDays: db.estimated_timeline_days || undefined,
  milestones: db.milestones || undefined,
  createdBy: db.created_by || undefined,
  createdAt: db.created_at.toISOString(),
  approvedAt: db.approved_at?.toISOString() || undefined,
  markdownOutput: db.markdown_output || undefined,
  status: (db.status || 'draft') as ProductPlan['status'],
  source: (db.source || 'ai') as ProductPlan['source'],
});

const dbToFeature = (db: DbFeature): Feature => ({
  id: db.id,
  projectId: db.project_id,
  planId: db.plan_id || undefined,
  name: db.name,
  description: db.description || undefined,
  userStory: db.user_story,
  priority: db.priority as Feature['priority'],
  riceScore: db.rice_score || undefined,
  dependencies: db.dependencies || undefined,
  blocksFeatures: db.blocks_features || undefined,
  status: db.status as Feature['status'],
  acceptanceCriteria: db.acceptance_criteria,
  estimatedHours: db.estimated_hours || undefined,
  actualHours: db.actual_hours || undefined,
  assignedTo: db.assigned_to || undefined,
  notes: db.notes || undefined,
  gitCommits: db.git_commits || undefined,
  createdAt: db.created_at.toISOString(),
  updatedAt: db.updated_at?.toISOString() || undefined,
  startedAt: db.started_at?.toISOString() || undefined,
  completedAt: db.completed_at?.toISOString() || undefined,
  deployedToStagingAt: db.deployed_to_staging_at?.toISOString() || undefined,
  deployedToProductionAt: db.deployed_to_production_at?.toISOString() || undefined,
});

const dbToDesign = (db: DbDesign): Design => ({
  id: db.id,
  projectId: db.project_id,
  planId: db.plan_id || undefined,
  designSystem: db.design_system,
  screens: db.screens || undefined,
  components: db.components || undefined,
  styleGuideUrl: db.style_guide_url || undefined,
  designedBy: db.designed_by || undefined,
  createdAt: db.created_at.toISOString(),
  approvedAt: db.approved_at?.toISOString() || undefined,
});

const dbToProjectMetrics = (db: DbProjectMetrics): ProjectMetrics => ({
  id: db.id,
  projectId: db.project_id,
  velocity: db.velocity ? Number(db.velocity) : undefined,
  avgFeatureHours: db.avg_feature_hours ? Number(db.avg_feature_hours) : undefined,
  estimationAccuracy: db.estimation_accuracy ? Number(db.estimation_accuracy) : undefined,
  burndownData: db.burndown_data || undefined,
  raciData: db.raci_data || undefined,
  completionPercentage: db.completion_percentage || undefined,
  featuresCompleted: db.features_completed || undefined,
  featuresTotal: db.features_total || undefined,
  deploysCount: db.deploys_count || undefined,
  lastDeployAt: db.last_deploy_at?.toISOString() || undefined,
  recordedAt: db.recorded_at.toISOString(),
});

const dbToTool = (db: DbTool): Tool => ({
  id: db.id,
  name: db.name,
  category: db.category as Tool['category'],
  url: db.url,
  description: db.description || undefined,
  iconName: db.icon_name || undefined,
  requiresApiKey: db.requires_api_key || undefined,
  apiKeyPlaceholder: db.api_key_placeholder || undefined,
  supportedCountries: db.supported_countries || undefined,
  createdAt: db.created_at.toISOString(),
});

const dbToProjectTool = (db: DbProjectTool): ProjectTool => ({
  projectId: db.project_id,
  toolId: db.tool_id,
  apiKeyConfigured: db.api_key_configured || undefined,
  notes: db.notes || undefined,
  isFavorite: db.is_favorite || undefined,
  addedAt: db.added_at.toISOString(),
});

// M-001: Validations Storage
export const validationStorage = {
  getByProject: async (projectId: string): Promise<Validation[]> => {
    if (!isPostgresConfigured()) return [];
    try {
      const result = await query<DbValidation>(
        'SELECT * FROM validations WHERE project_id = $1 ORDER BY created_at DESC',
        [projectId]
      );
      return result.rows.map(dbToValidation);
    } catch (error) {
      console.error('PostgreSQL error:', error);
      return [];
    }
  },

  get: async (id: string): Promise<Validation | null> => {
    if (!isPostgresConfigured()) return null;
    try {
      const result = await query<DbValidation>(
        'SELECT * FROM validations WHERE id = $1',
        [id]
      );
      return result.rows.length > 0 ? dbToValidation(result.rows[0]) : null;
    } catch (error) {
      console.error('PostgreSQL error:', error);
      return null;
    }
  },

  save: async (validation: Validation): Promise<void> => {
    if (!isPostgresConfigured()) return;
    try {
      await query(
        `INSERT INTO validations (
          id, project_id, raw_idea, target_market, verdict, confidence_score,
          market_analysis, problem_analysis, solution_proposal, adaptations_needed,
          barriers, stack_recommendation, core_features, out_of_scope,
          estimated_weeks, estimated_budget, validated_by, validation_date, markdown_output,
          status, source
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
        ON CONFLICT (id) DO UPDATE SET
          verdict = EXCLUDED.verdict,
          confidence_score = EXCLUDED.confidence_score,
          market_analysis = EXCLUDED.market_analysis,
          problem_analysis = EXCLUDED.problem_analysis,
          solution_proposal = EXCLUDED.solution_proposal,
          markdown_output = EXCLUDED.markdown_output,
          status = EXCLUDED.status,
          source = EXCLUDED.source`,
        [
          validation.id,
          validation.projectId,
          validation.rawIdea,
          validation.targetMarket,
          validation.verdict,
          validation.confidenceScore || null,
          JSON.stringify(validation.marketAnalysis || {}),
          validation.problemAnalysis || null,
          validation.solutionProposal || null,
          JSON.stringify(validation.adaptationsNeeded || []),
          JSON.stringify(validation.barriers || []),
          JSON.stringify(validation.stackRecommendation || {}),
          JSON.stringify(validation.coreFeatures || []),
          JSON.stringify(validation.outOfScope || []),
          validation.estimatedWeeks || null,
          validation.estimatedBudget || null,
          validation.validatedBy || null,
          validation.validationDate,
          validation.markdownOutput || null,
          validation.status || 'draft',
          validation.source || 'ai',
        ]
      );
    } catch (error) {
      console.error('PostgreSQL error:', error);
    }
  },
};

// M-002: Product Plans Storage
export const productPlanStorage = {
  getByProject: async (projectId: string): Promise<ProductPlan[]> => {
    if (!isPostgresConfigured()) return [];
    try {
      const result = await query<DbProductPlan>(
        'SELECT * FROM product_plans WHERE project_id = $1 ORDER BY created_at DESC',
        [projectId]
      );
      return result.rows.map(dbToProductPlan);
    } catch (error) {
      console.error('PostgreSQL error:', error);
      return [];
    }
  },

  get: async (id: string): Promise<ProductPlan | null> => {
    if (!isPostgresConfigured()) return null;
    try {
      const result = await query<DbProductPlan>(
        'SELECT * FROM product_plans WHERE id = $1',
        [id]
      );
      return result.rows.length > 0 ? dbToProductPlan(result.rows[0]) : null;
    } catch (error) {
      console.error('PostgreSQL error:', error);
      return null;
    }
  },

  save: async (plan: ProductPlan): Promise<void> => {
    if (!isPostgresConfigured()) return;
    try {
      await query(
        `INSERT INTO product_plans (
          id, project_id, validation_id, problem_statement, solution_statement,
          value_proposition, persona, user_journey, success_metrics, tech_stack,
          dependencies, estimated_timeline_days, milestones, created_by, markdown_output,
          approved_at, status, source
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        ON CONFLICT (id) DO UPDATE SET
          problem_statement = EXCLUDED.problem_statement,
          solution_statement = EXCLUDED.solution_statement,
          value_proposition = EXCLUDED.value_proposition,
          persona = EXCLUDED.persona,
          success_metrics = EXCLUDED.success_metrics,
          markdown_output = EXCLUDED.markdown_output,
          approved_at = EXCLUDED.approved_at,
          status = EXCLUDED.status,
          source = EXCLUDED.source`,
        [
          plan.id,
          plan.projectId,
          plan.validationId || null,
          plan.problemStatement,
          plan.solutionStatement,
          plan.valueProposition,
          JSON.stringify(plan.persona || {}),
          JSON.stringify(plan.userJourney || []),
          JSON.stringify(plan.successMetrics || []),
          JSON.stringify(plan.techStack || {}),
          JSON.stringify(plan.dependencies || {}),
          plan.estimatedTimelineDays || null,
          JSON.stringify(plan.milestones || []),
          plan.createdBy || null,
          plan.markdownOutput || null,
          plan.approvedAt || null,
          plan.status || 'draft',
          plan.source || 'ai',
        ]
      );
    } catch (error) {
      console.error('PostgreSQL error:', error);
    }
  },
};

// M-005: Features Storage
export const featureStorage = {
  getAll: async (): Promise<Feature[]> => {
    if (!isPostgresConfigured()) return [];
    try {
      const result = await query<DbFeature>(
        'SELECT * FROM features ORDER BY created_at ASC'
      );
      return result.rows.map(dbToFeature);
    } catch (error) {
      console.error('PostgreSQL error in featureStorage.getAll():', error);
      return [];
    }
  },

  getByProject: async (projectId: string): Promise<Feature[]> => {
    if (!isPostgresConfigured()) return [];
    try {
      const result = await query<DbFeature>(
        'SELECT * FROM features WHERE project_id = $1 ORDER BY created_at ASC',
        [projectId]
      );
      return result.rows.map(dbToFeature);
    } catch (error) {
      console.error('PostgreSQL error in featureStorage.getByProject():', error);
      return [];
    }
  },

  get: async (id: string): Promise<Feature | null> => {
    if (!isPostgresConfigured()) return null;
    try {
      const result = await query<DbFeature>(
        'SELECT * FROM features WHERE id = $1',
        [id]
      );
      return result.rows.length > 0 ? dbToFeature(result.rows[0]) : null;
    } catch (error) {
      console.error('PostgreSQL error in featureStorage.get():', error);
      return null;
    }
  },

  getByPlan: async (planId: string): Promise<Feature[]> => {
    if (!isPostgresConfigured()) return [];
    try {
      const result = await query<DbFeature>(
        'SELECT * FROM features WHERE plan_id = $1 ORDER BY priority DESC, created_at ASC',
        [planId]
      );
      return result.rows.map(dbToFeature);
    } catch (error) {
      console.error('PostgreSQL error in featureStorage.getByPlan():', error);
      return [];
    }
  },

  save: async (feature: Feature): Promise<void> => {
    if (!isPostgresConfigured()) {
      console.error('❌ PostgreSQL not configured in featureStorage.save()');
      return;
    }

    console.log('💾 featureStorage.save() called with:', {
      id: feature.id,
      status: feature.status,
      name: feature.name,
    });

    try {
      const result = await query(
        `INSERT INTO features (
          id, project_id, plan_id, name, description, user_story, priority,
          rice_score, dependencies, blocks_features, status, acceptance_criteria,
          estimated_hours, actual_hours, assigned_to, notes, git_commits,
          started_at, completed_at, deployed_to_staging_at, deployed_to_production_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          status = EXCLUDED.status,
          actual_hours = EXCLUDED.actual_hours,
          notes = EXCLUDED.notes,
          git_commits = EXCLUDED.git_commits,
          started_at = EXCLUDED.started_at,
          completed_at = EXCLUDED.completed_at,
          deployed_to_staging_at = EXCLUDED.deployed_to_staging_at,
          deployed_to_production_at = EXCLUDED.deployed_to_production_at`,
        [
          feature.id,
          feature.projectId,
          feature.planId || null,
          feature.name,
          feature.description || null,
          feature.userStory,
          feature.priority,
          JSON.stringify(feature.riceScore || {}),
          feature.dependencies || [],
          feature.blocksFeatures || [],
          feature.status,
          JSON.stringify(feature.acceptanceCriteria || []),
          feature.estimatedHours || null,
          feature.actualHours || null,
          feature.assignedTo || null,
          feature.notes || null,
          feature.gitCommits || [],
          feature.startedAt || null,
          feature.completedAt || null,
          feature.deployedToStagingAt || null,
          feature.deployedToProductionAt || null,
        ]
      );

      console.log('✅ Feature saved successfully to database');
    } catch (error) {
      console.error('❌ PostgreSQL error in featureStorage.save():', error);
      throw error; // Re-throw to let caller handle it
    }
  },

  delete: async (id: string): Promise<void> => {
    if (!isPostgresConfigured()) return;
    try {
      await query('DELETE FROM features WHERE id = $1', [id]);
      console.log('✅ Feature deleted successfully:', id);
    } catch (error) {
      console.error('❌ PostgreSQL error in featureStorage.delete():', error);
      throw error;
    }
  },
};

// M-004: Designs Storage
export const designStorage = {
  getByProject: async (projectId: string): Promise<Design[]> => {
    if (!isPostgresConfigured()) return [];
    try {
      const result = await query<DbDesign>(
        'SELECT * FROM designs WHERE project_id = $1 ORDER BY created_at DESC',
        [projectId]
      );
      return result.rows.map(dbToDesign);
    } catch (error) {
      console.error('PostgreSQL error:', error);
      return [];
    }
  },

  get: async (id: string): Promise<Design | null> => {
    if (!isPostgresConfigured()) return null;
    try {
      const result = await query<DbDesign>(
        'SELECT * FROM designs WHERE id = $1',
        [id]
      );
      return result.rows.length > 0 ? dbToDesign(result.rows[0]) : null;
    } catch (error) {
      console.error('PostgreSQL error:', error);
      return null;
    }
  },

  save: async (design: Design): Promise<void> => {
    if (!isPostgresConfigured()) return;
    try {
      await query(
        `INSERT INTO designs (
          id, project_id, plan_id, design_system, screens, components,
          style_guide_url, designed_by, approved_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO UPDATE SET
          design_system = EXCLUDED.design_system,
          screens = EXCLUDED.screens,
          components = EXCLUDED.components,
          style_guide_url = EXCLUDED.style_guide_url,
          approved_at = EXCLUDED.approved_at`,
        [
          design.id,
          design.projectId,
          design.planId || null,
          design.designSystem,
          design.screens || null,
          design.components || null,
          design.styleGuideUrl || null,
          design.designedBy || null,
          design.approvedAt || null,
        ]
      );
    } catch (error) {
      console.error('PostgreSQL error:', error);
    }
  },
};

// M-006: Project Metrics Storage
export const metricsStorage = {
  getByProject: async (projectId: string): Promise<ProjectMetrics[]> => {
    if (!isPostgresConfigured()) return [];
    try {
      const result = await query<DbProjectMetrics>(
        'SELECT * FROM project_metrics WHERE project_id = $1 ORDER BY recorded_at DESC',
        [projectId]
      );
      return result.rows.map(dbToProjectMetrics);
    } catch (error) {
      console.error('PostgreSQL error:', error);
      return [];
    }
  },

  getLatest: async (projectId: string): Promise<ProjectMetrics | null> => {
    if (!isPostgresConfigured()) return null;
    try {
      const result = await query<DbProjectMetrics>(
        'SELECT * FROM project_metrics WHERE project_id = $1 ORDER BY recorded_at DESC LIMIT 1',
        [projectId]
      );
      return result.rows.length > 0 ? dbToProjectMetrics(result.rows[0]) : null;
    } catch (error) {
      console.error('PostgreSQL error:', error);
      return null;
    }
  },

  save: async (metrics: ProjectMetrics): Promise<void> => {
    if (!isPostgresConfigured()) return;
    try {
      await query(
        `INSERT INTO project_metrics (
          id, project_id, velocity, avg_feature_hours, estimation_accuracy,
          burndown_data, raci_data, completion_percentage, features_completed,
          features_total, deploys_count, last_deploy_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          metrics.id,
          metrics.projectId,
          metrics.velocity || null,
          metrics.avgFeatureHours || null,
          metrics.estimationAccuracy || null,
          metrics.burndownData || null,
          metrics.raciData || null,
          metrics.completionPercentage || null,
          metrics.featuresCompleted || null,
          metrics.featuresTotal || null,
          metrics.deploysCount || null,
          metrics.lastDeployAt || null,
        ]
      );
    } catch (error) {
      console.error('PostgreSQL error:', error);
    }
  },
};

// M-008: Tools Storage
export const toolStorage = {
  getAll: async (): Promise<Tool[]> => {
    if (!isPostgresConfigured()) return [];
    try {
      const result = await query<DbTool>(
        'SELECT * FROM tools ORDER BY category, name'
      );
      return result.rows.map(dbToTool);
    } catch (error) {
      console.error('PostgreSQL error:', error);
      return [];
    }
  },

  getByCategory: async (category: Tool['category']): Promise<Tool[]> => {
    if (!isPostgresConfigured()) return [];
    try {
      const result = await query<DbTool>(
        'SELECT * FROM tools WHERE category = $1 ORDER BY name',
        [category]
      );
      return result.rows.map(dbToTool);
    } catch (error) {
      console.error('PostgreSQL error:', error);
      return [];
    }
  },

  get: async (id: string): Promise<Tool | null> => {
    if (!isPostgresConfigured()) return null;
    try {
      const result = await query<DbTool>(
        'SELECT * FROM tools WHERE id = $1',
        [id]
      );
      return result.rows.length > 0 ? dbToTool(result.rows[0]) : null;
    } catch (error) {
      console.error('PostgreSQL error:', error);
      return null;
    }
  },
};

// M-008: Project Tools Storage (Many-to-Many)
export const projectToolStorage = {
  getByProject: async (projectId: string): Promise<ProjectTool[]> => {
    if (!isPostgresConfigured()) return [];
    try {
      const result = await query<DbProjectTool>(
        'SELECT * FROM project_tools WHERE project_id = $1 ORDER BY added_at DESC',
        [projectId]
      );
      return result.rows.map(dbToProjectTool);
    } catch (error) {
      console.error('PostgreSQL error:', error);
      return [];
    }
  },

  save: async (projectTool: ProjectTool): Promise<void> => {
    if (!isPostgresConfigured()) return;
    try {
      await query(
        `INSERT INTO project_tools (
          project_id, tool_id, api_key_configured, notes, is_favorite
        ) VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (project_id, tool_id) DO UPDATE SET
          api_key_configured = EXCLUDED.api_key_configured,
          notes = EXCLUDED.notes,
          is_favorite = EXCLUDED.is_favorite`,
        [
          projectTool.projectId,
          projectTool.toolId,
          projectTool.apiKeyConfigured || null,
          projectTool.notes || null,
          projectTool.isFavorite || null,
        ]
      );
    } catch (error) {
      console.error('PostgreSQL error:', error);
    }
  },

  delete: async (projectId: string, toolId: string): Promise<void> => {
    if (!isPostgresConfigured()) return;
    try {
      await query(
        'DELETE FROM project_tools WHERE project_id = $1 AND tool_id = $2',
        [projectId, toolId]
      );
    } catch (error) {
      console.error('PostgreSQL error:', error);
    }
  },
};

// M-009: Idea Mixer - Database types
type DbIdea = {
  id: string;
  user_id: string | null;
  nombre: string | null;
  problema: string;
  mercado_objetivo: string;
  urgencia: string;
  tamaño_mercado: string | null;
  evidencia_demanda: string | null;
  solucion: string;
  herramientas_disponibles: string[] | null;
  integraciones_necesarias: any;
  informacion_requerida: string[] | null;
  complejidad_tecnica: number;
  skills_requeridos: any;
  tiempo_estimado: any;
  bloqueadores: string[] | null;
  tags: string[] | null;
  categoria: string | null;
  notas: string | null;
  favorita: boolean | null;
  created_at: Date;
  updated_at: Date | null;
};

type DbIdeaCombination = {
  id: string;
  user_id: string | null;
  idea_ids: string[];
  veredicto: string | null;
  confianza: number | null;
  analisis_completo: any;
  created_at: Date;
};

// Converter functions
function dbToIdea(dbIdea: DbIdea): Idea {
  return {
    id: dbIdea.id,
    userId: dbIdea.user_id || undefined,
    nombre: dbIdea.nombre || undefined,
    problema: dbIdea.problema,
    mercadoObjetivo: dbIdea.mercado_objetivo,
    urgencia: dbIdea.urgencia as 'baja' | 'media' | 'alta' | 'crítica',
    tamañoMercado: dbIdea.tamaño_mercado || undefined,
    evidenciaDemanda: dbIdea.evidencia_demanda || undefined,
    solucion: dbIdea.solucion,
    herramientasDisponibles: dbIdea.herramientas_disponibles || undefined,
    integracionesNecesarias: dbIdea.integraciones_necesarias || undefined,
    informacionRequerida: dbIdea.informacion_requerida || undefined,
    complejidadTecnica: dbIdea.complejidad_tecnica as 1 | 2 | 3 | 4 | 5,
    skillsRequeridos: dbIdea.skills_requeridos || undefined,
    tiempoEstimado: dbIdea.tiempo_estimado || undefined,
    bloqueadores: dbIdea.bloqueadores || undefined,
    tags: dbIdea.tags || undefined,
    categoria: dbIdea.categoria || undefined,
    notas: dbIdea.notas || undefined,
    favorita: dbIdea.favorita || undefined,
    createdAt: dbIdea.created_at.toISOString(),
    updatedAt: dbIdea.updated_at?.toISOString(),
  };
}

function dbToIdeaCombination(dbCombo: DbIdeaCombination): IdeaCombination {
  return {
    id: dbCombo.id,
    userId: dbCombo.user_id || undefined,
    ideaIds: dbCombo.idea_ids,
    veredicto: dbCombo.veredicto as 'VIABLE' | 'NO_VIABLE' | undefined,
    confianza: dbCombo.confianza || undefined,
    analisisCompleto: dbCombo.analisis_completo || undefined,
    createdAt: dbCombo.created_at.toISOString(),
  };
}

// M-009: Idea Storage
export const ideaStorage = {
  getAll: async (): Promise<Idea[]> => {
    if (!isPostgresConfigured()) return [];
    try {
      const result = await query<DbIdea>(
        'SELECT * FROM ideas ORDER BY created_at DESC'
      );
      return result.rows.map(dbToIdea);
    } catch (error) {
      console.error('PostgreSQL error:', error);
      return [];
    }
  },

  get: async (id: string): Promise<Idea | null> => {
    if (!isPostgresConfigured()) return null;
    try {
      const result = await query<DbIdea>(
        'SELECT * FROM ideas WHERE id = $1',
        [id]
      );
      return result.rows.length > 0 ? dbToIdea(result.rows[0]) : null;
    } catch (error) {
      console.error('PostgreSQL error:', error);
      return null;
    }
  },

  save: async (idea: Idea): Promise<void> => {
    if (!isPostgresConfigured()) return;
    try {
      await query(
        `INSERT INTO ideas (
          id, user_id, nombre, problema, mercado_objetivo, urgencia, tamaño_mercado, evidencia_demanda,
          solucion, herramientas_disponibles, integraciones_necesarias, informacion_requerida,
          complejidad_tecnica, skills_requeridos, tiempo_estimado, bloqueadores,
          tags, categoria, notas, favorita
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
        ON CONFLICT (id) DO UPDATE SET
          nombre = EXCLUDED.nombre,
          problema = EXCLUDED.problema,
          mercado_objetivo = EXCLUDED.mercado_objetivo,
          urgencia = EXCLUDED.urgencia,
          tamaño_mercado = EXCLUDED.tamaño_mercado,
          evidencia_demanda = EXCLUDED.evidencia_demanda,
          solucion = EXCLUDED.solucion,
          herramientas_disponibles = EXCLUDED.herramientas_disponibles,
          integraciones_necesarias = EXCLUDED.integraciones_necesarias,
          informacion_requerida = EXCLUDED.informacion_requerida,
          complejidad_tecnica = EXCLUDED.complejidad_tecnica,
          skills_requeridos = EXCLUDED.skills_requeridos,
          tiempo_estimado = EXCLUDED.tiempo_estimado,
          bloqueadores = EXCLUDED.bloqueadores,
          tags = EXCLUDED.tags,
          categoria = EXCLUDED.categoria,
          notas = EXCLUDED.notas,
          favorita = EXCLUDED.favorita`,
        [
          idea.id,
          idea.userId || null,
          idea.nombre || null,
          idea.problema,
          idea.mercadoObjetivo,
          idea.urgencia,
          idea.tamañoMercado || null,
          idea.evidenciaDemanda || null,
          idea.solucion,
          idea.herramientasDisponibles || null,
          JSON.stringify(idea.integracionesNecesarias || []),
          idea.informacionRequerida || null,
          idea.complejidadTecnica,
          JSON.stringify(idea.skillsRequeridos || []),
          JSON.stringify(idea.tiempoEstimado || {}),
          idea.bloqueadores || null,
          idea.tags || null,
          idea.categoria || null,
          idea.notas || null,
          idea.favorita || false,
        ]
      );
    } catch (error) {
      console.error('PostgreSQL error:', error);
    }
  },

  delete: async (id: string): Promise<void> => {
    if (!isPostgresConfigured()) return;
    try {
      await query('DELETE FROM ideas WHERE id = $1', [id]);
    } catch (error) {
      console.error('PostgreSQL error:', error);
    }
  },
};

// M-009: Idea Combination Storage
export const ideaCombinationStorage = {
  getAll: async (): Promise<IdeaCombination[]> => {
    if (!isPostgresConfigured()) return [];
    try {
      const result = await query<DbIdeaCombination>(
        'SELECT * FROM idea_combinations ORDER BY created_at DESC'
      );
      return result.rows.map(dbToIdeaCombination);
    } catch (error) {
      console.error('PostgreSQL error:', error);
      return [];
    }
  },

  get: async (id: string): Promise<IdeaCombination | null> => {
    if (!isPostgresConfigured()) return null;
    try {
      const result = await query<DbIdeaCombination>(
        'SELECT * FROM idea_combinations WHERE id = $1',
        [id]
      );
      return result.rows.length > 0 ? dbToIdeaCombination(result.rows[0]) : null;
    } catch (error) {
      console.error('PostgreSQL error:', error);
      return null;
    }
  },

  save: async (combination: IdeaCombination): Promise<void> => {
    if (!isPostgresConfigured()) return;
    try {
      await query(
        `INSERT INTO idea_combinations (
          id, user_id, idea_ids, veredicto, confianza, analisis_completo
        ) VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO UPDATE SET
          veredicto = EXCLUDED.veredicto,
          confianza = EXCLUDED.confianza,
          analisis_completo = EXCLUDED.analisis_completo`,
        [
          combination.id,
          combination.userId || null,
          combination.ideaIds,
          combination.veredicto || null,
          combination.confianza || null,
          JSON.stringify(combination.analisisCompleto || {}),
        ]
      );
    } catch (error) {
      console.error('PostgreSQL error:', error);
    }
  },

  delete: async (id: string): Promise<void> => {
    if (!isPostgresConfigured()) return;
    try {
      await query('DELETE FROM idea_combinations WHERE id = $1', [id]);
    } catch (error) {
      console.error('PostgreSQL error:', error);
    }
  },
};
