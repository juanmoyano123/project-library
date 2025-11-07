'use client';

import { Feature } from '@/lib/types';
import { BurndownChart } from './burndown-chart';
import { VelocityChart } from './velocity-chart';
import { RICEDistributionChart } from './rice-distribution-chart';
import { ProgressRings } from './progress-rings';

interface MetricsGridProps {
  features: Feature[];
}

export function MetricsGrid({ features }: MetricsGridProps) {
  if (features.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] neo-card bg-white p-12">
        <div className="text-center space-y-4">
          <div className="text-6xl">📊</div>
          <h3 className="text-2xl font-black text-black uppercase">No hay métricas disponibles</h3>
          <p className="text-black text-base max-w-md">
            Las métricas se generarán automáticamente cuando haya features en el proyecto
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Rings - Full Width */}
      <div className="w-full">
        <ProgressRings features={features} />
      </div>

      {/* Charts Grid - 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BurndownChart features={features} />
        <VelocityChart features={features} />
      </div>

      {/* RICE Distribution - Full Width */}
      <div className="w-full">
        <RICEDistributionChart features={features} />
      </div>
    </div>
  );
}
