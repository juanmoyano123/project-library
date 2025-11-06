import { NextResponse } from 'next/server';
import { featureStorage } from '@/lib/postgres-storage';
import { Feature } from '@/lib/types';

// GET /api/features?projectId=xxx or ?planId=xxx
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const planId = searchParams.get('planId');

    if (!projectId && !planId) {
      return NextResponse.json(
        { error: 'projectId or planId is required' },
        { status: 400 }
      );
    }

    let features: Feature[];

    if (planId) {
      features = await featureStorage.getByPlan(planId);
    } else if (projectId) {
      features = await featureStorage.getByProject(projectId);
    } else {
      features = [];
    }

    return NextResponse.json(features);
  } catch (error) {
    console.error('Error fetching features:', error);
    return NextResponse.json(
      { error: 'Failed to fetch features' },
      { status: 500 }
    );
  }
}

// POST /api/features - Create a new feature manually
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Generate feature ID if not provided
    let featureId = body.id;
    if (!featureId) {
      // Get existing features to determine next ID
      const existingFeatures = await featureStorage.getByProject(body.projectId);
      const maxNumber = existingFeatures.reduce((max, f) => {
        const match = f.id.match(/^F-(\d+)$/);
        if (match) {
          const num = parseInt(match[1], 10);
          return num > max ? num : max;
        }
        return max;
      }, 0);
      featureId = `F-${String(maxNumber + 1).padStart(3, '0')}`;
    }

    const feature: Feature = {
      id: featureId,
      projectId: body.projectId,
      planId: body.planId || undefined,
      name: body.name,
      description: body.description || undefined,
      userStory: body.userStory,
      priority: body.priority || 'P2',
      riceScore: body.riceScore || undefined,
      dependencies: body.dependencies || undefined,
      blocksFeatures: body.blocksFeatures || undefined,
      status: body.status || 'todo',
      acceptanceCriteria: body.acceptanceCriteria || [],
      estimatedHours: body.estimatedHours || undefined,
      actualHours: body.actualHours || undefined,
      assignedTo: body.assignedTo || undefined,
      notes: body.notes || undefined,
      gitCommits: body.gitCommits || undefined,
      createdAt: body.createdAt || new Date().toISOString(),
      startedAt: body.startedAt || undefined,
      completedAt: body.completedAt || undefined,
      deployedToStagingAt: body.deployedToStagingAt || undefined,
      deployedToProductionAt: body.deployedToProductionAt || undefined,
    };

    await featureStorage.save(feature);
    return NextResponse.json(feature, { status: 201 });
  } catch (error) {
    console.error('Error creating feature:', error);
    return NextResponse.json(
      { error: 'Failed to create feature' },
      { status: 500 }
    );
  }
}
