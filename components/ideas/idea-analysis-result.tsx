'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Target,
  Lightbulb,
  Wrench,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Check,
  Star,
  Clock,
  AlertTriangle,
  Package,
  Code,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { IdeaAnalysis } from './idea-analyzer-form';

interface IdeaAnalysisResultProps {
  analysis: IdeaAnalysis;
  rawIdea: string;
  onApprove: (analysis: IdeaAnalysis) => void | Promise<void>;
  onRegenerate: () => void;
}

const URGENCIA_CONFIG = {
  baja: { color: 'bg-gray-100 text-gray-700 border-gray-300', label: 'Baja' },
  media: { color: 'bg-blue-100 text-blue-700 border-blue-300', label: 'Media' },
  alta: { color: 'bg-orange-100 text-orange-700 border-orange-300', label: 'Alta' },
  crítica: { color: 'bg-red-100 text-red-700 border-red-300', label: 'Crítica' },
};

const COMPLEJIDAD_CONFIG = {
  1: { emoji: '😊', label: 'Muy Baja', color: 'bg-green-100 text-green-700' },
  2: { emoji: '🙂', label: 'Baja', color: 'bg-green-100 text-green-700' },
  3: { emoji: '😐', label: 'Media', color: 'bg-yellow-100 text-yellow-700' },
  4: { emoji: '😰', label: 'Alta', color: 'bg-orange-100 text-orange-700' },
  5: { emoji: '😱', label: 'Muy Alta', color: 'bg-red-100 text-red-700' },
};

export function IdeaAnalysisResult({
  analysis,
  rawIdea,
  onApprove,
  onRegenerate
}: IdeaAnalysisResultProps) {
  const [expandedSections, setExpandedSections] = useState({
    demanda: true,
    oferta: true,
    tecnico: true,
  });

  const [approving, setApproving] = useState(false);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleApprove = async () => {
    setApproving(true);
    try {
      await onApprove(analysis);
    } catch (error) {
      console.error('Error al aprobar idea:', error);
      alert('Error al aprobar la idea. Por favor intenta nuevamente.');
    } finally {
      setApproving(false);
    }
  };

  const urgenciaConfig = URGENCIA_CONFIG[analysis.urgencia];
  const complejidadConfig = COMPLEJIDAD_CONFIG[analysis.complejidadTecnica];

  const totalWeeks = analysis.tiempoEstimado
    ? analysis.tiempoEstimado.diseño + analysis.tiempoEstimado.desarrollo + analysis.tiempoEstimado.testing
    : 0;

  const Section = ({ title, expanded, onToggle, icon: Icon, children }: any) => (
    <Card className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          <h3 className="font-black text-lg">{title}</h3>
        </div>
        {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </button>
      {expanded && (
        <div className="p-6 pt-0 border-t-4 border-black mt-4">
          {children}
        </div>
      )}
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header Card with Summary */}
      <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-6 w-6" />
                <CardTitle className="text-2xl font-black">Análisis Completado</CardTitle>
              </div>
              <CardDescription className="text-base">
                Tu idea ha sido analizada en 3 dimensiones: DEMANDA, OFERTA y ANÁLISIS TÉCNICO
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className={`${urgenciaConfig.color} border-2 text-sm`}>
                Urgencia: {urgenciaConfig.label}
              </Badge>
              <Badge variant="outline" className={`${complejidadConfig.color} border-2 text-sm`}>
                {complejidadConfig.emoji} Complejidad: {complejidadConfig.label}
              </Badge>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-100 p-4 rounded-lg border-2 border-black">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Users className="h-4 w-4" />
                <span className="text-xs font-bold">MERCADO</span>
              </div>
              <p className="text-sm font-bold line-clamp-2">{analysis.mercadoObjetivo}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg border-2 border-black">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Clock className="h-4 w-4" />
                <span className="text-xs font-bold">TIEMPO ESTIMADO</span>
              </div>
              <p className="text-2xl font-black">{totalWeeks} <span className="text-sm font-normal">semanas</span></p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg border-2 border-black">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Package className="h-4 w-4" />
                <span className="text-xs font-bold">CATEGORÍA</span>
              </div>
              <p className="text-sm font-bold uppercase">{analysis.categoria || 'N/A'}</p>
            </div>
          </div>

          {/* Original Idea */}
          <Card className="mt-4 bg-blue-50 border-2 border-blue-500">
            <CardContent className="pt-4">
              <p className="text-xs font-bold text-blue-700 mb-2">IDEA ORIGINAL:</p>
              <p className="text-sm text-blue-900 italic">{rawIdea}</p>
            </CardContent>
          </Card>
        </CardHeader>
      </Card>

      {/* SECTION 1: DEMANDA */}
      <Section
        title="1. DEMANDA (Problema → Mercado)"
        expanded={expandedSections.demanda}
        onToggle={() => toggleSection('demanda')}
        icon={Target}
      >
        <div className="space-y-4">
          <div>
            <p className="text-xs font-bold text-gray-500 mb-2">PROBLEMA</p>
            <p className="text-base">{analysis.problema}</p>
          </div>

          <Separator className="bg-black h-[2px]" />

          <div>
            <p className="text-xs font-bold text-gray-500 mb-2">MERCADO OBJETIVO</p>
            <p className="text-base">{analysis.mercadoObjetivo}</p>
          </div>

          {analysis.tamañoMercado && (
            <>
              <Separator className="bg-black h-[2px]" />
              <div>
                <p className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  TAMAÑO DE MERCADO
                </p>
                <p className="text-base">{analysis.tamañoMercado}</p>
              </div>
            </>
          )}

          {analysis.evidenciaDemanda && (
            <>
              <Separator className="bg-black h-[2px]" />
              <div>
                <p className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  EVIDENCIA DE DEMANDA
                </p>
                <p className="text-base">{analysis.evidenciaDemanda}</p>
              </div>
            </>
          )}
        </div>
      </Section>

      {/* SECTION 2: OFERTA */}
      <Section
        title="2. OFERTA (Solución → Herramientas)"
        expanded={expandedSections.oferta}
        onToggle={() => toggleSection('oferta')}
        icon={Lightbulb}
      >
        <div className="space-y-4">
          <div>
            <p className="text-xs font-bold text-gray-500 mb-2">SOLUCIÓN PROPUESTA</p>
            <p className="text-base">{analysis.solucion}</p>
          </div>

          {analysis.herramientasDisponibles && analysis.herramientasDisponibles.length > 0 && (
            <>
              <Separator className="bg-black h-[2px]" />
              <div>
                <p className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  HERRAMIENTAS DISPONIBLES
                </p>
                <div className="flex flex-wrap gap-2">
                  {analysis.herramientasDisponibles.map((tool, idx) => (
                    <Badge key={idx} variant="outline" className="border-2 border-black">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {analysis.integracionesNecesarias && analysis.integracionesNecesarias.length > 0 && (
            <>
              <Separator className="bg-black h-[2px]" />
              <div>
                <p className="text-xs font-bold text-gray-500 mb-2">INTEGRACIONES NECESARIAS</p>
                <div className="space-y-3">
                  {analysis.integracionesNecesarias.map((int, idx) => (
                    <Card key={idx} className="border-2 border-black p-3">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-bold">{int.nombre}</p>
                        <Badge
                          variant="outline"
                          className={cn(
                            'border-2',
                            int.complejidad === 'baja' && 'bg-green-100 border-green-500',
                            int.complejidad === 'media' && 'bg-yellow-100 border-yellow-500',
                            int.complejidad === 'alta' && 'bg-red-100 border-red-500'
                          )}
                        >
                          {int.complejidad}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-xs text-gray-600">
                        <p>API: <a href={int.api} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{int.api}</a></p>
                        <p>Docs: <a href={int.documentacion} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{int.documentacion}</a></p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}

          {analysis.informacionRequerida && analysis.informacionRequerida.length > 0 && (
            <>
              <Separator className="bg-black h-[2px]" />
              <div>
                <p className="text-xs font-bold text-gray-500 mb-2">INFORMACIÓN REQUERIDA DEL USUARIO</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {analysis.informacionRequerida.map((info, idx) => (
                    <li key={idx}>{info}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </Section>

      {/* SECTION 3: TÉCNICO */}
      <Section
        title="3. ANÁLISIS TÉCNICO"
        expanded={expandedSections.tecnico}
        onToggle={() => toggleSection('tecnico')}
        icon={Wrench}
      >
        <div className="space-y-4">
          <div>
            <p className="text-xs font-bold text-gray-500 mb-2">COMPLEJIDAD TÉCNICA</p>
            <div className="flex items-center gap-3">
              <span className="text-4xl">{complejidadConfig.emoji}</span>
              <div>
                <p className="text-2xl font-black">{analysis.complejidadTecnica}/5</p>
                <p className="text-sm text-gray-600">{complejidadConfig.label}</p>
              </div>
            </div>
          </div>

          {analysis.skillsRequeridos && analysis.skillsRequeridos.length > 0 && (
            <>
              <Separator className="bg-black h-[2px]" />
              <div>
                <p className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  SKILLS REQUERIDOS
                </p>
                <div className="space-y-2">
                  {analysis.skillsRequeridos.map((skill, idx) => (
                    <Card key={idx} className="border-2 border-black p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold">{skill.skill}</p>
                          <p className="text-xs text-gray-600">Nivel: {skill.nivelNecesario}</p>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            'border-2',
                            skill.tenemos ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'
                          )}
                        >
                          {skill.tenemos ? '✓ Lo tenemos' : '✗ No lo tenemos'}
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}

          {analysis.tiempoEstimado && (
            <>
              <Separator className="bg-black h-[2px]" />
              <div>
                <p className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  TIEMPO ESTIMADO
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-100 p-3 rounded border-2 border-black">
                    <p className="text-xs text-gray-600">Diseño</p>
                    <p className="text-2xl font-black">{analysis.tiempoEstimado.diseño}<span className="text-sm font-normal">w</span></p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded border-2 border-black">
                    <p className="text-xs text-gray-600">Desarrollo</p>
                    <p className="text-2xl font-black">{analysis.tiempoEstimado.desarrollo}<span className="text-sm font-normal">w</span></p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded border-2 border-black">
                    <p className="text-xs text-gray-600">Testing</p>
                    <p className="text-2xl font-black">{analysis.tiempoEstimado.testing}<span className="text-sm font-normal">w</span></p>
                  </div>
                </div>
                <p className="text-center mt-2 text-sm text-gray-600">
                  Total: <span className="font-bold">{totalWeeks} semanas</span>
                </p>
              </div>
            </>
          )}

          {analysis.bloqueadores && analysis.bloqueadores.length > 0 && (
            <>
              <Separator className="bg-black h-[2px]" />
              <div>
                <p className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  BLOQUEADORES / RIESGOS
                </p>
                <ul className="space-y-2">
                  {analysis.bloqueadores.map((bloq, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{bloq}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </Section>

      {/* Tags */}
      {analysis.tags && analysis.tags.length > 0 && (
        <Card className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <CardContent className="pt-6">
            <p className="text-xs font-bold text-gray-500 mb-3">TAGS</p>
            <div className="flex flex-wrap gap-2">
              {analysis.tags.map((tag, idx) => (
                <Badge key={idx} variant="outline" className="border-2 border-black">
                  #{tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          onClick={onRegenerate}
          variant="outline"
          className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all font-bold"
        >
          <RefreshCw className="mr-2 h-5 w-5" />
          Regenerar Análisis
        </Button>
        <Button
          onClick={handleApprove}
          disabled={approving}
          className="flex-1 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all font-black text-lg bg-green-500 hover:bg-green-600"
        >
          {approving ? (
            <>
              <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Check className="mr-2 h-5 w-5" />
              Aprobar y Guardar Idea
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
