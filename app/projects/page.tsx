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
    <div className="min-h-screen bg-background">
      {/* Hero Section with Deep Purple/Blue Gradient */}
      <div className="relative overflow-hidden gradient-hero border-b-2 border-light-blue/30">
        {/* Animated glow orbs */}
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-light-blue/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-mint-green/20 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="container mx-auto px-6 py-24 lg:py-32 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="space-y-8 text-center">
              {/* Glassmorphic Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full text-sm font-bold text-white border-2 border-mint-green/60 shadow-lg">
                <Rocket className="h-4 w-4" />
                <span>Gestión de Proyectos + IA</span>
              </div>

              {/* Main Heading - SUPER VISIBLE */}
              <h1 className="text-6xl lg:text-8xl font-bold tracking-tight leading-none text-white drop-shadow-2xl">
                Project Library
              </h1>

              {/* Subheading - HIGH CONTRAST */}
              <p className="text-xl lg:text-2xl text-mint-green max-w-2xl mx-auto font-semibold leading-relaxed drop-shadow-lg">
                Gestiona proyectos, prompts y planificación con elegancia y potencia
              </p>

              {/* CTA Section */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  size="lg"
                  className="bg-mint-green text-dark-purple hover:bg-white hover:text-federal-blue shadow-2xl hover:shadow-mint transition-all px-8 h-14 font-bold text-base"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Nuevo Proyecto
                </Button>
                <div className="flex items-center gap-2 text-white text-base font-semibold bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                  <div className="h-2 w-2 rounded-full bg-mint-green animate-pulse" />
                  <span>
                    {projects.length} {projects.length === 1 ? 'proyecto' : 'proyectos'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Search Bar Card - Minimalist */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-card rounded-2xl shadow-subtle border border-border p-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar proyectos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 h-11 text-sm bg-background border-border focus:border-foreground/20 transition-colors"
                />
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <span>
                  {filteredProjects.length} {filteredProjects.length === 1 ? 'resultado' : 'resultados'}
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
