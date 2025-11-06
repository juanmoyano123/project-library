import { NextRequest, NextResponse } from 'next/server';
import { promptStorage } from '@/lib/postgres-storage';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId');

    if (projectId) {
      const prompts = await promptStorage.getByProject(projectId);
      return NextResponse.json(prompts);
    }

    const prompts = await promptStorage.getAll();
    return NextResponse.json(prompts);
  } catch (error) {
    console.error('Error fetching prompts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prompts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const prompt = await request.json();
    await promptStorage.save(prompt);
    return NextResponse.json(prompt);
  } catch (error) {
    console.error('Error saving prompt:', error);
    return NextResponse.json(
      { error: 'Failed to save prompt' },
      { status: 500 }
    );
  }
}
