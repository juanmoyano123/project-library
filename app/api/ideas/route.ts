import { NextRequest, NextResponse } from 'next/server';
import { ideaStorage } from '@/lib/postgres-storage';

// GET /api/ideas - Get all ideas
export async function GET(request: NextRequest) {
  try {
    const ideas = await ideaStorage.getAll();
    return NextResponse.json(ideas);
  } catch (error) {
    console.error('Error fetching ideas:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ideas' },
      { status: 500 }
    );
  }
}

// POST /api/ideas - Create new idea
export async function POST(request: NextRequest) {
  try {
    const idea = await request.json();

    // Validar campos requeridos
    if (!idea.id || !idea.problema || !idea.mercadoObjetivo || !idea.urgencia || !idea.solucion || !idea.complejidadTecnica) {
      return NextResponse.json(
        { error: 'Missing required fields: id, problema, mercadoObjetivo, urgencia, solucion, complejidadTecnica' },
        { status: 400 }
      );
    }

    // Validar urgencia
    if (!['baja', 'media', 'alta', 'crítica'].includes(idea.urgencia)) {
      return NextResponse.json(
        { error: 'Invalid urgencia value. Must be: baja, media, alta, or crítica' },
        { status: 400 }
      );
    }

    // Validar complejidadTecnica
    if (idea.complejidadTecnica < 1 || idea.complejidadTecnica > 5) {
      return NextResponse.json(
        { error: 'Invalid complejidadTecnica value. Must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Guardar idea
    await ideaStorage.save(idea);

    // Retornar la idea guardada
    const savedIdea = await ideaStorage.get(idea.id);
    return NextResponse.json(savedIdea, { status: 201 });
  } catch (error) {
    console.error('Error creating idea:', error);
    return NextResponse.json(
      { error: 'Failed to create idea' },
      { status: 500 }
    );
  }
}
