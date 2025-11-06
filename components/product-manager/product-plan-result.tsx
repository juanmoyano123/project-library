'use client';

import { useState } from 'react';
import { ProductPlan } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  ClipboardList,
  Users,
  Zap,
  Code,
  Target,
  Calendar,
  XCircle,
  AlertTriangle,
  Download,
  ChevronDown,
  ChevronUp,
  Check,
  RefreshCw,
  CheckCircle2,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductPlanResultProps {
  plan: ProductPlan;
}

export function ProductPlanResult({ plan }: ProductPlanResultProps) {
  const [expandedSections, setExpandedSections] = useState({
    executive: true,
    personas: true,
    features: true,
    techStack: false,
    metrics: false,
    timeline: false,
    outOfScope: false,
    risks: false,
  });

  const [approving, setApproving] = useState(false);
  const [iterating, setIterating] = useState(false);
  const [generatingFeatures, setGeneratingFeatures] = useState(false);
  const [localPlan, setLocalPlan] = useState(plan);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleApprove = async () => {
    setApproving(true);
    try {
      const response = await fetch(`/api/product-plans/${localPlan.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      });

      if (!response.ok) {
        throw new Error('Error al aprobar plan');
      }

      const updated = await response.json();
      setLocalPlan(updated);
    } catch (error) {
      console.error('Error approving product plan:', error);
      alert('Error al aprobar el plan. Por favor intenta nuevamente.');
    } finally {
      setApproving(false);
    }
  };

  const handleIterate = async () => {
    setIterating(true);
    try {
      const response = await fetch(`/api/product-plans/${localPlan.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'draft' }),
      });

      if (!response.ok) {
        throw new Error('Error al cambiar estado');
      }

      const updated = await response.json();
      setLocalPlan(updated);

      alert('Plan marcado como borrador. Puedes volver a generar el PRD para iterarlo.');
    } catch (error) {
      console.error('Error iterating product plan:', error);
      alert('Error al cambiar estado. Por favor intenta nuevamente.');
    } finally {
      setIterating(false);
    }
  };

  const handleGenerateFeatures = async () => {
    setGeneratingFeatures(true);
    try {
      const response = await fetch('/api/generate-features', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: localPlan.id,
          projectId: localPlan.projectId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al generar features');
      }

      const result = await response.json();

      alert(`¡Features generados exitosamente! Se crearon ${result.count} features. Ve a la sección Features para verlos.`);
    } catch (error: any) {
      console.error('Error generating features:', error);
      alert(`Error al generar features: ${error.message}`);
    } finally {
      setGeneratingFeatures(false);
    }
  };

  const downloadMarkdown = () => {
    if (!plan.markdownOutput) return;

    const blob = new Blob([plan.markdownOutput], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prd-${plan.id}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const Section = ({ title, icon: Icon, expanded, onToggle, children }: any) => (
    <div className="border rounded-lg">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          <h3 className="font-semibold">{title}</h3>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {expanded && (
        <div className="p-4 pt-0 space-y-3">
          {children}
        </div>
      )}
    </div>
  );

  // Parsear el dependencies object
  const features = plan.dependencies?.features || [];
  const timeline = plan.dependencies?.timeline || {};
  const risks = plan.dependencies?.risks || [];
  const outOfScope = plan.dependencies?.outOfScope || [];

  // Ordenar features por RICE score
  const sortedFeatures = [...features].sort((a: any, b: any) => (b.riceScore || 0) - (a.riceScore || 0));

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-2 shadow-lg bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 dark:from-blue-950/30 dark:via-cyan-950/30 dark:to-blue-900/30">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <ClipboardList className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Product Requirements Document</CardTitle>
                <CardDescription className="mt-1">
                  Timeline: {plan.estimatedTimelineDays ? `${Math.round(plan.estimatedTimelineDays / 7)} semanas` : 'N/A'} ·
                  {plan.createdBy} · {new Date(plan.createdAt).toLocaleDateString('es')}
                </CardDescription>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={downloadMarkdown}>
              <Download className="h-4 w-4 mr-2" />
              Descargar MD
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Action Buttons - Only for AI product plans */}
      {localPlan.source === 'ai' && (
        <Card>
          <CardContent className="pt-6">
            {localPlan.status === 'draft' ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground text-center">
                  Este PRD está en borrador. Puedes iterarlo o aprobarlo para usarlo en el desarrollo.
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
                        Volver a Borrador
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
                        Aprobar PRD
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                  <p className="font-semibold">PRD Aprobado</p>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Este PRD está aprobado y listo para iniciar el desarrollo.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button
                    onClick={handleGenerateFeatures}
                    disabled={generatingFeatures || iterating}
                    className="gap-2"
                  >
                    {generatingFeatures ? (
                      <>
                        <Layers className="h-4 w-4 animate-spin" />
                        Generando Features...
                      </>
                    ) : (
                      <>
                        <Layers className="h-4 w-4" />
                        Generar Features con IA
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleIterate}
                    disabled={iterating || generatingFeatures}
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

      {/* Executive Summary */}
      <Section
        title="Executive Summary"
        icon={ClipboardList}
        expanded={expandedSections.executive}
        onToggle={() => toggleSection('executive')}
      >
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Problem Statement</p>
            <p className="mt-1">{plan.problemStatement}</p>
          </div>
          <Separator />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Solution Statement</p>
            <p className="mt-1">{plan.solutionStatement}</p>
          </div>
          <Separator />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Value Proposition</p>
            <p className="mt-1 font-semibold text-primary">{plan.valueProposition}</p>
          </div>
        </div>
      </Section>

      {/* User Personas */}
      <Section
        title="User Personas"
        icon={Users}
        expanded={expandedSections.personas}
        onToggle={() => toggleSection('personas')}
      >
        <div className="space-y-4">
          {Array.isArray(plan.persona) && plan.persona.length > 0 ? (
            plan.persona.map((persona: any, i: number) => (
              <Card key={i} className="border">
                <CardContent className="pt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold">{persona.name}</h4>
                    <Badge variant="secondary">{persona.techSavviness || 'N/A'} tech</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {persona.age} · {persona.occupation} · {persona.location}
                  </p>

                  <div className="pt-2">
                    <p className="text-xs font-medium text-muted-foreground">Pain Points:</p>
                    <ul className="text-sm space-y-1 mt-1">
                      {persona.painPoints?.map((p: string, j: number) => (
                        <li key={j} className="flex gap-2">
                          <span className="text-destructive">•</span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2">
                    <p className="text-xs font-medium text-muted-foreground">Goals:</p>
                    <ul className="text-sm space-y-1 mt-1">
                      {persona.goals?.map((g: string, j: number) => (
                        <li key={j} className="flex gap-2">
                          <span className="text-green-600">•</span>
                          {g}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {persona.quote && (
                    <div className="pt-2 italic text-sm bg-muted p-2 rounded">
                      "{persona.quote}"
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No personas defined</p>
          )}
        </div>
      </Section>

      {/* Features with RICE */}
      <Section
        title={`Features & RICE Scoring (${sortedFeatures.length})`}
        icon={Zap}
        expanded={expandedSections.features}
        onToggle={() => toggleSection('features')}
      >
        <div className="space-y-3">
          {sortedFeatures.map((feature: any, i: number) => (
            <Card key={i} className="border">
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{feature.id}</Badge>
                      <h4 className="font-semibold">{feature.name}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                  </div>
                  <Badge className={cn(
                    "ml-2",
                    feature.priority === 'must-have' && 'bg-red-600',
                    feature.priority === 'should-have' && 'bg-yellow-600',
                    feature.priority === 'nice-to-have' && 'bg-green-600'
                  )}>
                    {feature.priority}
                  </Badge>
                </div>

                <div className="grid grid-cols-5 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Reach</p>
                    <p className="font-semibold">{feature.reach}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Impact</p>
                    <p className="font-semibold">{feature.impact}/5</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Confidence</p>
                    <p className="font-semibold">{feature.confidence}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Effort</p>
                    <p className="font-semibold">{feature.effort}w</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">RICE</p>
                    <p className="font-bold text-primary">{feature.riceScore?.toFixed(1)}</p>
                  </div>
                </div>

                {feature.acceptanceCriteria && feature.acceptanceCriteria.length > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Acceptance Criteria:</p>
                    <div className="space-y-2">
                      {feature.acceptanceCriteria.map((ac: any, j: number) => (
                        <div key={j} className="text-xs bg-muted p-2 rounded">
                          <p><span className="font-medium">Given:</span> {ac.given}</p>
                          <p><span className="font-medium">When:</span> {ac.when}</p>
                          <p><span className="font-medium">Then:</span> {ac.then}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Tech Stack */}
      <Section
        title="Tech Stack"
        icon={Code}
        expanded={expandedSections.techStack}
        onToggle={() => toggleSection('techStack')}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(plan.techStack || {}).map(([category, data]: [string, any]) => (
            <Card key={category} className="border">
              <CardContent className="pt-4 space-y-2">
                <p className="text-sm font-medium capitalize">{category}</p>
                <p className="font-semibold text-primary">
                  {data.framework || data.type || data.provider || data.platform || 'N/A'}
                </p>
                <p className="text-xs text-muted-foreground">{data.justification}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Success Metrics */}
      <Section
        title="Success Metrics"
        icon={Target}
        expanded={expandedSections.metrics}
        onToggle={() => toggleSection('metrics')}
      >
        <div className="space-y-3">
          {Array.isArray(plan.successMetrics) && plan.successMetrics.map((metric: any, i: number) => (
            <Card key={i} className="border">
              <CardContent className="pt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{metric.category}</Badge>
                  <h4 className="font-semibold">{metric.metric}</h4>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Target</p>
                    <p className="font-medium">{metric.target}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Benchmark</p>
                    <p className="font-medium">{metric.industryBenchmark}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Measured by: {metric.measuredBy}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Timeline */}
      <Section
        title={`Timeline (${timeline.totalWeeks || 12} weeks)`}
        icon={Calendar}
        expanded={expandedSections.timeline}
        onToggle={() => toggleSection('timeline')}
      >
        <div className="space-y-3">
          {timeline.phases?.map((phase: any, i: number) => (
            <Card key={i} className="border">
              <CardContent className="pt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{phase.phase}</h4>
                  <Badge variant="outline">Week {phase.week}</Badge>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Milestones:</p>
                  <ul className="text-sm space-y-1 mt-1">
                    {phase.milestones?.map((m: string, j: number) => (
                      <li key={j} className="flex gap-2">
                        <span>•</span>
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
                {phase.dependencies && phase.dependencies.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Dependencies: {phase.dependencies.join(', ')}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Out of Scope */}
      <Section
        title={`Out of Scope (${outOfScope.length})`}
        icon={XCircle}
        expanded={expandedSections.outOfScope}
        onToggle={() => toggleSection('outOfScope')}
      >
        <div className="space-y-2">
          {outOfScope.map((item: any, i: number) => (
            <Card key={i} className="border">
              <CardContent className="pt-3 pb-3">
                <p className="font-medium text-sm">{item.feature}</p>
                <p className="text-xs text-muted-foreground mt-1">Reason: {item.reason}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Risks */}
      <Section
        title={`Risks & Mitigation (${risks.length})`}
        icon={AlertTriangle}
        expanded={expandedSections.risks}
        onToggle={() => toggleSection('risks')}
      >
        <div className="space-y-2">
          {risks.map((risk: any, i: number) => (
            <Card key={i} className="border">
              <CardContent className="pt-3 pb-3 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">{risk.risk}</p>
                  <Badge className={cn(
                    risk.impact === 'high' && 'bg-red-600',
                    risk.impact === 'medium' && 'bg-yellow-600',
                    risk.impact === 'low' && 'bg-green-600'
                  )}>
                    {risk.impact} impact
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium">Mitigation:</span> {risk.mitigation}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}
