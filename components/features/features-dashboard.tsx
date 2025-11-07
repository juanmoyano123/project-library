'use client';

import { useState, useEffect } from 'react';
import { Feature } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { KanbanBoard } from './kanban-board';
import { GanttView } from './gantt-view';
import { FeaturesList } from './features-list';
import { FeatureDetailModal } from './feature-detail-modal';
import { MetricsGrid } from '../charts/metrics-grid';
import { FeatureFiltersPanel, applyFeatureFilters, FeatureFilters } from './feature-filters';
import { exportDashboardToPDF, exportMetricsToPDF } from '@/lib/export-pdf';
import { Kanban, Calendar, List, RefreshCw, BarChart3, Download } from 'lucide-react';

interface FeaturesDashboardProps {
  projectId: string;
  planId?: string;
}

export function FeaturesDashboard({ projectId, planId }: FeaturesDashboardProps) {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [activeTab, setActiveTab] = useState('kanban');
  const [filters, setFilters] = useState<FeatureFilters>({});

  const fetchFeatures = async () => {
    setLoading(true);
    try {
      const query = planId ? `planId=${planId}` : `projectId=${projectId}`;
      const response = await fetch(`/api/features?${query}`);
      if (!response.ok) throw new Error('Failed to fetch features');
      const data = await response.json();
      setFeatures(data);
    } catch (error) {
      console.error('Error fetching features:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, [projectId, planId]);

  const handleStatusChange = async (featureId: string, newStatus: Feature['status']) => {
    try {
      const feature = features.find((f) => f.id === featureId);
      if (!feature) {
        console.log('❌ Feature not found:', featureId);
        return;
      }

      console.log('🔍 FeaturesDashboard handleStatusChange:', {
        featureId,
        newStatus,
        oldStatus: feature.status,
        featureName: feature.name,
      });

      const updatePayload = { status: newStatus };
      console.log('📤 Sending to API:', updatePayload);

      const response = await fetch(`/api/features/${featureId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ API error response:', errorData);
        throw new Error('Failed to update feature status');
      }

      const updatedFeature = await response.json();
      console.log('✅ API success response:', updatedFeature);

      // Update local state
      setFeatures((prev) =>
        prev.map((f) => (f.id === featureId ? { ...f, status: newStatus } : f))
      );
    } catch (error) {
      console.error('Error updating feature status:', error);
      alert('Error al actualizar el estado de la feature');
    }
  };

  const handleFeatureClick = (feature: Feature) => {
    setSelectedFeature(feature);
  };

  const handleFiltersChange = (newFilters: FeatureFilters) => {
    setFilters(newFilters);
  };

  const handleExportPDF = async () => {
    try {
      if (activeTab === 'metrics') {
        await exportMetricsToPDF(projectId);
      } else {
        await exportDashboardToPDF(projectId, activeTab);
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Error al exportar a PDF');
    }
  };

  // Apply filters to features
  const filteredFeatures = applyFeatureFilters(features, filters);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <RefreshCw className="h-12 w-12 mx-auto text-black animate-spin" />
          <p className="text-black font-bold text-lg">Cargando features...</p>
        </div>
      </div>
    );
  }

  if (features.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] neo-card bg-white p-12">
        <div className="text-center space-y-4">
          <Kanban className="h-16 w-16 mx-auto text-black opacity-30" />
          <h3 className="text-2xl font-black text-black uppercase">No hay features aún</h3>
          <p className="text-black text-base max-w-md">
            Genera features desde un PRD aprobado en el Product Manager
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Filters Panel */}
        <FeatureFiltersPanel
          onFiltersChange={handleFiltersChange}
          features={features}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
          <TabsList className="neo-border bg-white p-1 gap-1">
            <TabsTrigger
              value="kanban"
              className="data-[state=active]:bg-[hsl(0,100%,60%)] data-[state=active]:text-white font-black uppercase text-sm neo-border-sm"
            >
              <Kanban className="h-4 w-4 mr-2" />
              Kanban
            </TabsTrigger>
            <TabsTrigger
              value="gantt"
              className="data-[state=active]:bg-[hsl(0,100%,60%)] data-[state=active]:text-white font-black uppercase text-sm neo-border-sm"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Gantt
            </TabsTrigger>
            <TabsTrigger
              value="list"
              className="data-[state=active]:bg-[hsl(0,100%,60%)] data-[state=active]:text-white font-black uppercase text-sm neo-border-sm"
            >
              <List className="h-4 w-4 mr-2" />
              Lista
            </TabsTrigger>
            <TabsTrigger
              value="metrics"
              className="data-[state=active]:bg-[hsl(0,100%,60%)] data-[state=active]:text-white font-black uppercase text-sm neo-border-sm"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Métricas
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Button
              onClick={handleExportPDF}
              variant="outline"
              className="neo-border font-black uppercase text-sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
            <Button
              onClick={fetchFeatures}
              variant="outline"
              className="neo-border font-black uppercase text-sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
          </div>
        </div>

          <TabsContent value="kanban" className="m-0" data-export-pdf>
            <KanbanBoard
              features={filteredFeatures}
              onFeatureClick={handleFeatureClick}
              onStatusChange={handleStatusChange}
            />
          </TabsContent>

          <TabsContent value="gantt" className="m-0" data-export-pdf>
            <GanttView features={filteredFeatures} onFeatureClick={handleFeatureClick} />
          </TabsContent>

          <TabsContent value="list" className="m-0" data-export-pdf>
            <FeaturesList features={filteredFeatures} onFeatureClick={handleFeatureClick} />
          </TabsContent>

          <TabsContent value="metrics" className="m-0" data-export-pdf>
            <MetricsGrid features={filteredFeatures} />
          </TabsContent>
        </Tabs>
      </div>

      <FeatureDetailModal
        feature={selectedFeature}
        open={!!selectedFeature}
        onClose={() => setSelectedFeature(null)}
      />
    </>
  );
}
