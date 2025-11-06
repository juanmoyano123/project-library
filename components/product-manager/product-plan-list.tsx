'use client';

import { useEffect, useState } from 'react';
import { ProductPlan } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ClipboardList, Calendar, Zap, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductPlanListProps {
  projectId: string;
  onPlanClick: (plan: ProductPlan) => void;
}

export function ProductPlanList({ projectId, onPlanClick }: ProductPlanListProps) {
  const [plans, setPlans] = useState<ProductPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
  }, [projectId]);

  const fetchPlans = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/plans?projectId=${projectId}`);

      if (!response.ok) {
        throw new Error('Error al cargar PRDs');
      }

      const data = await response.json();
      setPlans(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
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

  if (plans.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">
            No hay PRDs generados aún. Genera tu primer PRD desde una validación GO.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {plans.map((plan) => {
        const features = plan.dependencies?.features || [];
        const timeline = plan.dependencies?.timeline || {};
        const metrics = plan.successMetrics || [];

        return (
          <Card
            key={plan.id}
            className={cn(
              'cursor-pointer transition-all hover:shadow-md',
              'border-l-4 border-l-primary'
            )}
            onClick={() => onPlanClick(plan)}
          >
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <ClipboardList className="h-4 w-4 text-primary flex-shrink-0" />
                    <h3 className="font-semibold line-clamp-1">{plan.problemStatement}</h3>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {plan.valueProposition}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      {features.length} features
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      {metrics.length} metrics
                    </Badge>
                    {plan.estimatedTimelineDays && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {Math.round(plan.estimatedTimelineDays / 7)} semanas
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Creado</p>
                    <p className="text-sm font-medium">{formatDate(plan.createdAt)}</p>
                  </div>
                  {plan.createdBy && (
                    <Badge variant="secondary" className="text-xs">
                      {plan.createdBy}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Tech Stack Summary */}
              {plan.techStack && Object.keys(plan.techStack).length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-muted-foreground mb-2">Tech Stack:</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(plan.techStack).slice(0, 4).map(([key, value]: [string, any]) => (
                      <Badge key={key} variant="secondary" className="text-xs">
                        {value.framework || value.type || value.provider || value.platform || key}
                      </Badge>
                    ))}
                    {Object.keys(plan.techStack).length > 4 && (
                      <Badge variant="secondary" className="text-xs">
                        +{Object.keys(plan.techStack).length - 4}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
