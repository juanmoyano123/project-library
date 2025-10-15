'use client';

import { useState } from 'react';
import { Prompt, STAGE_NAMES } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Trash2, Calendar, Sparkles, FileText, Save, Edit2 } from 'lucide-react';

interface PromptDisplayTabsProps {
  prompt: Prompt;
  onDelete: (id: string) => void;
  onCopy: (text: string) => void;
  onUpdateNotes?: (promptId: string, notes: string) => void;
}

export function PromptDisplayTabs({ prompt, onDelete, onCopy, onUpdateNotes }: PromptDisplayTabsProps) {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(prompt.executionNotes || '');

  const handleSaveNotes = () => {
    if (onUpdateNotes) {
      onUpdateNotes(prompt.id, notes);
      setIsEditingNotes(false);
    }
  };

  return (
    <Card className="border-2 shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="font-semibold">
                Etapa {prompt.stage}: {STAGE_NAMES[prompt.stage]}
              </Badge>
              {prompt.improvedPrompt && (
                <Badge variant="secondary" className="gap-1">
                  <Sparkles className="h-3 w-3" />
                  Mejorado por Claude
                </Badge>
              )}
              {prompt.executionNotes && (
                <Badge className="gap-1 bg-gradient-to-r from-amber-500 to-orange-500">
                  <FileText className="h-3 w-3" />
                  Con notas
                </Badge>
              )}
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(prompt.timestamp).toLocaleString('es-ES')}
              </span>
              {prompt.tokens && (
                <Badge variant="outline" className="text-xs">
                  {prompt.tokens} tokens
                </Badge>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(prompt.id)}
            className="hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="plan" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="original">Original</TabsTrigger>
            <TabsTrigger value="improved" disabled={!prompt.improvedPrompt}>
              Mejorado {!prompt.improvedPrompt && '(N/A)'}
            </TabsTrigger>
            <TabsTrigger value="plan">Plan</TabsTrigger>
            <TabsTrigger value="notes" className="relative">
              Notas
              {prompt.executionNotes && (
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-amber-500 rounded-full" />
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="original" className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Prompt Original:</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCopy(prompt.originalPrompt)}
              >
                <Copy className="h-3 w-3 mr-1" />
                Copiar
              </Button>
            </div>
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm whitespace-pre-wrap">{prompt.originalPrompt}</p>
            </div>
          </TabsContent>

          <TabsContent value="improved" className="space-y-2">
            {prompt.improvedPrompt ? (
              <>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">Prompt Mejorado por Claude:</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onCopy(prompt.improvedPrompt!)}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copiar
                  </Button>
                </div>
                <div className="bg-primary/5 border border-primary/20 p-3 rounded-md">
                  <p className="text-sm whitespace-pre-wrap">{prompt.improvedPrompt}</p>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Este prompt no fue mejorado por Claude</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="plan" className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Plan de Claude Code:</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCopy(prompt.claudePlan)}
              >
                <Copy className="h-3 w-3 mr-1" />
                Copiar
              </Button>
            </div>
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm whitespace-pre-wrap">{prompt.claudePlan}</p>
            </div>
          </TabsContent>

          <TabsContent value="notes" className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Notas de Ejecución:</Label>
              {!isEditingNotes && onUpdateNotes && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingNotes(true)}
                >
                  <Edit2 className="h-3 w-3 mr-1" />
                  {prompt.executionNotes ? 'Editar' : 'Agregar notas'}
                </Button>
              )}
            </div>

            {isEditingNotes ? (
              <div className="space-y-3">
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Documenta cómo fue la ejecución del plan:
- ¿Funcionó como se esperaba?
- ¿Hubo que hacer iteraciones?
- ¿Qué problemas surgieron?
- ¿Qué se aprendió?"
                  className="min-h-[150px] border-2 focus:border-amber-500"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSaveNotes}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                  >
                    <Save className="h-3 w-3 mr-1" />
                    Guardar Notas
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsEditingNotes(false);
                      setNotes(prompt.executionNotes || '');
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                {prompt.executionNotes ? (
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-2 border-amber-200 dark:border-amber-800 p-4 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">{prompt.executionNotes}</p>
                    {prompt.notesUpdatedAt && (
                      <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-amber-200 dark:border-amber-800">
                        Última actualización: {new Date(prompt.notesUpdatedAt).toLocaleString('es-ES')}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p className="font-medium mb-1">Sin notas de ejecución</p>
                    <p className="text-sm">Documenta cómo fue la implementación de este plan</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
