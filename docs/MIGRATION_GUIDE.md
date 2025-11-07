# 🔄 MIGRATION GUIDE: V1.0 → V2.0

**Objetivo:** Migrar desde el sistema actual (2 vistas básicas) al nuevo sistema de 8 módulos especializados

**Fecha:** Noviembre 2025
**Status:** Fase 0A completándose
**Duración estimada:** 23 días (incluye Fase 0B)

---

## 📋 ÍNDICE

1. [Visión General](#visión-general)
2. [¿Por Qué Migrar?](#por-qué-migrar)
3. [Cambios de Alto Nivel](#cambios-de-alto-nivel)
4. [Pre-requisitos](#pre-requisitos)
5. [Fase 0A: Documentación](#fase-0a-documentación)
6. [Fase 0B: Code Audit](#fase-0b-code-audit)
7. [Fase 1: Database Migration](#fase-1-database-migration)
8. [Fases 2-7: Feature Implementation](#fases-2-7-feature-implementation)
9. [Rollback Plan](#rollback-plan)
10. [Testing Strategy](#testing-strategy)
11. [Deployment Strategy](#deployment-strategy)
12. [Post-Migration Checklist](#post-migration-checklist)

---

## 🎯 VISIÓN GENERAL

### **Estado Actual (V1.0)**
```
Project Library V1.0
├── Landing page (Neo-Brutalism) ✅
├── Projects dashboard ✅
└── Project detail con sidebar
    ├── Prompts view ✅
    └── Planner view ✅ (básico)
```

**Limitaciones:**
- Solo 2 vistas en el sidebar
- Sin validación de ideas
- Sin tracking de features tipo Jira
- Sin visualización de métricas
- Sin hub de herramientas
- Documentación manual

### **Estado Objetivo (V2.0)**
```
Project Library V2.0
├── Landing page ✅
├── Projects dashboard ✅
└── Project detail con sidebar
    ├── M-001: Validador de Ideas ⏳
    ├── M-002: Product Manager ⏳
    ├── M-003: Mejora de Prompts ✅ (migrar)
    ├── M-004: UX/UI Designer ⏳
    ├── M-005: Tickets & Features ⏳
    ├── M-006: Dashboard Visual ⏳
    ├── M-007: Documentación Viva ⏳
    └── M-008: Hub de Herramientas ⏳
```

**Nuevas Capacidades:**
- ✅ Workflow de 4 agentes automatizado
- ✅ Sistema Kanban tipo Jira
- ✅ Dashboard ejecutivo con métricas
- ✅ Hub centralizado de herramientas
- ✅ Documentación auto-generada
- ✅ Trazabilidad completa

---

## 💡 ¿POR QUÉ MIGRAR?

### **Problemas del Sistema Actual**
| Problema | Impacto | Solución V2.0 |
|----------|---------|---------------|
| Ideas sin validar | Tiempo perdido construyendo lo que nadie quiere | M-001: Validador automático |
| Sin tracking de features | No hay visibilidad del progreso | M-005: Kanban board |
| Prompts dispersos | Difícil encontrar qué se hizo | M-003: Timeline organizado |
| Sin métricas | No se puede optimizar el proceso | M-006: Dashboard con KPIs |
| Documentación manual | Nunca se hace | M-007: Auto-generación |
| Herramientas dispersas | Pérdida de tiempo buscando | M-008: Hub centralizado |

### **ROI Esperado**
- **Tiempo de setup:** 23 días one-time investment
- **Ahorro por proyecto:** ~30% tiempo (validación + tracking automático)
- **Calidad:** +50% (menos features innecesarias, mejor documentación)
- **Escalabilidad:** Sistema reusable para N proyectos

---

## 🔄 CAMBIOS DE ALTO NIVEL

### **1. Database Schema**
**Cambios:**
```sql
-- NUEVAS TABLAS (8)
CREATE TABLE validations (...);      -- M-001
CREATE TABLE product_plans (...);    -- M-002
CREATE TABLE features (...);         -- M-005
CREATE TABLE designs (...);          -- M-004
CREATE TABLE project_metrics (...);  -- M-006
CREATE TABLE tools (...);            -- M-008
CREATE TABLE project_tools (...);    -- M-008

-- TABLAS EXISTENTES (2) - Sin cambios breaking
-- projects ✅
-- prompts ✅ (se mantendrán compatibles)
```

**Estrategia:** Migración aditiva (no destructiva)
- ✅ No se modifican tablas existentes
- ✅ Solo se agregan nuevas
- ✅ Backward compatible

### **2. API Endpoints**
**Nuevos endpoints:**
```
POST   /api/validations              # M-001: Validar idea
POST   /api/plans                    # M-002: Generar plan
POST   /api/features                 # M-005: CRUD features
GET    /api/metrics/:projectId       # M-006: Obtener métricas
GET    /api/tools                    # M-008: Listar herramientas
POST   /api/projects/:id/tools       # M-008: Agregar tool a proyecto
```

**Endpoints existentes:** Sin cambios

### **3. UI Components**
**Nuevos componentes (50+):**
```
components/
├── validator/      # 4 componentes
├── planner/        # 5 componentes
├── designer/       # 4 componentes
├── kanban/         # 5 componentes
├── charts/         # 5 componentes
├── docs/           # 4 componentes
└── tools/          # 5 componentes
```

**Componentes existentes:** Refactor mínimo
- `project-sidebar.tsx`: Expand de 2 a 8 views
- `project-card.tsx`: Sin cambios
- `project-grid.tsx`: Sin cambios

### **4. TypeScript Types**
**Nuevos tipos:**
```typescript
// lib/types.ts
export interface Validation { ... }
export interface ProductPlan { ... }
export interface Feature { ... }
export interface Design { ... }
export interface ProjectMetrics { ... }
export interface Tool { ... }
```

**Tipos existentes:** Mantener + extend
```typescript
// Extend Project type
export interface Project {
  // ... existing fields
  validation_id?: string;  // NEW
  plan_id?: string;        // NEW
  design_id?: string;      // NEW
}
```

---

## ✅ PRE-REQUISITOS

### **Antes de empezar:**

1. **Git Estado Limpio**
```bash
git status
# Should show: "nothing to commit, working tree clean"
```

2. **Database Backup**
```bash
pg_dump -U postgres project_library > backup_pre_migration_$(date +%Y%m%d).sql
```

3. **Dependencias Actualizadas**
```bash
npm install
npm audit fix
```

4. **Branch de Migración**
```bash
git checkout -b migration/v2.0
```

5. **Environment Variables**
```bash
# .env.local
DATABASE_URL=postgresql://postgres:password@localhost:5432/project_library
ANTHROPIC_API_KEY=sk-ant-... # NEW (obtener en console.anthropic.com)
```

---

## 📝 FASE 0A: DOCUMENTACIÓN (1 día) ✅

### **Objetivo:** Consolidar documentación antes de code changes

### **Tareas:**
- [x] Actualizar `.project-overview.md` a V2.0
- [x] Consolidar `Workflow.md` con ejemplos
- [x] Crear `ARCHITECTURE.md`
- [x] Crear `MIGRATION_GUIDE.md` (este documento)
- [ ] Actualizar `README.md` principal

### **Output:**
```
docs/
├── .project-overview.md   ✅ V2.0 con 8 módulos
├── Workflow.md            ✅ Con ejemplo Project Library
├── ARCHITECTURE.md        ✅ Specs técnicas completas
└── MIGRATION_GUIDE.md     ✅ Este documento
```

### **Verificación:**
```bash
# Todos los docs deben mencionar V2.0 y 8 módulos
grep -r "V2.0" docs/
grep -r "8 módulos" docs/
```

---

## 🔍 FASE 0B: CODE AUDIT (3 días)

### **Objetivo:** Limpiar y preparar codebase

### **Día 1: Audit & Analysis**

#### **1.1 Dependency Audit**
```bash
# Verificar vulnerabilidades
npm audit

# Actualizar dependencies seguras
npm update

# Identificar dependencies no usadas
npx depcheck
```

#### **1.2 Code Coverage Analysis**
```bash
# Instalar coverage tool (planeado)
npm install --save-dev jest @testing-library/react
```

#### **1.3 Bundle Size Analysis**
```bash
# Analizar bundle
npm run build
npx @next/bundle-analyzer
```

**Deliverables:**
- `docs/AUDIT_REPORT.md` con hallazgos
- Lista de dependencies a remover
- Lista de código muerto

### **Día 2: Code Cleanup**

#### **2.1 Eliminar Código Muerto**
```bash
# Buscar imports no usados
npx eslint . --ext .ts,.tsx --fix

# Buscar archivos no referenciados
npx unimported
```

**Archivos candidatos para eliminar:**
- Components no usados en `components/`
- Utilities obsoletos en `lib/`
- API routes experimentales
- Hooks deprecated

#### **2.2 Consolidar Utilities**
```typescript
// ANTES: utilities dispersas
lib/utils/formatDate.ts
lib/utils/formatCurrency.ts
lib/helpers/date.ts

// DESPUÉS: consolidar
lib/utils.ts (todo centralizado)
```

### **Día 3: Refactor Structure**

#### **3.1 Mover a App Router Pattern**
```bash
# ANTES
pages/
├── index.tsx
├── projects/
│   └── [id].tsx

# DESPUÉS
app/
├── (marketing)/
│   └── page.tsx
└── projects/
    └── [id]/
        └── page.tsx
```

#### **3.2 Reorganizar Components**
```bash
# ANTES: flat structure
components/
├── project-card.tsx
├── project-grid.tsx
├── prompt-card.tsx
├── kanban-board.tsx  # Mezclado

# DESPUÉS: por feature
components/
├── projects/
│   ├── project-card.tsx
│   └── project-grid.tsx
├── prompts/
│   └── prompt-card.tsx
└── kanban/
    └── kanban-board.tsx
```

**Deliverables:**
- Codebase limpio y organizado
- Tests básicos configurados
- ESLint + Prettier configurados

---

## 🗄️ FASE 1: DATABASE MIGRATION (3 días)

### **Día 1: Schema Preparation**

#### **1.1 Crear Migration File**
```sql
-- db/migrations/002_add_v2_tables.sql

-- M-001: Validations
CREATE TABLE validations (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  verdict TEXT NOT NULL,
  stack_recommendation JSONB,
  markdown_output TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- M-002: Product Plans
CREATE TABLE product_plans (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  persona JSONB NOT NULL,
  success_metrics JSONB NOT NULL,
  markdown_output TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- M-005: Features
CREATE TABLE features (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  plan_id TEXT REFERENCES product_plans(id),
  name TEXT NOT NULL,
  priority TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'todo',
  rice_score JSONB,
  dependencies TEXT[],
  estimated_hours INTEGER,
  actual_hours INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- M-004: Designs
CREATE TABLE designs (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  design_system JSONB NOT NULL,
  screens JSONB,
  components JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- M-006: Project Metrics
CREATE TABLE project_metrics (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  velocity DECIMAL,
  burndown_data JSONB,
  raci_data JSONB,
  completion_percentage INTEGER,
  recorded_at TIMESTAMP DEFAULT NOW()
);

-- M-008: Tools
CREATE TABLE tools (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  requires_api_key BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE project_tools (
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  tool_id TEXT NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  api_key_configured BOOLEAN DEFAULT false,
  is_favorite BOOLEAN DEFAULT false,
  added_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (project_id, tool_id)
);

-- Indexes
CREATE INDEX idx_validations_project_id ON validations(project_id);
CREATE INDEX idx_product_plans_project_id ON product_plans(project_id);
CREATE INDEX idx_features_project_id ON features(project_id);
CREATE INDEX idx_features_status ON features(status);
CREATE INDEX idx_designs_project_id ON designs(project_id);
CREATE INDEX idx_project_metrics_project_id ON project_metrics(project_id);
CREATE INDEX idx_tools_category ON tools(category);
```

#### **1.2 Test Migration (Dry Run)**
```bash
# Crear DB de test
/Library/PostgreSQL/18/bin/psql -U postgres -c "CREATE DATABASE project_library_test;"

# Aplicar schema actual
/Library/PostgreSQL/18/bin/psql -U postgres -d project_library_test -f db/schema.sql

# Aplicar migración
/Library/PostgreSQL/18/bin/psql -U postgres -d project_library_test -f db/migrations/002_add_v2_tables.sql

# Verificar
/Library/PostgreSQL/18/bin/psql -U postgres -d project_library_test -c "\dt"
```

### **Día 2: Execute Migration**

#### **2.1 Backup Production Data**
```bash
# Full backup
pg_dump -U postgres project_library > backup_before_v2_migration.sql

# Verificar backup
psql -U postgres -d project_library_test < backup_before_v2_migration.sql
```

#### **2.2 Run Migration**
```bash
# Aplicar migración a producción local
/Library/PostgreSQL/18/bin/psql -U postgres -d project_library -f db/migrations/002_add_v2_tables.sql

# Verificar tablas creadas
/Library/PostgreSQL/18/bin/psql -U postgres -d project_library -c "\dt"

# Verificar indexes
/Library/PostgreSQL/18/bin/psql -U postgres -d project_library -c "\di"
```

#### **2.3 Seed Tools Data**
```sql
-- db/seeds/tools_seed.sql

-- Design & UI
INSERT INTO tools (id, name, category, url, description, requires_api_key) VALUES
('vercel-v0', 'Vercel V0', 'design', 'https://v0.dev', 'AI component generator', false),
('shadcn-ui', 'Shadcn/ui', 'design', 'https://ui.shadcn.com', 'React component library', false),
('tailwind-ui', 'Tailwind UI', 'design', 'https://tailwindui.com', 'Premium components', false),
('heroicons', 'Heroicons', 'design', 'https://heroicons.com', 'Free SVG icons', false),
('lucide', 'Lucide Icons', 'design', 'https://lucide.dev', 'Icon library', false);

-- APIs & Backend
INSERT INTO tools (id, name, category, url, description, requires_api_key) VALUES
('supabase', 'Supabase', 'api', 'https://supabase.com', 'PostgreSQL + Auth + Storage', true),
('clerk', 'Clerk', 'api', 'https://clerk.com', 'Authentication', true),
('stripe', 'Stripe', 'api', 'https://stripe.com', 'Payment processing', true),
('resend', 'Resend', 'api', 'https://resend.com', 'Transactional emails', true);

-- LATAM Specific
INSERT INTO tools (id, name, category, url, description, requires_api_key) VALUES
('mercado-pago', 'Mercado Pago', 'latam', 'https://mercadopago.com', 'Payments LATAM', true),
('whatsapp-api', 'WhatsApp Business API', 'latam', 'https://business.whatsapp.com', 'WhatsApp integration', true);

-- Deployment
INSERT INTO tools (id, name, category, url, description, requires_api_key) VALUES
('vercel', 'Vercel', 'deployment', 'https://vercel.com', 'Frontend hosting', false),
('netlify', 'Netlify', 'deployment', 'https://netlify.com', 'Static site hosting', false);
```

```bash
# Seed tools
/Library/PostgreSQL/18/bin/psql -U postgres -d project_library -f db/seeds/tools_seed.sql
```

### **Día 3: Data Layer Implementation**

#### **3.1 Extend `lib/storage.ts`**
```typescript
// lib/storage.ts

// ===== M-001: Validations =====
export async function createValidation(data: InsertValidation): Promise<Validation> {
  const result = await sql`
    INSERT INTO validations (id, project_id, verdict, stack_recommendation, markdown_output)
    VALUES (${data.id}, ${data.project_id}, ${data.verdict}, ${data.stack_recommendation}, ${data.markdown_output})
    RETURNING *
  `;
  return result[0];
}

export async function getValidationByProject(projectId: string): Promise<Validation | null> {
  const result = await sql`
    SELECT * FROM validations WHERE project_id = ${projectId} LIMIT 1
  `;
  return result[0] || null;
}

// ===== M-002: Product Plans =====
export async function createProductPlan(data: InsertProductPlan): Promise<ProductPlan> {
  const result = await sql`
    INSERT INTO product_plans (id, project_id, persona, success_metrics, markdown_output)
    VALUES (${data.id}, ${data.project_id}, ${data.persona}, ${data.success_metrics}, ${data.markdown_output})
    RETURNING *
  `;
  return result[0];
}

// ===== M-005: Features =====
export async function createFeature(data: InsertFeature): Promise<Feature> {
  const result = await sql`
    INSERT INTO features (id, project_id, plan_id, name, priority, status, rice_score, dependencies)
    VALUES (${data.id}, ${data.project_id}, ${data.plan_id}, ${data.name}, ${data.priority}, ${data.status}, ${data.rice_score}, ${data.dependencies})
    RETURNING *
  `;
  return result[0];
}

export async function getFeaturesByProject(projectId: string): Promise<Feature[]> {
  const result = await sql`
    SELECT * FROM features
    WHERE project_id = ${projectId}
    ORDER BY
      CASE priority
        WHEN 'P0' THEN 1
        WHEN 'P1' THEN 2
        WHEN 'P2' THEN 3
      END,
      created_at ASC
  `;
  return result;
}

export async function updateFeatureStatus(
  featureId: string,
  status: 'todo' | 'in_progress' | 'testing' | 'done'
): Promise<Feature> {
  const now = new Date().toISOString();
  const updates: any = { status };

  if (status === 'in_progress') updates.started_at = now;
  if (status === 'done') updates.completed_at = now;

  const result = await sql`
    UPDATE features
    SET
      status = ${status},
      ${status === 'in_progress' ? sql`started_at = ${now},` : sql``}
      ${status === 'done' ? sql`completed_at = ${now},` : sql``}
    WHERE id = ${featureId}
    RETURNING *
  `;
  return result[0];
}

// ===== M-008: Tools =====
export async function getAllTools(): Promise<Tool[]> {
  const result = await sql`SELECT * FROM tools ORDER BY category, name`;
  return result;
}

export async function getToolsByCategory(category: string): Promise<Tool[]> {
  const result = await sql`SELECT * FROM tools WHERE category = ${category} ORDER BY name`;
  return result;
}

export async function addToolToProject(projectId: string, toolId: string): Promise<void> {
  await sql`
    INSERT INTO project_tools (project_id, tool_id)
    VALUES (${projectId}, ${toolId})
    ON CONFLICT (project_id, tool_id) DO NOTHING
  `;
}

export async function getProjectTools(projectId: string): Promise<Tool[]> {
  const result = await sql`
    SELECT t.*, pt.api_key_configured, pt.is_favorite
    FROM tools t
    JOIN project_tools pt ON t.id = pt.tool_id
    WHERE pt.project_id = ${projectId}
    ORDER BY pt.is_favorite DESC, t.name
  `;
  return result;
}
```

#### **3.2 Update Types**
```typescript
// lib/types.ts

// M-001: Validations
export interface Validation {
  id: string;
  project_id: string;
  verdict: 'go' | 'validate_more' | 'no_go';
  stack_recommendation: Record<string, any>;
  markdown_output: string;
  created_at: Date;
}

// M-002: Product Plans
export interface ProductPlan {
  id: string;
  project_id: string;
  persona: Record<string, any>;
  success_metrics: Record<string, any>;
  markdown_output: string;
  created_at: Date;
}

// M-005: Features
export interface Feature {
  id: string; // F-001, F-002...
  project_id: string;
  plan_id: string | null;
  name: string;
  priority: 'P0' | 'P1' | 'P2';
  status: 'todo' | 'in_progress' | 'testing' | 'done';
  rice_score: RICEScore | null;
  dependencies: string[];
  estimated_hours: number | null;
  actual_hours: number | null;
  created_at: Date;
  started_at: Date | null;
  completed_at: Date | null;
}

export interface RICEScore {
  reach: number;
  impact: number;
  confidence: number;
  effort: number;
  total_score: number;
}

// M-008: Tools
export interface Tool {
  id: string;
  name: string;
  category: 'design' | 'api' | 'deployment' | 'development' | 'latam' | 'inspiration';
  url: string;
  description: string | null;
  requires_api_key: boolean;
  created_at: Date;
}
```

**Deliverables:**
- ✅ Database migrado con 7 nuevas tablas
- ✅ Indexes creados
- ✅ Tools seeded
- ✅ Data access layer extendido
- ✅ Types actualizados

---

## 🚀 FASES 2-7: FEATURE IMPLEMENTATION (16 días)

**Ver Workflow.md línea 1344-1380 para detalles completos**

### **Timeline Resumido:**
```
Días 5-6:   FASE 2: Hub de Herramientas (M-008)
Días 7-8:   FASE 3: Validador de Ideas (M-001)
Días 9-11:  FASE 4: Product Manager (M-002)
Días 12-15: FASE 5: Sistema de Tickets (M-005)
Días 16-18: FASE 6: Dashboard Visual (M-006)
Días 19-20: FASE 7: Documentación (M-007)
```

Cada fase sigue este patrón:
1. **Día 1:** API routes + storage functions
2. **Día 2:** UI components
3. **Día 3:** Integration + testing (para fases >2 días)

---

## 🔙 ROLLBACK PLAN

### **Si algo sale mal:**

#### **Rollback Database**
```bash
# Restaurar backup
psql -U postgres -d project_library < backup_before_v2_migration.sql

# Verificar data integrity
psql -U postgres -d project_library -c "SELECT COUNT(*) FROM projects;"
psql -U postgres -d project_library -c "SELECT COUNT(*) FROM prompts;"
```

#### **Rollback Code**
```bash
# Volver a commit anterior
git log --oneline
git reset --hard <commit-hash-before-migration>

# O volver a branch main
git checkout main
```

#### **Rollback Deployment (Vercel)**
```bash
# Via Vercel dashboard
# Deployments → Previous deployment → Promote to Production
```

### **Puntos de No Retorno:**
- ❌ ANTES de Fase 1: Safe to rollback (solo docs)
- ⚠️ DESPUÉS de Fase 1: Rollback requiere DB restore
- 🔒 DESPUÉS de Fase 7 deployed: Rollback afecta usuarios

---

## 🧪 TESTING STRATEGY

### **Unit Tests**
```typescript
// tests/unit/lib/storage.test.ts
describe('storage: validations', () => {
  it('should create validation', async () => {
    const validation = await storage.createValidation({
      id: 'val-001',
      project_id: 'proj-001',
      verdict: 'go',
      stack_recommendation: {},
      markdown_output: '# Test'
    });
    expect(validation.id).toBe('val-001');
  });
});
```

### **Integration Tests**
```typescript
// tests/integration/api/validations.test.ts
describe('POST /api/validations', () => {
  it('should validate idea via Claude API', async () => {
    const response = await fetch('/api/validations', {
      method: 'POST',
      body: JSON.stringify({
        project_id: 'proj-001',
        raw_idea: 'App for barbers',
        target_market: 'LATAM'
      })
    });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.verdict).toBeOneOf(['go', 'validate_more', 'no_go']);
  });
});
```

### **E2E Tests (Playwright)**
```typescript
// tests/e2e/kanban-board.spec.ts
test('drag feature from todo to in_progress', async ({ page }) => {
  await page.goto('/projects/proj-001/features');

  const feature = page.locator('[data-feature-id="F-001"]');
  const inProgressColumn = page.locator('[data-column="in_progress"]');

  await feature.dragTo(inProgressColumn);

  await expect(feature).toHaveAttribute('data-status', 'in_progress');
});
```

---

## 🚢 DEPLOYMENT STRATEGY

### **Estrategia: Blue-Green Deployment**

#### **Step 1: Deploy a Staging**
```bash
# Crear preview deployment
git push origin migration/v2.0

# Vercel auto-crea preview URL
# https://project-library-git-migration-v2-0-jeroniki.vercel.app
```

#### **Step 2: Smoke Testing en Staging**
```bash
# Checklist manual
- [ ] Landing page carga
- [ ] Projects dashboard carga
- [ ] Crear proyecto funciona
- [ ] Validador de ideas funciona (M-001)
- [ ] Kanban board funciona (M-005)
- [ ] Dashboard muestra métricas (M-006)
- [ ] Tools hub carga (M-008)
```

#### **Step 3: Database Migration en Producción**
```bash
# Conectar a Supabase (futuro)
# Ejecutar migration script
psql $SUPABASE_DATABASE_URL -f db/migrations/002_add_v2_tables.sql
```

#### **Step 4: Promote a Production**
```bash
# Merge a main
git checkout main
git merge migration/v2.0
git push origin main

# Vercel auto-deploys a production
# https://project-library.vercel.app
```

#### **Step 5: Monitor**
```bash
# Vercel Analytics
# Sentry (si configurado)
# Database performance
```

---

## ✅ POST-MIGRATION CHECKLIST

### **Verificación Funcional**
- [ ] Todos los proyectos existentes siguen visibles
- [ ] Prompts históricos siguen accesibles
- [ ] Validador de ideas genera `validacion.md`
- [ ] Product Manager genera `plan.md` con features
- [ ] Kanban board muestra features correctamente
- [ ] Drag & drop funciona en Kanban
- [ ] Dashboard muestra métricas
- [ ] Tools hub lista herramientas
- [ ] Agregar tool a proyecto funciona
- [ ] Documentación se genera automáticamente

### **Verificación Técnica**
- [ ] No hay errores en Vercel logs
- [ ] Database tiene 9 tablas (2 old + 7 new)
- [ ] Indexes creados correctamente
- [ ] API endpoints responden < 500ms
- [ ] Bundle size < 300KB (first load)
- [ ] Lighthouse score > 90

### **Verificación de Data**
```sql
-- Verificar tablas
SELECT COUNT(*) as total_projects FROM projects;
SELECT COUNT(*) as total_prompts FROM prompts;
SELECT COUNT(*) as total_validations FROM validations;
SELECT COUNT(*) as total_plans FROM product_plans;
SELECT COUNT(*) as total_features FROM features;
SELECT COUNT(*) as total_tools FROM tools;

-- Verificar integridad referencial
SELECT p.id, p.name, v.id as validation_id
FROM projects p
LEFT JOIN validations v ON p.id = v.project_id;
```

### **Documentación**
- [ ] README.md actualizado con V2.0
- [ ] CHANGELOG.md con release notes
- [ ] API.md con nuevos endpoints (planeado)
- [ ] Screenshots actualizados en docs

---

## 🎉 SUCCESS CRITERIA

**La migración se considera exitosa cuando:**

1. ✅ Todos los módulos (M-001 a M-008) funcionan
2. ✅ Data existente intacta (projects + prompts)
3. ✅ No errores en producción por 48 horas
4. ✅ Performance mantiene o mejora (LCP < 2.5s)
5. ✅ Tests coverage > 70%
6. ✅ Documentación completa

---

## 📞 SUPPORT & TROUBLESHOOTING

### **Errores Comunes**

#### **Error: "Cannot read property 'id' of undefined"**
**Causa:** Feature no existe en DB
**Solución:**
```bash
# Verificar feature existe
psql -U postgres -d project_library -c "SELECT * FROM features WHERE id = 'F-001';"
```

#### **Error: "Connection to database failed"**
**Causa:** DATABASE_URL incorrecto
**Solución:**
```bash
# Verificar env var
echo $DATABASE_URL

# Re-conectar
npm run dev
```

#### **Error: "Claude API rate limit"**
**Causa:** Demasiadas requests
**Solución:** Implementar rate limiting en API route

---

## 📚 RECURSOS

### **Documentos Relacionados**
- `.project-overview.md` - Visión del sistema V2.0
- `Workflow.md` - Workflow de 4 agentes
- `ARCHITECTURE.md` - Especificaciones técnicas
- `MIGRATION_POSTGRESQL.md` - Migración pasada (Supabase → PostgreSQL)

### **External Resources**
- [Next.js 15 Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading)
- [PostgreSQL Migration Best Practices](https://wiki.postgresql.org/wiki/Converting_from_other_Databases_to_PostgreSQL)
- [Claude API Documentation](https://docs.anthropic.com)

---

**Versión:** 1.0
**Última actualización:** Noviembre 2025
**Próxima revisión:** Post-Fase 0B
