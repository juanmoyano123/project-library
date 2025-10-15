'use client';

import { use, useEffect, useState } from 'react';
import { useProject } from '@/hooks/use-projects';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Calendar, CheckCircle2, Circle, Clock, AlertCircle, StickyNote } from 'lucide-react';
import { STAGE_NAMES, ProjectPlan, TaskStatus } from '@/lib/types';
import { PromptWorkflow } from '@/components/projects/prompt-workflow';
import { PromptDisplayTabs } from '@/components/projects/prompt-display-tabs';
import { ProjectSidebar } from '@/components/projects/project-sidebar';
import { OverviewAnalyzer } from '@/components/planner/overview-analyzer';
import { plannerStorage } from '@/lib/planner-storage';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

type ViewType = 'prompts' | 'planner';

export default function ProjectDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { project, loading, addPrompt, deletePrompt, updateProjectStage, updatePromptNotes } = useProject(id);
  const [activeView, setActiveView] = useState<ViewType>('prompts');
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [plan, setPlan] = useState<ProjectPlan | null>(null);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  useEffect(() => {
    if (id) {
      const savedPlan = plannerStorage.get(id);
      setPlan(savedPlan);
    }
  }, [id]);

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

  const handlePlanGenerated = (newPlan: ProjectPlan) => {
    plannerStorage.save(newPlan);
    setPlan(newPlan);
  };

  const handleTaskStatusChange = (taskId: string, newStatus: TaskStatus) => {
    if (!plan) return;

    const updatedPlan = {
      ...plan,
      updatedAt: new Date().toISOString(),
      stages: plan.stages.map((stage) => ({
        ...stage,
        tasks: stage.tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status: newStatus,
                completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined,
              }
            : task
        ),
      })),
    };

    plannerStorage.save(updatedPlan);
    setPlan(updatedPlan);
  };

  const handleSaveNotes = (taskId: string) => {
    if (!plan) return;

    const updatedPlan = {
      ...plan,
      updatedAt: new Date().toISOString(),
      stages: plan.stages.map((stage) => ({
        ...stage,
        tasks: stage.tasks.map((task) =>
          task.id === taskId ? { ...task, notes: tempNotes } : task
        ),
      })),
    };

    plannerStorage.save(updatedPlan);
    setPlan(updatedPlan);
    setEditingNotes(null);
    setTempNotes('');
  };

  const getTaskCounts = () => {
    if (!plan) return { total: 0, completed: 0, inProgress: 0, blocked: 0 };

    const allTasks = plan.stages.flatMap((s) => s.tasks);
    return {
      total: allTasks.length,
      completed: allTasks.filter((t) => t.status === 'completed').length,
      inProgress: allTasks.filter((t) => t.status === 'in-progress').length,
      blocked: allTasks.filter((t) => t.status === 'blocked').length,
    };
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'blocked':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300';
      case 'low':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-300';
    }
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

  const counts = getTaskCounts();
  const progress = counts.total > 0 ? (counts.completed / counts.total) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header - HIGH CONTRAST */}
      <div className="border-b-2 border-light-blue/30 gradient-hero backdrop-blur-sm sticky top-0 z-10 shadow-lg">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/projects">
                <Button className="bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 font-semibold">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-white drop-shadow-lg">{project.name}</h1>
                <p className="text-base text-mint-green font-semibold mt-1">{project.description}</p>
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
            <Card className="border-2 border-light-blue/40 shadow-xl min-h-[600px] bg-white dark:bg-card">
              <CardContent className="p-6">
                {/* Prompts View */}
                {activeView === 'prompts' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-3xl font-bold text-federal-blue dark:text-mint-green">Historial de Prompts</h2>
                        <CardDescription className="mt-2 text-base font-medium text-marian-blue dark:text-light-blue">
                          Cronología de todos los prompts y respuestas del proyecto
                        </CardDescription>
                      </div>
                      {!showWorkflow && (
                        <Button
                          onClick={() => setShowWorkflow(true)}
                          className="bg-marian-blue hover:bg-federal-blue text-white shadow-lg hover:shadow-xl font-bold text-base px-6"
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

                {/* Planner View */}
                {activeView === 'planner' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-3xl font-bold text-federal-blue dark:text-mint-green">Planificador</h2>
                      <CardDescription className="mt-2 text-base font-medium text-marian-blue dark:text-light-blue">
                        Genera un plan completo basado en el overview del proyecto
                      </CardDescription>
                    </div>

                    {!plan ? (
                      <OverviewAnalyzer
                        projectId={id}
                        projectName={project.name}
                        tags={project.tags}
                        initialOverview={project.overview}
                        onPlanGenerated={handlePlanGenerated}
                      />
                    ) : (
                      <ScrollArea className="h-[calc(100vh-300px)]">
                        <div className="space-y-6 pr-4">
                          {/* Summary Stats */}
                          <Card className="border-2 shadow-lg bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 dark:from-blue-950/30 dark:via-cyan-950/30 dark:to-blue-900/30">
                            <CardContent className="p-6 space-y-4">
                              <h3 className="font-bold text-lg">Progreso General</h3>
                              <div className="flex justify-between items-center text-sm">
                                <span>Progreso total</span>
                                <span className="font-medium">
                                  {counts.completed} / {counts.total} tareas ({Math.round(progress)}%)
                                </span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div
                                  className="bg-green-500 h-2 rounded-full transition-all"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                              <div className="grid grid-cols-3 gap-4 pt-2">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-blue-500" />
                                  <span className="text-sm">{counts.inProgress} en progreso</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  <span className="text-sm">{counts.completed} completadas</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <AlertCircle className="h-4 w-4 text-red-500" />
                                  <span className="text-sm">{counts.blocked} bloqueadas</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Tasks by Stage */}
                          {plan.stages.map((stage) => {
                            const stageTasks = stage.tasks;
                            const stageCompleted = stageTasks.filter((t) => t.status === 'completed').length;
                            const stageProgress = stageTasks.length > 0
                              ? (stageCompleted / stageTasks.length) * 100
                              : 0;

                            return (
                              <Card key={stage.id} className="border-2 shadow-md hover:shadow-lg transition-shadow">
                                <CardContent className="p-6 space-y-4">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <h3 className="text-lg font-bold">
                                        Etapa {stage.stage}: {STAGE_NAMES[stage.stage]}
                                      </h3>
                                      <p className="text-sm text-muted-foreground mt-1">
                                        {stageCompleted} / {stageTasks.length} tareas completadas
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-4 w-4 text-muted-foreground" />
                                      <span className="text-sm text-muted-foreground">
                                        ~{stage.estimatedDuration} días
                                      </span>
                                    </div>
                                  </div>
                                  <div className="w-full bg-muted rounded-full h-1.5">
                                    <div
                                      className="bg-green-500 h-1.5 rounded-full transition-all"
                                      style={{ width: `${stageProgress}%` }}
                                    />
                                  </div>

                                  <div className="space-y-3">
                                    {stageTasks.map((task) => (
                                      <div
                                        key={task.id}
                                        className={cn(
                                          'border rounded-lg p-4 space-y-3 transition-colors',
                                          task.status === 'completed' && 'bg-muted/50'
                                        )}
                                      >
                                        {/* Task content remains the same */}
                                        <div className="flex items-start gap-3">
                                          <input
                                            type="checkbox"
                                            checked={task.status === 'completed'}
                                            onChange={(e) =>
                                              handleTaskStatusChange(
                                                task.id,
                                                e.target.checked ? 'completed' : 'pending'
                                              )
                                            }
                                            className="mt-1"
                                          />
                                          <div className="flex-1 space-y-2">
                                            <div className="flex items-start justify-between gap-2">
                                              <h4
                                                className={cn(
                                                  'font-medium',
                                                  task.status === 'completed' && 'line-through text-muted-foreground'
                                                )}
                                              >
                                                {task.title}
                                              </h4>
                                              <div className="flex items-center gap-2 flex-shrink-0">
                                                <span
                                                  className={cn(
                                                    'text-xs px-2 py-0.5 rounded-md font-medium',
                                                    getPriorityColor(task.priority)
                                                  )}
                                                >
                                                  {task.priority}
                                                </span>
                                                {task.estimatedDays && (
                                                  <span className="text-xs text-muted-foreground">
                                                    {task.estimatedDays}d
                                                  </span>
                                                )}
                                              </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                              {task.description}
                                            </p>

                                            <div className="flex items-center gap-2 flex-wrap">
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                  handleTaskStatusChange(
                                                    task.id,
                                                    task.status === 'in-progress' ? 'pending' : 'in-progress'
                                                  )
                                                }
                                              >
                                                {getStatusIcon(task.status)}
                                                <span className="ml-2 text-xs capitalize">{task.status}</span>
                                              </Button>

                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                  setEditingNotes(task.id);
                                                  setTempNotes(task.notes);
                                                }}
                                              >
                                                <StickyNote className="h-3 w-3 mr-1" />
                                                Notas
                                              </Button>
                                            </div>

                                            {editingNotes === task.id && (
                                              <div className="space-y-2 pt-2">
                                                <Textarea
                                                  value={tempNotes}
                                                  onChange={(e) => setTempNotes(e.target.value)}
                                                  placeholder="Agrega notas sobre esta tarea..."
                                                  className="min-h-[80px]"
                                                />
                                                <div className="flex gap-2">
                                                  <Button size="sm" onClick={() => handleSaveNotes(task.id)}>
                                                    Guardar
                                                  </Button>
                                                  <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => {
                                                      setEditingNotes(null);
                                                      setTempNotes('');
                                                    }}
                                                  >
                                                    Cancelar
                                                  </Button>
                                                </div>
                                              </div>
                                            )}

                                            {task.notes && editingNotes !== task.id && (
                                              <div className="text-sm bg-muted p-2 rounded-md">
                                                <p className="text-muted-foreground">{task.notes}</p>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}

                          <div className="flex justify-end">
                            <Button
                              variant="outline"
                              onClick={() => {
                                plannerStorage.delete(id);
                                setPlan(null);
                              }}
                            >
                              Regenerar Plan
                            </Button>
                          </div>
                        </div>
                      </ScrollArea>
                    )}
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
