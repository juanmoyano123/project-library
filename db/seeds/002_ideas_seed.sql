-- Seed 002: Example ideas for M-009: Idea Mixer
-- Created: 2025-11-06
-- Description: 3 example ideas showcasing different complexity levels and categories

-- Clear existing data (for clean re-runs)
TRUNCATE TABLE idea_combinations CASCADE;
TRUNCATE TABLE ideas CASCADE;

-- IDEA-001: SaaS para barberías (Baja-Media complejidad)
INSERT INTO ideas (
  id, user_id, problema, mercado_objetivo, urgencia, tamaño_mercado, evidencia_demanda,
  solucion, herramientas_disponibles, integraciones_necesarias, informacion_requerida,
  complejidad_tecnica, skills_requeridos, tiempo_estimado, bloqueadores,
  tags, categoria, notas, favorita
) VALUES (
  'IDEA-001',
  'default-user',
  'Barberías en LATAM usan WhatsApp y cuadernos para gestionar turnos. Pierden tiempo en llamadas y no tienen visibilidad del calendario.',
  'Barberías pequeñas y medianas en Argentina, Chile, México (5-50 empleados)',
  'media',
  'Mercado LATAM: ~250k barberías activas. TAM: $12.5M ARR ($50/mes x 250k)',
  'Encuesta a 50 barberías: 82% usa WhatsApp, 65% pierde 2+ horas/día coordinando turnos',
  'App web + móvil para reservar turnos online, confirmación automática vía WhatsApp, calendario compartido para barberos',
  ARRAY['Next.js', 'Supabase', 'Tailwind CSS', 'Vercel'],
  '[
    {"nombre": "WhatsApp Business API", "api": "https://developers.facebook.com/docs/whatsapp", "documentacion": "https://business.whatsapp.com/products/business-api", "complejidad": "media"},
    {"nombre": "MercadoPago", "api": "https://www.mercadopago.com.ar/developers", "documentacion": "https://www.mercadopago.com.ar/developers/es/guides", "complejidad": "baja"}
  ]'::jsonb,
  ARRAY['Horarios disponibles de barberos', 'Servicios y precios', 'Datos de clientes (nombre, teléfono)'],
  3,
  '[
    {"skill": "React/Next.js", "nivelNecesario": "mid", "tenemos": true},
    {"skill": "PostgreSQL", "nivelNecesario": "mid", "tenemos": true},
    {"skill": "WhatsApp API", "nivelNecesario": "mid", "tenemos": false},
    {"skill": "Diseño UX/UI", "nivelNecesario": "mid", "tenemos": true}
  ]'::jsonb,
  '{"diseño": 2, "desarrollo": 6, "testing": 2}'::jsonb,
  ARRAY['Rate limits de WhatsApp API (200 mensajes/día en tier gratuito)', 'Integración con WhatsApp requiere verificación de negocio (2-4 semanas)'],
  ARRAY['saas', 'booking', 'latam', 'whatsapp'],
  'fintech',
  'Idea validada, problema real con evidencia de demanda',
  true
);

-- IDEA-002: Marketplace de freelancers especializados (Media-Alta complejidad)
INSERT INTO ideas (
  id, user_id, problema, mercado_objetivo, urgencia, tamaño_mercado, evidencia_demanda,
  solucion, herramientas_disponibles, integraciones_necesarias, informacion_requerida,
  complejidad_tecnica, skills_requeridos, tiempo_estimado, bloqueadores,
  tags, categoria, notas, favorita
) VALUES (
  'IDEA-002',
  'default-user',
  'Empresas buscan freelancers especializados (DevOps, ML, Blockchain) pero plataformas genéricas tienen baja calidad. Freelancers pierden 40% de tiempo buscando proyectos',
  'Startups tech y empresas medianas en USA/Europa buscando talento especializado ($5k+ budget/proyecto)',
  'alta',
  'Mercado freelance tech: $200B global. Segmento especializado: ~$40B. TAM: $400M ARR (1% market share)',
  'Upwork cobra 20% comisión pero freelancers se quejan de baja calidad de leads. Toptal cobra 3x más por curation',
  'Marketplace curado con evaluación técnica rigurosa (test + portfolio review). Matching automático con ML. Escrow de pagos + milestone tracking',
  ARRAY['Next.js', 'PostgreSQL', 'Stripe', 'AWS', 'Python (ML)'],
  '[
    {"nombre": "Stripe Connect", "api": "https://stripe.com/docs/connect", "documentacion": "https://stripe.com/docs/connect", "complejidad": "alta"},
    {"nombre": "GitHub API", "api": "https://docs.github.com/rest", "documentacion": "https://docs.github.com/rest", "complejidad": "media"},
    {"nombre": "OpenAI API", "api": "https://platform.openai.com/docs/api-reference", "documentacion": "https://platform.openai.com/docs", "complejidad": "media"}
  ]'::jsonb,
  ARRAY['Perfiles de freelancers (skills, experiencia, portfolio)', 'Proyectos de empresas (descripción, budget, deadline)', 'Historial de trabajos completados'],
  4,
  '[
    {"skill": "Full-stack development", "nivelNecesario": "senior", "tenemos": true},
    {"skill": "Machine Learning", "nivelNecesario": "mid", "tenemos": false},
    {"skill": "Stripe Connect", "nivelNecesario": "mid", "tenemos": false},
    {"skill": "Sistema de evaluación técnica", "nivelNecesario": "senior", "tenemos": false}
  ]'::jsonb,
  '{"diseño": 3, "desarrollo": 12, "testing": 4}'::jsonb,
  ARRAY['Competencia fuerte (Upwork, Toptal)', 'Chicken-egg problem: necesitamos freelancers y empresas simultáneamente', 'Sistema de evaluación requiere expertos para revisar aplicaciones'],
  ARRAY['marketplace', 'freelance', 'b2b', 'matching'],
  'marketplace',
  'Mercado competitivo pero con oportunidad de nicho especializado',
  false
);

-- IDEA-003: App de tracking de hábitos gamificada (Baja complejidad)
INSERT INTO ideas (
  id, user_id, problema, mercado_objetivo, urgencia, tamaño_mercado, evidencia_demanda,
  solucion, herramientas_disponibles, integraciones_necesarias, informacion_requerida,
  complejidad_tecnica, skills_requeridos, tiempo_estimado, bloqueadores,
  tags, categoria, notas, favorita
) VALUES (
  'IDEA-003',
  'default-user',
  'Apps de hábitos son aburridas y poco engaging. 90% de usuarios abandonan después de 2 semanas. Falta motivación social y competencia',
  'Millennials y Gen Z (18-35 años) que quieren mejorar hábitos (fitness, lectura, meditación)',
  'baja',
  'Mercado habit tracking: $2B. Competidores: Habitica ($10M revenue), Streaks, Loop. TAM: $20M ARR',
  'Habitica tiene 5M+ usuarios activos. Apple Fitness+ tiene 2M+ suscriptores. Demand exists pero saturado',
  'App móvil con gamification: XP, niveles, badges, challenges sociales. Competir con amigos en streaks. Integración con Apple Health',
  ARRAY['React Native', 'Supabase', 'Expo'],
  '[
    {"nombre": "Apple HealthKit", "api": "https://developer.apple.com/healthkit/", "documentacion": "https://developer.apple.com/documentation/healthkit", "complejidad": "media"},
    {"nombre": "Google Fit", "api": "https://developers.google.com/fit", "documentacion": "https://developers.google.com/fit", "complejidad": "media"}
  ]'::jsonb,
  ARRAY['Hábitos del usuario (ejercicio, lectura, meditación)', 'Progreso diario', 'Conexiones sociales (amigos)'],
  2,
  '[
    {"skill": "React Native", "nivelNecesario": "mid", "tenemos": true},
    {"skill": "Gamification design", "nivelNecesario": "mid", "tenemos": false},
    {"skill": "Push notifications", "nivelNecesario": "junior", "tenemos": true}
  ]'::jsonb,
  '{"diseño": 2, "desarrollo": 4, "testing": 1}'::jsonb,
  ARRAY['Mercado muy competido', 'Monetización difícil (usuarios no pagan por habit trackers)', 'Retención es un desafío (churn rate alto)'],
  ARRAY['mobile', 'gamification', 'health', 'social'],
  'saas',
  'Baja prioridad - mercado saturado',
  false
);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Seed 002 completed successfully: 3 example ideas inserted';
END $$;
