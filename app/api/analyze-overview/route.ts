import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { STAGE_NAMES } from '@/lib/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

const ANALYSIS_SYSTEM_PROMPT = `Eres un experto en gestión de proyectos de desarrollo de software.

Analiza el overview del proyecto y genera un plan de acción detallado dividido en las 9 etapas:
0. Inicialización
1. Discovery
2. Diseño
3. Setup
4. Backend
5. Frontend
6. Testing
7. Deploy
8. Docs

Para cada etapa, genera:
- 3-6 tareas específicas y accionables
- Descripción clara de cada tarea
- Prioridad (low, medium, high)
- Estimación de días para completar la etapa
- Dependencias lógicas entre etapas

IMPORTANTE:
- Sé específico y técnico
- Considera las mejores prácticas
- Identifica riesgos y bloqueadores potenciales
- Asegura que las tareas sean medibles
- Devuelve ÚNICAMENTE un JSON válido sin explicaciones adicionales

Formato JSON de respuesta:
{
  "stages": [
    {
      "stage": 0,
      "estimatedDuration": 3,
      "tasks": [
        {
          "title": "Título de la tarea",
          "description": "Descripción detallada",
          "priority": "high",
          "estimatedDays": 1
        }
      ]
    }
  ]
}`;

export async function POST(request: NextRequest) {
  try {
    const { overview, projectName, tags } = await request.json();

    if (!overview || typeof overview !== 'string') {
      return NextResponse.json(
        { error: 'Overview is required' },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY not configured' },
        { status: 500 }
      );
    }

    const userPrompt = `Proyecto: ${projectName || 'Sin nombre'}
Tags: ${tags?.join(', ') || 'Ninguno'}

Overview del proyecto:
${overview}

Genera un plan de acción detallado con tareas específicas para cada etapa.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      system: ANALYSIS_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    const responseText = message.content[0].type === 'text'
      ? message.content[0].text
      : '';

    // Parse the JSON response
    const planData = JSON.parse(responseText);

    return NextResponse.json({
      plan: planData,
      tokens: message.usage.input_tokens + message.usage.output_tokens,
      model: message.model,
    });

  } catch (error: any) {
    console.error('Error analyzing overview:', error);

    // If it's a JSON parse error, try to extract JSON from the response
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          error: 'Failed to parse AI response',
          details: error.message
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to analyze overview',
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}
