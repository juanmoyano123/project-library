'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Idea } from '@/lib/types';
import {
  Star,
  Clock,
  Zap,
  Package,
  TrendingUp,
  Code,
  Users,
  AlertTriangle,
  ExternalLink,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface IdeaDetailDialogProps {
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

export function IdeaDetailDialog({ idea, open, onOpenChange }: IdeaDetailDialogProps) {
  if (!idea) return null;

  const urgenciaConfig = URGENCIA_CONFIG[idea.urgencia];
  const complejidadConfig = COMPLEJIDAD_CONFIG[idea.complejidadTecnica];

  const totalWeeks = idea.tiempoEstimado
    ? idea.tiempoEstimado.diseño + idea.tiempoEstimado.desarrollo + idea.tiempoEstimado.testing
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <DialogHeader>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <DialogTitle className="text-3xl font-black mb-3">
                {idea.nombre || 'Idea Sin Nombre'}
              </DialogTitle>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="border-2 border-black font-mono font-bold">
                  {idea.id}
                </Badge>
                {idea.categoria && (
                  <Badge variant="outline" className="border-2 border-black uppercase">
                    {idea.categoria}
                  </Badge>
                )}
                {idea.favorita && (
                  <Badge variant="outline" className="border-2 border-yellow-500 bg-yellow-50">
                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500 mr-1" />
                    Favorita
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Badge variant="outline" className={`${urgenciaConfig.color} border-2`}>
                {urgenciaConfig.label}
              </Badge>
              <Badge variant="outline" className="border-2 border-black">
                {complejidadConfig.emoji} {idea.complejidadTecnica}/5
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-200px)] pr-4">
          <div className="space-y-6">
            {/* DEMANDA SECTION */}
            <section className="neo-card p-6 space-y-4 bg-[hsl(0,100%,60%)] text-white">
              <h3 className="text-xl font-black uppercase flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Demanda (Problema → Mercado)
              </h3>

              <div>
                <p className="text-xs font-bold opacity-80 mb-1">PROBLEMA</p>
                <p className="text-sm leading-relaxed">{idea.problema}</p>
              </div>

              <div>
                <p className="text-xs font-bold opacity-80 mb-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  MERCADO OBJETIVO
                </p>
                <p className="text-sm leading-relaxed">{idea.mercadoObjetivo}</p>
              </div>

              {idea.tamañoMercado && (
                <div>
                  <p className="text-xs font-bold opacity-80 mb-1">TAMAÑO DE MERCADO</p>
                  <p className="text-sm">{idea.tamañoMercado}</p>
                </div>
              )}

              {idea.evidenciaDemanda && (
                <div>
                  <p className="text-xs font-bold opacity-80 mb-1">EVIDENCIA DE DEMANDA</p>
                  <p className="text-sm">{idea.evidenciaDemanda}</p>
                </div>
              )}
            </section>

            {/* OFERTA SECTION */}
            <section className="neo-card p-6 space-y-4 bg-[hsl(60,100%,50%)] text-black">
              <h3 className="text-xl font-black uppercase flex items-center gap-2">
                <Package className="h-5 w-5" />
                Oferta (Solución → Herramientas)
              </h3>

              <div>
                <p className="text-xs font-bold opacity-80 mb-1">SOLUCIÓN</p>
                <p className="text-sm leading-relaxed">{idea.solucion}</p>
              </div>

              {idea.herramientasDisponibles && idea.herramientasDisponibles.length > 0 && (
                <div>
                  <p className="text-xs font-bold opacity-80 mb-2">HERRAMIENTAS DISPONIBLES</p>
                  <div className="flex flex-wrap gap-2">
                    {idea.herramientasDisponibles.map((tool, idx) => (
                      <Badge key={idx} variant="outline" className="border-2 border-black">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {idea.integracionesNecesarias && idea.integracionesNecesarias.length > 0 && (
                <div>
                  <p className="text-xs font-bold opacity-80 mb-2">INTEGRACIONES NECESARIAS</p>
                  <div className="space-y-2">
                    {idea.integracionesNecesarias.map((integracion, idx) => (
                      <div key={idx} className="bg-white neo-border-sm p-3 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-sm">{integracion.nombre}</p>
                          <Badge
                            variant="outline"
                            className="border border-black text-xs"
                          >
                            {integracion.complejidad}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <a
                            href={integracion.api}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-1"
                          >
                            API <ExternalLink className="h-3 w-3" />
                          </a>
                          <span>•</span>
                          <a
                            href={integracion.documentacion}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-1"
                          >
                            Docs <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {idea.informacionRequerida && idea.informacionRequerida.length > 0 && (
                <div>
                  <p className="text-xs font-bold opacity-80 mb-2">INFORMACIÓN REQUERIDA</p>
                  <ul className="space-y-1 text-sm">
                    {idea.informacionRequerida.map((info, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="font-bold">•</span>
                        <span>{info}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            {/* ANÁLISIS TÉCNICO SECTION */}
            <section className="neo-card p-6 space-y-4 bg-[hsl(215,100%,50%)] text-white">
              <h3 className="text-xl font-black uppercase flex items-center gap-2">
                <Code className="h-5 w-5" />
                Análisis Técnico
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold opacity-80 mb-1">COMPLEJIDAD TÉCNICA</p>
                  <p className="text-2xl font-black">
                    {complejidadConfig.emoji} {idea.complejidadTecnica}/5
                  </p>
                  <p className="text-xs opacity-80">{complejidadConfig.label}</p>
                </div>

                {totalWeeks > 0 && (
                  <div>
                    <p className="text-xs font-bold opacity-80 mb-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      TIEMPO ESTIMADO
                    </p>
                    <p className="text-2xl font-black">{totalWeeks} semanas</p>
                    {idea.tiempoEstimado && (
                      <p className="text-xs opacity-80">
                        Diseño: {idea.tiempoEstimado.diseño}s • Desarrollo: {idea.tiempoEstimado.desarrollo}s • Testing: {idea.tiempoEstimado.testing}s
                      </p>
                    )}
                  </div>
                )}
              </div>

              {idea.skillsRequeridos && idea.skillsRequeridos.length > 0 && (
                <div>
                  <p className="text-xs font-bold opacity-80 mb-2 flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    SKILLS REQUERIDOS
                  </p>
                  <div className="space-y-2">
                    {idea.skillsRequeridos.map((skill, idx) => (
                      <div key={idx} className="bg-white/10 neo-border-sm border-white/20 p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {skill.tenemos ? (
                            <CheckCircle className="h-4 w-4 text-green-300" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-300" />
                          )}
                          <div>
                            <p className="font-bold text-sm">{skill.skill}</p>
                            <p className="text-xs opacity-80">Nivel: {skill.nivelNecesario}</p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={`border-2 ${
                            skill.tenemos
                              ? 'border-green-300 bg-green-300/20'
                              : 'border-red-300 bg-red-300/20'
                          }`}
                        >
                          {skill.tenemos ? 'Tenemos' : 'Falta'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {idea.bloqueadores && idea.bloqueadores.length > 0 && (
                <div>
                  <p className="text-xs font-bold opacity-80 mb-2 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    BLOQUEADORES POTENCIALES
                  </p>
                  <ul className="space-y-2">
                    {idea.bloqueadores.map((bloq, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-white/10 neo-border-sm border-white/20 p-2 text-sm">
                        <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        <span>{bloq}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            {/* METADATA */}
            {((idea.tags && idea.tags.length > 0) || idea.notas) && (
              <section className="neo-card p-6 space-y-4">
                {idea.tags && idea.tags.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-gray-500 mb-2">TAGS</p>
                    <div className="flex flex-wrap gap-2">
                      {idea.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="border-2 border-black">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {idea.notas && (
                  <div>
                    <p className="text-xs font-bold text-gray-500 mb-2">NOTAS</p>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{idea.notas}</p>
                  </div>
                )}
              </section>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
