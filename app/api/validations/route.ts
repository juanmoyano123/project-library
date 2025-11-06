import { NextResponse } from 'next/server';
import { validationStorage } from '@/lib/postgres-storage';
import { Validation } from '@/lib/types';
import { nanoid } from 'nanoid';

// GET /api/validations?projectId=xxx - Get validations for a project
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

    const validations = await validationStorage.getByProject(projectId);

    // Sort by validation date, newest first
    validations.sort((a, b) => {
      return new Date(b.validationDate).getTime() - new Date(a.validationDate).getTime();
    });

    return NextResponse.json(validations);
  } catch (error) {
    console.error('Error fetching validations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch validations' },
      { status: 500 }
    );
  }
}

// POST /api/validations - Create a new validation
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation: Validation = {
      id: body.id || nanoid(),
      projectId: body.projectId,
      rawIdea: body.rawIdea,
      targetMarket: body.targetMarket,
      verdict: body.verdict,
      confidenceScore: body.confidenceScore,
      marketAnalysis: body.marketAnalysis || {},
      problemAnalysis: body.problemAnalysis,
      solutionProposal: body.solutionProposal,
      adaptationsNeeded: body.adaptationsNeeded,
      barriers: body.barriers,
      stackRecommendation: body.stackRecommendation || {},
      coreFeatures: body.coreFeatures || [],
      outOfScope: body.outOfScope,
      estimatedWeeks: body.estimatedWeeks,
      estimatedBudget: body.estimatedBudget,
      validatedBy: body.validatedBy || 'Claude Sonnet 4',
      validationDate: body.validationDate || new Date().toISOString(),
      markdownOutput: body.markdownOutput,
      createdAt: body.createdAt || new Date().toISOString(),
      status: body.status || 'draft',
      source: body.source || 'ai',
    };

    await validationStorage.save(validation);
    return NextResponse.json(validation, { status: 201 });
  } catch (error) {
    console.error('Error creating validation:', error);
    return NextResponse.json(
      { error: 'Failed to create validation' },
      { status: 500 }
    );
  }
}
