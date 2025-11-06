'use client';

import { Feature } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, Clock, GitBranch } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GanttViewProps {
  features: Feature[];
  onFeatureClick: (feature: Feature) => void;
}

const priorityColors = {
  P0: 'bg-[hsl(0,100%,60%)]',
  P1: 'bg-[hsl(30,100%,60%)]',
  P2: 'bg-[hsl(200,100%,40%)]',
};

const statusColors = {
  todo: 'bg-gray-300',
  in_progress: 'bg-[hsl(200,100%,60%)]',
  testing: 'bg-[hsl(60,100%,60%)]',
  done: 'bg-[hsl(120,60%,60%)]',
};

export function GanttView({ features, onFeatureClick }: GanttViewProps) {
  // Sort features by priority and dependencies
  const sortedFeatures = [...features].sort((a, b) => {
    // First by priority
    const priorityOrder = { P0: 0, P1: 1, P2: 2 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;

    // Then by creation date
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  // Calculate timeline (simplified: use estimated hours)
  const totalWeeks = Math.ceil(
    features.reduce((sum, f) => sum + (f.estimatedHours || 40), 0) / 40
  );
  const weeksToShow = Math.max(12, totalWeeks);

  // Calculate position for each feature
  let currentWeek = 0;
  const featurePositions = new Map<string, { start: number; duration: number }>();

  sortedFeatures.forEach((feature) => {
    // Check if dependencies are met
    const dependenciesEndWeek = (feature.dependencies || []).reduce((max, depId) => {
      const depPos = featurePositions.get(depId);
      return depPos ? Math.max(max, depPos.start + depPos.duration) : max;
    }, 0);

    const startWeek = Math.max(currentWeek, dependenciesEndWeek);
    const durationWeeks = Math.ceil((feature.estimatedHours || 40) / 40);

    featurePositions.set(feature.id, {
      start: startWeek,
      duration: durationWeeks,
    });

    // Update current week for non-dependent features
    if ((feature.dependencies || []).length === 0) {
      currentWeek = startWeek + durationWeeks;
    }
  });

  return (
    <Card className="neo-card bg-white">
      <CardHeader className="p-6 border-b-4 border-black">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-black text-black uppercase tracking-tight flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Timeline de Features
          </CardTitle>
          <Badge className="bg-black text-white font-black text-base neo-border-sm px-3 py-1">
            {weeksToShow} semanas
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <ScrollArea className="w-full">
          <div className="min-w-[1200px]">
            {/* Timeline Header */}
            <div className="flex items-center mb-4">
              <div className="w-[300px] flex-shrink-0" />
              <div className="flex-1 flex border-b-4 border-black">
                {Array.from({ length: weeksToShow }, (_, i) => (
                  <div
                    key={i}
                    className="flex-1 text-center py-2 border-r-2 border-black text-xs font-black text-black uppercase"
                  >
                    S{i + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Rows */}
            <div className="space-y-2">
              {sortedFeatures.map((feature) => {
                const position = featurePositions.get(feature.id);
                if (!position) return null;

                const leftPercent = (position.start / weeksToShow) * 100;
                const widthPercent = (position.duration / weeksToShow) * 100;

                return (
                  <div key={feature.id} className="flex items-center group">
                    {/* Feature Info */}
                    <div className="w-[300px] flex-shrink-0 pr-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-black text-black uppercase">
                          {feature.id}
                        </span>
                        <Badge className={cn('text-xs font-black text-white', priorityColors[feature.priority])}>
                          {feature.priority}
                        </Badge>
                      </div>
                      <h4 className="text-sm font-bold text-black line-clamp-1">
                        {feature.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-black mt-1">
                        <Clock className="h-3 w-3" />
                        <span className="font-bold">{feature.estimatedHours || 40}h</span>
                        {feature.dependencies && feature.dependencies.length > 0 && (
                          <>
                            <GitBranch className="h-3 w-3 ml-2" />
                            <span className="font-bold">{feature.dependencies.length} dep</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Timeline Bar */}
                    <div className="flex-1 relative h-12 border-b-2 border-black">
                      <div
                        className={cn(
                          'absolute h-10 neo-border-sm cursor-pointer transition-all hover:neo-shadow-sm hover:-translate-y-0.5',
                          statusColors[feature.status]
                        )}
                        style={{
                          left: `${leftPercent}%`,
                          width: `${widthPercent}%`,
                        }}
                        onClick={() => onFeatureClick(feature)}
                      >
                        <div className="h-full flex items-center justify-center px-2">
                          <span className="text-xs font-black text-black truncate">
                            {feature.name}
                          </span>
                        </div>
                      </div>

                      {/* Dependency Arrows */}
                      {feature.dependencies &&
                        feature.dependencies.map((depId) => {
                          const depPosition = featurePositions.get(depId);
                          if (!depPosition) return null;

                          const depEndPercent = ((depPosition.start + depPosition.duration) / weeksToShow) * 100;

                          return (
                            <div
                              key={depId}
                              className="absolute top-5 h-0.5 bg-[hsl(0,100%,60%)] opacity-50"
                              style={{
                                left: `${depEndPercent}%`,
                                width: `${leftPercent - depEndPercent}%`,
                              }}
                            >
                              <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                                <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-4 border-l-[hsl(0,100%,60%)]" />
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-6 p-4 bg-gray-50 neo-border">
              <h4 className="text-xs font-black text-black uppercase mb-3">Leyenda</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-300 neo-border-sm" />
                  <span className="text-xs font-bold text-black">To Do</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[hsl(200,100%,60%)] neo-border-sm" />
                  <span className="text-xs font-bold text-black">In Progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[hsl(60,100%,60%)] neo-border-sm" />
                  <span className="text-xs font-bold text-black">Testing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[hsl(120,60%,60%)] neo-border-sm" />
                  <span className="text-xs font-bold text-black">Done</span>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-8 h-0.5 bg-[hsl(0,100%,60%)]" />
                <span className="text-xs font-bold text-black">Dependencia</span>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
