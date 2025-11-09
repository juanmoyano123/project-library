'use client';

import { useState, useEffect } from 'react';
import { Project, Prompt, ProjectWithPrompts } from '@/lib/types';
import { projectStorage, promptStorage } from '@/lib/api-storage';
import { nanoid } from 'nanoid';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    const data = await projectStorage.getAll();
    setProjects(data);
    setLoading(false);
  };

  const createProject = async (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProject: Project = {
      ...data,
      id: nanoid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await projectStorage.save(newProject);
    await loadProjects();
    return newProject;
  };

  const updateProject = async (id: string, data: Partial<Project>) => {
    const project = await projectStorage.get(id);
    if (!project) return null;

    const updatedProject: Project = {
      ...project,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    await projectStorage.save(updatedProject);
    await loadProjects();
    return updatedProject;
  };

  const deleteProject = async (id: string) => {
    await projectStorage.delete(id);
    await loadProjects();
  };

  const getProject = async (id: string): Promise<Project | null> => {
    return await projectStorage.get(id);
  };

  return {
    projects,
    loading,
    createProject,
    updateProject,
    deleteProject,
    getProject,
    refresh: loadProjects,
  };
}

export function useProject(projectId: string) {
  const [project, setProject] = useState<ProjectWithPrompts | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    setLoading(true);
    const projectData = await projectStorage.get(projectId);
    if (projectData) {
      const prompts = await promptStorage.getByProject(projectId);
      setProject({ ...projectData, prompts });
    } else {
      setProject(null);
    }
    setLoading(false);
  };

  const addPrompt = async (data: {
    originalPrompt: string;
    improvedPrompt: string | null;
    claudePlan: string;
    stage: number;
  }) => {
    const newPrompt: Prompt = {
      id: nanoid(),
      projectId,
      originalPrompt: data.originalPrompt,
      improvedPrompt: data.improvedPrompt,
      claudePlan: data.claudePlan,
      timestamp: new Date().toISOString(),
      stage: data.stage as any,
    };

    await promptStorage.save(newPrompt);
    await loadProject();
    return newPrompt;
  };

  const deletePrompt = async (promptId: string) => {
    await promptStorage.delete(promptId);
    await loadProject();
  };

  const updateProjectStage = async (stage: number) => {
    if (project) {
      const updated = await projectStorage.get(projectId);
      if (updated) {
        await projectStorage.save({
          ...updated,
          currentStage: stage as any,
          updatedAt: new Date().toISOString(),
        });
        await loadProject();
      }
    }
  };

  const updatePromptNotes = async (promptId: string, notes: string) => {
    const prompt = await promptStorage.get(promptId);
    if (prompt) {
      const updatedPrompt: Prompt = {
        ...prompt,
        executionNotes: notes,
        notesUpdatedAt: new Date().toISOString(),
      };
      await promptStorage.save(updatedPrompt);
      await loadProject();
    }
  };

  const updateProject = async (id: string, data: Partial<Project>) => {
    const projectData = await projectStorage.get(id);
    if (!projectData) return null;

    const updatedProject: Project = {
      ...projectData,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    await projectStorage.save(updatedProject);
    await loadProject();
    return updatedProject;
  };

  return {
    project,
    loading,
    addPrompt,
    deletePrompt,
    updateProjectStage,
    updatePromptNotes,
    updateProject,
    refresh: loadProject,
  };
}
