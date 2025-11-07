'use client';

import { Idea } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Star,
  Zap,
  Target,
  Package,
  Plug,
  Wrench,
  Clock,
  AlertTriangle,
  TrendingUp,
  Calendar,
} from 'lucide-react';

interface IdeaDetailModalProps {
  idea: Idea | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function IdeaDetailModal({ idea, open, onOpenChange }: IdeaDetailModalProps) {
  if (!idea) return null;

  const urgenciaConfig = URGENCIA_CONFIG[idea.urgencia];
  const complejidadConfig = COMPLEJIDAD_CONFIG[idea.complejidadTecnica];

  const totalWeeks = idea.tiempoEstimado
    ? idea.tiempoEstimado.diseño + idea.tiempoEstimado.desarrollo + idea.tiempoEstimado.testing
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6">
            {/* Header */}
            <DialogHeader className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="border-2 border-black font-mono font-bold">
                    {idea.id}
                  </Badge>
                  {idea.favorita && (
                    <Star className="h-6 w-6 fill-yellow-500 text-yellow-500" />
                  )}
                  {idea.categoria && (
                    <Badge variant="outline" className="border-2 border-black uppercase">
                      {idea.categoria}
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className={`${urgenciaConfig.color} border-2`}>
                    {urgenciaConfig.label}
                  </Badge>
                  <Badge variant="outline" className="border-2 border-black">
                    {complejidadConfig.emoji} {idea.complejidadTecnica}/5
                  </Badge>
                </div>
              </div>

              {idea.nombre && (
                <DialogTitle className="text-3xl font-black uppercase tracking-tight">
                  {idea.nombre}
                </DialogTitle>
              )}

              <DialogDescription className="text-sm text-gray-500 flex items-center gap-2 mt-2">
                <Calendar className="h-4 w-4" />
                Creada el {new Date(idea.createdAt).toLocaleDateString('es-ES')}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Problema */}
              <div className="border-4 border-black p-4 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-sm font-black uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Problema
                </h3>
                <p className="text-base leading-relaxed">{idea.problema}</p>
              </div>

              {/* Solución */}
              <div className="border-4 border-black p-4 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-sm font-black uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Solución
                </h3>
                <p className="text-base leading-relaxed">{idea.solucion}</p>
              </div>

              {/* Mercado Objetivo */}
              <div className="border-4 border-black p-4 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-sm font-black uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Mercado Objetivo
                </h3>
                <p className="text-base leading-relaxed mb-3">{idea.mercadoObjetivo}</p>
                {idea.tamañoMercado && (
                  <div className="mb-2">
                    <p className="text-xs font-bold text-gray-500 mb-1">Tamaño del Mercado:</p>
                    <p className="text-sm">{idea.tamañoMercado}</p>
                  </div>
                )}
                {idea.evidenciaDemanda && (
                  <div>
                    <p className="text-xs font-bold text-gray-500 mb-1">Evidencia de Demanda:</p>
                    <p className="text-sm">{idea.evidenciaDemanda}</p>
                  </div>
                )}
              </div>

              {/* Integraciones */}
              {idea.integracionesNecesarias && idea.integracionesNecesarias.length > 0 && (
                <div className="border-4 border-black p-4 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <h3 className="text-sm font-black uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Plug className="h-4 w-4" />
                    Integraciones Necesarias
                  </h3>
                  <div className="space-y-3">
                    {idea.integracionesNecesarias.map((integracion, idx) => (
                      <div key={idx} className="border-2 border-black p-3 bg-gray-50">
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-bold text-sm">{integracion.nombre}</p>
                          <Badge
                            variant="outline"
                            className={`border text-xs ${
                              integracion.complejidad === 'alta'
                                ? 'border-red-500 text-red-700'
                                : integracion.complejidad === 'media'
                                ? 'border-orange-500 text-orange-700'
                                : 'border-green-500 text-green-700'
                            }`}
                          >
                            {integracion.complejidad}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">API: {integracion.api}</p>
                        <a
                          href={integracion.documentacion}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          📚 Documentación →
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Herramientas Disponibles */}
              {idea.herramientasDisponibles && idea.herramientasDisponibles.length > 0 && (
                <div className="border-4 border-black p-4 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <h3 className="text-sm font-black uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    Herramientas Disponibles
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {idea.herramientasDisponibles.map((tool, idx) => (
                      <Badge key={idx} variant="outline" className="border-2 border-black">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Tiempo Estimado */}
              {idea.tiempoEstimado && (
                <div className="border-4 border-black p-4 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <h3 className="text-sm font-black uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Tiempo Estimado: {totalWeeks} semanas
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="border-2 border-black p-2 text-center">
                      <p className="text-xs font-bold text-gray-500 mb-1">Diseño</p>
                      <p className="text-lg font-black">{idea.tiempoEstimado.diseño}w</p>
                    </div>
                    <div className="border-2 border-black p-2 text-center">
                      <p className="text-xs font-bold text-gray-500 mb-1">Desarrollo</p>
                      <p className="text-lg font-black">{idea.tiempoEstimado.desarrollo}w</p>
                    </div>
                    <div className="border-2 border-black p-2 text-center">
                      <p className="text-xs font-bold text-gray-500 mb-1">Testing</p>
                      <p className="text-lg font-black">{idea.tiempoEstimado.testing}w</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Bloqueadores */}
              {idea.bloqueadores && idea.bloqueadores.length > 0 && (
                <div className="border-4 border-black p-4 bg-red-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <h3 className="text-sm font-black uppercase tracking-wider mb-2 flex items-center gap-2 text-red-700">
                    <AlertTriangle className="h-4 w-4" />
                    Bloqueadores
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    {idea.bloqueadores.map((blocker, idx) => (
                      <li key={idx} className="text-sm text-red-900">{blocker}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Información Requerida */}
              {idea.informacionRequerida && idea.informacionRequerida.length > 0 && (
                <div className="border-4 border-black p-4 bg-blue-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <h3 className="text-sm font-black uppercase tracking-wider mb-2 flex items-center gap-2 text-blue-700">
                    <TrendingUp className="h-4 w-4" />
                    Información Requerida
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    {idea.informacionRequerida.map((info, idx) => (
                      <li key={idx} className="text-sm text-blue-900">{info}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tags */}
              {idea.tags && idea.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {idea.tags.map((tag, idx) => (
                    <Badge key={idx} variant="outline" className="border-2 border-black">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Notas */}
              {idea.notas && (
                <div className="border-4 border-black p-4 bg-yellow-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <h3 className="text-sm font-black uppercase tracking-wider mb-2">Notas</h3>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{idea.notas}</p>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
