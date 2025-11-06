'use client';

import { useState } from 'react';
import { useProjects } from '@/hooks/use-projects';
import { ProjectGrid } from '@/components/projects/project-grid';
import { NewProjectDialog } from '@/components/projects/new-project-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Sparkles, Rocket } from 'lucide-react';

export default function ProjectsPage() {
  const { projects, createProject, deleteProject, updateProject, loading } = useProjects();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleArchive = (id: string) => {
    const project = projects.find(p => p.id === id);
    if (project) {
      updateProject(id, {
        status: project.status === 'archived' ? 'active' : 'archived',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <Sparkles className="h-16 w-16 text-primary animate-pulse" />
          </div>
          <p className="text-lg text-muted-foreground">Cargando proyectos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Neo-Brutalism Hero Section */}
      <div className="relative border-b-4 border-black bg-white">
        {/* Decorative colored blocks */}
        <div className="absolute top-12 right-12 w-32 h-32 bg-[hsl(0,100%,60%)] neo-border rotate-12 hidden lg:block" />
        <div className="absolute bottom-12 left-12 w-24 h-24 bg-[hsl(60,100%,50%)] neo-border -rotate-6 hidden lg:block" />
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-[hsl(215,100%,50%)] neo-border rotate-45 hidden md:block" />

        <div className="container mx-auto px-6 py-24 lg:py-32 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="space-y-8 text-center">
              {/* Neo Badge */}
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-[hsl(0,100%,60%)] text-white neo-border-sm neo-shadow-sm font-black uppercase text-xs tracking-wider">
                <Rocket className="h-4 w-4" />
                <span>Gestión de Proyectos + IA</span>
              </div>

              {/* Main Heading - BOLD & BLACK */}
              <h1 className="text-7xl lg:text-9xl font-black tracking-tighter leading-none text-black uppercase">
                Project<br />Library
              </h1>

              {/* Subheading - HIGH CONTRAST */}
              <p className="text-xl lg:text-2xl text-black max-w-2xl mx-auto font-bold leading-tight">
                Gestiona proyectos, prompts y planificación con <span className="bg-[hsl(60,100%,50%)] px-2 py-1 neo-border-sm">elegancia</span> y <span className="bg-[hsl(215,100%,50%)] text-white px-2 py-1 neo-border-sm">potencia</span>
              </p>

              {/* CTA Section */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                <button
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-[hsl(0,100%,60%)] text-white neo-btn hover:bg-[hsl(0,100%,55%)] text-lg"
                >
                  <Plus className="mr-2 h-5 w-5 inline" />
                  Nuevo Proyecto
                </button>
                <div className="flex items-center gap-3 text-black text-base font-bold bg-[hsl(60,100%,50%)] px-6 py-3 neo-border-sm neo-shadow-sm uppercase tracking-wide">
                  <div className="h-3 w-3 bg-black animate-pulse" />
                  <span>
                    {projects.length} {projects.length === 1 ? 'Proyecto' : 'Proyectos'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-16">
        {/* Search Bar - Neo Style */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white neo-card p-8">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black" />
                <Input
                  placeholder="BUSCAR PROYECTOS..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-base font-bold uppercase tracking-wide bg-white neo-border focus:ring-4 focus:ring-[hsl(60,100%,50%)] transition-all"
                />
              </div>
              <div className="flex items-center gap-2 text-sm font-black text-black uppercase bg-[hsl(215,100%,50%)] text-white px-4 py-3 neo-border-sm">
                <span>
                  {filteredProjects.length} {filteredProjects.length === 1 ? 'Resultado' : 'Resultados'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <ProjectGrid
          projects={filteredProjects}
          onDelete={deleteProject}
          onArchive={handleArchive}
        />
      </div>

      <NewProjectDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onCreateProject={createProject}
      />
    </div>
  );
}
