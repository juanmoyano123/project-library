import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

const IMPROVEMENT_SYSTEM_PROMPT = `Eres un experto en optimizar prompts para desarrollo de software con IA.

Tu tarea es tomar un prompt inicial y mejorarlo para que sea más:
- Específico y detallado
- Técnicamente preciso
- Con casos edge considerados
- Con mejores prácticas incluidas
- Estructurado y claro

Mantén la intención original del usuario pero hazlo mucho más efectivo para obtener una respuesta de calidad de un asistente de IA.

IMPORTANTE:
- NO ejecutes el prompt, solo mejóralo
- NO agregues explicaciones adicionales
- Devuelve ÚNICAMENTE el prompt mejorado
- Mantén el mismo idioma del prompt original`;

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required and must be a string' },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY not configured' },
        { status: 500 }
      );
    }

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      system: IMPROVEMENT_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const improvedPrompt = message.content[0].type === 'text'
      ? message.content[0].text
      : '';

    return NextResponse.json({
      improved: improvedPrompt,
      tokens: message.usage.input_tokens + message.usage.output_tokens,
      model: message.model,
    });

  } catch (error: any) {
    console.error('Error improving prompt:', error);

    return NextResponse.json(
      {
        error: 'Failed to improve prompt',
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}
