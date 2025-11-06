'use client';

import { useEffect, useState } from 'react';
import { Validation } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, AlertCircle, Clock, TrendingUp, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ValidationListProps {
  projectId: string;
  onValidationClick: (validation: Validation) => void;
}

export function ValidationList({ projectId, onValidationClick }: ValidationListProps) {
  const [validations, setValidations] = useState<Validation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchValidations();
  }, [projectId]);

  const fetchValidations = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/validations?projectId=${projectId}`);

      if (!response.ok) {
        throw new Error('Error al cargar validaciones');
      }

      const data = await response.json();
      setValidations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const getVerdictConfig = (verdict: string) => {
    switch (verdict) {
      case 'go':
        return {
          icon: CheckCircle2,
          label: 'GO',
          color: 'text-green-600',
          bgColor: 'bg-green-50 dark:bg-green-950/30',
          borderColor: 'border-green-200',
        };
      case 'validate_more':
        return {
          icon: AlertCircle,
          label: 'VALIDAR MÁS',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
          borderColor: 'border-yellow-200',
        };
      case 'no_go':
        return {
          icon: XCircle,
          label: 'NO GO',
          color: 'text-red-600',
          bgColor: 'bg-red-50 dark:bg-red-950/30',
          borderColor: 'border-red-200',
        };
      default:
        return {
          icon: AlertCircle,
          label: verdict,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <p className="text-destructive text-center">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (validations.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">
            No hay validaciones aún. Crea tu primera validación de idea.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {validations.map((validation) => {
        const verdictConfig = getVerdictConfig(validation.verdict);
        const VerdictIcon = verdictConfig.icon;

        return (
          <Card
            key={validation.id}
            className={cn(
              'cursor-pointer transition-all hover:shadow-md',
              'border-l-4',
              verdictConfig.borderColor
            )}
            onClick={() => onValidationClick(validation)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      className={cn(
                        'font-semibold',
                        verdictConfig.color,
                        verdictConfig.bgColor,
                        verdictConfig.borderColor,
                        'border'
                      )}
                    >
                      <VerdictIcon className="h-3 w-3 mr-1" />
                      {verdictConfig.label}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={cn(
                        validation.status === 'approved'
                          ? 'bg-green-50 text-green-700 border-green-300 dark:bg-green-950/30'
                          : 'bg-yellow-50 text-yellow-700 border-yellow-300 dark:bg-yellow-950/30'
                      )}
                    >
                      {validation.status === 'approved' ? 'APROBADA' : 'BORRADOR'}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {validation.source === 'ai' ? '🤖 IA' : '✍️ Manual'}
                    </Badge>
                    <Badge variant="outline">{validation.targetMarket}</Badge>
                  </div>
                  <CardTitle className="text-base line-clamp-2">{validation.rawIdea}</CardTitle>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <div className="flex items-center gap-1 text-sm">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{validation.confidenceScore}%</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(validation.validationDate)}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2">
                {validation.coreFeatures.slice(0, 3).map((feature, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {feature.length > 40 ? feature.substring(0, 40) + '...' : feature}
                  </Badge>
                ))}
                {validation.coreFeatures.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{validation.coreFeatures.length - 3} más
                  </Badge>
                )}
              </div>
              {validation.estimatedWeeks && validation.estimatedBudget && (
                <div className="flex gap-4 mt-3 text-sm text-muted-foreground">
                  <span>⏱ {validation.estimatedWeeks} semanas</span>
                  <span>💰 ${validation.estimatedBudget.toLocaleString()} USD</span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
