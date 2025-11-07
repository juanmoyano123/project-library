'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Idea } from '@/lib/types';
import {
  Star,
  Clock,
  Zap,
  Package,
  Plug,
  Eye,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface IdeaCardProps {
  idea: Idea;
  onView?: (idea: Idea) => void;
  onDelete?: (ideaId: string) => void;
}

const URGENCIA_CONFIG = {
  baja: { color: 'bg-gray-100 text-gray-700 border-gray-300', label: 'Baja' },
  media: { color: 'bg-blue-100 text-blue-700 border-blue-300', label: 'Media' },
  alta: { color: 'bg-orange-100 text-orange-700 border-orange-300', label: 'Alta' },
  crítica: { color: 'bg-red-100 text-red-700 border-red-300', label: 'Crítica' },
};

const COMPLEJIDAD_CONFIG = {
  1: { emoji: '😊', label: 'Muy Baja' },
  2: { emoji: '🙂', label: 'Baja' },
  3: { emoji: '😐', label: 'Media' },
  4: { emoji: '😰', label: 'Alta' },
  5: { emoji: '😱', label: 'Muy Alta' },
};

export function IdeaCard({ idea, onView, onDelete }: IdeaCardProps) {
  const urgenciaConfig = URGENCIA_CONFIG[idea.urgencia];
  const complejidadConfig = COMPLEJIDAD_CONFIG[idea.complejidadTecnica];

  const totalWeeks = idea.tiempoEstimado
    ? idea.tiempoEstimado.diseño + idea.tiempoEstimado.desarrollo + idea.tiempoEstimado.testing
    : 0;

  return (
    <Card
      className={cn(
        'border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all cursor-pointer',
        idea.favorita && 'bg-yellow-50'
      )}
      onClick={() => onView?.(idea)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="border-2 border-black font-mono font-bold">
                {idea.id}
              </Badge>
              {idea.favorita && (
                <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
              )}
            </div>
            {idea.categoria && (
              <Badge
                variant="outline"
                className="mb-2 border-2 border-black uppercase text-xs"
              >
                {idea.categoria}
              </Badge>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Badge variant="outline" className={`${urgenciaConfig.color} border-2 text-xs justify-center`}>
              {urgenciaConfig.label}
            </Badge>
            <Badge variant="outline" className="border-2 border-black text-xs justify-center">
              {complejidadConfig.emoji} {idea.complejidadTecnica}/5
            </Badge>
          </div>
        </div>

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
          <p className="text-xs font-bold text-gray-500 mb-1 flex items-center gap-1">
            <Zap className="h-3 w-3" />
            PROBLEMA
          </p>
          <p className="text-sm line-clamp-2">{idea.problema}</p>
        </div>

        {/* Solución */}
        <div>
          <p className="text-xs font-bold text-gray-500 mb-1 flex items-center gap-1">
            <Package className="h-3 w-3" />
            SOLUCIÓN
          </p>
          <p className="text-sm line-clamp-2">{idea.solucion}</p>
        </div>

        {/* Integraciones */}
        <div>
          <p className="text-xs font-bold text-gray-500 mb-1 flex items-center gap-1">
            <Plug className="h-3 w-3" />
            INTEGRACIONES
          </p>
          <p className="text-sm line-clamp-2">
            {idea.integracionesNecesarias && idea.integracionesNecesarias.length > 0
              ? idea.integracionesNecesarias.map(i => i.nombre).join(', ')
              : 'Sin integraciones definidas'}
          </p>
        </div>

        {/* Tiempo Estimado */}
        {totalWeeks > 0 && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Clock className="h-3 w-3" />
            <span><strong>{totalWeeks}</strong> semanas estimadas</span>
          </div>
        )}

        {/* Tags */}
        {idea.tags && idea.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {idea.tags.slice(0, 3).map((tag, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="border border-black text-xs"
              >
                #{tag}
              </Badge>
            ))}
            {idea.tags.length > 3 && (
              <Badge variant="outline" className="border border-black text-xs">
                +{idea.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onView?.(idea);
            }}
            size="sm"
            variant="outline"
            className="flex-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
          >
            <Eye className="h-4 w-4 mr-1" />
            Ver
          </Button>
          {onDelete && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('¿Estás seguro de eliminar esta idea?')) {
                  onDelete(idea.id);
                }
              }}
              size="sm"
              variant="outline"
              className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
