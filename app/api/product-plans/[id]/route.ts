import { NextRequest, NextResponse } from 'next/server';
import { productPlanStorage } from '@/lib/postgres-storage';

// GET /api/product-plans/[id] - Get specific product plan
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const plan = await productPlanStorage.get(id);

    if (!plan) {
      return NextResponse.json(
        { error: 'Product plan not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(plan);
  } catch (error) {
    console.error('Error fetching product plan:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product plan' },
      { status: 500 }
    );
  }
}

// PUT /api/product-plans/[id] - Update product plan (e.g., change status)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    // Validar que status sea válido si se proporciona
    if (status && !['draft', 'approved'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be "draft" or "approved"' },
        { status: 400 }
      );
    }

    // Obtener plan existente
    const existing = await productPlanStorage.get(id);
    if (!existing) {
      return NextResponse.json(
        { error: 'Product plan not found' },
        { status: 404 }
      );
    }

    // Actualizar plan
    const updated = {
      ...existing,
      ...body,
      // Si se aprueba, agregar fecha de aprobación
      approvedAt: status === 'approved' ? new Date().toISOString() : existing.approvedAt,
    };

    await productPlanStorage.save(updated);

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating product plan:', error);
    return NextResponse.json(
      { error: 'Failed to update product plan' },
      { status: 500 }
    );
  }
}
