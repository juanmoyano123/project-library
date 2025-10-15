'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { ProjectPlan, PlanStage } from '@/lib/types';
import { nanoid } from 'nanoid';

interface OverviewAnalyzerProps {
  projectId: string;
  projectName: string;
  tags: string[];
  initialOverview?: string;
  onPlanGenerated: (plan: ProjectPlan) => void;
}

export function OverviewAnalyzer({
  projectId,
  projectName,
  tags,
  initialOverview = '',
  onPlanGenerated,
}: OverviewAnalyzerProps) {
  const [overview, setOverview] = useState(initialOverview);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<ProjectPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!overview.trim()) {
      setError('Por favor, escribe un overview del proyecto');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-overview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          overview,
          projectName,
          tags,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al analizar el overview');
      }

      const data = await response.json();

      // Transform API response to ProjectPlan structure
      const plan: ProjectPlan = {
        id: nanoid(),
        projectId,
        overview,
        generatedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        stages: data.plan.stages.map((stageData: any) => {
          const stageId = nanoid();
          return {
            id: stageId,
            stage: stageData.stage,
            estimatedDuration: stageData.estimatedDuration || 0,
            tasks: stageData.tasks.map((task: any) => ({
              id: nanoid(),
              stageId,
              title: task.title,
              description: task.description,
              status: 'pending' as const,
              priority: task.priority || 'medium',
              estimatedDays: task.estimatedDays,
              notes: '',
              dependencies: [],
            })),
          };
        }),
      };

      setGeneratedPlan(plan);
    } catch (err: any) {
      setError(err.message || 'Error al generar el plan');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAcceptPlan = () => {
    if (generatedPlan) {
      onPlanGenerated(generatedPlan);
    }
  };

  const handleRegenerate = () => {
    setGeneratedPlan(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 shadow-xl bg-gradient-to-br from-card via-card to-accent/5">
        <CardHeader className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-accent/20 to-primary/20 blur-3xl rounded-full" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl font-bold">Overview del Proyecto</CardTitle>
            </div>
            <CardDescription className="text-base">
              Describe tu proyecto en detalle. La IA analizará esta información para generar un plan de acción completo.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
            placeholder="Describe tu proyecto: objetivos, funcionalidades principales, tecnologías que planeas usar, público objetivo, etc."
            className="min-h-[200px] resize-none border-2 focus:border-primary shadow-inner"
            disabled={isAnalyzing || !!generatedPlan}
          />

          {error && (
            <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 p-3 rounded-md">
              {error}
            </div>
          )}

          {!generatedPlan && (
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !overview.trim()}
              className="w-full bg-gradient-to-r from-accent via-primary to-secondary hover:shadow-2xl transition-all text-lg py-6 font-semibold"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analizando con IA...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generar Plan con IA
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {generatedPlan && (
        <Card className="border-2 border-green-500/50 shadow-2xl bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-green-900/30">
          <CardHeader className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-green-400/30 to-emerald-400/30 blur-3xl rounded-full" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-green-900 dark:text-green-100">Plan Generado Exitosamente</CardTitle>
              </div>
              <CardDescription className="text-base text-green-700 dark:text-green-300 font-medium">
                La IA ha generado {generatedPlan.stages.length} etapas con{' '}
                {generatedPlan.stages.reduce((acc, s) => acc + s.tasks.length, 0)} tareas totales
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-h-[400px] overflow-y-auto space-y-4 pr-2">
              {generatedPlan.stages.map((stage) => (
                <div key={stage.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">
                      Etapa {stage.stage}: {getStageNameByNumber(stage.stage)}
                    </h3>
                    <span className="text-sm text-muted-foreground">
                      ~{stage.estimatedDuration} días
                    </span>
                  </div>
                  <div className="space-y-2">
                    {stage.tasks.map((task) => (
                      <div key={task.id} className="text-sm pl-4 border-l-2 border-muted">
                        <div className="font-medium">{task.title}</div>
                        <div className="text-muted-foreground text-xs">
                          {task.description}
                        </div>
                        <div className="flex gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            task.priority === 'high'
                              ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                              : task.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          }`}>
                            {task.priority}
                          </span>
                          {task.estimatedDays && (
                            <span className="text-xs text-muted-foreground">
                              {task.estimatedDays}d
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleAcceptPlan}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all text-base py-5 font-semibold"
              >
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Aceptar y Guardar Plan
              </Button>
              <Button
                onClick={handleRegenerate}
                variant="outline"
                className="border-2 hover:bg-accent/10 hover:border-accent hover:shadow-lg transition-all"
              >
                Regenerar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function getStageNameByNumber(stage: number): string {
  const names: Record<number, string> = {
    0: 'Inicialización',
    1: 'Discovery',
    2: 'Diseño',
    3: 'Setup',
    4: 'Backend',
    5: 'Frontend',
    6: 'Testing',
    7: 'Deploy',
    8: 'Docs',
  };
  return names[stage] || 'Unknown';
}
