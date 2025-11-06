import { NextRequest, NextResponse } from 'next/server';
import { validationStorage } from '@/lib/postgres-storage';

// GET /api/validations/[id] - Get specific validation
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const validation = await validationStorage.get(id);

    if (!validation) {
      return NextResponse.json(
        { error: 'Validation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(validation);
  } catch (error) {
    console.error('Error fetching validation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch validation' },
      { status: 500 }
    );
  }
}

// PUT /api/validations/[id] - Update validation (e.g., change status)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    // Validar que status sea válido
    if (status && !['draft', 'approved'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be "draft" or "approved"' },
        { status: 400 }
      );
    }

    // Obtener validación existente
    const existing = await validationStorage.get(id);
    if (!existing) {
      return NextResponse.json(
        { error: 'Validation not found' },
        { status: 404 }
      );
    }

    // Actualizar validación
    const updated = {
      ...existing,
      ...body,
    };

    await validationStorage.save(updated);

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating validation:', error);
    return NextResponse.json(
      { error: 'Failed to update validation' },
      { status: 500 }
    );
  }
}
