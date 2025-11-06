import { NextRequest, NextResponse } from 'next/server';
import { featureStorage } from '@/lib/postgres-storage';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/features/[id] - Get a specific feature
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    const feature = await featureStorage.get(id);

    if (!feature) {
      return NextResponse.json(
        { error: 'Feature not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(feature);
  } catch (error) {
    console.error('Error fetching feature:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feature' },
      { status: 500 }
    );
  }
}

// PUT /api/features/[id] - Update a feature
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const body = await request.json();

    console.log('🔍 API PUT /api/features/[id] received:', {
      id,
      body,
      bodyKeys: Object.keys(body),
    });

    // Get existing feature
    const existingFeature = await featureStorage.get(id);
    if (!existingFeature) {
      console.log('❌ Feature not found:', id);
      return NextResponse.json(
        { error: 'Feature not found' },
        { status: 404 }
      );
    }

    console.log('📦 Existing feature:', {
      id: existingFeature.id,
      name: existingFeature.name,
      currentStatus: existingFeature.status,
    });

    // Merge updates with existing feature
    const updatedFeature = {
      ...existingFeature,
      ...body,
      id, // Ensure ID doesn't change
      projectId: existingFeature.projectId, // Ensure projectId doesn't change
      createdAt: existingFeature.createdAt, // Ensure createdAt doesn't change
    };

    console.log('🔄 Updated feature before save:', {
      id: updatedFeature.id,
      name: updatedFeature.name,
      status: updatedFeature.status,
      statusType: typeof updatedFeature.status,
    });

    // Auto-set timestamps based on status changes
    if (body.status && body.status !== existingFeature.status) {
      const now = new Date().toISOString();

      if (body.status === 'in_progress' && !updatedFeature.startedAt) {
        updatedFeature.startedAt = now;
      }

      if (body.status === 'done' && !updatedFeature.completedAt) {
        updatedFeature.completedAt = now;
      }
    }

    console.log('💾 Calling featureStorage.save with:', {
      id: updatedFeature.id,
      status: updatedFeature.status,
    });

    await featureStorage.save(updatedFeature);

    console.log('✅ Feature saved successfully');

    return NextResponse.json(updatedFeature);
  } catch (error) {
    console.error('❌ Error updating feature:', error);
    return NextResponse.json(
      { error: 'Failed to update feature' },
      { status: 500 }
    );
  }
}

// DELETE /api/features/[id] - Delete a feature
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    const existingFeature = await featureStorage.get(id);
    if (!existingFeature) {
      return NextResponse.json(
        { error: 'Feature not found' },
        { status: 404 }
      );
    }

    await featureStorage.delete(id);
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error deleting feature:', error);
    return NextResponse.json(
      { error: 'Failed to delete feature' },
      { status: 500 }
    );
  }
}
