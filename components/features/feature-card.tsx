'use client';

import { Feature } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertCircle, User, GitBranch } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  feature: Feature;
  onClick?: () => void;
  isDragging?: boolean;
}

const priorityColors = {
  P0: 'bg-[hsl(0,100%,60%)] text-white',
  P1: 'bg-[hsl(30,100%,60%)] text-white',
  P2: 'bg-[hsl(200,100%,40%)] text-white',
};

const statusLabels = {
  todo: 'To Do',
  in_progress: 'In Progress',
  testing: 'Testing',
  done: 'Done',
};

export function FeatureCard({ feature, onClick, isDragging = false }: FeatureCardProps) {
  const riceScore = feature.riceScore as any;
  const totalScore = riceScore?.riceScore || 0;

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:neo-shadow-sm neo-card bg-white',
        isDragging && 'opacity-50 rotate-2'
      )}
      onClick={onClick}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black text-black uppercase tracking-wide">
                {feature.id}
              </span>
              <Badge className={cn('text-xs font-black', priorityColors[feature.priority])}>
                {feature.priority}
              </Badge>
            </div>
            <h4 className="text-sm font-black text-black uppercase tracking-tight line-clamp-2">
              {feature.name}
            </h4>
          </div>
          {totalScore > 0 && (
            <div className="flex flex-col items-center justify-center bg-[hsl(60,100%,50%)] neo-border-sm px-2 py-1 min-w-[50px]">
              <span className="text-xs font-black text-black uppercase">RICE</span>
              <span className="text-lg font-black text-black">{totalScore.toFixed(0)}</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2 space-y-3">
        {/* Description */}
        {feature.description && (
          <p className="text-xs text-black line-clamp-2 font-medium">
            {feature.description}
          </p>
        )}

        {/* Dependencies */}
        {feature.dependencies && feature.dependencies.length > 0 && (
          <div className="flex items-center gap-1 text-xs">
            <GitBranch className="h-3 w-3 text-black" />
            <span className="font-bold text-black">
              {feature.dependencies.length} {feature.dependencies.length === 1 ? 'dependency' : 'dependencies'}
            </span>
          </div>
        )}

        {/* Footer Info */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t-2 border-black">
          {/* Estimated Hours */}
          {feature.estimatedHours && (
            <div className="flex items-center gap-1 text-xs">
              <Clock className="h-3 w-3 text-black" />
              <span className="font-bold text-black">{feature.estimatedHours}h</span>
            </div>
          )}

          {/* Assigned To */}
          {feature.assignedTo && (
            <div className="flex items-center gap-1 text-xs">
              <User className="h-3 w-3 text-black" />
              <span className="font-bold text-black truncate max-w-[100px]">
                {feature.assignedTo}
              </span>
            </div>
          )}

          {/* Acceptance Criteria Count */}
          {feature.acceptanceCriteria && feature.acceptanceCriteria.length > 0 && (
            <div className="flex items-center gap-1 text-xs">
              <AlertCircle className="h-3 w-3 text-black" />
              <span className="font-bold text-black">
                {feature.acceptanceCriteria.length} AC
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
