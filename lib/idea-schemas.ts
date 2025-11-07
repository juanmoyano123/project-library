import { z } from 'zod';

// ================================================
// NESTED SCHEMAS
// ================================================

export const ideaIntegrationSchema = z.object({
  nombre: z.string().min(1, 'Nombre de integración es requerido'),
  api: z.string().url('Debe ser una URL válida'),
  documentacion: z.string().url('Debe ser una URL válida'),
  complejidad: z.enum(['baja', 'media', 'alta']),
});

export const ideaSkillSchema = z.object({
  skill: z.string().min(1, 'Skill es requerido'),
  nivelNecesario: z.enum(['junior', 'mid', 'senior']),
  tenemos: z.boolean(),
});

export const ideaTiempoEstimadoSchema = z.object({
  diseño: z.number().min(0, 'Diseño debe ser un número positivo'),
  desarrollo: z.number().min(0, 'Desarrollo debe ser un número positivo'),
  testing: z.number().min(0, 'Testing debe ser un número positivo'),
});

// ================================================
// MAIN IDEA SCHEMA
// ================================================

export const ideaSchema = z.object({
  // ID (required)
  id: z.string().regex(/^IDEA-\d{3}$/, 'ID debe tener formato IDEA-XXX (ej: IDEA-001)'),

  userId: z.string().optional(),

  // ================================================
  // DEMANDA (Problema → Mercado)
  // ================================================
  problema: z
    .string()
    .min(20, 'Describe el problema en al menos 20 caracteres')
    .max(1000, 'Máximo 1000 caracteres'),

  mercadoObjetivo: z
    .string()
    .min(10, 'Describe el mercado objetivo en al menos 10 caracteres')
    .max(500, 'Máximo 500 caracteres'),

  urgencia: z.enum(['baja', 'media', 'alta', 'crítica'], {
    errorMap: () => ({ message: 'Urgencia debe ser: baja, media, alta o crítica' }),
  }),

  tamañoMercado: z.string().max(500).optional(),

  evidenciaDemanda: z.string().max(1000).optional(),

  // ================================================
  // OFERTA (Solución → Herramientas)
  // ================================================
  solucion: z
    .string()
    .min(20, 'Describe la solución en al menos 20 caracteres')
    .max(1000, 'Máximo 1000 caracteres'),

  herramientasDisponibles: z.array(z.string()).optional(),

  integracionesNecesarias: z.array(ideaIntegrationSchema).optional(),

  informacionRequerida: z.array(z.string()).optional(),

  // ================================================
  // ANÁLISIS TÉCNICO
  // ================================================
  complejidadTecnica: z
    .number()
    .int('Debe ser un número entero')
    .min(1, 'Complejidad mínima es 1')
    .max(5, 'Complejidad máxima es 5'),

  skillsRequeridos: z.array(ideaSkillSchema).optional(),

  tiempoEstimado: ideaTiempoEstimadoSchema.optional(),

  bloqueadores: z.array(z.string()).optional(),

  // ================================================
  // METADATA
  // ================================================
  tags: z.array(z.string()).optional(),

  categoria: z.string().optional(),

  notas: z.string().max(2000, 'Máximo 2000 caracteres').optional(),

  favorita: z.boolean().optional(),

  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

// ================================================
// PARTIAL SCHEMAS (para updates)
// ================================================

// Schema para crear nueva idea (todos los campos requeridos excepto opcionales)
export const createIdeaSchema = ideaSchema.omit({
  createdAt: true,
  updatedAt: true
});

// Schema para actualizar idea (todos los campos opcionales excepto id)
export const updateIdeaSchema = ideaSchema.partial().required({ id: true });

// ================================================
// IDEA COMBINATION SCHEMA
// ================================================

export const ideaCombinationSchema = z.object({
  id: z.string().optional(),
  userId: z.string().optional(),
  ideaIds: z
    .array(z.string())
    .min(2, 'Debes seleccionar al menos 2 ideas para combinar')
    .max(5, 'Máximo 5 ideas por combinación'),
  veredicto: z.enum(['VIABLE', 'NO_VIABLE']).optional(),
  confianza: z.number().int().min(0).max(100).optional(),
  analisisCompleto: z.any().optional(),
  createdAt: z.string().optional(),
});

// ================================================
// TYPE INFERENCE
// ================================================

export type IdeaFormInput = z.infer<typeof ideaSchema>;
export type CreateIdeaInput = z.infer<typeof createIdeaSchema>;
export type UpdateIdeaInput = z.infer<typeof updateIdeaSchema>;
export type IdeaCombinationInput = z.infer<typeof ideaCombinationSchema>;
