import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { validationStorage, productPlanStorage } from '@/lib/postgres-storage';
import { nanoid } from 'nanoid';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

const PRD_SYSTEM_PROMPT = `Eres un Product Manager senior experto en crear Product Requirements Documents (PRDs) de nivel Google/Meta.

Tu tarea es tomar una idea validada exitosamente y transformarla en un PRD completo, detallado y accionable.

IMPORTANTE:
- Debes responder ÚNICAMENTE con un objeto JSON válido
- NO agregues texto antes o después del JSON
- NO uses markdown code blocks
- El JSON debe seguir EXACTAMENTE este schema:

{
  "executiveSummary": {
    "vision": string (2-3 oraciones de la visión del producto),
    "problemStatement": string (el problema core que resolvemos),
    "solutionStatement": string (cómo lo resolvemos),
    "valueProposition": string (por qué somos diferentes/mejores)
  },
  "userPersonas": [
    {
      "name": string,
      "age": string (ej: "28-35"),
      "occupation": string,
      "location": string,
      "techSavviness": string ("low" | "medium" | "high"),
      "painPoints": [string, string, string],
      "goals": [string, string, string],
      "behaviors": [string, string],
      "quote": string (una frase que esta persona diría)
    }
  ],
  "featuresWithRICE": [
    {
      "id": string (ej: "F-001"),
      "name": string,
      "description": string (1-2 líneas),
      "reach": number (usuarios afectados por quarter: 1-10000),
      "impact": number (1=minimal, 2=low, 3=medium, 4=high, 5=massive),
      "confidence": number (0-100),
      "effort": number (person-weeks: 0.5-20),
      "riceScore": number (calculado: (reach * impact * confidence/100) / effort),
      "priority": string ("must-have" | "should-have" | "nice-to-have"),
      "acceptanceCriteria": [
        {
          "given": string,
          "when": string,
          "then": string
        }
      ]
    }
  ],
  "techStack": {
    "frontend": {
      "framework": string,
      "justification": string (por qué esta elección)
    },
    "backend": {
      "framework": string,
      "justification": string
    },
    "database": {
      "type": string,
      "justification": string
    },
    "hosting": {
      "platform": string,
      "justification": string
    },
    "payments": {
      "provider": string,
      "justification": string
    },
    "auth": {
      "provider": string,
      "justification": string
    }
  },
  "successMetrics": [
    {
      "category": string ("Acquisition" | "Activation" | "Retention" | "Revenue" | "Referral"),
      "metric": string (nombre del KPI),
      "target": string (objetivo específico con número),
      "industryBenchmark": string (benchmark de la industria),
      "measuredBy": string (cómo se mide)
    }
  ],
  "timeline": {
    "totalWeeks": number (12 por defecto),
    "phases": [
      {
        "week": string (ej: "1-2"),
        "phase": string (ej: "Foundation"),
        "milestones": [string],
        "deliverables": [string],
        "dependencies": [string] (qué debe estar listo antes)
      }
    ]
  },
  "outOfScope": [
    {
      "feature": string,
      "reason": string (por qué no está en v1)
    }
  ],
  "risks": [
    {
      "risk": string,
      "impact": string ("low" | "medium" | "high"),
      "mitigation": string
    }
  ]
}

CRITERIOS DE CALIDAD:

1. **Executive Summary**: Debe ser claro, conciso y convencer stakeholders en 30 segundos
2. **User Personas**: 2-3 personas realistas con detalles específicos (no genéricos)
3. **RICE Scoring**:
   - Reach: Basado en market size de la validación
   - Impact: Alineado con pain points de usuarios
   - Confidence: Basado en data disponible
   - Effort: Realista considerando el stack
   - Ordenar features por RICE score descendente
4. **Acceptance Criteria**: Given-When-Then format, específicos y testables
5. **Tech Stack**: Justificaciones basadas en:
   - Mercado objetivo (LATAM vs USA)
   - Costos
   - Developer experience
   - Time to market
   - Escalabilidad
6. **Success Metrics**: KPIs SMART con benchmarks reales de la industria
7. **Timeline**: 12 semanas máximo, con dependencias claras
8. **Out of Scope**: Features que NO hacer en v1 con razones válidas

CONTEXTO DEL MERCADO:
- Si es LATAM: considerar payment methods locales (Mercado Pago, PIX), WhatsApp Business, infraestructura limitada
- Si es USA: considerar Stripe, SMS, mejor infraestructura

Genera un PRD profesional, detallado y listo para ejecución.`;

export async function POST(request: NextRequest) {
  try {
    const { projectId, validationId } = await request.json();

    if (!projectId || !validationId) {
      return NextResponse.json(
        { error: 'projectId and validationId are required' },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY not configured' },
        { status: 500 }
      );
    }

    // Obtener la validación
    const validations = await validationStorage.getByProject(projectId);
    const validation = validations.find((v) => v.id === validationId);

    if (!validation) {
      return NextResponse.json(
        { error: 'Validation not found' },
        { status: 404 }
      );
    }

    if (validation.verdict !== 'go') {
      return NextResponse.json(
        { error: 'Only GO validations can generate PRDs' },
        { status: 400 }
      );
    }

    // Preparar prompt con datos de la validación
    const userPrompt = `Genera un PRD completo basado en esta validación exitosa:

**Idea Original:** ${validation.rawIdea}

**Mercado Objetivo:** ${validation.targetMarket}

**Análisis de Mercado:**
- Tamaño: ${validation.marketAnalysis.size || 'N/A'}
- Crecimiento: ${validation.marketAnalysis.growth || 'N/A'}
- Competencia: ${validation.marketAnalysis.competition || 'N/A'}
${validation.marketAnalysis.usaComparison ? `- Comparación USA: ${validation.marketAnalysis.usaComparison}` : ''}

**Problema:** ${validation.problemAnalysis}

**Solución:** ${validation.solutionProposal}

**Adaptaciones Necesarias:**
${validation.adaptationsNeeded?.map((a) => `- ${a}`).join('\n') || 'Ninguna'}

**Barreras:**
${validation.barriers?.map((b) => `- ${b}`).join('\n') || 'Ninguna'}

**Stack Recomendado:**
- Frontend: ${validation.stackRecommendation.frontend || 'N/A'}
- Backend: ${validation.stackRecommendation.backend || 'N/A'}
- Database: ${validation.stackRecommendation.database || 'N/A'}
- Payment: ${validation.stackRecommendation.payment || 'N/A'}
- Auth: ${validation.stackRecommendation.auth || 'N/A'}

**Features Core del MVP:**
${validation.coreFeatures.map((f, i) => `${i + 1}. ${f}`).join('\n')}

**Out of Scope (inicial):**
${validation.outOfScope?.map((f) => `- ${f}`).join('\n') || 'N/A'}

**Estimación:**
- Tiempo: ${validation.estimatedWeeks} semanas
- Presupuesto: $${validation.estimatedBudget?.toLocaleString()} USD
- Confianza: ${validation.confidenceScore}%

Por favor genera un PRD completo y profesional en formato JSON.`;

    console.log('Generating PRD with Claude...');

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      temperature: 0.7,
      system: PRD_SYSTEM_PROMPT,
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

    // Clean markdown code blocks if present
    let cleanedJson = responseText.trim();
    if (cleanedJson.startsWith('```json')) {
      cleanedJson = cleanedJson.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanedJson.startsWith('```')) {
      cleanedJson = cleanedJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    // Parse JSON response
    let prdData;
    try {
      prdData = JSON.parse(cleanedJson);
    } catch (parseError) {
      console.error('Failed to parse Claude response:', cleanedJson);
      return NextResponse.json(
        { error: 'Failed to parse PRD response', details: cleanedJson.substring(0, 500) },
        { status: 500 }
      );
    }

    // Create product plan object
    const productPlan = {
      id: nanoid(),
      projectId,
      validationId,
      problemStatement: prdData.executiveSummary.problemStatement,
      solutionStatement: prdData.executiveSummary.solutionStatement,
      valueProposition: prdData.executiveSummary.valueProposition,
      persona: prdData.userPersonas || [],
      userJourney: [],
      successMetrics: prdData.successMetrics || [],
      techStack: prdData.techStack || {},
      dependencies: {
        features: prdData.featuresWithRICE || [],
        timeline: prdData.timeline || {},
        risks: prdData.risks || [],
        outOfScope: prdData.outOfScope || [],
      },
      estimatedTimelineDays: (prdData.timeline?.totalWeeks || 12) * 7,
      milestones: prdData.timeline?.phases || [],
      createdBy: 'Claude Sonnet 4',
      createdAt: new Date().toISOString(),
      markdownOutput: generateMarkdown(prdData, validation),
      status: 'draft' as const,
      source: 'ai' as const,
    };

    // Save to database
    await productPlanStorage.save(productPlan);

    console.log('PRD generated successfully:', productPlan.id);

    return NextResponse.json(productPlan);

  } catch (error: any) {
    console.error('Error generating PRD:', error);

    return NextResponse.json(
      {
        error: 'Failed to generate PRD',
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function generateMarkdown(prdData: any, validation: any): string {
  return `# Product Requirements Document (PRD)

**Generado:** ${new Date().toLocaleDateString('es')}
**Basado en:** ${validation.rawIdea}
**Mercado:** ${validation.targetMarket}

---

## 📋 Executive Summary

### Vision
${prdData.executiveSummary.vision}

### Problem Statement
${prdData.executiveSummary.problemStatement}

### Solution Statement
${prdData.executiveSummary.solutionStatement}

### Value Proposition
${prdData.executiveSummary.valueProposition}

---

## 👥 User Personas

${prdData.userPersonas?.map((persona: any, i: number) => `
### Persona ${i + 1}: ${persona.name}
- **Edad:** ${persona.age}
- **Ocupación:** ${persona.occupation}
- **Ubicación:** ${persona.location}
- **Tech Savviness:** ${persona.techSavviness}

**Pain Points:**
${persona.painPoints?.map((p: string) => `- ${p}`).join('\n')}

**Goals:**
${persona.goals?.map((g: string) => `- ${g}`).join('\n')}

**Behaviors:**
${persona.behaviors?.map((b: string) => `- ${b}`).join('\n')}

**Quote:** _"${persona.quote}"_
`).join('\n---\n') || 'N/A'}

---

## ✨ Features & RICE Scoring

${prdData.featuresWithRICE?.sort((a: any, b: any) => b.riceScore - a.riceScore).map((f: any) => `
### ${f.id}: ${f.name}
**Description:** ${f.description}

**RICE Score:** ${f.riceScore.toFixed(1)} | **Priority:** ${f.priority}
- Reach: ${f.reach} users/quarter
- Impact: ${f.impact}/5
- Confidence: ${f.confidence}%
- Effort: ${f.effort} person-weeks

**Acceptance Criteria:**
${f.acceptanceCriteria?.map((ac: any, i: number) => `
${i + 1}. **Given** ${ac.given}
   **When** ${ac.when}
   **Then** ${ac.then}
`).join('\n')}
`).join('\n---\n') || 'N/A'}

---

## 🛠 Tech Stack

${Object.entries(prdData.techStack || {}).map(([category, data]: [string, any]) => `
### ${category.charAt(0).toUpperCase() + category.slice(1)}
- **Choice:** ${data.framework || data.type || data.provider || data.platform}
- **Justification:** ${data.justification}
`).join('\n')}

---

## 📊 Success Metrics

${prdData.successMetrics?.map((m: any) => `
### ${m.category}: ${m.metric}
- **Target:** ${m.target}
- **Industry Benchmark:** ${m.industryBenchmark}
- **Measured By:** ${m.measuredBy}
`).join('\n') || 'N/A'}

---

## 📅 Timeline (${prdData.timeline?.totalWeeks || 12} semanas)

${prdData.timeline?.phases?.map((phase: any) => `
### Week ${phase.week}: ${phase.phase}

**Milestones:**
${phase.milestones?.map((m: string) => `- ${m}`).join('\n')}

**Deliverables:**
${phase.deliverables?.map((d: string) => `- ${d}`).join('\n')}

${phase.dependencies?.length > 0 ? `**Dependencies:** ${phase.dependencies.join(', ')}` : ''}
`).join('\n') || 'N/A'}

---

## 🚫 Out of Scope (v1)

${prdData.outOfScope?.map((item: any) => `
- **${item.feature}**
  - Reason: ${item.reason}
`).join('\n') || 'N/A'}

---

## ⚠️ Risks & Mitigation

${prdData.risks?.map((risk: any) => `
- **${risk.risk}** (Impact: ${risk.impact})
  - Mitigation: ${risk.mitigation}
`).join('\n') || 'N/A'}

---

*PRD generated by Claude Sonnet 4 - Product Manager AI*
`;
}
