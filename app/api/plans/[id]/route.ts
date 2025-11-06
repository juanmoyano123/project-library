import { NextResponse } from 'next/server';
import { productPlanStorage } from '@/lib/postgres-storage';
import { ProductPlan } from '@/lib/types';

// GET /api/plans/[id] - Get a specific product plan
export async function GET(
  request: Request,
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

// PATCH /api/plans/[id] - Update a product plan
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await productPlanStorage.get(id);
    if (!existing) {
      return NextResponse.json(
        { error: 'Product plan not found' },
        { status: 404 }
      );
    }

    const updated: ProductPlan = {
      ...existing,
      ...body,
      id, // Ensure ID doesn't change
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
