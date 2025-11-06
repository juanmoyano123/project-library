'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Idea } from '@/lib/types';
import { IdeaDetailDialog } from '@/components/ideas/idea-detail-dialog';
import {
  Lightbulb,
  Rocket,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ArrowRight,
  Eye,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface IdeasSectionProps {
  onCreateProject: (idea: Idea) => void | Promise<void>;
}

const URGENCIA_CONFIG = {
  baja: { color: 'bg-gray-100 text-gray-700', label: 'Baja' },
  media: { color: 'bg-blue-100 text-blue-700', label: 'Media' },
  alta: { color: 'bg-orange-100 text-orange-700', label: 'Alta' },
  crítica: { color: 'bg-red-100 text-red-700', label: 'Crítica' },
};

export function IdeasSection({ onCreateProject }: IdeasSectionProps) {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [creatingProjectId, setCreatingProjectId] = useState<string | null>(null);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  useEffect(() => {
    loadIdeas();
  }, []);

  const loadIdeas = async () => {
    try {
      const response = await fetch('/api/ideas');
      if (response.ok) {
        const data = await response.json();
        // Solo mostrar las primeras 6 ideas más recientes
        setIdeas(data.slice(0, 6));
      }
    } catch (error) {
      console.error('Error loading ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (idea: Idea) => {
    setCreatingProjectId(idea.id);
    try {
      await onCreateProject(idea);
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Error al crear proyecto desde idea');
    } finally {
      setCreatingProjectId(null);
    }
  };

  const handleViewDetails = (idea: Idea) => {
    setSelectedIdea(idea);
    setIsDetailDialogOpen(true);
  };

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('ideas-scroll-container');
    if (container) {
      const scrollAmount = 400;
      const newPosition = direction === 'left'
        ? scrollPosition - scrollAmount
        : scrollPosition + scrollAmount;

      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };

  if (loading) {
    return (
      <div className="bg-white neo-card p-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (ideas.length === 0) {
    return (
      <div className="bg-white neo-card p-8">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Lightbulb className="h-16 w-16 mb-4 text-gray-400" />
          <h3 className="text-xl font-black mb-2">No tienes ideas todavía</h3>
          <p className="text-gray-600 mb-6">
            Crea tu primera idea usando el Mixer de Ideas con IA
          </p>
          <Link href="/ideas">
            <Button className="bg-[hsl(60,100%,50%)] text-black neo-btn hover:bg-[hsl(60,100%,45%)]">
              <Lightbulb className="mr-2 h-4 w-4" />
              Ir a Ideas
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white neo-card p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-[hsl(60,100%,50%)] p-3 neo-border-sm">
            <Lightbulb className="h-6 w-6 text-black" />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight">Ideas</h2>
            <p className="text-sm text-gray-600 font-bold">
              {ideas.length} {ideas.length === 1 ? 'idea lista' : 'ideas listas'} para convertir en proyecto
            </p>
          </div>
        </div>
        <Link href="/ideas">
          <Button
            variant="outline"
            className="neo-border-sm neo-shadow-sm font-bold uppercase"
          >
            Ver Todas
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="relative">
        {/* Scroll Buttons */}
        {ideas.length > 3 && (
          <>
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white neo-border-sm neo-shadow-sm p-2 hover:bg-gray-50 transition-all"
              style={{ transform: 'translateY(-50%) translateX(-50%)' }}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white neo-border-sm neo-shadow-sm p-2 hover:bg-gray-50 transition-all"
              style={{ transform: 'translateY(-50%) translateX(50%)' }}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Ideas Cards */}
        <div
          id="ideas-scroll-container"
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {ideas.map((idea) => {
            const urgenciaConfig = URGENCIA_CONFIG[idea.urgencia];
            const totalWeeks = idea.tiempoEstimado
              ? idea.tiempoEstimado.diseño + idea.tiempoEstimado.desarrollo + idea.tiempoEstimado.testing
              : 0;

            return (
              <Card
                key={idea.id}
                className="flex-shrink-0 w-80 neo-card-sm hover:neo-shadow transition-all"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <Badge
                      variant="outline"
                      className="neo-border-sm font-mono font-bold uppercase"
                    >
                      {idea.id}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={cn('neo-border-sm text-xs', urgenciaConfig.color)}
                    >
                      {urgenciaConfig.label}
                    </Badge>
                  </div>
                  {idea.categoria && (
                    <Badge
                      variant="outline"
                      className="w-fit neo-border-sm uppercase text-xs mb-2"
                    >
                      {idea.categoria}
                    </Badge>
                  )}

                  {/* Nombre del Proyecto - DESTACADO */}
                  {idea.nombre && (
                    <h3 className="text-lg font-black mb-2 leading-tight">
                      {idea.nombre}
                    </h3>
                  )}
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* Problema */}
                  <div>
                    <p className="text-xs font-bold text-gray-500 mb-1 uppercase">
                      Problema
                    </p>
                    <p className="text-sm line-clamp-2 font-medium">{idea.problema}</p>
                  </div>

                  {/* Solución */}
                  <div>
                    <p className="text-xs font-bold text-gray-500 mb-1 uppercase">
                      Solución
                    </p>
                    <p className="text-sm line-clamp-2 font-medium">{idea.solucion}</p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="bg-gray-100 p-2 neo-border-sm">
                      <p className="text-xs text-gray-600 font-bold">Complejidad</p>
                      <p className="text-lg font-black">{idea.complejidadTecnica}/5</p>
                    </div>
                    {totalWeeks > 0 && (
                      <div className="bg-gray-100 p-2 neo-border-sm">
                        <p className="text-xs text-gray-600 font-bold">Tiempo</p>
                        <p className="text-lg font-black">{totalWeeks}w</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(idea);
                      }}
                      variant="outline"
                      size="sm"
                      className="flex-1 neo-border-sm neo-shadow-sm font-bold uppercase"
                    >
                      <Eye className="mr-1 h-4 w-4" />
                      Ver
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCreateProject(idea);
                      }}
                      disabled={creatingProjectId === idea.id}
                      size="sm"
                      className="flex-1 bg-[hsl(0,100%,60%)] text-white neo-btn hover:bg-[hsl(0,100%,55%)] font-bold uppercase"
                    >
                      {creatingProjectId === idea.id ? (
                        <>
                          <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                          Creando...
                        </>
                      ) : (
                        <>
                          <Rocket className="mr-1 h-4 w-4" />
                          Crear
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Idea Detail Dialog */}
      <IdeaDetailDialog
        idea={selectedIdea}
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
      />
    </div>
  );
}
