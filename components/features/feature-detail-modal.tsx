'use client';

import { Feature } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Clock, User, GitBranch, CheckCircle2, Calendar, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureDetailModalProps {
  feature: Feature | null;
  open: boolean;
  onClose: () => void;
}

const priorityColors = {
  P0: 'bg-[hsl(0,100%,60%)] text-white',
  P1: 'bg-[hsl(30,100%,60%)] text-white',
  P2: 'bg-[hsl(200,100%,40%)] text-white',
};

const statusColors = {
  todo: 'bg-gray-200 text-black',
  in_progress: 'bg-[hsl(200,100%,70%)] text-black',
  testing: 'bg-[hsl(60,100%,70%)] text-black',
  done: 'bg-[hsl(120,60%,70%)] text-black',
};

const statusLabels = {
  todo: 'To Do',
  in_progress: 'In Progress',
  testing: 'Testing',
  done: 'Done',
};

export function FeatureDetailModal({ feature, open, onClose }: FeatureDetailModalProps) {
  if (!feature) return null;

  const riceScore = feature.riceScore as any;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] neo-card bg-white p-0">
        <DialogHeader className="p-6 pb-4 border-b-4 border-black">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-black text-black uppercase tracking-wide">
                  {feature.id}
                </span>
                <Badge className={cn('text-xs font-black', priorityColors[feature.priority])}>
                  {feature.priority}
                </Badge>
                <Badge className={cn('text-xs font-black neo-border-sm', statusColors[feature.status])}>
                  {statusLabels[feature.status]}
                </Badge>
              </div>
              <DialogTitle className="text-2xl font-black text-black uppercase tracking-tight">
                {feature.name}
              </DialogTitle>
            </div>

            {riceScore?.riceScore && (
              <div className="flex flex-col items-center bg-[hsl(60,100%,50%)] neo-border px-4 py-2">
                <span className="text-xs font-black text-black uppercase">RICE Score</span>
                <span className="text-3xl font-black text-black">{riceScore.riceScore.toFixed(0)}</span>
              </div>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="p-6 space-y-6">
            {/* Description */}
            {feature.description && (
              <div>
                <h3 className="text-sm font-black text-black uppercase tracking-wide mb-2">
                  Descripción
                </h3>
                <p className="text-sm text-black font-medium leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )}

            <Separator className="bg-black h-[2px]" />

            {/* User Story */}
            <div>
              <h3 className="text-sm font-black text-black uppercase tracking-wide mb-2">
                User Story
              </h3>
              <p className="text-sm text-black font-medium leading-relaxed bg-[hsl(60,100%,90%)] p-4 neo-border-sm">
                {feature.userStory}
              </p>
            </div>

            {/* Acceptance Criteria */}
            {feature.acceptanceCriteria && feature.acceptanceCriteria.length > 0 && (
              <>
                <Separator className="bg-black h-[2px]" />
                <div>
                  <h3 className="text-sm font-black text-black uppercase tracking-wide mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Acceptance Criteria ({feature.acceptanceCriteria.length})
                  </h3>
                  <div className="space-y-3">
                    {feature.acceptanceCriteria.map((ac: any, idx: number) => (
                      <div key={idx} className="bg-white neo-border p-4">
                        <div className="flex items-start gap-2 mb-2">
                          <Badge className="bg-black text-white font-black text-xs">
                            AC-{idx + 1}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm">
                          <p className="font-bold text-black">
                            <span className="text-[hsl(200,100%,40%)]">GIVEN</span> {ac.given}
                          </p>
                          <p className="font-bold text-black">
                            <span className="text-[hsl(30,100%,50%)]">WHEN</span> {ac.when}
                          </p>
                          <p className="font-bold text-black">
                            <span className="text-[hsl(120,60%,40%)]">THEN</span> {ac.then}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* RICE Score Details */}
            {riceScore && (
              <>
                <Separator className="bg-black h-[2px]" />
                <div>
                  <h3 className="text-sm font-black text-black uppercase tracking-wide mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    RICE Score Breakdown
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-[hsl(200,100%,90%)] neo-border p-3">
                      <div className="text-xs font-black text-black uppercase mb-1">Reach</div>
                      <div className="text-2xl font-black text-black">{riceScore.reach}</div>
                      <div className="text-xs text-black font-medium">users/quarter</div>
                    </div>
                    <div className="bg-[hsl(30,100%,90%)] neo-border p-3">
                      <div className="text-xs font-black text-black uppercase mb-1">Impact</div>
                      <div className="text-2xl font-black text-black">{riceScore.impact}/5</div>
                    </div>
                    <div className="bg-[hsl(60,100%,90%)] neo-border p-3">
                      <div className="text-xs font-black text-black uppercase mb-1">Confidence</div>
                      <div className="text-2xl font-black text-black">{riceScore.confidence}%</div>
                    </div>
                    <div className="bg-[hsl(120,60%,90%)] neo-border p-3">
                      <div className="text-xs font-black text-black uppercase mb-1">Effort</div>
                      <div className="text-2xl font-black text-black">{riceScore.effort}</div>
                      <div className="text-xs text-black font-medium">person-weeks</div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Meta Information */}
            <Separator className="bg-black h-[2px]" />
            <div className="grid grid-cols-2 gap-4">
              {/* Time Estimates */}
              {feature.estimatedHours && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-black" />
                  <div>
                    <div className="text-xs font-black text-black uppercase">Estimado</div>
                    <div className="text-sm font-bold text-black">{feature.estimatedHours}h</div>
                  </div>
                </div>
              )}

              {/* Assigned To */}
              {feature.assignedTo && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-black" />
                  <div>
                    <div className="text-xs font-black text-black uppercase">Asignado a</div>
                    <div className="text-sm font-bold text-black">{feature.assignedTo}</div>
                  </div>
                </div>
              )}

              {/* Created Date */}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-black" />
                <div>
                  <div className="text-xs font-black text-black uppercase">Creado</div>
                  <div className="text-sm font-bold text-black">
                    {new Date(feature.createdAt).toLocaleDateString('es')}
                  </div>
                </div>
              </div>

              {/* Completed Date */}
              {feature.completedAt && (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-black" />
                  <div>
                    <div className="text-xs font-black text-black uppercase">Completado</div>
                    <div className="text-sm font-bold text-black">
                      {new Date(feature.completedAt).toLocaleDateString('es')}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dependencies */}
            {feature.dependencies && feature.dependencies.length > 0 && (
              <>
                <Separator className="bg-black h-[2px]" />
                <div>
                  <h3 className="text-sm font-black text-black uppercase tracking-wide mb-3 flex items-center gap-2">
                    <GitBranch className="h-4 w-4" />
                    Dependencias ({feature.dependencies.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {feature.dependencies.map((dep) => (
                      <Badge
                        key={dep}
                        className="bg-[hsl(30,100%,60%)] text-white font-black neo-border-sm"
                      >
                        {dep}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Blocks Features */}
            {feature.blocksFeatures && feature.blocksFeatures.length > 0 && (
              <>
                <Separator className="bg-black h-[2px]" />
                <div>
                  <h3 className="text-sm font-black text-black uppercase tracking-wide mb-3 flex items-center gap-2">
                    <GitBranch className="h-4 w-4" />
                    Bloquea a ({feature.blocksFeatures.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {feature.blocksFeatures.map((blocked) => (
                      <Badge
                        key={blocked}
                        className="bg-[hsl(0,100%,60%)] text-white font-black neo-border-sm"
                      >
                        {blocked}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Notes */}
            {feature.notes && (
              <>
                <Separator className="bg-black h-[2px]" />
                <div>
                  <h3 className="text-sm font-black text-black uppercase tracking-wide mb-2">
                    Notas
                  </h3>
                  <p className="text-sm text-black font-medium leading-relaxed whitespace-pre-wrap">
                    {feature.notes}
                  </p>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
