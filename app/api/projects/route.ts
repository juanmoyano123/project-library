import { NextRequest, NextResponse } from 'next/server';
import { projectStorage } from '@/lib/postgres-storage';

export async function GET() {
  try {
    const projects = await projectStorage.getAll();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const project = await request.json();
    await projectStorage.save(project);
    return NextResponse.json(project);
  } catch (error) {
    console.error('Error saving project:', error);
    return NextResponse.json(
      { error: 'Failed to save project' },
      { status: 500 }
    );
  }
}
