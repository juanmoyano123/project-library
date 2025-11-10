'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import { IdeaAnalyzerForm, type IdeaAnalysis } from '@/components/ideas/idea-analyzer-form';
import { IdeaAnalysisResult } from '@/components/ideas/idea-analysis-result';
import { IdeasDashboard } from '@/components/ideas/ideas-dashboard';
import { Idea } from '@/lib/types';
import { nanoid } from 'nanoid';

type ViewMode = 'dashboard' | 'analyze' | 'result';

export default function IdeasPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [currentAnalysis, setCurrentAnalysis] = useState<IdeaAnalysis | null>(null);
  const [currentRawIdea, setCurrentRawIdea] = useState<string>('');
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Para recargar el dashboard

  const handleAnalysisComplete = (analysis: IdeaAnalysis, rawIdea: string) => {
    setCurrentAnalysis(analysis);
    setCurrentRawIdea(rawIdea);
    setViewMode('result');
  };

  const handleApprove = async (analysis: IdeaAnalysis) => {
    // Generate unique ID
    const ideaId = `IDEA-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`;

    // Build Idea object
    const idea: Idea = {
      id: ideaId,
      problema: analysis.problema,
      mercadoObjetivo: analysis.mercadoObjetivo,
      urgencia: analysis.urgencia,
      tamañoMercado: analysis.tamañoMercado,
      evidenciaDemanda: analysis.evidenciaDemanda,
      solucion: analysis.solucion,
      herramientasDisponibles: analysis.herramientasDisponibles,
      integracionesNecesarias: analysis.integracionesNecesarias,
      informacionRequerida: analysis.informacionRequerida,
      complejidadTecnica: analysis.complejidadTecnica,
      skillsRequeridos: analysis.skillsRequeridos,
      tiempoEstimado: analysis.tiempoEstimado,
      bloqueadores: analysis.bloqueadores,
      categoria: analysis.categoria,
      tags: analysis.tags,
      notas: `Idea original: ${currentRawIdea}`,
      favorita: false,
      createdAt: new Date().toISOString(),
    };

    // Save to API
    console.log('💾 Guardando idea:', idea);

    const response = await fetch('/api/ideas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(idea),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al guardar');
    }

    console.log('✅ Idea guardada exitosamente');

    // Reset and go back to dashboard
    setCurrentAnalysis(null);
    setCurrentRawIdea('');
    setRefreshTrigger(prev => prev + 1); // Trigger refresh del dashboard
    setViewMode('dashboard');
  };

  const handleRegenerate = () => {
    setViewMode('analyze');
  };

  const handleViewIdea = (idea: Idea) => {
    setSelectedIdea(idea);
    // Aquí podrías mostrar un modal o página de detalle
    console.log('Ver idea:', idea);
  };

  return (
    <div className="min-h-screen bg-[#FFFCF0] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" className="border-2 border-black">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>

          {viewMode !== 'dashboard' && (
            <Button
              variant="outline"
              onClick={() => setViewMode('dashboard')}
              className="border-2 border-black"
            >
              Ver Dashboard
            </Button>
          )}
        </div>

        {/* Main Content */}
        {viewMode === 'dashboard' && (
          <IdeasDashboard
            onNewIdea={() => setViewMode('analyze')}
            onViewIdea={handleViewIdea}
            refreshTrigger={refreshTrigger}
          />
        )}

        {viewMode === 'analyze' && (
          <div className="max-w-4xl mx-auto">
            <IdeaAnalyzerForm
              onAnalysisComplete={handleAnalysisComplete}
              onCancel={() => setViewMode('dashboard')}
            />
          </div>
        )}

        {viewMode === 'result' && currentAnalysis && (
          <div className="max-w-5xl mx-auto">
            <IdeaAnalysisResult
              analysis={currentAnalysis}
              rawIdea={currentRawIdea}
              onApprove={handleApprove}
              onRegenerate={handleRegenerate}
            />
          </div>
        )}
      </div>
    </div>
  );
}
