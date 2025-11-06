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
      className: 'bg-[hsl(60,100%,50%)] text-black neo-border-sm neo-shadow-sm',
    },
    completed: {
      label: 'Completado',
      className: 'bg-[hsl(215,100%,50%)] text-white neo-border-sm neo-shadow-sm',
    },
    archived: {
      label: 'Archivado',
      className: 'bg-gray-300 text-black neo-border-sm',
    },
  };

  const status = statusConfig[project.status];

  return (
    <Card className="group relative overflow-hidden hover-lift transition-all duration-150 neo-card bg-white">
      {/* Bold top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-black" />

      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-3 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-black" />
              <Badge
                variant="outline"
                className={cn('text-[10px] font-black uppercase tracking-wider shrink-0', status.className)}
              >
                {status.label}
              </Badge>
            </div>
            <CardTitle className="text-2xl font-black tracking-tight truncate text-black uppercase">
              {project.name}
            </CardTitle>
            <CardDescription className="line-clamp-2 text-sm font-bold leading-relaxed text-black">
              {project.description}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-200 neo-border-sm"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="neo-border neo-shadow bg-white">
              <DropdownMenuItem asChild className="font-bold cursor-pointer">
                <Link href={`/projects/${project.id}`}>Ver detalles</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onArchive(project.id)} className="font-bold cursor-pointer">
                {project.status === 'archived' ? 'Desarchivar' : 'Archivar'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(project.id)} className="text-[hsl(0,100%,60%)] font-bold cursor-pointer">
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stage badge - Neo style */}
        <div className="flex items-center gap-2">
          <div className={cn(
            'px-3 py-2 text-xs font-black tracking-wide uppercase',
            `stage-badge-${project.currentStage}`
          )}>
            Etapa {project.currentStage}: {STAGE_NAMES[project.currentStage]}
          </div>
        </div>

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="h-4 w-4 text-black shrink-0" />
            {project.tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-[10px] font-bold px-2 py-1 bg-white text-black neo-border-sm uppercase"
              >
                {tag}
              </Badge>
            ))}
            {project.tags.length > 3 && (
              <Badge variant="outline" className="text-[10px] neo-border-sm font-bold">
                +{project.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Date */}
        <div className="flex items-center gap-2 text-xs text-black font-bold pt-2 border-t-2 border-black uppercase">
          <Calendar className="h-4 w-4" />
          <span>{new Date(project.updatedAt).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })}</span>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Link href={`/projects/${project.id}`} className="w-full">
          <button className="w-full flex items-center justify-between bg-[hsl(0,100%,60%)] text-white neo-btn hover:bg-[hsl(0,100%,55%)] text-sm group/btn">
            <span>Abrir Proyecto</span>
            <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </Link>
      </CardFooter>
    </Card>
  );
}
