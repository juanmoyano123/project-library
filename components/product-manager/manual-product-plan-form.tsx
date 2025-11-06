'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, FileEdit, Plus, X } from 'lucide-react';
import { ProductPlan } from '@/lib/types';
import { nanoid } from 'nanoid';

interface ManualProductPlanFormProps {
  projectId: string;
  validationId?: string;
  onPlanComplete: (plan: ProductPlan) => void;
  onCancel?: () => void;
}

export function ManualProductPlanForm({ projectId, validationId, onPlanComplete, onCancel }: ManualProductPlanFormProps) {
  // Executive Summary
  const [problemStatement, setProblemStatement] = useState('');
  const [solutionStatement, setSolutionStatement] = useState('');
  const [valueProposition, setValueProposition] = useState('');

  // User Personas
  const [personaName, setPersonaName] = useState('');
  const [personaAge, setPersonaAge] = useState('');
  const [personaOccupation, setPersonaOccupation] = useState('');
  const [personaPainPoints, setPersonaPainPoints] = useState<string[]>(['']);
  const [personaGoals, setPersonaGoals] = useState<string[]>(['']);

  // Tech Stack
  const [stackFrontend, setStackFrontend] = useState('Next.js + React');
  const [stackFrontendJustification, setStackFrontendJustification] = useState('');
  const [stackBackend, setStackBackend] = useState('Next.js API Routes');
  const [stackBackendJustification, setStackBackendJustification] = useState('');
  const [stackDatabase, setStackDatabase] = useState('PostgreSQL');
  const [stackDatabaseJustification, setStackDatabaseJustification] = useState('');
  const [stackHosting, setStackHosting] = useState('Vercel');
  const [stackHostingJustification, setStackHostingJustification] = useState('');
  const [stackPayment, setStackPayment] = useState('Stripe');
  const [stackPaymentJustification, setStackPaymentJustification] = useState('');
  const [stackAuth, setStackAuth] = useState('NextAuth.js');
  const [stackAuthJustification, setStackAuthJustification] = useState('');

  // Success Metrics
  const [metrics, setMetrics] = useState<Array<{category: string; metric: string; target: string;}>>([
    { category: 'Acquisition', metric: '', target: '' }
  ]);

  // Timeline
  const [estimatedWeeks, setEstimatedWeeks] = useState(12);

  // Features (simplified - just names for manual entry)
  const [features, setFeatures] = useState<string[]>(['']);

  // Out of Scope
  const [outOfScope, setOutOfScope] = useState<string[]>(['']);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addToArray = (arr: string[], setArr: (val: string[]) => void) => {
    setArr([...arr, '']);
  };

  const removeFromArray = (arr: string[], setArr: (val: string[]) => void, index: number) => {
    setArr(arr.filter((_, i) => i !== index));
  };

  const updateArrayItem = (arr: string[], setArr: (val: string[]) => void, index: number, value: string) => {
    const newArr = [...arr];
    newArr[index] = value;
    setArr(newArr);
  };

  const addMetric = () => {
    setMetrics([...metrics, { category: 'Activation', metric: '', target: '' }]);
  };

  const removeMetric = (index: number) => {
    setMetrics(metrics.filter((_, i) => i !== index));
  };

  const updateMetric = (index: number, field: keyof typeof metrics[0], value: string) => {
    const newMetrics = [...metrics];
    newMetrics[index][field] = value;
    setMetrics(newMetrics);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!problemStatement.trim() || !solutionStatement.trim() || !valueProposition.trim()) {
      setError('Los campos de Executive Summary son obligatorios');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const productPlan: ProductPlan = {
        id: nanoid(),
        projectId,
        validationId,
        problemStatement: problemStatement.trim(),
        solutionStatement: solutionStatement.trim(),
        valueProposition: valueProposition.trim(),
        persona: personaName.trim() ? {
          name: personaName,
          age: personaAge,
          occupation: personaOccupation,
          painPoints: personaPainPoints.filter(p => p.trim()),
          goals: personaGoals.filter(g => g.trim()),
        } : {},
        successMetrics: metrics.filter(m => m.metric.trim() && m.target.trim()).map(m => ({
          category: m.category,
          metric: m.metric,
          target: m.target,
          industryBenchmark: 'N/A',
          measuredBy: 'Manual tracking',
        })),
        techStack: {
          frontend: {
            framework: stackFrontend,
            justification: stackFrontendJustification || 'Manual selection',
          },
          backend: {
            framework: stackBackend,
            justification: stackBackendJustification || 'Manual selection',
          },
          database: {
            type: stackDatabase,
            justification: stackDatabaseJustification || 'Manual selection',
          },
          hosting: {
            platform: stackHosting,
            justification: stackHostingJustification || 'Manual selection',
          },
          payments: {
            provider: stackPayment,
            justification: stackPaymentJustification || 'Manual selection',
          },
          auth: {
            provider: stackAuth,
            justification: stackAuthJustification || 'Manual selection',
          },
        },
        dependencies: {
          features: features.filter(f => f.trim()).map((f, i) => ({
            id: `F-${String(i + 1).padStart(3, '0')}`,
            name: f,
            description: 'Manual feature entry',
            reach: 0,
            impact: 3,
            confidence: 50,
            effort: 1,
            riceScore: 0,
            priority: 'should-have' as const,
            acceptanceCriteria: [],
          })),
          timeline: {
            totalWeeks: estimatedWeeks,
            phases: [],
          },
          risks: [],
          outOfScope: outOfScope.filter(f => f.trim()).map(f => ({
            feature: f,
            reason: 'Out of scope for v1',
          })),
        },
        estimatedTimelineDays: estimatedWeeks * 7,
        createdBy: 'Manual',
        createdAt: new Date().toISOString(),
        status: 'approved', // Manual plans are pre-approved
        source: 'manual',
      };

      // Save to database
      const response = await fetch('/api/product-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productPlan),
      });

      if (!response.ok) {
        throw new Error('Error al guardar plan de producto');
      }

      onPlanComplete(productPlan);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileEdit className="h-5 w-5 text-primary" />
          Crear PRD Manual
        </CardTitle>
        <CardDescription>
          Ingresa un PRD ya creado sin necesidad de usar IA. Los campos de Executive Summary son obligatorios.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Executive Summary */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-semibold text-sm">Executive Summary *</h3>

            <div className="space-y-2">
              <Label htmlFor="problemStatement">Problem Statement *</Label>
              <Textarea
                id="problemStatement"
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                placeholder="¿Qué problema core resuelve este producto?"
                rows={3}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="solutionStatement">Solution Statement *</Label>
              <Textarea
                id="solutionStatement"
                value={solutionStatement}
                onChange={(e) => setSolutionStatement(e.target.value)}
                placeholder="¿Cómo lo resolvemos?"
                rows={3}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valueProposition">Value Proposition *</Label>
              <Textarea
                id="valueProposition"
                value={valueProposition}
                onChange={(e) => setValueProposition(e.target.value)}
                placeholder="¿Por qué somos diferentes/mejores?"
                rows={2}
                disabled={loading}
              />
            </div>
          </div>

          {/* User Persona (optional) */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-semibold text-sm">User Persona (opcional)</h3>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="personaName">Nombre</Label>
                <Input
                  id="personaName"
                  value={personaName}
                  onChange={(e) => setPersonaName(e.target.value)}
                  placeholder="Ej: María López"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="personaAge">Edad</Label>
                <Input
                  id="personaAge"
                  value={personaAge}
                  onChange={(e) => setPersonaAge(e.target.value)}
                  placeholder="Ej: 28-35"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="personaOccupation">Ocupación</Label>
                <Input
                  id="personaOccupation"
                  value={personaOccupation}
                  onChange={(e) => setPersonaOccupation(e.target.value)}
                  placeholder="Ej: Entrepreneur"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Pain Points</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addToArray(personaPainPoints, setPersonaPainPoints)}
                  disabled={loading}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Agregar
                </Button>
              </div>

              {personaPainPoints.map((painPoint, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={painPoint}
                    onChange={(e) => updateArrayItem(personaPainPoints, setPersonaPainPoints, i, e.target.value)}
                    placeholder={`Pain point ${i + 1}`}
                    disabled={loading}
                  />
                  {personaPainPoints.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromArray(personaPainPoints, setPersonaPainPoints, i)}
                      disabled={loading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Goals</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addToArray(personaGoals, setPersonaGoals)}
                  disabled={loading}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Agregar
                </Button>
              </div>

              {personaGoals.map((goal, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={goal}
                    onChange={(e) => updateArrayItem(personaGoals, setPersonaGoals, i, e.target.value)}
                    placeholder={`Goal ${i + 1}`}
                    disabled={loading}
                  />
                  {personaGoals.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromArray(personaGoals, setPersonaGoals, i)}
                      disabled={loading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-semibold text-sm">Tech Stack</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stackFrontend">Frontend</Label>
                <Input
                  id="stackFrontend"
                  value={stackFrontend}
                  onChange={(e) => setStackFrontend(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stackFrontendJust">Justificación (opcional)</Label>
                <Input
                  id="stackFrontendJust"
                  value={stackFrontendJustification}
                  onChange={(e) => setStackFrontendJustification(e.target.value)}
                  placeholder="¿Por qué esta elección?"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stackBackend">Backend</Label>
                <Input
                  id="stackBackend"
                  value={stackBackend}
                  onChange={(e) => setStackBackend(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stackBackendJust">Justificación (opcional)</Label>
                <Input
                  id="stackBackendJust"
                  value={stackBackendJustification}
                  onChange={(e) => setStackBackendJustification(e.target.value)}
                  placeholder="¿Por qué esta elección?"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stackDatabase">Database</Label>
                <Input
                  id="stackDatabase"
                  value={stackDatabase}
                  onChange={(e) => setStackDatabase(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stackDatabaseJust">Justificación (opcional)</Label>
                <Input
                  id="stackDatabaseJust"
                  value={stackDatabaseJustification}
                  onChange={(e) => setStackDatabaseJustification(e.target.value)}
                  placeholder="¿Por qué esta elección?"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stackHosting">Hosting</Label>
                <Input
                  id="stackHosting"
                  value={stackHosting}
                  onChange={(e) => setStackHosting(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stackHostingJust">Justificación (opcional)</Label>
                <Input
                  id="stackHostingJust"
                  value={stackHostingJustification}
                  onChange={(e) => setStackHostingJustification(e.target.value)}
                  placeholder="¿Por qué esta elección?"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stackPayment">Payment</Label>
                <Input
                  id="stackPayment"
                  value={stackPayment}
                  onChange={(e) => setStackPayment(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stackPaymentJust">Justificación (opcional)</Label>
                <Input
                  id="stackPaymentJust"
                  value={stackPaymentJustification}
                  onChange={(e) => setStackPaymentJustification(e.target.value)}
                  placeholder="¿Por qué esta elección?"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stackAuth">Auth</Label>
                <Input
                  id="stackAuth"
                  value={stackAuth}
                  onChange={(e) => setStackAuth(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stackAuthJust">Justificación (opcional)</Label>
                <Input
                  id="stackAuthJust"
                  value={stackAuthJustification}
                  onChange={(e) => setStackAuthJustification(e.target.value)}
                  placeholder="¿Por qué esta elección?"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Success Metrics */}
          <div className="space-y-4 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Success Metrics (KPIs)</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMetric}
                disabled={loading}
              >
                <Plus className="h-3 w-3 mr-1" />
                Agregar
              </Button>
            </div>

            {metrics.map((metric, i) => (
              <div key={i} className="flex gap-2 items-end">
                <div className="flex-1 space-y-2">
                  <Label>Categoría</Label>
                  <Input
                    value={metric.category}
                    onChange={(e) => updateMetric(i, 'category', e.target.value)}
                    placeholder="Ej: Acquisition, Retention..."
                    disabled={loading}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label>Métrica</Label>
                  <Input
                    value={metric.metric}
                    onChange={(e) => updateMetric(i, 'metric', e.target.value)}
                    placeholder="Ej: Monthly signups"
                    disabled={loading}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label>Target</Label>
                  <Input
                    value={metric.target}
                    onChange={(e) => updateMetric(i, 'target', e.target.value)}
                    placeholder="Ej: 1000 usuarios/mes"
                    disabled={loading}
                  />
                </div>
                {metrics.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMetric(i)}
                    disabled={loading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="space-y-4 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Features (MVP)</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addToArray(features, setFeatures)}
                disabled={loading}
              >
                <Plus className="h-3 w-3 mr-1" />
                Agregar
              </Button>
            </div>

            {features.map((feature, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={feature}
                  onChange={(e) => updateArrayItem(features, setFeatures, i, e.target.value)}
                  placeholder={`Feature ${i + 1}`}
                  disabled={loading}
                />
                {features.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromArray(features, setFeatures, i)}
                    disabled={loading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Out of Scope */}
          <div className="space-y-4 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Out of Scope (v1)</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addToArray(outOfScope, setOutOfScope)}
                disabled={loading}
              >
                <Plus className="h-3 w-3 mr-1" />
                Agregar
              </Button>
            </div>

            {outOfScope.map((item, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={item}
                  onChange={(e) => updateArrayItem(outOfScope, setOutOfScope, i, e.target.value)}
                  placeholder={`Feature fuera de scope ${i + 1}`}
                  disabled={loading}
                />
                {outOfScope.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromArray(outOfScope, setOutOfScope, i)}
                    disabled={loading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-semibold text-sm">Timeline</h3>

            <div className="space-y-2">
              <Label htmlFor="estimatedWeeks">Semanas Estimadas</Label>
              <Input
                id="estimatedWeeks"
                type="number"
                min="1"
                max="52"
                value={estimatedWeeks}
                onChange={(e) => setEstimatedWeeks(Number(e.target.value))}
                disabled={loading}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <FileEdit className="h-4 w-4 mr-2" />
                  Guardar PRD
                </>
              )}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
