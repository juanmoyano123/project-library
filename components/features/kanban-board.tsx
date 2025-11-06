'use client';

import { useState } from 'react';
import { Feature } from '@/lib/types';
import { FeatureCard } from './feature-card';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  rectIntersection,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverEvent,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface KanbanBoardProps {
  features: Feature[];
  onFeatureClick: (feature: Feature) => void;
  onStatusChange: (featureId: string, newStatus: Feature['status']) => Promise<void>;
}

const columns: { id: Feature['status']; label: string; color: string }[] = [
  { id: 'todo', label: 'To Do', color: 'bg-gray-100' },
  { id: 'in_progress', label: 'In Progress', color: 'bg-[hsl(200,100%,90%)]' },
  { id: 'testing', label: 'Testing', color: 'bg-[hsl(60,100%,90%)]' },
  { id: 'done', label: 'Done', color: 'bg-[hsl(120,60%,90%)]' },
];

interface SortableFeatureCardProps {
  feature: Feature;
  onFeatureClick: (feature: Feature) => void;
}

function SortableFeatureCard({ feature, onFeatureClick }: SortableFeatureCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: feature.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <FeatureCard
        feature={feature}
        onClick={() => onFeatureClick(feature)}
        isDragging={isDragging}
      />
    </div>
  );
}

interface DroppableColumnProps {
  column: { id: Feature['status']; label: string; color: string };
  features: Feature[];
  onFeatureClick: (feature: Feature) => void;
}

function DroppableColumn({ column, features, onFeatureClick }: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <Card
      className={cn(
        'neo-card flex flex-col h-full transition-all',
        column.color,
        isOver && 'ring-4 ring-black ring-offset-2'
      )}
    >
      <CardHeader className="p-4 border-b-4 border-black">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-black text-black uppercase tracking-wide">
            {column.label}
          </CardTitle>
          <Badge className="bg-black text-white font-black neo-border-sm">
            {features.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent ref={setNodeRef} className="p-4 flex-1 overflow-y-auto space-y-3 min-h-[400px] flex flex-col">
        <SortableContext items={features.map((f) => f.id)} strategy={verticalListSortingStrategy}>
          {features.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-sm text-black font-bold opacity-50">
              Arrastra features aquí
            </div>
          ) : (
            features.map((feature) => (
              <SortableFeatureCard
                key={feature.id}
                feature={feature}
                onFeatureClick={onFeatureClick}
              />
            ))
          )}
        </SortableContext>
      </CardContent>
    </Card>
  );
}

export function KanbanBoard({ features, onFeatureClick, onStatusChange }: KanbanBoardProps) {
  const [activeFeature, setActiveFeature] = useState<Feature | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const feature = features.find((f) => f.id === event.active.id);
    setActiveFeature(feature || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveFeature(null);

    if (!over) return;

    const featureId = active.id as string;
    let newStatus = over.id as Feature['status'];

    console.log('🔍 KanbanBoard handleDragEnd:', {
      activeId: active.id,
      overId: over.id,
      featureId,
      newStatus,
      activeIdType: typeof active.id,
      overIdType: typeof over.id,
    });

    // If dropped over a feature (not a column), find the column that feature belongs to
    const validStatuses: Feature['status'][] = ['todo', 'in_progress', 'testing', 'done'];
    if (!validStatuses.includes(newStatus)) {
      console.log('⚠️ Dropped over a feature, finding its column...');
      const targetFeature = features.find((f) => f.id === over.id);
      if (targetFeature) {
        newStatus = targetFeature.status;
        console.log('✅ Found target column:', newStatus);
      } else {
        console.log('❌ Invalid drop target:', over.id);
        return;
      }
    } else {
      console.log('🎯 Detected column drop directly: column =', newStatus);
    }

    const feature = features.find((f) => f.id === featureId);
    if (!feature || feature.status === newStatus) {
      console.log('⏭️ No status change needed');
      return;
    }

    console.log('✅ Valid status change, calling onStatusChange with:', { featureId, newStatus });
    await onStatusChange(featureId, newStatus);
  };

  const getFeaturesByStatus = (status: Feature['status']) => {
    return features.filter((f) => f.status === status);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-4 gap-4 h-full">
        {columns.map((column) => {
          const columnFeatures = getFeaturesByStatus(column.id);

          return (
            <DroppableColumn
              key={column.id}
              column={column}
              features={columnFeatures}
              onFeatureClick={onFeatureClick}
            />
          );
        })}
      </div>

      <DragOverlay>
        {activeFeature ? (
          <div className="rotate-3 scale-105">
            <FeatureCard feature={activeFeature} isDragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
