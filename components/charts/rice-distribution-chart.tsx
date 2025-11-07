'use client';

import { useMemo } from 'react';
import { Feature } from '@/lib/types';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RICEDistributionChartProps {
  features: Feature[];
}

const PRIORITY_COLORS = {
  critical: 'hsl(0, 100%, 60%)',
  high: 'hsl(30, 100%, 60%)',
  medium: 'hsl(60, 100%, 60%)',
  low: 'hsl(200, 100%, 60%)',
};

const PRIORITY_LABELS = {
  critical: 'Crítico',
  high: 'Alto',
  medium: 'Medio',
  low: 'Bajo',
};

export function RICEDistributionChart({ features }: RICEDistributionChartProps) {
  const chartData = useMemo(() => {
    const distribution: Record<string, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

    features.forEach((feature) => {
      const priority = feature.priority || 'medium';
      distribution[priority]++;
    });

    return Object.entries(distribution)
      .filter(([_, count]) => count > 0)
      .map(([priority, count]) => ({
        name: PRIORITY_LABELS[priority as keyof typeof PRIORITY_LABELS],
        value: count,
        priority,
      }));
  }, [features]);

  if (chartData.length === 0) {
    return (
      <Card className="neo-card bg-white">
        <CardHeader className="border-b-4 border-black">
          <CardTitle className="text-lg font-black uppercase">Distribución RICE</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-[300px] text-black opacity-50 font-bold">
            No hay features para analizar
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderCustomLabel = (entry: any) => {
    return `${entry.value}`;
  };

  return (
    <Card className="neo-card bg-white">
      <CardHeader className="border-b-4 border-black">
        <CardTitle className="text-lg font-black uppercase">Distribución RICE</CardTitle>
        <p className="text-sm text-black opacity-70 font-bold mt-2">
          Features por prioridad
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={100}
              innerRadius={50}
              fill="#8884d8"
              dataKey="value"
              stroke="#000"
              strokeWidth={3}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={PRIORITY_COLORS[entry.priority as keyof typeof PRIORITY_COLORS]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '4px solid #000',
                borderRadius: '0px',
                boxShadow: '4px 4px 0px 0px #000',
                fontWeight: 'bold',
              }}
            />
            <Legend
              wrapperStyle={{
                fontWeight: 'bold',
                fontSize: '12px',
              }}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          {chartData.map((item) => (
            <div
              key={item.priority}
              className="neo-border-sm p-3"
              style={{ backgroundColor: PRIORITY_COLORS[item.priority as keyof typeof PRIORITY_COLORS] + '20' }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-black">
                  {item.name}
                </span>
                <span className="text-2xl font-black text-black">
                  {item.value}
                </span>
              </div>
              <div className="mt-1 text-xs font-bold text-black opacity-70">
                {Math.round((item.value / features.length) * 100)}% del total
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
