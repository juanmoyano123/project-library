import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

const IDEA_ANALYSIS_SYSTEM_PROMPT = `Eres un experto analista de producto especializado en analizar ideas de negocio y desglosarlas en sus componentes fundamentales.

Tu tarea es tomar una idea de negocio en bruto y analizarla profundamente en 3 dimensiones:
1. DEMANDA (Problema → Mercado)
2. OFERTA (Solución → Herramientas)
3. ANÁLISIS TÉCNICO (Complejidad → Viabilidad)

IMPORTANTE:
- Debes responder ÚNICAMENTE con un objeto JSON válido
- NO agregues texto antes o después del JSON
- NO uses markdown code blocks
- El JSON debe seguir EXACTAMENTE este schema:

{
  "nombre": string (REQUERIDO, 3-50 chars, nombre descriptivo del proyecto basado en categoría y problema. Ejemplos: "Bonds Fintech", "Booking App - Barberías", "Health Tracker SaaS"),
  "problema": string (20-1000 chars, describe el problema que resuelve esta idea),
  "mercadoObjetivo": string (10-500 chars, describe el mercado objetivo específico),
  "urgencia": "baja" | "media" | "alta" | "crítica",
  "tamañoMercado": string (opcional, estimación de TAM/SAM),
  "evidenciaDemanda": string (opcional, evidencia que existe la demanda),
  "solucion": string (20-1000 chars, describe la solución propuesta),
  "herramientasDisponibles": string[] (opcional, tech stack disponible: Next.js, Supabase, etc.),
  "integracionesNecesarias": [
    {
      "nombre": string,
      "api": string (URL de la API),
      "documentacion": string (URL de docs),
      "complejidad": "baja" | "media" | "alta",
      "funcionalidad": string (REQUERIDO, descripción breve de qué funcionalidad específica aporta esta integración a la app. Ejemplos: "Procesamiento de pagos con tarjeta", "Autenticación social con Google/Facebook", "Envío de notificaciones SMS", "Geolocalización y mapas interactivos")
    }
  ],
  "informacionRequerida": string[] (opcional, qué información del usuario necesitas),
  "complejidadTecnica": number (1-5, donde 1=muy fácil, 5=muy difícil),
  "skillsRequeridos": [
    {
      "skill": string (ej: "React", "PostgreSQL", "Stripe API"),
      "nivelNecesario": "junior" | "mid" | "senior",
      "tenemos": boolean (false por defecto, asume que no lo tenemos)
    }
  ],
  "tiempoEstimado": {
    "diseño": number (semanas),
    "desarrollo": number (semanas),
    "testing": number (semanas)
  },
  "bloqueadores": string[] (opcional, posibles bloqueadores o riesgos),
  "categoria": string (ej: "saas", "marketplace", "fintech", "health", etc.),
  "tags": string[] (palabras clave relevantes)
}

CRITERIOS DE ANÁLISIS:

0. **NOMBRE DEL PROYECTO**:
   - Genera un nombre descriptivo y atractivo basado en la categoría y el problema
   - Debe ser corto (3-50 caracteres) pero informativo
   - Ejemplos:
     * Fintech de bonos → "Bonds Fintech"
     * App de turnos para barberías → "Booking App - Barberías"
     * Marketplace de diseñadores → "Designer Marketplace"
     * SaaS de fitness → "Fitness Tracker SaaS"
   - Usa el formato: "[Concepto Principal] - [Industria/Nicho]" o "[Concepto Principal] [Categoría]"

1. **DEMANDA**:
   - Identifica el problema real y doloroso
   - Define el mercado objetivo específico (no genérico)
   - Evalúa la urgencia basándote en qué tan crítico es el problema
   - Busca evidencia de demanda (competidores similares, estadísticas, tendencias)

2. **OFERTA**:
   - Propón una solución clara y viable
   - Recomienda stack técnico moderno y probado (Next.js, Supabase, PostgreSQL, Stripe, etc.)
   - Identifica APIs necesarias (ej: WhatsApp, payment gateways, maps, etc.)
   - Para CADA integración, describe específicamente QUÉ FUNCIONALIDAD aporta a la app (no solo el nombre del servicio)
   - Lista qué información necesitas del usuario para implementar

3. **ANÁLISIS TÉCNICO**:
   - Complejidad 1-2: Proyectos simples (CRUD, integraciones básicas)
   - Complejidad 3: Proyectos standard (autenticación, pagos, APIs)
   - Complejidad 4-5: Proyectos complejos (ML, matching, algoritmos)
   - Identifica skills específicos necesarios
   - Estima tiempo realista (diseño, desarrollo, testing)
   - Lista bloqueadores potenciales (rate limits, verificaciones, regulaciones)

IMPORTANTE:
- Sé específico y práctico
- Usa ejemplos reales cuando sea posible
- Para integraciones, busca URLs reales de APIs conocidas
- Estima tiempos de manera conservadora
- Marca "tenemos: false" en todos los skills por defecto`;

export async function POST(request: NextRequest) {
  try {
    const { rawIdea } = await request.json();

    if (!rawIdea || typeof rawIdea !== 'string' || rawIdea.trim().length < 10) {
      return NextResponse.json(
        { error: 'rawIdea es requerido y debe tener al menos 10 caracteres' },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY not configured' },
        { status: 500 }
      );
    }

    const userPrompt = `Analiza esta idea de negocio en detalle:

IDEA EN BRUTO:
${rawIdea}

Por favor realiza un análisis completo considerando:

1. DEMANDA (Problema → Mercado):
   - ¿Cuál es el problema real que resuelve?
   - ¿Quién es el mercado objetivo específico?
   - ¿Qué tan urgente es el problema?
   - ¿Cuál es el tamaño potencial del mercado?
   - ¿Hay evidencia de que existe la demanda?

2. OFERTA (Solución → Herramientas):
   - ¿Cuál es la solución propuesta?
   - ¿Qué stack técnico recomiendas? (prefiere Next.js, Supabase, PostgreSQL)
   - ¿Qué integraciones de terceros son necesarias? (pagos, notificaciones, maps, etc.)
   - ¿Qué información necesitas del usuario?

3. ANÁLISIS TÉCNICO:
   - ¿Cuál es la complejidad técnica real? (1-5)
   - ¿Qué skills específicos se requieren?
   - ¿Cuánto tiempo realista tomará? (diseño, desarrollo, testing)
   - ¿Cuáles son los bloqueadores o riesgos?
   - ¿Qué categoría es? (saas, marketplace, fintech, etc.)

Devuelve tu análisis en el formato JSON especificado. Sé específico y práctico.`;

    console.log('🔍 Analizando idea con Claude...');

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      temperature: 0.7,
      system: IDEA_ANALYSIS_SYSTEM_PROMPT,
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

    console.log('📝 Respuesta de Claude (primeros 500 chars):', responseText.substring(0, 500));

    // Parse JSON response
    let analysis;
    try {
      // Remove markdown code blocks if present
      const cleanedResponse = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      analysis = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('❌ Error parsing Claude response:', parseError);
      console.error('Raw response:', responseText);
      return NextResponse.json(
        { error: 'Failed to parse AI response', rawResponse: responseText },
        { status: 500 }
      );
    }

    // Validate required fields
    if (!analysis.nombre || !analysis.problema || !analysis.mercadoObjetivo || !analysis.urgencia ||
        !analysis.solucion || typeof analysis.complejidadTecnica !== 'number') {
      console.error('❌ Análisis incompleto:', analysis);
      return NextResponse.json(
        { error: 'Análisis incompleto: faltan campos requeridos', analysis },
        { status: 500 }
      );
    }

    // Validate urgencia enum
    if (!['baja', 'media', 'alta', 'crítica'].includes(analysis.urgencia)) {
      console.error('❌ Urgencia inválida:', analysis.urgencia);
      analysis.urgencia = 'media'; // Default fallback
    }

    // Validate complejidadTecnica range
    if (analysis.complejidadTecnica < 1 || analysis.complejidadTecnica > 5) {
      console.error('❌ ComplejidadTecnica fuera de rango:', analysis.complejidadTecnica);
      analysis.complejidadTecnica = Math.max(1, Math.min(5, Math.round(analysis.complejidadTecnica)));
    }

    console.log('✅ Análisis completado exitosamente');

    return NextResponse.json({
      analysis,
      tokensUsed: message.usage.input_tokens + message.usage.output_tokens,
      model: message.model,
    });

  } catch (error: any) {
    console.error('❌ Error en /api/analyze-idea:', error);
    return NextResponse.json(
      {
        error: 'Failed to analyze idea',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
