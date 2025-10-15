'use client';

import { Project } from '@/lib/types';
import { ProjectCard } from './project-card';

interface ProjectGridProps {
  projects: Project[];
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
}

export function ProjectGrid({ projects, onDelete, onArchive }: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-2xl font-bold mb-2">No hay proyectos</h3>
        <p className="text-muted-foreground">
          Crea tu primer proyecto para empezar a gestionar tus prompts
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onDelete={onDelete}
          onArchive={onArchive}
        />
      ))}
    </div>
  );
}
