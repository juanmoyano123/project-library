'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Sparkles, FileEdit } from 'lucide-react';
import { Validation } from '@/lib/types';
import { ManualValidationForm } from './manual-validation-form';

interface ValidationFormProps {
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

export function ValidationForm({ projectId, onValidationComplete, onCancel }: ValidationFormProps) {
  const [rawIdea, setRawIdea] = useState('');
  const [targetMarket, setTargetMarket] = useState('LATAM');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rawIdea.trim()) {
      setError('Por favor describe tu idea');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Call API to validate idea
      const response = await fetch('/api/validate-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          rawIdea: rawIdea.trim(),
          targetMarket,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al validar la idea');
      }

      const validation = await response.json();
      onValidationComplete(validation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tabs defaultValue="ai" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="ai" className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          Validación con IA
        </TabsTrigger>
        <TabsTrigger value="manual" className="flex items-center gap-2">
          <FileEdit className="h-4 w-4" />
          Validación Manual
        </TabsTrigger>
      </TabsList>

      {/* AI Validation Tab */}
      <TabsContent value="ai">
        <Card className="border-2 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Nueva Validación con IA
            </CardTitle>
            <CardDescription>
              Describe tu idea y te ayudaremos a validar su viabilidad para el mercado seleccionado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Idea Input */}
              <div className="space-y-2">
                <Label htmlFor="idea">
                  Describe tu idea o problema a resolver
                </Label>
                <Textarea
                  id="idea"
                  placeholder="Ej: Una app para que barberos gestionen turnos y cobros online, enfocada en Argentina donde muchos barberos aún usan WhatsApp y cuadernos..."
                  value={rawIdea}
                  onChange={(e) => setRawIdea(e.target.value)}
                  className="min-h-[150px]"
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  Sé específico: ¿Qué problema resuelve? ¿Para quién? ¿Por qué ahora?
                </p>
              </div>

              {/* Market Selector */}
              <div className="space-y-2">
                <Label htmlFor="market">Mercado objetivo</Label>
                <Select value={targetMarket} onValueChange={setTargetMarket} disabled={loading}>
                  <SelectTrigger id="market">
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
                <p className="text-xs text-muted-foreground">
                  Analizaremos competencia, barreras y oportunidades específicas del mercado
                </p>
              </div>

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
                  disabled={loading || !rawIdea.trim()}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analizando idea...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Validar Idea
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
                    Esto puede tomar 30-60 segundos mientras Claude analiza tu idea...
                  </p>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Manual Validation Tab */}
      <TabsContent value="manual">
        <ManualValidationForm
          projectId={projectId}
          onValidationComplete={onValidationComplete}
          onCancel={onCancel}
        />
      </TabsContent>
    </Tabs>
  );
}
