import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { productPlanStorage, featureStorage } from '@/lib/postgres-storage';
import { Feature } from '@/lib/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

const FEATURE_GENERATION_SYSTEM_PROMPT = `Eres un Product Manager experto especializado en descomponer PRDs (Product Requirements Documents) en features ejecutables siguiendo metodologías ágiles.

Tu tarea es analizar un PRD completo y extraer features técnicas estructuradas para un equipo de desarrollo.

IMPORTANTE:
- Debes responder ÚNICAMENTE con un objeto JSON válido
- NO agregues texto antes o después del JSON
- NO uses markdown code blocks
- El JSON debe seguir EXACTAMENTE este schema:

{
  "features": [
    {
      "name": string (max 80 chars),
      "description": string,
      "userStory": string (formato: "Given [context] When [action] Then [outcome]"),
      "priority": "P0" | "P1" | "P2",
      "riceScore": {
        "reach": number (1-10),
        "impact": number (1-10),
        "confidence": number (1-10, representa porcentaje dividido por 10),
        "effort": number (1-10),
        "score": number (calculado: (reach * impact * confidence) / effort)
      },
      "acceptanceCriteria": [
        {
          "given": string,
          "when": string,
          "then": string
        }
      ],
      "estimatedHours": number,
      "dependencies": [string] (nombres de features de las que depende, usar nombres exactos)
    }
  ]
}

CRITERIOS DE EXTRACCIÓN:

1. **Priorización (P0/P1/P2):**
   - P0: Features críticas para MVP, sin ellas el producto no funciona
   - P1: Features importantes que agregan valor significativo pero no bloquean el MVP
   - P2: Features nice-to-have, mejoras futuras

2. **RICE Score:**
   - Reach (1-10): ¿Cuántos usuarios impacta? 10=todos, 5=la mitad, 1=nicho muy pequeño
   - Impact (1-10): ¿Qué tan grande es el impacto? 10=transformacional, 5=moderado, 1=mínimo
   - Confidence (1-10): ¿Qué tan seguros estamos? 10=100%, 5=50%, 1=10%
   - Effort (1-10): ¿Cuánto esfuerzo requiere? 10=muchísimo, 5=moderado, 1=trivial
   - Score = (Reach × Impact × Confidence) / Effort

3. **User Stories:**
   - Siempre en formato Given-When-Then
   - Given: Contexto/precondiciones
   - When: Acción del usuario
   - Then: Resultado esperado

4. **Acceptance Criteria:**
   - Mínimo 2, máximo 5 criterios por feature
   - Cada criterio en formato Given-When-Then
   - Deben ser testables y específicos

5. **Estimación de Horas:**
   - Considera: diseño, desarrollo, testing, code review
   - Sé realista: features complejas pueden ser 40-80 horas
   - Features simples: 4-16 horas

6. **Dependencies:**
   - Identifica features que deben completarse antes
   - Usa el nombre EXACTO de la feature como aparece en el array
   - Si no hay dependencias, array vacío []

7. **Granularidad:**
   - Divide features grandes en features más pequeñas y manejables
   - Cada feature debería ser completable en 1-2 semanas máximo
   - Si una feature tiene >80 horas, probablemente deba dividirse

EJEMPLOS DE BUENAS FEATURES:

{
  "name": "Sistema de autenticación de usuarios",
  "description": "Implementar autenticación segura con email/password usando NextAuth, incluyendo registro, login, logout y recuperación de contraseña.",
  "userStory": "Given I am a new user When I complete the registration form with valid email and password Then my account is created and I receive a verification email",
  "priority": "P0",
  "riceScore": {
    "reach": 10,
    "impact": 10,
    "confidence": 9,
    "effort": 6,
    "score": 150
  },
  "acceptanceCriteria": [
    {
      "given": "I am on the registration page",
      "when": "I submit valid credentials",
      "then": "my account is created in the database"
    },
    {
      "given": "I have a valid account",
      "when": "I enter correct email and password",
      "then": "I am logged in and redirected to dashboard"
    },
    {
      "given": "I forgot my password",
      "when": "I request password reset",
      "then": "I receive a reset link via email"
    }
  ],
  "estimatedHours": 32,
  "dependencies": []
}

Analiza el PRD cuidadosamente y extrae TODAS las features necesarias para implementar el producto completo.`;

export async function POST(request: NextRequest) {
  try {
    const { planId, projectId } = await request.json();

    if (!planId || !projectId) {
      return NextResponse.json(
        { error: 'planId and projectId are required' },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY not configured' },
        { status: 500 }
      );
    }

    // Fetch the product plan
    const plan = await productPlanStorage.get(planId);
    if (!plan) {
      return NextResponse.json(
        { error: 'Product plan not found' },
        { status: 404 }
      );
    }

    // Build comprehensive PRD context for Claude
    const prdContext = `
# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## Problem Statement
${plan.problemStatement}

## Solution Statement
${plan.solutionStatement}

## Value Proposition
${plan.valueProposition}

## User Persona
${JSON.stringify(plan.persona, null, 2)}

## User Journey
${plan.userJourney ? JSON.stringify(plan.userJourney, null, 2) : 'Not specified'}

## Success Metrics
${JSON.stringify(plan.successMetrics, null, 2)}

## Tech Stack
${JSON.stringify(plan.techStack, null, 2)}

## Dependencies
${plan.dependencies ? JSON.stringify(plan.dependencies, null, 2) : 'None specified'}

## Timeline
${plan.estimatedTimelineDays ? `${plan.estimatedTimelineDays} days` : 'Not specified'}

## Milestones
${plan.milestones ? JSON.stringify(plan.milestones, null, 2) : 'Not specified'}

---

Por favor analiza este PRD y extrae todas las features necesarias en el formato JSON especificado.
Considera el tech stack, las métricas de éxito, y el timeline para hacer estimaciones realistas.
`;

    // Call Claude Opus 4
    const message = await anthropic.messages.create({
      model: 'claude-opus-4-20250514',
      max_tokens: 8192,
      temperature: 0.3, // Lower temperature for more consistent structured output
      system: FEATURE_GENERATION_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: prdContext,
        },
      ],
    });

    const responseText = message.content[0].type === 'text'
      ? message.content[0].text
      : '';

    // Parse JSON response
    let analysisData: { features: any[] };
    try {
      analysisData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse Claude response:', responseText);
      return NextResponse.json(
        { error: 'Failed to parse feature generation response', details: responseText },
        { status: 500 }
      );
    }

    if (!analysisData.features || !Array.isArray(analysisData.features)) {
      return NextResponse.json(
        { error: 'Invalid response format: features array not found' },
        { status: 500 }
      );
    }

    // Generate feature IDs and resolve dependencies
    const featureNameToId = new Map<string, string>();
    const features: Feature[] = [];

    // First pass: create all features with IDs
    analysisData.features.forEach((featureData, index) => {
      const featureId = `F-${String(index + 1).padStart(3, '0')}`;
      featureNameToId.set(featureData.name, featureId);
    });

    // Second pass: create full Feature objects with resolved dependencies
    analysisData.features.forEach((featureData, index) => {
      const featureId = `F-${String(index + 1).padStart(3, '0')}`;

      // Resolve dependency names to IDs
      const dependencies = (featureData.dependencies || [])
        .map((depName: string) => featureNameToId.get(depName))
        .filter((id: string | undefined): id is string => id !== undefined);

      const feature: Feature = {
        id: featureId,
        projectId,
        planId,
        name: featureData.name,
        description: featureData.description || undefined,
        userStory: featureData.userStory,
        priority: featureData.priority,
        riceScore: featureData.riceScore,
        dependencies: dependencies.length > 0 ? dependencies : undefined,
        blocksFeatures: undefined, // Will be calculated from reverse dependencies
        status: 'todo',
        acceptanceCriteria: featureData.acceptanceCriteria || [],
        estimatedHours: featureData.estimatedHours,
        createdAt: new Date().toISOString(),
      };

      features.push(feature);
    });

    // Calculate blocksFeatures (reverse dependencies)
    features.forEach(feature => {
      if (feature.dependencies && feature.dependencies.length > 0) {
        feature.dependencies.forEach(depId => {
          const blockedFeature = features.find(f => f.id === depId);
          if (blockedFeature) {
            if (!blockedFeature.blocksFeatures) {
              blockedFeature.blocksFeatures = [];
            }
            blockedFeature.blocksFeatures.push(feature.id);
          }
        });
      }
    });

    // Save all features to database
    await Promise.all(features.map(feature => featureStorage.save(feature)));

    return NextResponse.json({
      success: true,
      count: features.length,
      features,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error generating features:', error);

    return NextResponse.json(
      {
        error: 'Failed to generate features',
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}
