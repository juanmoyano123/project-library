'use client';

import { Project, STAGE_NAMES } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Calendar, Tag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
}

export function ProjectCard({ project, onDelete, onArchive }: ProjectCardProps) {
  const statusConfig = {
    active: {
      label: 'Activo',
      className: 'bg-mint-green/20 text-federal-blue dark:text-mint-green border-mint-green/40',
    },
    completed: {
      label: 'Completado',
      className: 'bg-light-blue/20 text-marian-blue dark:text-light-blue border-light-blue/40',
    },
    archived: {
      label: 'Archivado',
      className: 'bg-muted text-muted-foreground border-border/50',
    },
  };

  const status = statusConfig[project.status];

  return (
    <Card className="group relative overflow-hidden hover-lift hover:shadow-elevated hover:glow-blue transition-all duration-300 border border-border bg-card">
      {/* Gradient top border accent */}
      <div className="absolute top-0 left-0 right-0 h-px gradient-border" />

      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-light-blue/70" />
              <Badge
                variant="outline"
                className={cn('text-[10px] font-medium uppercase tracking-wider shrink-0', status.className)}
              >
                {status.label}
              </Badge>
            </div>
            <CardTitle className="text-xl font-light tracking-tight truncate text-gradient-accent">
              {project.name}
            </CardTitle>
            <CardDescription className="line-clamp-2 text-sm font-light leading-relaxed text-light-blue/80">
              {project.description}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/projects/${project.id}`}>Ver detalles</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onArchive(project.id)}>
                {project.status === 'archived' ? 'Desarchivar' : 'Archivar'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(project.id)} className="text-destructive">
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stage badge - monochrome */}
        <div className="flex items-center gap-2">
          <div className={cn(
            'px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide border bg-muted/50',
            `stage-badge-${project.currentStage}`
          )}>
            Etapa {project.currentStage}: {STAGE_NAMES[project.currentStage]}
          </div>
        </div>

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="h-3 w-3 text-muted-foreground/50 shrink-0" />
            {project.tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-[10px] font-medium px-2 py-0.5 bg-muted/50 text-muted-foreground border-0"
              >
                {tag}
              </Badge>
            ))}
            {project.tags.length > 3 && (
              <Badge variant="outline" className="text-[10px] border-border/50">
                +{project.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Date */}
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground pt-2 border-t border-border/50">
          <Calendar className="h-3 w-3" />
          <span>{new Date(project.updatedAt).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })}</span>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Link href={`/projects/${project.id}`} className="w-full">
          <Button
            variant="ghost"
            className="w-full justify-between hover:bg-marian-blue/10 hover:text-light-blue transition-all group/btn border border-transparent hover:border-light-blue/30"
          >
            <span className="text-sm font-light">Abrir Proyecto</span>
            <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
