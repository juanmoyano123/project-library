import { Project, Prompt } from './types';
import { projectStorage as localProjectStorage, promptStorage as localPromptStorage } from './storage';

// Client-side storage that uses API routes
const API_BASE = '/api';

// Projects Storage
export const projectStorage = {
  getAll: async (): Promise<Project[]> => {
    try {
      const response = await fetch(`${API_BASE}/projects`);
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      return await response.json();
    } catch (error) {
      console.error('API error, falling back to localStorage:', error);
      return localProjectStorage.getAll();
    }
  },

  get: async (id: string): Promise<Project | null> => {
    try {
      const response = await fetch(`${API_BASE}/projects/${id}`);
      if (response.status === 404) {
        return null;
      }
      if (!response.ok) {
        throw new Error('Failed to fetch project');
      }
      return await response.json();
    } catch (error) {
      console.error('API error, falling back to localStorage:', error);
      return localProjectStorage.get(id);
    }
  },

  save: async (project: Project): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
      });

      if (!response.ok) {
        throw new Error('Failed to save project');
      }
    } catch (error) {
      console.error('API error, falling back to localStorage:', error);
      localProjectStorage.save(project);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE}/projects/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }
    } catch (error) {
      console.error('API error, falling back to localStorage:', error);
      localProjectStorage.delete(id);
    }
  },
};

// Prompts Storage
export const promptStorage = {
  getAll: async (): Promise<Prompt[]> => {
    try {
      const response = await fetch(`${API_BASE}/prompts`);
      if (!response.ok) {
        throw new Error('Failed to fetch prompts');
      }
      return await response.json();
    } catch (error) {
      console.error('API error, falling back to localStorage:', error);
      return localPromptStorage.getAll();
    }
  },

  get: async (id: string): Promise<Prompt | null> => {
    try {
      const response = await fetch(`${API_BASE}/prompts/${id}`);
      if (response.status === 404) {
        return null;
      }
      if (!response.ok) {
        throw new Error('Failed to fetch prompt');
      }
      return await response.json();
    } catch (error) {
      console.error('API error, falling back to localStorage:', error);
      return localPromptStorage.get(id);
    }
  },

  getByProject: async (projectId: string): Promise<Prompt[]> => {
    try {
      const response = await fetch(`${API_BASE}/prompts?projectId=${projectId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch prompts');
      }
      return await response.json();
    } catch (error) {
      console.error('API error, falling back to localStorage:', error);
      return localPromptStorage.getByProject(projectId);
    }
  },

  save: async (prompt: Prompt): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE}/prompts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prompt),
      });

      if (!response.ok) {
        throw new Error('Failed to save prompt');
      }
    } catch (error) {
      console.error('API error, falling back to localStorage:', error);
      localPromptStorage.save(prompt);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE}/prompts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete prompt');
      }
    } catch (error) {
      console.error('API error, falling back to localStorage:', error);
      localPromptStorage.delete(id);
    }
  },

  deleteByProject: async (projectId: string): Promise<void> => {
    try {
      const prompts = await promptStorage.getByProject(projectId);
      await Promise.all(prompts.map(p => promptStorage.delete(p.id)));
    } catch (error) {
      console.error('API error, falling back to localStorage:', error);
      localPromptStorage.deleteByProject(projectId);
    }
  },
};
