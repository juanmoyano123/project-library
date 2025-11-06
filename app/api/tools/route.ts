import { NextResponse } from 'next/server';
import { toolStorage } from '@/lib/postgres-storage';

// GET /api/tools - Get all tools or filter by category
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    if (category) {
      const tools = await toolStorage.getByCategory(category as any);
      return NextResponse.json(tools);
    }

    const tools = await toolStorage.getAll();
    return NextResponse.json(tools);
  } catch (error) {
    console.error('Error fetching tools:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tools' },
      { status: 500 }
    );
  }
}
