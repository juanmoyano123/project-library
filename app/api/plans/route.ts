import { NextResponse } from 'next/server';
import { productPlanStorage } from '@/lib/postgres-storage';
import { ProductPlan } from '@/lib/types';
import { nanoid } from 'nanoid';

// GET /api/plans?projectId=xxx - Get product plans for a project
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json(
        { error: 'projectId is required' },
        { status: 400 }
      );
    }

    const plans = await productPlanStorage.getByProject(projectId);
    return NextResponse.json(plans);
  } catch (error) {
    console.error('Error fetching product plans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product plans' },
      { status: 500 }
    );
  }
}

// POST /api/plans - Create a new product plan
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const plan: ProductPlan = {
      id: body.id || nanoid(),
      projectId: body.projectId,
      validationId: body.validationId,
      problemStatement: body.problemStatement,
      solutionStatement: body.solutionStatement,
      valueProposition: body.valueProposition,
      persona: body.persona || {},
      userJourney: body.userJourney,
      successMetrics: body.successMetrics || [],
      techStack: body.techStack || {},
      dependencies: body.dependencies,
      estimatedTimelineDays: body.estimatedTimelineDays,
      milestones: body.milestones,
      createdBy: body.createdBy || 'Claude Opus 4',
      createdAt: body.createdAt || new Date().toISOString(),
      approvedAt: body.approvedAt,
      markdownOutput: body.markdownOutput,
      status: body.status || 'draft',
      source: body.source || 'manual',
    };

    await productPlanStorage.save(plan);
    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    console.error('Error creating product plan:', error);
    return NextResponse.json(
      { error: 'Failed to create product plan' },
      { status: 500 }
    );
  }
}
