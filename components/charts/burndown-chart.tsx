'use client';

import { useMemo } from 'react';
import { Feature } from '@/lib/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BurndownChartProps {
  features: Feature[];
}

export function BurndownChart({ features }: BurndownChartProps) {
  const chartData = useMemo(() => {
    if (features.length === 0) return [];

    // Find project start date (earliest startedAt or createdAt)
    const startDates = features
      .map((f) => f.startedAt || f.createdAt)
      .filter(Boolean)
      .sort();

    const projectStart = startDates[0] ? new Date(startDates[0]) : new Date();

    // Find project end date (latest completedAt or now)
    const endDates = features
      .map((f) => f.completedAt)
      .filter(Boolean)
      .sort();

    const projectEnd = endDates.length > 0
      ? new Date(endDates[endDates.length - 1])
      : new Date();

    // Calculate total weeks
    const totalWeeks = Math.max(
      Math.ceil((projectEnd.getTime() - projectStart.getTime()) / (7 * 24 * 60 * 60 * 1000)),
      4
    );

    const totalFeatures = features.length;

    // Build week-by-week data
    const data = [];
    for (let week = 0; week <= totalWeeks; week++) {
      const weekDate = new Date(projectStart);
      weekDate.setDate(weekDate.getDate() + week * 7);

      // Count features completed by this week
      const completedByWeek = features.filter((f) => {
        if (!f.completedAt) return false;
        const completedDate = new Date(f.completedAt);
        return completedDate <= weekDate;
      }).length;

      const remaining = totalFeatures - completedByWeek;

      // Ideal burndown (linear)
      const idealRemaining = Math.max(0, totalFeatures - (totalFeatures / totalWeeks) * week);

      data.push({
        week: `S${week}`,
        ideal: Math.round(idealRemaining),
        actual: remaining,
      });
    }

    return data;
  }, [features]);

  if (chartData.length === 0) {
    return (
      <Card className="neo-card bg-white">
        <CardHeader className="border-b-4 border-black">
          <CardTitle className="text-lg font-black uppercase">Burndown Chart</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-[300px] text-black opacity-50 font-bold">
            No hay datos suficientes para el burndown
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="neo-card bg-white">
      <CardHeader className="border-b-4 border-black">
        <CardTitle className="text-lg font-black uppercase">Burndown Chart</CardTitle>
        <p className="text-sm text-black opacity-70 font-bold mt-2">
          Features restantes vs ideal por semana
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeWidth={2} stroke="#000" strokeDasharray="0" />
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
            />
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
            />
            <Line
              type="monotone"
              dataKey="ideal"
              stroke="hsl(0, 0%, 70%)"
              strokeWidth={3}
              strokeDasharray="8 8"
              dot={{ fill: 'hsl(0, 0%, 70%)', strokeWidth: 2, r: 5 }}
              name="Ideal"
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="hsl(0, 100%, 60%)"
              strokeWidth={3}
              dot={{ fill: 'hsl(0, 100%, 60%)', strokeWidth: 2, r: 6 }}
              name="Real"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
