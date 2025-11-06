import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { validationStorage } from '@/lib/postgres-storage';
import { nanoid } from 'nanoid';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

const VALIDATION_SYSTEM_PROMPT = `Eres un experto analista de producto especializado en validación de ideas de negocios para mercados USA y LATAM.

Tu tarea es analizar ideas de negocio y determinar su viabilidad, especialmente considerando la adaptación de modelos exitosos de USA a mercados LATAM.

IMPORTANTE:
- Debes responder ÚNICAMENTE con un objeto JSON válido
- NO agregues texto antes o después del JSON
- NO uses markdown code blocks
- El JSON debe seguir EXACTAMENTE este schema:

{
  "verdict": "go" | "validate_more" | "no_go",
  "confidenceScore": number (0-100),
  "marketAnalysis": {
    "size": string,
    "growth": string,
    "competition": string,
    "usaComparison": string
  },
  "problemAnalysis": string,
  "solutionProposal": string,
  "adaptationsNeeded": [string],
  "barriers": [string],
  "stackRecommendation": {
    "frontend": string,
    "backend": string,
    "database": string,
    "payment": string,
    "auth": string
  },
  "coreFeatures": [string],
  "outOfScope": [string],
  "estimatedWeeks": number,
  "estimatedBudget": number
}

CRITERIOS DE VEREDICTO:
- "go": Idea viable, problema real, solución clara, competencia manejable, go to market claro
- "validate_more": Idea prometedora pero necesita más investigación o pivoteo
- "no_go": Idea no viable, problema muy pequeño, competencia dominante, o barreras insuperables

Considera:
1. ¿El problema es real y doloroso?
2. ¿La solución es viable técnicamente?
3. ¿Hay competencia? ¿Cómo diferenciarse?
4. ¿Barreras regulatorias en LATAM?
5. ¿Payment methods disponibles?
6. ¿Stack técnico apropiado?
7. ¿MVP factible en 8-12 semanas?`;

export async function POST(request: NextRequest) {
  try {
    const { projectId, rawIdea, targetMarket } = await request.json();

    if (!projectId || !rawIdea || !targetMarket) {
      return NextResponse.json(
        { error: 'projectId, rawIdea, and targetMarket are required' },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY not configured' },
        { status: 500 }
      );
    }

    const userPrompt = `Analiza esta idea de negocio:

IDEA: ${rawIdea}

MERCADO OBJETIVO: ${targetMarket}

Por favor analiza la viabilidad considerando:
- Tamaño de mercado y crecimiento en ${targetMarket}
- Competencia actual (busca ejemplos de USA si aplica)
- Barreras de entrada específicas de ${targetMarket} (regulatorias, pago, etc.)
- Stack técnico recomendado para ${targetMarket}
- Features core para un MVP viable
- Estimación realista de tiempo y presupuesto

Devuelve tu análisis en el formato JSON especificado.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      temperature: 0.7,
      system: VALIDATION_SYSTEM_PROMPT,
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

    // Parse JSON response
    let analysisData;
    try {
      analysisData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse Claude response:', responseText);
      return NextResponse.json(
        { error: 'Failed to parse validation response', details: responseText },
        { status: 500 }
      );
    }

    // Create validation object
    const validation = {
      id: nanoid(),
      projectId,
      rawIdea,
      targetMarket,
      verdict: analysisData.verdict,
      confidenceScore: analysisData.confidenceScore,
      marketAnalysis: analysisData.marketAnalysis || {},
      problemAnalysis: analysisData.problemAnalysis,
      solutionProposal: analysisData.solutionProposal,
      adaptationsNeeded: analysisData.adaptationsNeeded || [],
      barriers: analysisData.barriers || [],
      stackRecommendation: analysisData.stackRecommendation || {},
      coreFeatures: analysisData.coreFeatures || [],
      outOfScope: analysisData.outOfScope || [],
      estimatedWeeks: analysisData.estimatedWeeks,
      estimatedBudget: analysisData.estimatedBudget,
      validatedBy: 'Claude Sonnet 4',
      validationDate: new Date().toISOString(),
      markdownOutput: generateMarkdown(analysisData, rawIdea, targetMarket),
      createdAt: new Date().toISOString(),
      status: 'draft' as const,  // AI validations start as draft
      source: 'ai' as const,     // This came from AI analysis
    };

    // Save to database
    await validationStorage.save(validation);

    return NextResponse.json(validation);

  } catch (error: any) {
    console.error('Error validating idea:', error);

    return NextResponse.json(
      {
        error: 'Failed to validate idea',
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function generateMarkdown(data: any, idea: string, market: string): string {
  const verdictEmojiMap: Record<string, string> = {
    go: '✅',
    validate_more: '⚠️',
    no_go: '❌',
  };
  const verdictEmoji = verdictEmojiMap[data.verdict as string] || '❓';

  return `# Validación de Idea

## ${verdictEmoji} Veredicto: ${data.verdict.toUpperCase()}
**Confianza:** ${data.confidenceScore}%
**Mercado:** ${market}

## 💡 Idea Original
${idea}

## 📊 Análisis de Mercado
- **Tamaño:** ${data.marketAnalysis?.size || 'N/A'}
- **Crecimiento:** ${data.marketAnalysis?.growth || 'N/A'}
- **Competencia:** ${data.marketAnalysis?.competition || 'N/A'}
- **Comparación USA:** ${data.marketAnalysis?.usaComparison || 'N/A'}

## 🎯 Análisis del Problema
${data.problemAnalysis || 'N/A'}

## 💡 Solución Propuesta
${data.solutionProposal || 'N/A'}

## 🔄 Adaptaciones Necesarias
${data.adaptationsNeeded?.map((a: string) => `- ${a}`).join('\n') || 'Ninguna'}

## 🚧 Barreras Identificadas
${data.barriers?.map((b: string) => `- ${b}`).join('\n') || 'Ninguna'}

## 🛠 Stack Tecnológico Recomendado
- **Frontend:** ${data.stackRecommendation?.frontend || 'N/A'}
- **Backend:** ${data.stackRecommendation?.backend || 'N/A'}
- **Database:** ${data.stackRecommendation?.database || 'N/A'}
- **Pagos:** ${data.stackRecommendation?.payment || 'N/A'}
- **Auth:** ${data.stackRecommendation?.auth || 'N/A'}

## ✨ Features Core (MVP)
${data.coreFeatures?.map((f: string) => `- ${f}`).join('\n') || 'N/A'}

## 🚫 Fuera de Scope (v1)
${data.outOfScope?.map((f: string) => `- ${f}`).join('\n') || 'N/A'}

## ⏱ Estimación
- **Tiempo:** ${data.estimatedWeeks || '?'} semanas
- **Presupuesto:** $${data.estimatedBudget?.toLocaleString() || '?'} USD

---
*Validación generada por Claude Sonnet 4*
`;
}
