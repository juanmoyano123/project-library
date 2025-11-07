'use client';

import { useMemo } from 'react';
import { Feature } from '@/lib/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface VelocityChartProps {
  features: Feature[];
}

export function VelocityChart({ features }: VelocityChartProps) {
  const { chartData, avgVelocity } = useMemo(() => {
    const completedFeatures = features.filter((f) => f.completedAt);

    if (completedFeatures.length === 0) {
      return { chartData: [], avgVelocity: 0 };
    }

    // Group features by week of completion
    const weeklyData: Map<string, { week: string; count: number; timestamp: number }> = new Map();

    completedFeatures.forEach((feature) => {
      const completedDate = new Date(feature.completedAt!);

      // Calculate week number from project start
      const weekStart = new Date(completedDate);
      weekStart.setDate(completedDate.getDate() - completedDate.getDay()); // Start of week (Sunday)
      weekStart.setHours(0, 0, 0, 0);

      const weekKey = weekStart.toISOString().split('T')[0];
      const weekNum = Math.floor((weekStart.getTime() - new Date(2024, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
      const weekLabel = `S${weekNum % 52}`;

      if (weeklyData.has(weekKey)) {
        weeklyData.get(weekKey)!.count++;
      } else {
        weeklyData.set(weekKey, {
          week: weekLabel,
          count: 1,
          timestamp: weekStart.getTime(),
        });
      }
    });

    // Convert to array and sort by timestamp
    const sortedData = Array.from(weeklyData.values())
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(({ week, count }) => ({ week, features: count }));

    // Calculate average velocity
    const totalFeatures = sortedData.reduce((sum, w) => sum + w.features, 0);
    const avg = sortedData.length > 0 ? totalFeatures / sortedData.length : 0;

    return {
      chartData: sortedData,
      avgVelocity: Math.round(avg * 10) / 10,
    };
  }, [features]);

  if (chartData.length === 0) {
    return (
      <Card className="neo-card bg-white">
        <CardHeader className="border-b-4 border-black">
          <CardTitle className="text-lg font-black uppercase">Velocity Chart</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-[300px] text-black opacity-50 font-bold">
            No hay features completadas aún
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="neo-card bg-white">
      <CardHeader className="border-b-4 border-black">
        <CardTitle className="text-lg font-black uppercase">Velocity Chart</CardTitle>
        <div className="flex items-center justify-between mt-2">
          <p className="text-sm text-black opacity-70 font-bold">
            Features completadas por semana
          </p>
          <div className="bg-[hsl(200,100%,90%)] neo-border-sm px-3 py-1">
            <span className="text-xs font-black uppercase text-black">
              Promedio: {avgVelocity} f/semana
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeWidth={2} stroke="#000" strokeDasharray="0" vertical={false} />
            <XAxis
              dataKey="week"
              stroke="#000"
              strokeWidth={2}
              style={{ fontSize: '12px', fontWeight: 'bold' }}
            />
            <YAxis
              stroke="#000"
              strokeWidth={2}
              style={{ fontSize: '12px', fontWeight: 'bold' }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '4px solid #000',
                borderRadius: '0px',
                boxShadow: '4px 4px 0px 0px #000',
                fontWeight: 'bold',
              }}
              cursor={{ fill: 'hsl(200, 100%, 95%)' }}
            />
            <Legend
              wrapperStyle={{
                fontWeight: 'bold',
                fontSize: '12px',
              }}
            />
            <Bar
              dataKey="features"
              fill="hsl(200, 100%, 60%)"
              stroke="#000"
              strokeWidth={2}
              name="Features"
              radius={[0, 0, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
