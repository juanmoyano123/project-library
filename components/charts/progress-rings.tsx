'use client';

import { useMemo } from 'react';
import { Feature } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ProgressRingsProps {
  features: Feature[];
}

interface RingData {
  label: string;
  value: number;
  max: number;
  percentage: number;
  color: string;
  bgColor: string;
}

export function ProgressRings({ features }: ProgressRingsProps) {
  const rings = useMemo<RingData[]>(() => {
    const total = features.length;
    if (total === 0) return [];

    // Overall completion
    const completed = features.filter((f) => f.status === 'done').length;
    const completionRate = (completed / total) * 100;

    // By priority
    const critical = features.filter((f) => f.priority === 'critical');
    const criticalDone = critical.filter((f) => f.status === 'done').length;
    const criticalRate = critical.length > 0 ? (criticalDone / critical.length) * 100 : 0;

    const high = features.filter((f) => f.priority === 'high');
    const highDone = high.filter((f) => f.status === 'done').length;
    const highRate = high.length > 0 ? (highDone / high.length) * 100 : 0;

    // By status
    const inProgress = features.filter((f) => f.status === 'in_progress').length;
    const testing = features.filter((f) => f.status === 'testing').length;

    return [
      {
        label: 'Completado',
        value: completed,
        max: total,
        percentage: Math.round(completionRate),
        color: 'hsl(120, 60%, 50%)',
        bgColor: 'hsl(120, 60%, 90%)',
      },
      {
        label: 'Crítico Done',
        value: criticalDone,
        max: critical.length,
        percentage: Math.round(criticalRate),
        color: 'hsl(0, 100%, 60%)',
        bgColor: 'hsl(0, 100%, 90%)',
      },
      {
        label: 'Alto Done',
        value: highDone,
        max: high.length,
        percentage: Math.round(highRate),
        color: 'hsl(30, 100%, 60%)',
        bgColor: 'hsl(30, 100%, 90%)',
      },
      {
        label: 'En Progreso',
        value: inProgress,
        max: total,
        percentage: Math.round((inProgress / total) * 100),
        color: 'hsl(200, 100%, 60%)',
        bgColor: 'hsl(200, 100%, 90%)',
      },
    ];
  }, [features]);

  if (rings.length === 0) {
    return (
      <Card className="neo-card bg-white">
        <CardHeader className="border-b-4 border-black">
          <CardTitle className="text-lg font-black uppercase">Progress Rings</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-[200px] text-black opacity-50 font-bold">
            No hay features para analizar
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="neo-card bg-white">
      <CardHeader className="border-b-4 border-black">
        <CardTitle className="text-lg font-black uppercase">Progress Rings</CardTitle>
        <p className="text-sm text-black opacity-70 font-bold mt-2">
          Métricas clave del proyecto
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {rings.map((ring, index) => (
            <ProgressRing key={index} {...ring} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ProgressRing({ label, value, max, percentage, color, bgColor }: RingData) {
  // SVG circle parameters
  const size = 120;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center space-y-3">
      {/* SVG Ring */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={bgColor}
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.5s ease',
            }}
          />
          {/* Black border */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#000"
            strokeWidth={2}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black text-black">{percentage}%</span>
          <span className="text-xs font-bold text-black opacity-70">
            {value}/{max}
          </span>
        </div>
      </div>

      {/* Label */}
      <div className="text-center">
        <p className="text-xs font-black uppercase text-black">{label}</p>
      </div>
    </div>
  );
}
