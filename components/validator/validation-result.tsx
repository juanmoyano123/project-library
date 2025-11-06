'use client';

import { Validation } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Zap,
  DollarSign,
  Clock,
  Download,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Check,
  ClipboardList,
  ArrowRight,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ValidationResultProps {
  validation: Validation;
  onApproved?: () => void;
}

export function ValidationResult({ validation, onApproved }: ValidationResultProps) {
  const [expandedSections, setExpandedSections] = useState({
    market: true,
    problem: true,
    solution: true,
    adaptations: false,
    barriers: false,
    stack: false,
    features: true,
    estimates: true,
  });

  const [approving, setApproving] = useState(false);
  const [iterating, setIterating] = useState(false);
  const [localValidation, setLocalValidation] = useState(validation);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleApprove = async () => {
    setApproving(true);
    try {
      const response = await fetch(`/api/validations/${localValidation.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      });

      if (!response.ok) {
        throw new Error('Error al aprobar validación');
      }

      const updated = await response.json();
      setLocalValidation(updated);

      // Llamar callback después de aprobar exitosamente
      if (onApproved) {
        onApproved();
      }
    } catch (error) {
      console.error('Error approving validation:', error);
      alert('Error al aprobar la validación. Por favor intenta nuevamente.');
    } finally {
      setApproving(false);
    }
  };

  const handleIterate = async () => {
    setIterating(true);
    try {
      const response = await fetch(`/api/validations/${localValidation.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'draft' }),
      });

      if (!response.ok) {
        throw new Error('Error al cambiar estado');
      }

      const updated = await response.json();
      setLocalValidation(updated);

      // Aquí podrías agregar lógica para volver a la validación o recargar el análisis AI
      alert('Validación marcada como borrador. Puedes volver a validar la idea para iterarla.');
    } catch (error) {
      console.error('Error iterating validation:', error);
      alert('Error al cambiar estado. Por favor intenta nuevamente.');
    } finally {
      setIterating(false);
    }
  };

  const getVerdictConfig = (verdict: string) => {
    switch (verdict) {
      case 'go':
        return {
          icon: CheckCircle2,
          label: 'GO - Ejecutar',
          color: 'text-green-600',
          bgColor: 'bg-green-50 dark:bg-green-950/30',
          borderColor: 'border-green-200',
        };
      case 'validate_more':
        return {
          icon: AlertCircle,
          label: 'Validar Más',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
          borderColor: 'border-yellow-200',
        };
      case 'no_go':
        return {
          icon: XCircle,
          label: 'NO GO - No ejecutar',
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

  const verdictConfig = getVerdictConfig(localValidation.verdict);
  const VerdictIcon = verdictConfig.icon;

  const downloadMarkdown = () => {
    if (!validation.markdownOutput) return;

    const blob = new Blob([validation.markdownOutput], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `validation-${validation.id}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const Section = ({ title, expanded, onToggle, children }: any) => (
    <div className="border rounded-lg">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
      >
        <h3 className="font-semibold">{title}</h3>
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {expanded && (
        <div className="p-4 pt-0 space-y-2">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Verdict Card */}
      <Card className={cn('border-2', verdictConfig.borderColor, verdictConfig.bgColor)}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={cn('p-2 rounded-lg', verdictConfig.bgColor)}>
                <VerdictIcon className={cn('h-6 w-6', verdictConfig.color)} />
              </div>
              <div>
                <CardTitle className="text-2xl">{verdictConfig.label}</CardTitle>
                <CardDescription>
                  Confianza: {validation.confidenceScore}% · {validation.targetMarket}
                </CardDescription>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={downloadMarkdown}>
              <Download className="h-4 w-4 mr-2" />
              Descargar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-background/50 rounded-lg">
            <p className="text-sm font-medium text-muted-foreground mb-2">Idea Original</p>
            <p>{validation.rawIdea}</p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons - Only for AI validations */}
      {localValidation.source === 'ai' && (
        <Card>
          <CardContent className="pt-6">
            {localValidation.status === 'draft' ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground text-center">
                  Esta validación está en borrador. Puedes iterarla o aprobarla para usarla en el PRD.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleIterate}
                    disabled={iterating || approving}
                    className="flex-1"
                  >
                    {iterating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Iterar Idea
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleApprove}
                    disabled={approving || iterating}
                    className="flex-1"
                  >
                    {approving ? (
                      <>
                        <Check className="h-4 w-4 mr-2 animate-spin" />
                        Aprobando...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Aprobar para PRD
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                  <p className="font-semibold">Validación Aprobada</p>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Esta validación está aprobada y lista para generar un PRD desde el Product Manager.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  {onApproved && (
                    <Button
                      onClick={onApproved}
                      className="gap-2"
                    >
                      <ClipboardList className="h-4 w-4" />
                      Ir al Product Manager
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleIterate}
                    disabled={iterating}
                  >
                    {iterating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Volver a Borrador
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Market Analysis */}
      <Section
        title="📊 Análisis de Mercado"
        expanded={expandedSections.market}
        onToggle={() => toggleSection('market')}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Tamaño</p>
            <p className="font-medium">{validation.marketAnalysis.size || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Crecimiento</p>
            <p className="font-medium">{validation.marketAnalysis.growth || 'N/A'}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-muted-foreground">Competencia</p>
            <p className="font-medium">{validation.marketAnalysis.competition || 'N/A'}</p>
          </div>
          {validation.marketAnalysis.usaComparison && (
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground">Comparación USA</p>
              <p className="font-medium">{validation.marketAnalysis.usaComparison}</p>
            </div>
          )}
        </div>
      </Section>

      {/* Problem & Solution */}
      <div className="grid md:grid-cols-2 gap-4">
        <Section
          title="🎯 Problema"
          expanded={expandedSections.problem}
          onToggle={() => toggleSection('problem')}
        >
          <p className="text-sm">{validation.problemAnalysis || 'N/A'}</p>
        </Section>

        <Section
          title="💡 Solución"
          expanded={expandedSections.solution}
          onToggle={() => toggleSection('solution')}
        >
          <p className="text-sm">{validation.solutionProposal || 'N/A'}</p>
        </Section>
      </div>

      {/* Adaptations & Barriers */}
      {(validation.adaptationsNeeded && validation.adaptationsNeeded.length > 0 ||
        validation.barriers && validation.barriers.length > 0) && (
        <div className="grid md:grid-cols-2 gap-4">
          {validation.adaptationsNeeded && validation.adaptationsNeeded.length > 0 && (
            <Section
              title="🔄 Adaptaciones Necesarias"
              expanded={expandedSections.adaptations}
              onToggle={() => toggleSection('adaptations')}
            >
              <ul className="space-y-1">
                {validation.adaptationsNeeded.map((adaptation, i) => (
                  <li key={i} className="text-sm flex gap-2">
                    <span className="text-muted-foreground">•</span>
                    {adaptation}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {validation.barriers && validation.barriers.length > 0 && (
            <Section
              title="🚧 Barreras"
              expanded={expandedSections.barriers}
              onToggle={() => toggleSection('barriers')}
            >
              <ul className="space-y-1">
                {validation.barriers.map((barrier, i) => (
                  <li key={i} className="text-sm flex gap-2">
                    <span className="text-muted-foreground">•</span>
                    {barrier}
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>
      )}

      {/* Tech Stack */}
      <Section
        title="🛠 Stack Tecnológico"
        expanded={expandedSections.stack}
        onToggle={() => toggleSection('stack')}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(validation.stackRecommendation).map(([key, value]) => (
            <div key={key}>
              <p className="text-xs text-muted-foreground capitalize">{key}</p>
              <Badge variant="secondary" className="mt-1">{value as string}</Badge>
            </div>
          ))}
        </div>
      </Section>

      {/* Features */}
      <Section
        title="✨ Features Core (MVP)"
        expanded={expandedSections.features}
        onToggle={() => toggleSection('features')}
      >
        <ul className="space-y-2">
          {validation.coreFeatures.map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
        {validation.outOfScope && validation.outOfScope.length > 0 && (
          <>
            <Separator className="my-4" />
            <p className="text-sm font-medium text-muted-foreground mb-2">Fuera de Scope (v1)</p>
            <ul className="space-y-1">
              {validation.outOfScope.map((feature, i) => (
                <li key={i} className="text-sm text-muted-foreground flex gap-2">
                  <span>•</span>
                  {feature}
                </li>
              ))}
            </ul>
          </>
        )}
      </Section>

      {/* Estimates */}
      <Section
        title="⏱ Estimación"
        expanded={expandedSections.estimates}
        onToggle={() => toggleSection('estimates')}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Tiempo</p>
              <p className="font-semibold">{validation.estimatedWeeks || '?'} semanas</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Presupuesto</p>
              <p className="font-semibold">
                ${validation.estimatedBudget?.toLocaleString() || '?'} USD
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Metadata */}
      <div className="text-xs text-muted-foreground text-center">
        Validado por {validation.validatedBy} el{' '}
        {new Date(validation.validationDate).toLocaleDateString('es', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </div>
    </div>
  );
}
