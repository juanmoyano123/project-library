'use client';

import { use, useEffect, useState } from 'react';
import { useProject } from '@/hooks/use-projects';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft } from 'lucide-react';
import { PromptWorkflow } from '@/components/projects/prompt-workflow';
import { PromptDisplayTabs } from '@/components/projects/prompt-display-tabs';
import { ProjectSidebar } from '@/components/projects/project-sidebar';
import { ToolsHub } from '@/components/tools/tools-hub';
import { ValidationForm } from '@/components/validator/validation-form';
import { ValidationResult } from '@/components/validator/validation-result';
import { ValidationList } from '@/components/validator/validation-list';
import { ProductPlanForm } from '@/components/product-manager/product-plan-form';
import { ProductPlanResult } from '@/components/product-manager/product-plan-result';
import { ProductPlanList } from '@/components/product-manager/product-plan-list';
import { FeaturesDashboard } from '@/components/features/features-dashboard';
import { Validation, ProductPlan as ProductPlanType } from '@/lib/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

type ViewType = 'prompts' | 'tools' | 'validator' | 'prd' | 'features';

export default function ProjectDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { project, loading, addPrompt, deletePrompt, updateProjectStage, updatePromptNotes } = useProject(id);
  const [activeView, setActiveView] = useState<ViewType>('prompts');
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [showValidationForm, setShowValidationForm] = useState(true);
  const [selectedValidation, setSelectedValidation] = useState<Validation | null>(null);
  const [showPrdForm, setShowPrdForm] = useState(true);
  const [selectedPrd, setSelectedPrd] = useState<ProductPlanType | null>(null);

  const handleSavePrompt = async (data: {
    originalPrompt: string;
    improvedPrompt: string | null;
    claudePlan: string;
  }) => {
    if (project) {
      await addPrompt({
        ...data,
        stage: project.currentStage,
      });
      setShowWorkflow(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleValidationComplete = (validation: Validation) => {
    setSelectedValidation(validation);
    setShowValidationForm(false);
  };

  const handleValidationClick = (validation: Validation) => {
    setSelectedValidation(validation);
    setShowValidationForm(false);
  };

  const handleNewValidation = () => {
    setSelectedValidation(null);
    setShowValidationForm(true);
  };

  const handlePrdGenerated = (plan: ProductPlanType) => {
    setSelectedPrd(plan);
    setShowPrdForm(false);
  };

  const handlePrdClick = (plan: ProductPlanType) => {
    setSelectedPrd(plan);
    setShowPrdForm(false);
  };

  const handleNewPrd = () => {
    setSelectedPrd(null);
    setShowPrdForm(true);
  };

  const handleValidationApproved = () => {
    // Cambiar a la vista del Product Manager cuando se aprueba una validación
    setActiveView('prd');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-muted-foreground">Cargando proyecto...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-2">Proyecto no encontrado</h2>
          <Link href="/projects">
            <Button variant="outline">Volver a proyectos</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Neo-Brutalism Style */}
      <div className="border-b-4 border-black bg-white sticky top-0 z-10 neo-shadow">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/projects">
                <Button className="bg-white hover:bg-[hsl(0,0%,95%)] text-black border-4 border-black neo-shadow-sm font-black uppercase tracking-wide transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
              </Link>
              <div>
                <h1 className="text-4xl font-black text-black uppercase tracking-tight">{project.name}</h1>
                <p className="text-base text-black font-bold mt-2 bg-[hsl(60,100%,50%)] inline-block px-3 py-1 neo-border-sm">{project.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-[280px_1fr] gap-6">
          {/* Left Sidebar */}
          <aside>
            <ProjectSidebar
              activeView={activeView}
              onViewChange={setActiveView}
              promptCount={project.prompts.length}
              projectName={project.name}
            />
          </aside>

          {/* Main Content Area */}
          <main>
            <Card className="neo-card min-h-[600px] bg-white">
              <CardContent className="p-6">
                {/* Prompts View */}
                {activeView === 'prompts' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-4xl font-black text-black uppercase tracking-tight">Historial de Prompts</h2>
                        <CardDescription className="mt-2 text-base font-bold text-black">
                          Cronología de todos los prompts y respuestas del proyecto
                        </CardDescription>
                      </div>
                      {!showWorkflow && (
                        <Button
                          onClick={() => setShowWorkflow(true)}
                          className="bg-[hsl(0,100%,60%)] hover:bg-[hsl(0,100%,55%)] text-white neo-shadow-sm font-black uppercase text-base px-6 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]"
                        >
                          + Nuevo Prompt
                        </Button>
                      )}
                    </div>

                    {showWorkflow && (
                      <PromptWorkflow
                        onSave={handleSavePrompt}
                        onCancel={() => setShowWorkflow(false)}
                        projectStatus={project.status}
                        currentStage={project.currentStage}
                        tags={project.tags}
                        createdAt={project.createdAt}
                        promptCount={project.prompts.length}
                        onStageChange={updateProjectStage}
                      />
                    )}

                    {!showWorkflow && (
                      <ScrollArea className="h-[calc(100vh-300px)]">
                        <div className="space-y-4 pr-4">
                          {project.prompts.length === 0 ? (
                            <div className="text-center py-20 text-muted-foreground">
                              <p className="text-lg font-medium mb-2">No hay prompts aún</p>
                              <p className="text-sm">Agrega el primero con el botón de arriba</p>
                            </div>
                          ) : (
                            project.prompts.map((prompt) => (
                              <PromptDisplayTabs
                                key={prompt.id}
                                prompt={prompt}
                                onDelete={deletePrompt}
                                onCopy={handleCopy}
                                onUpdateNotes={updatePromptNotes}
                              />
                            ))
                          )}
                        </div>
                      </ScrollArea>
                    )}
                  </div>
                )}

                {/* Tools View */}
                {activeView === 'tools' && (
                  <div className="space-y-6">
                    <ToolsHub />
                  </div>
                )}

                {/* Validator View */}
                {activeView === 'validator' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-4xl font-black text-black uppercase tracking-tight">
                          Validador de Ideas
                        </h2>
                        <CardDescription className="mt-2 text-base font-bold text-black">
                          Analiza la viabilidad de tus ideas de negocio con IA
                        </CardDescription>
                      </div>
                      {!showValidationForm && !selectedValidation && (
                        <Button
                          onClick={handleNewValidation}
                          className="bg-[hsl(0,100%,60%)] hover:bg-[hsl(0,100%,55%)] text-white neo-shadow-sm font-black uppercase text-base px-6 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]"
                        >
                          + Nueva Validación
                        </Button>
                      )}
                    </div>

                    {showValidationForm && !selectedValidation && (
                      <ValidationForm
                        projectId={id}
                        onValidationComplete={handleValidationComplete}
                        onCancel={() => setShowValidationForm(false)}
                      />
                    )}

                    {selectedValidation && (
                      <div className="space-y-4">
                        <Button
                          variant="outline"
                          onClick={handleNewValidation}
                          className="mb-4"
                        >
                          ← Ver todas las validaciones
                        </Button>
                        <ValidationResult
                          validation={selectedValidation}
                          onApproved={handleValidationApproved}
                        />
                      </div>
                    )}

                    {!showValidationForm && !selectedValidation && (
                      <ScrollArea className="h-[calc(100vh-300px)]">
                        <div className="pr-4">
                          <ValidationList
                            projectId={id}
                            onValidationClick={handleValidationClick}
                          />
                        </div>
                      </ScrollArea>
                    )}
                  </div>
                )}

                {/* Product Manager (PRD) View */}
                {activeView === 'prd' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-4xl font-black text-black uppercase tracking-tight">
                          Product Manager
                        </h2>
                        <CardDescription className="mt-2 text-base font-bold text-black">
                          Genera PRDs profesionales desde validaciones exitosas
                        </CardDescription>
                      </div>
                      {!showPrdForm && !selectedPrd && (
                        <Button
                          onClick={handleNewPrd}
                          className="bg-[hsl(0,100%,60%)] hover:bg-[hsl(0,100%,55%)] text-white neo-shadow-sm font-black uppercase text-base px-6 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]"
                        >
                          + Nuevo PRD
                        </Button>
                      )}
                    </div>

                    {showPrdForm && !selectedPrd && (
                      <ProductPlanForm
                        projectId={id}
                        onPlanGenerated={handlePrdGenerated}
                        onCancel={() => setShowPrdForm(false)}
                      />
                    )}

                    {selectedPrd && (
                      <div className="space-y-4">
                        <Button
                          variant="outline"
                          onClick={handleNewPrd}
                          className="mb-4"
                        >
                          ← Ver todos los PRDs
                        </Button>
                        <ProductPlanResult plan={selectedPrd} />
                      </div>
                    )}

                    {!showPrdForm && !selectedPrd && (
                      <ScrollArea className="h-[calc(100vh-300px)]">
                        <div className="pr-4">
                          <ProductPlanList
                            projectId={id}
                            onPlanClick={handlePrdClick}
                          />
                        </div>
                      </ScrollArea>
                    )}
                  </div>
                )}

                {/* Features Dashboard View */}
                {activeView === 'features' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-4xl font-black text-black uppercase tracking-tight">
                        Features Dashboard
                      </h2>
                      <CardDescription className="mt-2 text-base font-bold text-black">
                        Gestiona tus features con Kanban, Gantt y vistas de lista
                      </CardDescription>
                    </div>

                    <FeaturesDashboard projectId={id} />
                  </div>
                )}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}
