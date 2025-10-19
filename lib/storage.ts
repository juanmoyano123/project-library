import { Project, Prompt } from './types';

const PROJECTS_KEY = 'project-library-projects';
const PROMPTS_KEY = 'project-library-prompts';

// Projects Storage (localStorage)
export const projectStorage = {
  getAll: (): Project[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(PROJECTS_KEY);
    return data ? JSON.parse(data) : [];
  },

  get: (id: string): Project | null => {
    const projects = projectStorage.getAll();
    return projects.find(p => p.id === id) || null;
  },

  save: (project: Project): void => {
    const projects = projectStorage.getAll();
    const index = projects.findIndex(p => p.id === project.id);

    if (index >= 0) {
      projects[index] = project;
    } else {
      projects.push(project);
    }

    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  },

  delete: (id: string): void => {
    const projects = projectStorage.getAll();
    const filtered = projects.filter(p => p.id !== id);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(filtered));

    // Also delete associated prompts
    promptStorage.deleteByProject(id);
  },
};

// Prompts Storage (localStorage for now, can migrate to IndexedDB later)
export const promptStorage = {
  getAll: (): Prompt[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(PROMPTS_KEY);
    return data ? JSON.parse(data) : [];
  },

  get: (id: string): Prompt | null => {
    const prompts = promptStorage.getAll();
    return prompts.find(p => p.id === id) || null;
  },

  getByProject: (projectId: string): Prompt[] => {
    const prompts = promptStorage.getAll();
    return prompts
      .filter(p => p.projectId === projectId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  },

  save: (prompt: Prompt): void => {
    const prompts = promptStorage.getAll();
    const index = prompts.findIndex(p => p.id === prompt.id);

    if (index >= 0) {
      prompts[index] = prompt;
    } else {
      prompts.push(prompt);
    }

    localStorage.setItem(PROMPTS_KEY, JSON.stringify(prompts));
  },

  delete: (id: string): void => {
    const prompts = promptStorage.getAll();
    const filtered = prompts.filter(p => p.id !== id);
    localStorage.setItem(PROMPTS_KEY, JSON.stringify(filtered));
  },

  deleteByProject: (projectId: string): void => {
    const prompts = promptStorage.getAll();
    const filtered = prompts.filter(p => p.projectId !== projectId);
    localStorage.setItem(PROMPTS_KEY, JSON.stringify(filtered));
  },
};

// Export/Import utilities
export const exportData = () => {
  return {
    projects: projectStorage.getAll(),
    prompts: promptStorage.getAll(),
    exportedAt: new Date().toISOString(),
  };
};

export const importData = (data: { projects: Project[], prompts: Prompt[] }) => {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(data.projects));
  localStorage.setItem(PROMPTS_KEY, JSON.stringify(data.prompts));
};
