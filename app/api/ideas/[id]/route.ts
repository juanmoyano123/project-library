import { NextRequest, NextResponse } from 'next/server';
import { ideaStorage } from '@/lib/postgres-storage';

// GET /api/ideas/[id] - Get specific idea
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idea = await ideaStorage.get(id);

    if (!idea) {
      return NextResponse.json(
        { error: 'Idea not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(idea);
  } catch (error) {
    console.error('Error fetching idea:', error);
    return NextResponse.json(
      { error: 'Failed to fetch idea' },
      { status: 500 }
    );
  }
}

// PUT /api/ideas/[id] - Update idea
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = await request.json();

    // Obtener idea existente
    const existing = await ideaStorage.get(id);
    if (!existing) {
      return NextResponse.json(
        { error: 'Idea not found' },
        { status: 404 }
      );
    }

    // Validar urgencia si se está actualizando
    if (updates.urgencia && !['baja', 'media', 'alta', 'crítica'].includes(updates.urgencia)) {
      return NextResponse.json(
        { error: 'Invalid urgencia value. Must be: baja, media, alta, or crítica' },
        { status: 400 }
      );
    }

    // Validar complejidadTecnica si se está actualizando
    if (updates.complejidadTecnica !== undefined && (updates.complejidadTecnica < 1 || updates.complejidadTecnica > 5)) {
      return NextResponse.json(
        { error: 'Invalid complejidadTecnica value. Must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Actualizar idea
    const updated = {
      ...existing,
      ...updates,
      id, // Asegurar que el ID no se cambie
    };

    await ideaStorage.save(updated);

    // Retornar la idea actualizada
    const savedIdea = await ideaStorage.get(id);
    return NextResponse.json(savedIdea);
  } catch (error) {
    console.error('Error updating idea:', error);
    return NextResponse.json(
      { error: 'Failed to update idea' },
      { status: 500 }
    );
  }
}

// DELETE /api/ideas/[id] - Delete idea
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verificar que existe
    const existing = await ideaStorage.get(id);
    if (!existing) {
      return NextResponse.json(
        { error: 'Idea not found' },
        { status: 404 }
      );
    }

    await ideaStorage.delete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting idea:', error);
    return NextResponse.json(
      { error: 'Failed to delete idea' },
      { status: 500 }
    );
  }
}
