'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, Lightbulb } from 'lucide-react';

export interface IdeaAnalysis {
  problema: string;
  mercadoObjetivo: string;
  urgencia: 'baja' | 'media' | 'alta' | 'crítica';
  tamañoMercado?: string;
  evidenciaDemanda?: string;
  solucion: string;
  herramientasDisponibles?: string[];
  integracionesNecesarias?: Array<{
    nombre: string;
    api: string;
    documentacion: string;
    complejidad: 'baja' | 'media' | 'alta';
  }>;
  informacionRequerida?: string[];
  complejidadTecnica: 1 | 2 | 3 | 4 | 5;
  skillsRequeridos?: Array<{
    skill: string;
    nivelNecesario: 'junior' | 'mid' | 'senior';
    tenemos: boolean;
  }>;
  tiempoEstimado?: {
    diseño: number;
    desarrollo: number;
    testing: number;
  };
  bloqueadores?: string[];
  categoria?: string;
  tags?: string[];
}

interface IdeaAnalyzerFormProps {
  onAnalysisComplete: (analysis: IdeaAnalysis, rawIdea: string) => void;
  onCancel?: () => void;
}

export function IdeaAnalyzerForm({ onAnalysisComplete, onCancel }: IdeaAnalyzerFormProps) {
  const [rawIdea, setRawIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rawIdea.trim() || rawIdea.trim().length < 10) {
      setError('Por favor describe tu idea (mínimo 10 caracteres)');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🚀 Enviando idea para análisis...');

      const response = await fetch('/api/analyze-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawIdea: rawIdea.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al analizar la idea');
      }

      const { analysis } = await response.json();
      console.log('✅ Análisis completado:', analysis);

      onAnalysisComplete(analysis, rawIdea.trim());
    } catch (err) {
      console.error('❌ Error en análisis:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <CardHeader>
        <CardTitle className="text-2xl font-black flex items-center gap-2">
          <Lightbulb className="h-6 w-6" />
          Nueva Idea
        </CardTitle>
        <CardDescription className="text-base">
          Describe tu idea en bruto y la IA la analizará completamente en 3 dimensiones:
          <strong> DEMANDA, OFERTA y ANÁLISIS TÉCNICO</strong>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Idea Input */}
          <div className="space-y-2">
            <Label htmlFor="idea" className="text-base font-bold">
              ¿Cuál es tu idea? *
            </Label>
            <Textarea
              id="idea"
              placeholder="Ej: Una app para que restaurantes pequeños gestionen su propio delivery sin depender de Rappi/Uber que cobran 30% de comisión. Integrar con WhatsApp para pedidos y Google Maps para tracking..."
              value={rawIdea}
              onChange={(e) => setRawIdea(e.target.value)}
              className="min-h-[150px] border-2 border-black text-base"
              disabled={loading}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>
                Sé específico: ¿Qué problema resuelve? ¿Para quién? ¿Cómo?
              </span>
              <span>{rawIdea.length} caracteres</span>
            </div>
          </div>

          {/* Info Box */}
          <Card className="border-2 border-blue-500 bg-blue-50">
            <CardContent className="pt-4">
              <div className="flex gap-3">
                <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-2 text-sm text-blue-900">
                  <p className="font-bold">La IA analizará automáticamente:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Problema específico y mercado objetivo</li>
                    <li>Urgencia y tamaño de mercado estimado</li>
                    <li>Solución propuesta y stack técnico</li>
                    <li>Integraciones necesarias (APIs, servicios)</li>
                    <li>Complejidad técnica (1-5) y skills requeridos</li>
                    <li>Tiempo estimado y posibles bloqueadores</li>
                  </ul>
                  <p className="text-xs italic mt-3">
                    Luego podrás iterar el resultado hasta que estés conforme
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <Card className="border-4 border-red-500 bg-red-50">
              <CardContent className="pt-6">
                <p className="text-red-700 font-bold">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
                className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
              >
                Cancelar
              </Button>
            )}
            <Button
              type="submit"
              disabled={loading || rawIdea.trim().length < 10}
              className="flex-1 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all font-black text-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analizando con IA...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Analizar con IA
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
