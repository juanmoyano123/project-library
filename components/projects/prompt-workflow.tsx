'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Sparkles, Copy, CheckCircle2, RotateCcw, Info, Tag, Calendar, ArrowRight } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { STAGE_NAMES, ProjectStage, ProjectStatus } from '@/lib/types';

interface PromptWorkflowProps {
  onSave: (data: {
    originalPrompt: string;
    improvedPrompt: string | null;
    claudePlan: string;
  }) => void;
  onCancel?: () => void;
  projectStatus: ProjectStatus;
  currentStage: ProjectStage;
  tags: string[];
  createdAt: string;
  promptCount: number;
  onStageChange?: (stage: ProjectStage) => void;
}

type Step = 'original' | 'improved' | 'plan';

export function PromptWorkflow({
  onSave,
  onCancel,
  projectStatus,
  currentStage,
  tags,
  createdAt,
  promptCount,
  onStageChange
}: PromptWorkflowProps) {
  const [step, setStep] = useState<Step>('original');
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [improvedPrompt, setImprovedPrompt] = useState('');
  const [claudePlan, setClaudePlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [skipImprovement, setSkipImprovement] = useState(false);

  const improvePrompt = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/improve-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: originalPrompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to improve prompt');
      }

      const data = await response.json();
      setImprovedPrompt(data.improved);
      setStep('improved');
    } catch (err: any) {
      setError(err.message || 'Error al mejorar el prompt');
    } finally {
      setLoading(false);
    }
  };

  const skipToNextStep = () => {
    setSkipImprovement(true);
    setImprovedPrompt(originalPrompt); // Use original as "improved"
    setStep('improved');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(improvedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    onSave({
      originalPrompt,
      improvedPrompt: improvedPrompt || null,
      claudePlan,
    });
  };

  const resetWorkflow = () => {
    setStep('original');
    setOriginalPrompt('');
    setImprovedPrompt('');
    setClaudePlan('');
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Project Context Card */}
      <Card className="border border-border/50 shadow-subtle bg-muted/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-foreground/5 flex items-center justify-center border border-border/50">
              <Info className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <CardTitle className="text-sm font-light tracking-tight">Contexto del Proyecto</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground/70 mb-1">Estado</Label>
            <Badge variant="outline" className="font-medium text-xs bg-foreground/5 border-border/50">
              {projectStatus === 'active' ? 'Activo' : projectStatus === 'completed' ? 'Completado' : 'Archivado'}
            </Badge>
          </div>

          <div>
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground/70 mb-1">Etapa Actual</Label>
            <div className="mt-1">
              {onStageChange ? (
                <select
                  value={currentStage}
                  onChange={(e) => onStageChange(parseInt(e.target.value) as ProjectStage)}
                  className="w-full px-2 py-1 text-xs border rounded-md bg-background border-border focus:border-foreground/30 transition-colors"
                >
                  {Object.entries(STAGE_NAMES).map(([stage, name]) => (
                    <option key={stage} value={stage}>
                      {stage}. {name}
                    </option>
                  ))}
                </select>
              ) : (
                <Badge variant="secondary" className="font-medium text-xs bg-muted/50 border-0">
                  Etapa {currentStage}: {STAGE_NAMES[currentStage]}
                </Badge>
              )}
            </div>
          </div>

          {tags.length > 0 && (
            <div className="col-span-2">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground/70 mb-2 flex items-center gap-1">
                <Tag className="h-3 w-3" />
                Tags
              </Label>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-[10px] bg-muted/50 text-muted-foreground border-0">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div>
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground/70 mb-1 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Creado
            </Label>
            <p className="text-sm font-light">
              {new Date(createdAt).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>

          <div>
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground/70 mb-1">Total Prompts</Label>
            <p className="text-xl font-extralight tracking-tight">{promptCount}</p>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Workflow Steps */}
      <div className="space-y-4">
        {/* Step 1: Original Prompt */}
        <Card className={step === 'original' ? 'border-2 border-foreground/20 shadow-elegant' : 'border border-border'}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-foreground/10 text-foreground text-xs font-light">
                    1
                  </span>
                  <span className="text-base font-light">Tu Prompt Original</span>
                </CardTitle>
                <CardDescription className="font-light">Escribe la tarea que quieres realizar</CardDescription>
              </div>
              {step !== 'original' && (
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              placeholder="Ej: Quiero crear un sistema de autenticación con login y registro..."
              value={originalPrompt}
              onChange={(e) => setOriginalPrompt(e.target.value)}
              rows={4}
              disabled={step !== 'original'}
              className="border border-border focus:border-foreground/30 transition-colors"
            />
            {error && (
              <div className="text-xs text-destructive bg-destructive/5 p-3 rounded-md border border-destructive/20">
                {error}
              </div>
            )}
            {step === 'original' && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 p-3 rounded-md bg-muted/30 border border-border/50">
                  <Checkbox
                    id="skipImprovement"
                    checked={skipImprovement}
                    onCheckedChange={(checked) => setSkipImprovement(checked as boolean)}
                  />
                  <label
                    htmlFor="skipImprovement"
                    className="text-sm font-light text-muted-foreground cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Ya está escrito por Claude Code (no necesita mejora)
                  </label>
                </div>

                <div className="flex gap-2">
                  {skipImprovement ? (
                    <Button
                      onClick={skipToNextStep}
                      disabled={!originalPrompt.trim()}
                      className="flex-1 bg-foreground text-background hover:bg-foreground/90 shadow-subtle"
                    >
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Continuar al Plan
                    </Button>
                  ) : (
                    <Button
                      onClick={improvePrompt}
                      disabled={!originalPrompt.trim() || loading}
                      className="flex-1 bg-foreground text-background hover:bg-foreground/90 shadow-subtle"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Mejorando...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Mejorar con Claude
                        </>
                      )}
                    </Button>
                  )}
                  {onCancel && (
                    <Button variant="outline" onClick={onCancel} className="border-border hover:bg-muted">
                      Cancelar
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 2: Improved Prompt */}
        {(step === 'improved' || step === 'plan') && (
          <Card className={step === 'improved' ? 'border-2 border-foreground/20 shadow-elegant' : 'border border-border'}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-foreground/10 text-foreground text-xs font-light">
                      2
                    </span>
                    <span className="text-base font-light">
                      {skipImprovement ? 'Tu Prompt de Claude Code' : 'Prompt Mejorado por Claude'}
                    </span>
                  </CardTitle>
                  <CardDescription className="font-light">
                    {skipImprovement
                      ? 'Prompt listo para ejecutar en Claude Code.'
                      : 'Claude optimizó tu prompt. Cópialo y úsalo en Claude Code.'}
                  </CardDescription>
                </div>
                {step === 'plan' && (
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-muted/30 border border-border/50 p-4 rounded-lg">
                <Label className="text-xs font-medium uppercase tracking-widest text-muted-foreground/70 mb-2 block">
                  {skipImprovement ? 'Prompt Original' : 'Prompt Optimizado'}
                </Label>
                <p className="text-sm font-light whitespace-pre-wrap leading-relaxed">{improvedPrompt}</p>
              </div>
              {step === 'improved' && (
                <div className="flex gap-2">
                  {!skipImprovement && (
                    <Button onClick={copyToClipboard} variant="outline" className="flex-1 border-border hover:bg-muted">
                      {copied ? (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copiar
                        </>
                      )}
                    </Button>
                  )}
                  {!skipImprovement && (
                    <Button onClick={() => { setStep('original'); setImprovedPrompt(''); setSkipImprovement(false); }} variant="outline" className="border-border hover:bg-muted">
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Regenerar
                    </Button>
                  )}
                  <Button onClick={() => setStep('plan')} className="flex-1 bg-foreground text-background hover:bg-foreground/90 shadow-subtle">
                    Continuar →
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 3: Claude Plan */}
        {step === 'plan' && (
          <Card className="border-2 border-foreground/20 shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-foreground/10 text-foreground text-xs font-light">
                  3
                </span>
                <span className="text-base font-light">Plan de Claude Code</span>
              </CardTitle>
              <CardDescription className="font-light">
                Pega aquí el plan/respuesta que te dio Claude Code
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="Pega el plan propuesto por Claude Code aquí..."
                value={claudePlan}
                onChange={(e) => setClaudePlan(e.target.value)}
                rows={8}
                className="border border-border focus:border-foreground/30 transition-colors font-light"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  disabled={!claudePlan.trim()}
                  className="flex-1 bg-foreground text-background hover:bg-foreground/90 shadow-subtle"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Guardar Prompt Completo
                </Button>
                <Button variant="outline" onClick={resetWorkflow} className="border-border hover:bg-muted">
                  Empezar de Nuevo
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
