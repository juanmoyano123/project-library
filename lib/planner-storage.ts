import { ProjectPlan } from './types';

const PLANNER_KEY_PREFIX = 'project-plan-';

export const plannerStorage = {
  get: (projectId: string): ProjectPlan | null => {
    if (typeof window === 'undefined') return null;

    const key = `${PLANNER_KEY_PREFIX}${projectId}`;
    const data = localStorage.getItem(key);

    return data ? JSON.parse(data) : null;
  },

  save: (plan: ProjectPlan): void => {
    if (typeof window === 'undefined') return;

    const key = `${PLANNER_KEY_PREFIX}${plan.projectId}`;
    const updatedPlan = {
      ...plan,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(key, JSON.stringify(updatedPlan));
  },

  delete: (projectId: string): void => {
    if (typeof window === 'undefined') return;

    const key = `${PLANNER_KEY_PREFIX}${projectId}`;
    localStorage.removeItem(key);
  },

  exists: (projectId: string): boolean => {
    if (typeof window === 'undefined') return false;

    const key = `${PLANNER_KEY_PREFIX}${projectId}`;
    return localStorage.getItem(key) !== null;
  },
};
