import { supabase, isSupabaseConfigured } from './supabase';
import { Project, Prompt } from './types';
import { projectStorage as localProjectStorage, promptStorage as localPromptStorage } from './storage';

// Database type definitions matching Supabase schema
type DbProject = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
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
  timestamp: string;
  stage: number;
  tokens: number | null;
  model: string | null;
};

// Convert DB format to App format
const dbToProject = (db: DbProject): Project => ({
  id: db.id,
  name: db.name,
  description: db.description || '',
  createdAt: db.created_at,
  updatedAt: db.updated_at,
  status: db.status as Project['status'],
  currentStage: db.current_stage as Project['currentStage'],
  tags: db.tags || [],
});

const projectToDb = (project: Partial<Project>): Partial<DbProject> => ({
  ...(project.id && { id: project.id }),
  ...(project.name && { name: project.name }),
  ...(project.description !== undefined && { description: project.description }),
  ...(project.createdAt && { created_at: project.createdAt }),
  ...(project.updatedAt && { updated_at: project.updatedAt }),
  ...(project.status && { status: project.status }),
  ...(project.currentStage !== undefined && { current_stage: project.currentStage }),
  ...(project.tags && { tags: project.tags }),
});

const dbToPrompt = (db: DbPrompt): Prompt => ({
  id: db.id,
  projectId: db.project_id,
  originalPrompt: db.original_prompt,
  improvedPrompt: db.improved_prompt,
  claudePlan: db.claude_plan,
  timestamp: db.timestamp,
  stage: db.stage as Prompt['stage'],
  tokens: db.tokens || undefined,
  model: db.model || undefined,
});

const promptToDb = (prompt: Partial<Prompt>): Partial<DbPrompt> => ({
  ...(prompt.id && { id: prompt.id }),
  ...(prompt.projectId && { project_id: prompt.projectId }),
  ...(prompt.originalPrompt !== undefined && { original_prompt: prompt.originalPrompt }),
  ...(prompt.improvedPrompt !== undefined && { improved_prompt: prompt.improvedPrompt }),
  ...(prompt.claudePlan !== undefined && { claude_plan: prompt.claudePlan }),
  ...(prompt.timestamp && { timestamp: prompt.timestamp }),
  ...(prompt.stage !== undefined && { stage: prompt.stage }),
  ...(prompt.tokens !== undefined && { tokens: prompt.tokens }),
  ...(prompt.model !== undefined && { model: prompt.model }),
});

// Projects Storage with Supabase fallback
export const projectStorage = {
  getAll: async (): Promise<Project[]> => {
    if (!isSupabaseConfigured()) {
      return localProjectStorage.getAll();
    }

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Supabase error, falling back to localStorage:', error);
      return localProjectStorage.getAll();
    }

    return (data || []).map(dbToProject);
  },

  get: async (id: string): Promise<Project | null> => {
    if (!isSupabaseConfigured()) {
      return localProjectStorage.get(id);
    }

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase error, falling back to localStorage:', error);
      return localProjectStorage.get(id);
    }

    return data ? dbToProject(data) : null;
  },

  save: async (project: Project): Promise<void> => {
    if (!isSupabaseConfigured()) {
      return localProjectStorage.save(project);
    }

    const dbProject = projectToDb(project);
    const { error } = await supabase
      .from('projects')
      .upsert(dbProject);

    if (error) {
      console.error('Supabase error, falling back to localStorage:', error);
      localProjectStorage.save(project);
      return;
    }
  },

  delete: async (id: string): Promise<void> => {
    if (!isSupabaseConfigured()) {
      return localProjectStorage.delete(id);
    }

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error, falling back to localStorage:', error);
      localProjectStorage.delete(id);
      return;
    }
  },
};

// Prompts Storage with Supabase fallback
export const promptStorage = {
  getAll: async (): Promise<Prompt[]> => {
    if (!isSupabaseConfigured()) {
      return localPromptStorage.getAll();
    }

    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .order('timestamp', { ascending: true });

    if (error) {
      console.error('Supabase error, falling back to localStorage:', error);
      return localPromptStorage.getAll();
    }

    return (data || []).map(dbToPrompt);
  },

  get: async (id: string): Promise<Prompt | null> => {
    if (!isSupabaseConfigured()) {
      return localPromptStorage.get(id);
    }

    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase error, falling back to localStorage:', error);
      return localPromptStorage.get(id);
    }

    return data ? dbToPrompt(data) : null;
  },

  getByProject: async (projectId: string): Promise<Prompt[]> => {
    if (!isSupabaseConfigured()) {
      return localPromptStorage.getByProject(projectId);
    }

    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('project_id', projectId)
      .order('timestamp', { ascending: true });

    if (error) {
      console.error('Supabase error, falling back to localStorage:', error);
      return localPromptStorage.getByProject(projectId);
    }

    return (data || []).map(dbToPrompt);
  },

  save: async (prompt: Prompt): Promise<void> => {
    if (!isSupabaseConfigured()) {
      return localPromptStorage.save(prompt);
    }

    const dbPrompt = promptToDb(prompt);
    const { error } = await supabase
      .from('prompts')
      .upsert(dbPrompt);

    if (error) {
      console.error('Supabase error, falling back to localStorage:', error);
      localPromptStorage.save(prompt);
      return;
    }
  },

  delete: async (id: string): Promise<void> => {
    if (!isSupabaseConfigured()) {
      return localPromptStorage.delete(id);
    }

    const { error } = await supabase
      .from('prompts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error, falling back to localStorage:', error);
      localPromptStorage.delete(id);
      return;
    }
  },

  deleteByProject: async (projectId: string): Promise<void> => {
    if (!isSupabaseConfigured()) {
      return localPromptStorage.deleteByProject(projectId);
    }

    const { error } = await supabase
      .from('prompts')
      .delete()
      .eq('project_id', projectId);

    if (error) {
      console.error('Supabase error, falling back to localStorage:', error);
      localPromptStorage.deleteByProject(projectId);
      return;
    }
  },
};
