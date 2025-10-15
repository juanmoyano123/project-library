'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Plus, X, CheckCircle2 } from 'lucide-react';
import { ProjectStage, ChecklistItem } from '@/lib/types';
import { getChecklistForStage } from '@/lib/stage-checklists';
import { nanoid } from 'nanoid';
import { cn } from '@/lib/utils';

interface StageChecklistProps {
  projectId: string;
  currentStage: ProjectStage;
  onChecklistChange?: (items: ChecklistItem[]) => void;
}

export function StageChecklist({ projectId, currentStage, onChecklistChange }: StageChecklistProps) {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);

  // Initialize checklist when stage changes
  useEffect(() => {
    loadChecklistForStage();
  }, [currentStage, projectId]);

  const loadChecklistForStage = () => {
    // Load from localStorage
    const storageKey = `checklist-${projectId}-${currentStage}`;
    const saved = localStorage.getItem(storageKey);

    if (saved) {
      const savedItems = JSON.parse(saved);
      setItems(savedItems);
    } else {
      // Initialize with template
      const template = getChecklistForStage(currentStage);
      const templateItems: ChecklistItem[] = template.tasks.map(task => ({
        id: nanoid(),
        text: task,
        completed: false,
        isCustom: false,
      }));
      setItems(templateItems);
      saveToStorage(templateItems);
    }
  };

  const saveToStorage = (updatedItems: ChecklistItem[]) => {
    const storageKey = `checklist-${projectId}-${currentStage}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedItems));
    onChecklistChange?.(updatedItems);
  };

  const toggleItem = (id: string) => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setItems(updatedItems);
    saveToStorage(updatedItems);
  };

  const addCustomTask = () => {
    if (!newTaskText.trim()) return;

    const newItem: ChecklistItem = {
      id: nanoid(),
      text: newTaskText.trim(),
      completed: false,
      isCustom: true,
    };

    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    saveToStorage(updatedItems);
    setNewTaskText('');
    setShowAddTask(false);
  };

  const removeItem = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    saveToStorage(updatedItems);
  };

  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const template = getChecklistForStage(currentStage);

  return (
    <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-card via-card to-primary/5">
      <CardHeader className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 blur-3xl rounded-full" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-base font-bold">Checklist - {template.name}</CardTitle>
          </div>
          <CardDescription className="font-medium">
            {completedCount} de {totalCount} completadas ({Math.round(progressPercentage)}%)
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Progress value={progressPercentage} className="h-3 shadow-inner" />
          <div
            className="absolute top-0 left-0 h-3 rounded-full bg-gradient-to-r from-primary via-secondary to-accent transition-all"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
          {items.map(item => (
            <div
              key={item.id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg border-2 transition-all group",
                item.completed
                  ? "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800"
                  : "bg-card hover:bg-accent/5 border-transparent hover:border-primary/20 hover:shadow-md"
              )}
            >
              <Checkbox
                id={item.id}
                checked={item.completed}
                onCheckedChange={() => toggleItem(item.id)}
                className="mt-0.5"
              />
              <label
                htmlFor={item.id}
                className={cn(
                  "flex-1 text-sm cursor-pointer font-medium transition-all",
                  item.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                )}
              >
                {item.text}
              </label>
              {item.isCustom && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(item.id)}
                  className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {showAddTask ? (
          <div className="flex gap-2 p-3 bg-primary/5 rounded-lg border-2 border-primary/20">
            <Input
              placeholder="Nueva tarea..."
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') addCustomTask();
                if (e.key === 'Escape') {
                  setShowAddTask(false);
                  setNewTaskText('');
                }
              }}
              className="border-2 focus:border-primary"
              autoFocus
            />
            <Button
              size="sm"
              onClick={addCustomTask}
              className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg"
            >
              Agregar
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setShowAddTask(false);
                setNewTaskText('');
              }}
            >
              Cancelar
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddTask(true)}
            className="w-full border-2 border-dashed border-primary/30 hover:border-primary hover:bg-primary/5 hover:shadow-md transition-all"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar tarea personalizada
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
