'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, ClipboardList, CheckCircle2, TrendingUp, MapPin, Sparkles, FileEdit } from 'lucide-react';
import { Validation, ProductPlan } from '@/lib/types';
import { ManualProductPlanForm } from './manual-product-plan-form';

interface ProductPlanFormProps {
  projectId: string;
  onPlanGenerated: (plan: ProductPlan) => void;
  onCancel?: () => void;
}

export function ProductPlanForm({ projectId, onPlanGenerated, onCancel }: ProductPlanFormProps) {
  const [validations, setValidations] = useState<Validation[]>([]);
  const [selectedValidation, setSelectedValidation] = useState<Validation | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingValidations, setFetchingValidations] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApprovedValidations();
  }, [projectId]);

  const fetchApprovedValidations = async () => {
    setFetchingValidations(true);
    setError(null);

    try {
      const response = await fetch(`/api/validations?projectId=${projectId}`);

      if (!response.ok) {
        throw new Error('Error al cargar validaciones');
      }

      const allValidations = await response.json();
      // Filtrar solo validaciones con estado APPROVED (cualquier veredicto)
      // Si un PM aprobó una validación 'validate_more', puede querer generar PRD igual
      const approvedValidations = allValidations.filter(
        (v: Validation) => v.status === 'approved'
      );
      setValidations(approvedValidations);

      if (approvedValidations.length === 0) {
        setError('No hay validaciones aprobadas para PRD. Primero valida una idea y apruébala desde el resultado.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setFetchingValidations(false);
    }
  };

  const handleValidationSelect = (validationId: string) => {
    const validation = validations.find((v) => v.id === validationId);
    setSelectedValidation(validation || null);
  };

  const handleGeneratePRD = async () => {
    if (!selectedValidation) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-prd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          validationId: selectedValidation.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al generar PRD');
      }

      const plan = await response.json();
      onPlanGenerated(plan);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingValidations) {
    return (
      <Card className="border-2 shadow-lg">
        <CardContent className="pt-6 flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="ai" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="ai" className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          PRD con IA
        </TabsTrigger>
        <TabsTrigger value="manual" className="flex items-center gap-2">
          <FileEdit className="h-4 w-4" />
          PRD Manual
        </TabsTrigger>
      </TabsList>

      {/* AI PRD Generation Tab */}
      <TabsContent value="ai">
        <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" />
          Generar Product Requirements Document (PRD)
        </CardTitle>
        <CardDescription>
          Selecciona una validación exitosa para generar un PRD completo estilo Google/Meta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); handleGeneratePRD(); }} className="space-y-6">
          {/* Validation Selector */}
          <div className="space-y-2">
            <label htmlFor="validation" className="text-sm font-medium">
              Seleccionar Validación Aprobada
            </label>
            <Select
              value={selectedValidation?.id || ''}
              onValueChange={handleValidationSelect}
              disabled={loading || validations.length === 0}
            >
              <SelectTrigger id="validation">
                <SelectValue placeholder="Elige una validación aprobada..." />
              </SelectTrigger>
              <SelectContent>
                {validations.map((validation) => (
                  <SelectItem key={validation.id} value={validation.id}>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-green-600" />
                      <span className="truncate max-w-[300px]">{validation.rawIdea}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {validations.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {validations.length} validación{validations.length !== 1 ? 'es' : ''} aprobada{validations.length !== 1 ? 's' : ''} disponible{validations.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Selected Validation Preview */}
          {selectedValidation && (
            <div className="p-4 border-2 rounded-lg space-y-3 bg-muted/30">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm font-semibold mb-1">{selectedValidation.rawIdea}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant="outline"
                      className={
                        selectedValidation.verdict === 'go'
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-yellow-50 text-yellow-700 border-yellow-200"
                      }
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      {selectedValidation.verdict === 'go' ? 'GO' : 'VALIDATE MORE'}
                    </Badge>
                    <Badge variant="outline">
                      <MapPin className="h-3 w-3 mr-1" />
                      {selectedValidation.targetMarket}
                    </Badge>
                    <Badge variant="outline">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {selectedValidation.confidenceScore}% confianza
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-muted-foreground">Features Core</p>
                  <p className="font-medium">{selectedValidation.coreFeatures.length} features</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Estimación</p>
                  <p className="font-medium">
                    {selectedValidation.estimatedWeeks} semanas / ${selectedValidation.estimatedBudget?.toLocaleString()} USD
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground mb-1">Problema</p>
                <p className="text-sm line-clamp-2">{selectedValidation.problemAnalysis}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={loading || !selectedValidation}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generando PRD con Claude...
                </>
              ) : (
                <>
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Generar PRD
                </>
              )}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
              >
                Cancelar
              </Button>
            )}
          </div>

          {/* Info */}
          {loading && (
            <div className="text-center p-4 bg-muted/50 rounded-md">
              <p className="text-sm text-muted-foreground">
                Generando PRD completo con:
              </p>
              <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                <li>• Executive Summary</li>
                <li>• User Personas detalladas</li>
                <li>• Features con RICE Scoring</li>
                <li>• Acceptance Criteria (Given-When-Then)</li>
                <li>• Tech Stack Justification</li>
                <li>• Success Metrics & KPIs</li>
                <li>• Timeline de 12 semanas</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-3">
                Esto puede tomar 60-90 segundos...
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
      </TabsContent>

      {/* Manual PRD Tab */}
      <TabsContent value="manual">
        <ManualProductPlanForm
          projectId={projectId}
          onPlanComplete={onPlanGenerated}
          onCancel={onCancel}
        />
      </TabsContent>
    </Tabs>
  );
}
