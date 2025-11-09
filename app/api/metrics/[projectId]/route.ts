import { NextRequest, NextResponse } from 'next/server';
import { featureStorage } from '@/lib/postgres-storage';

interface RouteParams {
  params: Promise<{ projectId: string }>;
}

interface MetricsResponse {
  projectId: string;
  totalFeatures: number;
  completedFeatures: number;
  completionRate: number;
  inProgressFeatures: number;
  testingFeatures: number;
  todoFeatures: number;
  priorityDistribution: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  priorityCompletion: {
    critical: { total: number; done: number; rate: number };
    high: { total: number; done: number; rate: number };
    medium: { total: number; done: number; rate: number };
    low: { total: number; done: number; rate: number };
  };
  velocity: {
    weeklyData: Array<{ week: string; count: number }>;
    average: number;
  };
  burndown: {
    weeklyData: Array<{ week: string; ideal: number; actual: number }>;
  };
  estimatedCompletion: string | null;
}

// GET /api/metrics/[projectId] - Get aggregated metrics for a project
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { projectId } = await params;

    // Fetch all features for the project
    const allFeatures = await featureStorage.getAll();
    const features = allFeatures.filter((f) => f.projectId === projectId);

    if (features.length === 0) {
      return NextResponse.json({
        projectId,
        totalFeatures: 0,
        completedFeatures: 0,
        completionRate: 0,
        inProgressFeatures: 0,
        testingFeatures: 0,
        todoFeatures: 0,
        priorityDistribution: { critical: 0, high: 0, medium: 0, low: 0 },
        priorityCompletion: {
          critical: { total: 0, done: 0, rate: 0 },
          high: { total: 0, done: 0, rate: 0 },
          medium: { total: 0, done: 0, rate: 0 },
          low: { total: 0, done: 0, rate: 0 },
        },
        velocity: { weeklyData: [], average: 0 },
        burndown: { weeklyData: [] },
        estimatedCompletion: null,
      } as MetricsResponse);
    }

    // Basic counts
    const totalFeatures = features.length;
    const completedFeatures = features.filter((f) => f.status === 'done').length;
    const inProgressFeatures = features.filter((f) => f.status === 'in_progress').length;
    const testingFeatures = features.filter((f) => f.status === 'testing').length;
    const todoFeatures = features.filter((f) => f.status === 'todo').length;
    const completionRate = (completedFeatures / totalFeatures) * 100;

    // Priority distribution (map P0/P1/P2 to human-readable labels)
    const priorityDistribution = {
      critical: features.filter((f) => f.priority === 'P0').length,
      high: features.filter((f) => f.priority === 'P1').length,
      medium: features.filter((f) => f.priority === 'P2').length,
      low: 0, // No P3 in the current schema
    };

    // Priority completion rates
    const calculatePriorityCompletion = (priority: 'P0' | 'P1' | 'P2') => {
      const priorityFeatures = features.filter((f) => f.priority === priority);
      const done = priorityFeatures.filter((f) => f.status === 'done').length;
      return {
        total: priorityFeatures.length,
        done,
        rate: priorityFeatures.length > 0 ? (done / priorityFeatures.length) * 100 : 0,
      };
    };

    const priorityCompletion = {
      critical: calculatePriorityCompletion('P0'),
      high: calculatePriorityCompletion('P1'),
      medium: calculatePriorityCompletion('P2'),
      low: { total: 0, done: 0, rate: 0 }, // No P3 in the current schema
    };

    // Velocity calculation
    const completedWithDates = features.filter((f) => f.completedAt);
    const weeklyVelocity = new Map<string, number>();

    completedWithDates.forEach((feature) => {
      const completedDate = new Date(feature.completedAt!);
      const weekStart = new Date(completedDate);
      weekStart.setDate(completedDate.getDate() - completedDate.getDay());
      weekStart.setHours(0, 0, 0, 0);

      const weekKey = weekStart.toISOString().split('T')[0];
      weeklyVelocity.set(weekKey, (weeklyVelocity.get(weekKey) || 0) + 1);
    });

    const velocityData = Array.from(weeklyVelocity.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([week, count], index) => ({
        week: `S${index + 1}`,
        count,
      }));

    const averageVelocity = velocityData.length > 0
      ? velocityData.reduce((sum, w) => sum + w.count, 0) / velocityData.length
      : 0;

    // Burndown calculation
    const startDates = features
      .map((f) => f.startedAt || f.createdAt)
      .filter(Boolean)
      .sort();

    const projectStart = startDates[0] ? new Date(startDates[0]) : new Date();
    const projectEnd = new Date();

    const totalWeeks = Math.max(
      Math.ceil((projectEnd.getTime() - projectStart.getTime()) / (7 * 24 * 60 * 60 * 1000)),
      4
    );

    const burndownData = [];
    for (let week = 0; week <= totalWeeks; week++) {
      const weekDate = new Date(projectStart);
      weekDate.setDate(weekDate.getDate() + week * 7);

      const completedByWeek = features.filter((f) => {
        if (!f.completedAt) return false;
        return new Date(f.completedAt) <= weekDate;
      }).length;

      const remaining = totalFeatures - completedByWeek;
      const idealRemaining = Math.max(0, totalFeatures - (totalFeatures / totalWeeks) * week);

      burndownData.push({
        week: `S${week}`,
        ideal: Math.round(idealRemaining),
        actual: remaining,
      });
    }

    // Estimated completion
    let estimatedCompletion: string | null = null;
    if (averageVelocity > 0 && completionRate < 100) {
      const remainingFeatures = totalFeatures - completedFeatures;
      const weeksToComplete = Math.ceil(remainingFeatures / averageVelocity);
      const estimatedDate = new Date();
      estimatedDate.setDate(estimatedDate.getDate() + weeksToComplete * 7);
      estimatedCompletion = estimatedDate.toISOString().split('T')[0];
    }

    const metrics: MetricsResponse = {
      projectId,
      totalFeatures,
      completedFeatures,
      completionRate: Math.round(completionRate * 10) / 10,
      inProgressFeatures,
      testingFeatures,
      todoFeatures,
      priorityDistribution,
      priorityCompletion,
      velocity: {
        weeklyData: velocityData,
        average: Math.round(averageVelocity * 10) / 10,
      },
      burndown: {
        weeklyData: burndownData,
      },
      estimatedCompletion,
    };

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error calculating metrics:', error);
    return NextResponse.json(
      { error: 'Failed to calculate metrics' },
      { status: 500 }
    );
  }
}
