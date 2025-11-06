'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, FileEdit, Plus, X } from 'lucide-react';
import { Validation } from '@/lib/types';
import { nanoid } from 'nanoid';

interface ManualValidationFormProps {
  projectId: string;
  onValidationComplete: (validation: Validation) => void;
  onCancel?: () => void;
}

const MARKETS = [
  { value: 'USA', label: 'Estados Unidos' },
  { value: 'LATAM', label: 'Latinoamérica (General)' },
  { value: 'AR', label: 'Argentina' },
  { value: 'MX', label: 'México' },
  { value: 'BR', label: 'Brasil' },
  { value: 'CL', label: 'Chile' },
  { value: 'CO', label: 'Colombia' },
  { value: 'PE', label: 'Perú' },
  { value: 'UY', label: 'Uruguay' },
];

export function ManualValidationForm({ projectId, onValidationComplete, onCancel }: ManualValidationFormProps) {
  // Basic Info
  const [rawIdea, setRawIdea] = useState('');
  const [targetMarket, setTargetMarket] = useState('LATAM');
  const [verdict, setVerdict] = useState<'go' | 'validate_more' | 'no_go'>('go');
  const [confidenceScore, setConfidenceScore] = useState(85);

  // Market Analysis
  const [marketSize, setMarketSize] = useState('');
  const [marketGrowth, setMarketGrowth] = useState('');
  const [competition, setCompetition] = useState('');
  const [usaComparison, setUsaComparison] = useState('');

  // Problem & Solution
  const [problemAnalysis, setProblemAnalysis] = useState('');
  const [solutionProposal, setSolutionProposal] = useState('');

  // Adaptations & Barriers
  const [adaptations, setAdaptations] = useState<string[]>(['']);
  const [barriers, setBarriers] = useState<string[]>(['']);

  // Stack
  const [stackFrontend, setStackFrontend] = useState('Next.js + React');
  const [stackBackend, setStackBackend] = useState('Next.js API Routes');
  const [stackDatabase, setStackDatabase] = useState('PostgreSQL');
  const [stackPayment, setStackPayment] = useState('Stripe');
  const [stackAuth, setStackAuth] = useState('NextAuth.js');

  // Features
  const [coreFeatures, setCoreFeatures] = useState<string[]>(['']);
  const [outOfScope, setOutOfScope] = useState<string[]>(['']);

  // Estimates
  const [estimatedWeeks, setEstimatedWeeks] = useState(8);
  const [estimatedBudget, setEstimatedBudget] = useState(5000);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rawIdea.trim()) {
      setError('Por favor describe la idea');
      return;
    }

    if (!problemAnalysis.trim() || !solutionProposal.trim()) {
      setError('El análisis del problema y la solución son obligatorios');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const validation: Validation = {
        id: nanoid(),
        projectId,
        rawIdea: rawIdea.trim(),
        targetMarket,
        verdict,
        confidenceScore,
        marketAnalysis: {
          size: marketSize,
          growth: marketGrowth,
          competition,
          usaComparison,
        },
        problemAnalysis: problemAnalysis.trim(),
        solutionProposal: solutionProposal.trim(),
        adaptationsNeeded: adaptations.filter(a => a.trim()),
        barriers: barriers.filter(b => b.trim()),
        stackRecommendation: {
          frontend: stackFrontend,
          backend: stackBackend,
          database: stackDatabase,
          payment: stackPayment,
          auth: stackAuth,
        },
        coreFeatures: coreFeatures.filter(f => f.trim()),
        outOfScope: outOfScope.filter(f => f.trim()),
        estimatedWeeks,
        estimatedBudget,
        validatedBy: 'Manual',
        validationDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        status: 'approved', // Manual validations are pre-approved
        source: 'manual',
      };

      // Save to database
      const response = await fetch('/api/validations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validation),
      });

      if (!response.ok) {
        throw new Error('Error al guardar validación');
      }

      onValidationComplete(validation);
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
          Crear Validación Manual
        </CardTitle>
        <CardDescription>
          Ingresa una idea ya validada sin necesidad de usar IA. Todos los campos marcados con * son obligatorios.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-semibold text-sm">Información Básica</h3>

            <div className="space-y-2">
              <Label htmlFor="rawIdea">Idea / Descripción *</Label>
              <Textarea
                id="rawIdea"
                value={rawIdea}
                onChange={(e) => setRawIdea(e.target.value)}
                placeholder="Describe la idea validada..."
                rows={3}
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetMarket">Mercado Objetivo *</Label>
                <Select value={targetMarket} onValueChange={setTargetMarket} disabled={loading}>
                  <SelectTrigger id="targetMarket">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MARKETS.map((market) => (
                      <SelectItem key={market.value} value={market.value}>
                        {market.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="verdict">Veredicto *</Label>
                <Select value={verdict} onValueChange={(v: any) => setVerdict(v)} disabled={loading}>
                  <SelectTrigger id="verdict">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="go">GO - Ejecutar</SelectItem>
                    <SelectItem value="validate_more">Validar Más</SelectItem>
                    <SelectItem value="no_go">NO GO</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confidenceScore">Confianza (0-100) *</Label>
                <Input
                  id="confidenceScore"
                  type="number"
                  min="0"
                  max="100"
                  value={confidenceScore}
                  onChange={(e) => setConfidenceScore(Number(e.target.value))}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Market Analysis */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-semibold text-sm">Análisis de Mercado</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="marketSize">Tamaño de Mercado</Label>
                <Input
                  id="marketSize"
                  value={marketSize}
                  onChange={(e) => setMarketSize(e.target.value)}
                  placeholder="Ej: $500M USD en LATAM"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="marketGrowth">Crecimiento</Label>
                <Input
                  id="marketGrowth"
                  value={marketGrowth}
                  onChange={(e) => setMarketGrowth(e.target.value)}
                  placeholder="Ej: 15% anual"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="competition">Competencia</Label>
              <Textarea
                id="competition"
                value={competition}
                onChange={(e) => setCompetition(e.target.value)}
                placeholder="Describe la competencia actual..."
                rows={2}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="usaComparison">Comparación con USA (opcional)</Label>
              <Textarea
                id="usaComparison"
                value={usaComparison}
                onChange={(e) => setUsaComparison(e.target.value)}
                placeholder="¿Hay modelos similares en USA?"
                rows={2}
                disabled={loading}
              />
            </div>
          </div>

          {/* Problem & Solution */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-semibold text-sm">Problema y Solución</h3>

            <div className="space-y-2">
              <Label htmlFor="problemAnalysis">Análisis del Problema *</Label>
              <Textarea
                id="problemAnalysis"
                value={problemAnalysis}
                onChange={(e) => setProblemAnalysis(e.target.value)}
                placeholder="¿Qué problema resuelve esta idea?"
                rows={3}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="solutionProposal">Solución Propuesta *</Label>
              <Textarea
                id="solutionProposal"
                value={solutionProposal}
                onChange={(e) => setSolutionProposal(e.target.value)}
                placeholder="¿Cómo se resuelve el problema?"
                rows={3}
                disabled={loading}
              />
            </div>
          </div>

          {/* Stack Recommendation */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-semibold text-sm">Stack Tecnológico Recomendado</h3>

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
                <Label htmlFor="stackBackend">Backend</Label>
                <Input
                  id="stackBackend"
                  value={stackBackend}
                  onChange={(e) => setStackBackend(e.target.value)}
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
                <Label htmlFor="stackPayment">Payment</Label>
                <Input
                  id="stackPayment"
                  value={stackPayment}
                  onChange={(e) => setStackPayment(e.target.value)}
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
            </div>
          </div>

          {/* Core Features */}
          <div className="space-y-4 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Features Core (MVP)</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addToArray(coreFeatures, setCoreFeatures)}
                disabled={loading}
              >
                <Plus className="h-3 w-3 mr-1" />
                Agregar
              </Button>
            </div>

            {coreFeatures.map((feature, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={feature}
                  onChange={(e) => updateArrayItem(coreFeatures, setCoreFeatures, i, e.target.value)}
                  placeholder={`Feature ${i + 1}`}
                  disabled={loading}
                />
                {coreFeatures.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromArray(coreFeatures, setCoreFeatures, i)}
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
              <h3 className="font-semibold text-sm">Fuera de Scope (v1)</h3>
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

            {outOfScope.map((feature, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={feature}
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

          {/* Adaptations */}
          <div className="space-y-4 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Adaptaciones Necesarias (opcional)</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addToArray(adaptations, setAdaptations)}
                disabled={loading}
              >
                <Plus className="h-3 w-3 mr-1" />
                Agregar
              </Button>
            </div>

            {adaptations.map((adaptation, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={adaptation}
                  onChange={(e) => updateArrayItem(adaptations, setAdaptations, i, e.target.value)}
                  placeholder={`Adaptación ${i + 1}`}
                  disabled={loading}
                />
                {adaptations.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromArray(adaptations, setAdaptations, i)}
                    disabled={loading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Barriers */}
          <div className="space-y-4 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Barreras (opcional)</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addToArray(barriers, setBarriers)}
                disabled={loading}
              >
                <Plus className="h-3 w-3 mr-1" />
                Agregar
              </Button>
            </div>

            {barriers.map((barrier, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={barrier}
                  onChange={(e) => updateArrayItem(barriers, setBarriers, i, e.target.value)}
                  placeholder={`Barrera ${i + 1}`}
                  disabled={loading}
                />
                {barriers.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromArray(barriers, setBarriers, i)}
                    disabled={loading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Estimates */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-semibold text-sm">Estimación</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="estimatedWeeks">Semanas Estimadas</Label>
                <Input
                  id="estimatedWeeks"
                  type="number"
                  min="1"
                  value={estimatedWeeks}
                  onChange={(e) => setEstimatedWeeks(Number(e.target.value))}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedBudget">Presupuesto (USD)</Label>
                <Input
                  id="estimatedBudget"
                  type="number"
                  min="0"
                  step="100"
                  value={estimatedBudget}
                  onChange={(e) => setEstimatedBudget(Number(e.target.value))}
                  disabled={loading}
                />
              </div>
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
                  Guardar Validación
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
