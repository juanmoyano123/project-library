# 🏗️ PROJECT LIBRARY SYSTEM - ARQUITECTURA TÉCNICA V2.0

**Status:** En desarrollo activo - Fase 0A
**Última actualización:** Noviembre 2025
**Owner:** Juan Jeronimo Moyano

---

## 📋 ÍNDICE

1. [Visión General](#visión-general)
2. [Arquitectura de Alto Nivel](#arquitectura-de-alto-nivel)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Estructura de Directorios](#estructura-de-directorios)
5. [Database Schema](#database-schema)
6. [Módulos del Sistema](#módulos-del-sistema)
7. [Data Flow](#data-flow)
8. [API Endpoints](#api-endpoints)
9. [Componentes Clave](#componentes-clave)
10. [Patrones de Diseño](#patrones-de-diseño)
11. [Seguridad](#seguridad)
12. [Performance](#performance)
13. [Deployment](#deployment)
14. [Monitoreo y Logging](#monitoreo-y-logging)
15. [Testing Strategy](#testing-strategy)
16. [Decisiones Arquitectónicas](#decisiones-arquitectónicas)

---

## 🎯 VISIÓN GENERAL

### **¿Qué es Project Library?**
Sistema integral que automatiza el desarrollo de MVPs desde la validación de idea hasta producción, siguiendo un workflow multi-agente inspirado en metodologías de Google y Meta.

### **Principios Arquitectónicos**
1. **Simplicidad sobre complejidad**: Usar herramientas pragmáticas (PostgreSQL directo, no ORMs complejos)
2. **Server-First**: Aprovechar Next.js 15 Server Components al máximo
3. **Type Safety**: TypeScript strict mode + Zod para validación runtime
4. **Progressive Enhancement**: Funcionalidad core sin JavaScript, mejoras con interactividad
5. **Local-First Development**: PostgreSQL local para desarrollo, migración a Supabase para producción

### **Arquitectura en 3 Capas**
```
┌─────────────────────────────────────────┐
│         PRESENTATION LAYER              │
│  Next.js 15 App Router + React 19      │
│  Server Components + Client Components  │
│  Neo-Brutalism Design System           │
└─────────────────────────────────────────┘
              ↕
┌─────────────────────────────────────────┐
│         APPLICATION LAYER               │
│  Next.js API Routes                     │
│  Business Logic + Validation            │
│  Claude API Integration                 │
└─────────────────────────────────────────┘
              ↕
┌─────────────────────────────────────────┐
│            DATA LAYER                   │
│  PostgreSQL 18 (local)                  │
│  Connection Pooling                     │
│  JSONB for flexible schemas             │
└─────────────────────────────────────────┘
```

---

## 🏗️ ARQUITECTURA DE ALTO NIVEL

### **Diagrama de Módulos**
```
┌────────────────────────────────────────────────────────────┐
│                    PROJECT LIBRARY SYSTEM                   │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  M-001       │  │  M-002       │  │  M-003       │    │
│  │  Validador   │→ │  Product     │  │  Mejora de   │    │
│  │  de Ideas    │  │  Manager     │  │  Prompts     │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│         ↓                 ↓                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  M-004       │  │  M-005       │  │  M-006       │    │
│  │  UX/UI       │  │  Tickets &   │  │  Dashboard   │    │
│  │  Designer    │  │  Features    │  │  Visual      │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                           ↓                 ↓              │
│  ┌──────────────┐  ┌──────────────┐                       │
│  │  M-007       │  │  M-008       │                       │
│  │  Docs        │  │  Hub de      │                       │
│  │  Automática  │  │  Herramientas│                       │
│  └──────────────┘  └──────────────┘                       │
│                                                             │
├────────────────────────────────────────────────────────────┤
│              SHARED INFRASTRUCTURE                          │
│  Database | Storage | API Client | Auth (Futuro)          │
└────────────────────────────────────────────────────────────┘
```

---

## 💻 STACK TECNOLÓGICO

### **Frontend**
```json
{
  "framework": "Next.js 15.5.5",
  "runtime": "React 19",
  "language": "TypeScript 5.x (strict mode)",
  "styling": "TailwindCSS 3.4.1",
  "components": "Shadcn/ui (Radix UI primitives)",
  "icons": "Lucide React 0.344.0",
  "charts": "Recharts 2.12.7",
  "design_system": "Neo-Brutalism"
}
```

### **Backend**
```json
{
  "runtime": "Node.js 20+",
  "framework": "Next.js API Routes",
  "database": "PostgreSQL 18 (local)",
  "db_client": "postgres 3.4.3 (connection pooling)",
  "validation": "Zod (planeado)",
  "api_integration": "@anthropic-ai/sdk 0.20.0"
}
```

### **DevOps & Deployment**
```json
{
  "hosting": "Vercel (autodeploy)",
  "ci_cd": "Vercel Git Integration",
  "database_prod": "Supabase PostgreSQL (planeado)",
  "domain": "Vercel domains",
  "monitoring": "Vercel Analytics (básico)"
}
```

### **Integraciones**
```json
{
  "ai": "Claude API (Anthropic)",
  "git": "@octokit/rest 20.0.2",
  "deployment": "@vercel/sdk 1.0.0"
}
```

---

## 📁 ESTRUCTURA DE DIRECTORIOS

```
project-library/
├── app/                                    # Next.js 15 App Router
│   ├── (marketing)/                        # Landing pages
│   │   ├── layout.tsx
│   │   └── page.tsx                        # Hero Neo-Brutalism
│   │
│   ├── projects/                           # Main application
│   │   ├── layout.tsx
│   │   ├── page.tsx                        # Projects dashboard
│   │   ├── new/
│   │   │   └── page.tsx                    # Create project
│   │   │
│   │   └── [id]/                           # Project detail
│   │       ├── layout.tsx                  # Sidebar layout
│   │       ├── page.tsx                    # Default view (prompts)
│   │       │
│   │       ├── validator/                  # M-001: Validador de Ideas
│   │       │   └── page.tsx
│   │       │
│   │       ├── planner/                    # M-002: Product Manager
│   │       │   └── page.tsx
│   │       │
│   │       ├── prompts/                    # M-003: Mejora de Prompts
│   │       │   └── page.tsx
│   │       │
│   │       ├── designer/                   # M-004: UX/UI Designer
│   │       │   └── page.tsx
│   │       │
│   │       ├── features/                   # M-005: Tickets & Features
│   │       │   └── page.tsx
│   │       │
│   │       ├── dashboard/                  # M-006: Dashboard Visual
│   │       │   └── page.tsx
│   │       │
│   │       ├── docs/                       # M-007: Documentación
│   │       │   └── page.tsx
│   │       │
│   │       └── tools/                      # M-008: Hub de Herramientas
│   │           └── page.tsx
│   │
│   ├── api/                                # API Routes
│   │   ├── projects/
│   │   │   ├── route.ts                    # GET, POST /api/projects
│   │   │   └── [id]/
│   │   │       ├── route.ts                # GET, PATCH, DELETE /api/projects/:id
│   │   │       └── prompts/
│   │   │           └── route.ts            # GET, POST /api/projects/:id/prompts
│   │   │
│   │   ├── validations/
│   │   │   ├── route.ts                    # POST /api/validations (Claude)
│   │   │   └── [id]/route.ts
│   │   │
│   │   ├── plans/
│   │   │   ├── route.ts                    # POST /api/plans (Claude)
│   │   │   └── [id]/route.ts
│   │   │
│   │   ├── features/
│   │   │   ├── route.ts                    # GET, POST /api/features
│   │   │   └── [id]/route.ts
│   │   │
│   │   ├── tools/
│   │   │   ├── route.ts                    # GET, POST /api/tools
│   │   │   └── [id]/route.ts
│   │   │
│   │   └── metrics/
│   │       └── [projectId]/route.ts        # GET /api/metrics/:projectId
│   │
│   ├── globals.css                         # Global styles + Tailwind
│   └── layout.tsx                          # Root layout
│
├── components/                             # React Components
│   ├── ui/                                 # Shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── select.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   └── ... (otros componentes Shadcn)
│   │
│   ├── layout/                             # Layout components
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── sidebar.tsx
│   │
│   ├── projects/                           # Project-specific components
│   │   ├── project-card.tsx
│   │   ├── project-grid.tsx
│   │   ├── project-sidebar.tsx             # Sidebar con 8 módulos
│   │   ├── project-header.tsx
│   │   ├── create-project-form.tsx
│   │   └── delete-project-dialog.tsx
│   │
│   ├── prompts/                            # M-003 components
│   │   ├── prompt-timeline.tsx
│   │   ├── prompt-card.tsx
│   │   ├── prompt-improvement-modal.tsx
│   │   └── prompt-version-comparison.tsx
│   │
│   ├── validator/                          # M-001 components
│   │   ├── validation-wizard.tsx
│   │   ├── validation-result-card.tsx
│   │   ├── market-analysis-section.tsx
│   │   └── stack-recommendation.tsx
│   │
│   ├── planner/                            # M-002 components
│   │   ├── plan-editor.tsx
│   │   ├── rice-score-calculator.tsx
│   │   ├── feature-list.tsx
│   │   ├── dependencies-mapper.tsx
│   │   └── acceptance-criteria-builder.tsx
│   │
│   ├── designer/                           # M-004 components
│   │   ├── wireframe-viewer.tsx
│   │   ├── mockup-gallery.tsx
│   │   ├── style-guide-viewer.tsx
│   │   └── component-spec-card.tsx
│   │
│   ├── kanban/                             # M-005 components
│   │   ├── kanban-board.tsx
│   │   ├── feature-card.tsx
│   │   ├── kanban-column.tsx
│   │   ├── time-tracker.tsx
│   │   └── deploy-status-badge.tsx
│   │
│   ├── charts/                             # M-006 components
│   │   ├── burndown-chart.tsx
│   │   ├── gantt-chart.tsx
│   │   ├── raci-matrix.tsx
│   │   ├── velocity-tracker.tsx
│   │   └── progress-ring.tsx
│   │
│   ├── docs/                               # M-007 components
│   │   ├── doc-viewer.tsx
│   │   ├── doc-generator.tsx
│   │   ├── architecture-decision-log.tsx
│   │   └── timeline-viewer.tsx
│   │
│   └── tools/                              # M-008 components
│       ├── tools-hub.tsx
│       ├── tool-card.tsx
│       ├── tool-category-section.tsx
│       ├── api-key-manager.tsx
│       └── tool-search.tsx
│
├── lib/                                    # Shared utilities
│   ├── db.ts                               # PostgreSQL client setup
│   ├── storage.ts                          # Data access layer (CRUD operations)
│   ├── types.ts                            # TypeScript type definitions
│   ├── utils.ts                            # General utilities (cn, formatters)
│   ├── constants.ts                        # App constants
│   ├── validators.ts                       # Zod schemas (planeado)
│   ├── claude.ts                           # Claude API wrapper (planeado)
│   ├── github.ts                           # GitHub API wrapper (planeado)
│   └── vercel.ts                           # Vercel API wrapper (planeado)
│
├── db/                                     # Database files
│   ├── schema.sql                          # Full database schema
│   ├── migrations/                         # SQL migrations (planeado)
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_add_validations.sql
│   │   └── ...
│   └── seeds/                              # Seed data for development
│       └── tools_seed.sql
│
├── docs/                                   # Documentation
│   ├── .project-overview.md                # V2.0 - Sistema completo
│   ├── Workflow.md                         # Workflow de 4 agentes
│   ├── ARCHITECTURE.md                     # This file
│   ├── MIGRATION_GUIDE.md                  # Guide para migrar a Supabase
│   └── API.md                              # API documentation (planeado)
│
├── public/                                 # Static assets
│   ├── design/                             # Design assets (M-004)
│   │   ├── wireframes/
│   │   ├── mockups/
│   │   └── style-guide.md
│   ├── icons/
│   └── images/
│
├── scripts/                                # Utility scripts
│   ├── setup-db.sh                         # PostgreSQL setup
│   ├── seed-tools.ts                       # Seed tools data
│   └── migrate.ts                          # Run migrations (planeado)
│
├── tests/                                  # Tests (planeado Fase 0B)
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.local                              # Environment variables (gitignored)
├── .env.example                            # Example env file
├── next.config.js                          # Next.js configuration
├── tailwind.config.ts                      # Tailwind + Design System
├── tsconfig.json                           # TypeScript configuration
├── package.json                            # Dependencies
└── README.md                               # Main readme
```

---

## 🗄️ DATABASE SCHEMA

### **Schema Completo (PostgreSQL 18)**

```sql
-- ================================================
-- CORE TABLES
-- ================================================

-- Projects: Entidad principal
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active', -- 'active' | 'archived' | 'completed'
  stage INTEGER NOT NULL DEFAULT 0, -- 0-8 (workflow stages)
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  archived_at TIMESTAMP
);

-- Prompts: Historial de prompts del proyecto
CREATE TABLE prompts (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  improved_content TEXT, -- Prompt mejorado por Claude
  original_content TEXT, -- Original antes de mejora
  stage INTEGER NOT NULL, -- 0-8 (qué stage del workflow)
  agent TEXT, -- 'validator' | 'pm' | 'designer' | 'developer'
  status TEXT DEFAULT 'pending', -- 'pending' | 'improved' | 'executed'
  tokens_used INTEGER, -- Tokens consumidos (tracking)
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- M-001: VALIDADOR DE IDEAS
-- ================================================

CREATE TABLE validations (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,

  -- Input
  raw_idea TEXT NOT NULL,
  target_market TEXT NOT NULL, -- 'USA' | 'LATAM' | 'AR' | 'MX' | etc

  -- Output del análisis
  verdict TEXT NOT NULL, -- 'go' | 'validate_more' | 'no_go'
  confidence_score INTEGER, -- 0-100

  -- Secciones del documento validacion.md
  market_analysis JSONB NOT NULL, -- {usa: {...}, latam: {...}}
  problem_analysis TEXT,
  solution_proposal TEXT,
  adaptations_needed JSONB, -- [{type: 'cultural', description: '...'}]
  barriers JSONB, -- [{severity: 'high', description: '...'}]

  -- Stack recomendado
  stack_recommendation JSONB NOT NULL,
  -- {
  --   frontend: {tech: 'Next.js', reason: '...'},
  --   backend: {tech: 'Supabase', reason: '...'},
  --   ...
  -- }

  -- MVP scope
  core_features JSONB NOT NULL, -- ['Feature 1', 'Feature 2', ...]
  out_of_scope JSONB, -- ['Feature X', 'Feature Y', ...]

  -- Estimaciones
  estimated_weeks INTEGER,
  estimated_budget DECIMAL,

  -- Metadata
  validated_by TEXT DEFAULT 'Claude Sonnet 4', -- Qué modelo usó
  validation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  markdown_output TEXT -- Full validacion.md content
);

-- ================================================
-- M-002: PRODUCT MANAGER
-- ================================================

CREATE TABLE product_plans (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  validation_id TEXT REFERENCES validations(id), -- Link to validation

  -- Executive Summary
  problem_statement TEXT NOT NULL,
  solution_statement TEXT NOT NULL,
  value_proposition TEXT NOT NULL,

  -- User Persona
  persona JSONB NOT NULL,
  -- {
  --   name: 'María',
  --   age_range: '25-35',
  --   occupation: 'Barbera independiente',
  --   pain_points: [...],
  --   goals: [...]
  -- }

  -- User Journey
  user_journey JSONB,
  -- [
  --   {stage: 'Discovery', trigger: '...', actions: [...], pain_eliminated: '...'},
  --   {stage: 'Activation', ...},
  --   ...
  -- ]

  -- Success Metrics
  success_metrics JSONB NOT NULL,
  -- [
  --   {metric: 'User signups', target: '100 in 2 weeks'},
  --   {metric: 'Retention rate', target: '60% after 30 days'},
  --   ...
  -- ]

  -- Tech Stack decision
  tech_stack JSONB NOT NULL,

  -- Dependencies
  dependencies JSONB, -- Mapping de dependencies entre features

  -- Timeline
  estimated_timeline_days INTEGER,
  milestones JSONB,

  -- Metadata
  created_by TEXT DEFAULT 'Claude Opus 4',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP,
  markdown_output TEXT -- Full plan.md content
);

-- Features: Individual features del plan
CREATE TABLE features (
  id TEXT PRIMARY KEY, -- F-001, F-002, F-003...
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  plan_id TEXT REFERENCES product_plans(id),

  -- Feature info
  name TEXT NOT NULL,
  description TEXT,
  user_story TEXT NOT NULL, -- "Como X quiero Y para Z"

  -- Priorización
  priority TEXT NOT NULL, -- 'P0' | 'P1' | 'P2'
  rice_score JSONB,
  -- {
  --   reach: 1000,
  --   impact: 3,
  --   confidence: 80,
  --   effort: 5,
  --   total_score: 480
  -- }

  -- Dependencies
  dependencies TEXT[], -- ['F-001', 'F-003']
  blocks_features TEXT[], -- Features que bloquea

  -- Status tracking
  status TEXT NOT NULL DEFAULT 'todo', -- 'todo' | 'in_progress' | 'testing' | 'done'

  -- Acceptance Criteria (Given-When-Then)
  acceptance_criteria JSONB NOT NULL,
  -- [
  --   {given: '...', when: '...', then: '...'},
  --   ...
  -- ]

  -- Time tracking
  estimated_hours INTEGER,
  actual_hours INTEGER,

  -- Assignee (futuro: multi-user)
  assigned_to TEXT,

  -- Notas de ejecución
  notes TEXT,
  git_commits TEXT[], -- Array de commit SHAs

  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  deployed_to_staging_at TIMESTAMP,
  deployed_to_production_at TIMESTAMP
);

-- ================================================
-- M-004: UX/UI DESIGNER
-- ================================================

CREATE TABLE designs (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  plan_id TEXT REFERENCES product_plans(id),

  -- Design System
  design_system JSONB NOT NULL,
  -- {
  --   style: 'Neo-Brutalism',
  --   colors: {primary: '#FF3333', ...},
  --   typography: {sans: 'DM Sans', mono: 'Space Mono'},
  --   shadows: {...},
  --   spacing: {...}
  -- }

  -- Screens
  screens JSONB,
  -- [
  --   {
  --     id: 'S-001',
  --     name: 'Landing page',
  --     wireframe_url: '/design/wireframes/landing.png',
  --     mockup_desktop_url: '/design/mockups/landing-desktop.png',
  --     mockup_mobile_url: '/design/mockups/landing-mobile.png',
  --     features_covered: ['F-001', 'F-002']
  --   },
  --   ...
  -- ]

  -- Component Specs
  components JSONB,
  -- [
  --   {
  --     name: 'Button',
  --     variants: ['primary', 'secondary', 'outline'],
  --     props: {...},
  --     code_snippet: '<Button>Click me</Button>'
  --   },
  --   ...
  -- ]

  -- Style Guide
  style_guide_url TEXT, -- Markdown file path

  -- Metadata
  designed_by TEXT DEFAULT 'Claude Sonnet 4',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP
);

-- ================================================
-- M-006: DASHBOARD & METRICS
-- ================================================

CREATE TABLE project_metrics (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,

  -- Velocity metrics
  velocity DECIMAL, -- Features completed per day
  avg_feature_hours DECIMAL,

  -- Accuracy metrics
  estimation_accuracy DECIMAL, -- % de accuracy (estimado vs real)

  -- Burndown data
  burndown_data JSONB,
  -- [
  --   {date: '2025-11-01', planned_remaining: 10, actual_remaining: 8},
  --   {date: '2025-11-02', planned_remaining: 9, actual_remaining: 7},
  --   ...
  -- ]

  -- RACI matrix
  raci_data JSONB,
  -- {
  --   'F-001': {status: 'done', responsible: 'Developer', accountable: 'PM'},
  --   'F-002': {status: 'in_progress', ...},
  --   ...
  -- }

  -- Progress
  completion_percentage INTEGER, -- 0-100
  features_completed INTEGER,
  features_total INTEGER,

  -- Deploy frequency
  deploys_count INTEGER,
  last_deploy_at TIMESTAMP,

  -- Timestamps
  recorded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- M-008: HUB DE HERRAMIENTAS
-- ================================================

CREATE TABLE tools (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'design' | 'api' | 'deployment' | 'development' | 'latam' | 'inspiration'
  url TEXT NOT NULL,
  description TEXT,
  icon_name TEXT, -- Lucide icon name

  -- Configuration
  requires_api_key BOOLEAN DEFAULT false,
  api_key_placeholder TEXT, -- e.g., 'sk-...'

  -- LATAM specific
  supported_countries TEXT[], -- ['AR', 'MX', 'CL'] for payment providers

  -- Metadata
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Relación many-to-many: Projects <-> Tools
CREATE TABLE project_tools (
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  tool_id TEXT NOT NULL REFERENCES tools(id) ON DELETE CASCADE,

  -- Configuration per project
  api_key_configured BOOLEAN DEFAULT false,
  notes TEXT, -- Project-specific notes about this tool
  is_favorite BOOLEAN DEFAULT false,

  added_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (project_id, tool_id)
);

-- ================================================
-- INDEXES FOR PERFORMANCE
-- ================================================

-- Projects
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_stage ON projects(stage);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);

-- Prompts
CREATE INDEX idx_prompts_project_id ON prompts(project_id);
CREATE INDEX idx_prompts_stage ON prompts(stage);
CREATE INDEX idx_prompts_created_at ON prompts(created_at DESC);

-- Validations
CREATE INDEX idx_validations_project_id ON validations(project_id);
CREATE INDEX idx_validations_verdict ON validations(verdict);

-- Product Plans
CREATE INDEX idx_product_plans_project_id ON product_plans(project_id);

-- Features
CREATE INDEX idx_features_project_id ON features(project_id);
CREATE INDEX idx_features_plan_id ON features(plan_id);
CREATE INDEX idx_features_status ON features(status);
CREATE INDEX idx_features_priority ON features(priority);

-- Designs
CREATE INDEX idx_designs_project_id ON designs(project_id);

-- Project Metrics
CREATE INDEX idx_project_metrics_project_id ON project_metrics(project_id);
CREATE INDEX idx_project_metrics_recorded_at ON project_metrics(recorded_at DESC);

-- Tools
CREATE INDEX idx_tools_category ON tools(category);

-- Project Tools
CREATE INDEX idx_project_tools_project_id ON project_tools(project_id);
CREATE INDEX idx_project_tools_is_favorite ON project_tools(is_favorite);
```

---

## 🔄 DATA FLOW

### **Flujo: Crear Proyecto**
```
User → Frontend
    ↓
POST /api/projects
    ↓
storage.createProject()
    ↓
INSERT INTO projects
    ↓
Return {id, name, ...}
    ↓
Redirect to /projects/[id]
```

### **Flujo: Validación de Idea (M-001)**
```
User ingresa idea cruda
    ↓
POST /api/validations
    ↓
Claude API (Sonnet 4)
    - Análisis USA vs LATAM
    - Stack recommendation
    - Veredicto Go/No-Go
    ↓
INSERT INTO validations
    ↓
Generate validacion.md
    ↓
Return validation result
    ↓
Frontend: Display verdict ✅⚠️❌
```

### **Flujo: Product Manager (M-002)**
```
User activa PM agent
    ↓
POST /api/plans
    - Input: validation_id
    ↓
Claude API (Opus 4)
    - Read validacion.md
    - Generate plan.md
    - RICE scoring
    - User stories
    - Dependencies
    ↓
INSERT INTO product_plans
INSERT INTO features (F-001, F-002, ...)
    ↓
Return complete plan
    ↓
Frontend: Display plan editor
```

### **Flujo: Kanban Board (M-005)**
```
User arrastra feature card
    ↓
PATCH /api/features/[id]
    - status: 'in_progress'
    - started_at: NOW()
    ↓
UPDATE features SET status = 'in_progress'
    ↓
Trigger metric recalculation
    ↓
UPDATE project_metrics
    ↓
WebSocket (futuro): Broadcast change
    ↓
Frontend: Update board real-time
```

---

## 🌐 API ENDPOINTS

### **Projects**
```
GET    /api/projects              → List all projects
POST   /api/projects              → Create project
GET    /api/projects/[id]         → Get project by ID
PATCH  /api/projects/[id]         → Update project
DELETE /api/projects/[id]         → Delete project
POST   /api/projects/[id]/archive → Archive project
```

### **Prompts (M-003)**
```
GET    /api/projects/[id]/prompts           → List prompts
POST   /api/projects/[id]/prompts           → Create prompt
POST   /api/projects/[id]/prompts/improve   → Improve prompt with Claude
GET    /api/prompts/[id]                    → Get prompt
PATCH  /api/prompts/[id]                    → Update prompt
```

### **Validations (M-001)**
```
POST   /api/validations              → Validate idea (Claude API)
GET    /api/validations/[id]         → Get validation
GET    /api/projects/[id]/validation → Get project's validation
```

### **Plans (M-002)**
```
POST   /api/plans                    → Generate plan (Claude Opus 4)
GET    /api/plans/[id]               → Get plan
PATCH  /api/plans/[id]               → Update plan
GET    /api/projects/[id]/plan       → Get project's plan
```

### **Features (M-005)**
```
GET    /api/features                 → List all features (with filters)
POST   /api/features                 → Create feature
GET    /api/features/[id]            → Get feature
PATCH  /api/features/[id]            → Update feature (status, hours, etc)
DELETE /api/features/[id]            → Delete feature
GET    /api/projects/[id]/features   → Get project's features
```

### **Designs (M-004)**
```
POST   /api/designs                  → Create design system
GET    /api/designs/[id]             → Get design
PATCH  /api/designs/[id]             → Update design
GET    /api/projects/[id]/design     → Get project's design
```

### **Tools (M-008)**
```
GET    /api/tools                    → List all tools
POST   /api/tools                    → Create tool (admin)
GET    /api/tools/[id]               → Get tool
POST   /api/projects/[id]/tools      → Add tool to project
DELETE /api/projects/[id]/tools/[toolId] → Remove tool from project
PATCH  /api/projects/[id]/tools/[toolId] → Update tool config (API key, favorite)
```

### **Metrics (M-006)**
```
GET    /api/metrics/[projectId]          → Get latest metrics
GET    /api/metrics/[projectId]/burndown → Burndown chart data
GET    /api/metrics/[projectId]/velocity → Velocity over time
POST   /api/metrics/[projectId]/recalculate → Trigger recalculation
```

---

## 🧩 COMPONENTES CLAVE

### **ProjectSidebar** (`components/projects/project-sidebar.tsx`)
**Responsabilidad:** Navegación principal entre 8 módulos

**Props:**
```typescript
interface ProjectSidebarProps {
  activeView: ViewType; // 'prompts' | 'planner' | 'validator' | ...
  onViewChange: (view: ViewType) => void;
  promptCount?: number;
  featureCount?: number;
  projectName: string;
}
```

**Estado:**
- Lista de módulos con íconos, labels, badges
- Highlight del módulo activo

### **KanbanBoard** (`components/kanban/kanban-board.tsx`)
**Responsabilidad:** Sistema de tracking de features tipo Jira

**Features:**
- Drag & drop entre columnas (To Do → In Progress → Testing → Done)
- Time tracking automático
- Dependencies visualization
- Deploy status badges

**Tecnología:** `@dnd-kit/core` (planeado)

### **BurndownChart** (`components/charts/burndown-chart.tsx`)
**Responsabilidad:** Visualizar progreso vs timeline

**Props:**
```typescript
interface BurndownChartProps {
  data: {
    date: string;
    plannedRemaining: number;
    actualRemaining: number;
  }[];
}
```

**Tecnología:** Recharts LineChart

### **ValidationWizard** (`components/validator/validation-wizard.tsx`)
**Responsabilidad:** Multi-step form para ingresar idea

**Steps:**
1. Idea cruda (textarea)
2. Target market (select: USA, LATAM, país específico)
3. Contexto adicional (optional)
4. Review & Submit

**Output:** POST a `/api/validations` → Claude API call

---

## 🎨 PATRONES DE DISEÑO

### **1. Server Components First**
- Usar React Server Components para data fetching
- Client Components solo cuando necesario (interactividad)

```tsx
// ✅ BUENO: Server Component
export default async function ProjectPage({ params }: { params: { id: string } }) {
  const project = await storage.getProject(params.id);
  return <ProjectDetail project={project} />;
}

// ❌ MALO: Client Component innecesario
'use client';
export default function ProjectPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState(null);
  useEffect(() => {
    fetch(`/api/projects/${params.id}`).then(...);
  }, []);
  return <ProjectDetail project={project} />;
}
```

### **2. Composition over Inheritance**
- Componentes pequeños y composables
- Evitar props drilling con Context API

```tsx
<KanbanBoard>
  <KanbanColumn status="todo">
    {features.map(f => <FeatureCard key={f.id} feature={f} />)}
  </KanbanColumn>
  <KanbanColumn status="in_progress">
    {features.map(f => <FeatureCard key={f.id} feature={f} />)}
  </KanbanColumn>
</KanbanBoard>
```

### **3. Data Access Layer**
- Toda interacción con DB via `lib/storage.ts`
- No SQL directo en API routes

```typescript
// ✅ BUENO
import { storage } from '@/lib/storage';
const project = await storage.getProject(id);

// ❌ MALO
import { sql } from '@/lib/db';
const project = await sql`SELECT * FROM projects WHERE id = ${id}`;
```

### **4. Type Safety End-to-End**
- TypeScript strict mode
- Shared types en `lib/types.ts`
- Zod para validación runtime (planeado)

```typescript
// lib/types.ts
export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: 'active' | 'archived' | 'completed';
  stage: number; // 0-8
  created_at: Date;
  updated_at: Date;
}

// Zod schema (planeado)
export const ProjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().nullable(),
  status: z.enum(['active', 'archived', 'completed']),
  stage: z.number().int().min(0).max(8),
});
```

---

## 🔒 SEGURIDAD

### **Actual (MVP)**
- Sin autenticación (desarrollo local)
- Database local (no expuesta)
- API keys en `.env.local` (gitignored)

### **Futuro (Producción)**
```typescript
// Planeado: Clerk Auth
import { auth } from '@clerk/nextjs';

export async function GET(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const projects = await storage.getProjectsByUser(userId);
  return Response.json(projects);
}
```

### **Environment Variables**
```bash
# .env.local
DATABASE_URL=postgresql://postgres:password@localhost:5432/project_library

# Integraciones (futuro)
ANTHROPIC_API_KEY=sk-ant-...
GITHUB_TOKEN=ghp_...
VERCEL_TOKEN=...

# Auth (futuro)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```

---

## ⚡ PERFORMANCE

### **Optimizaciones Actuales**
1. **Connection Pooling:** `postgres` library con pool
2. **Server Components:** Reduce bundle size ~40%
3. **Static Generation:** Landing page pre-rendered
4. **Image Optimization:** Next.js Image component

### **Métricas Objetivo**
- **Time to First Byte (TTFB):** < 200ms
- **Largest Contentful Paint (LCP):** < 2.5s
- **First Input Delay (FID):** < 100ms
- **Cumulative Layout Shift (CLS):** < 0.1

### **Futuras Optimizaciones**
- **React Suspense:** Para loading states
- **Incremental Static Regeneration:** Para project detail pages
- **CDN Caching:** Vercel Edge Network
- **Database Indexes:** Ya implementados (ver schema)

---

## 🚀 DEPLOYMENT

### **Desarrollo Local**
```bash
# 1. PostgreSQL setup
/Library/PostgreSQL/18/bin/psql -U postgres -c "CREATE DATABASE project_library;"
/Library/PostgreSQL/18/bin/psql -U postgres -d project_library -f db/schema.sql

# 2. Install dependencies
npm install

# 3. Run dev server
npm run dev # localhost:3000
```

### **Producción (Vercel)**
```yaml
# vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "DATABASE_URL": "@database_url",
    "ANTHROPIC_API_KEY": "@anthropic_api_key"
  }
}
```

**Deploy Flow:**
```
git push origin main
    ↓
Vercel Git Integration detecta push
    ↓
Trigger build: npm run build
    ↓
Deploy a production
    ↓
URL: project-library.vercel.app
```

---

## 📊 MONITOREO Y LOGGING

### **Actual (MVP)**
- Console.log básico
- Vercel Analytics (built-in)

### **Futuro**
```typescript
// Planeado: Sentry
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

// API error logging
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const project = await storage.createProject(data);
    return Response.json(project);
  } catch (error) {
    Sentry.captureException(error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
```

---

## 🧪 TESTING STRATEGY

### **Planeado (Fase 0B)**
```
tests/
├── unit/                   # Jest
│   ├── lib/
│   │   ├── storage.test.ts
│   │   └── utils.test.ts
│   └── components/
│       └── project-card.test.tsx
│
├── integration/            # Jest + Testing Library
│   ├── api/
│   │   ├── projects.test.ts
│   │   └── features.test.ts
│   └── flows/
│       └── create-project.test.tsx
│
└── e2e/                    # Playwright
    ├── landing.spec.ts
    ├── create-project.spec.ts
    └── kanban-board.spec.ts
```

**Coverage objetivo:** >80%

---

## 📝 DECISIONES ARQUITECTÓNICAS

### **ADR-001: PostgreSQL Local vs Supabase**
**Decisión:** Usar PostgreSQL 18 local para desarrollo, migrar a Supabase en producción

**Razones:**
- ✅ Full control durante desarrollo
- ✅ No depender de conexión internet
- ✅ Queries más rápidas (localhost)
- ✅ Fácil debugging

**Trade-offs:**
- ⚠️ Requiere instalación local
- ⚠️ Setup manual para nuevo dev

**Mitigación:** Script `setup-db.sh` + documentación detallada

---

### **ADR-002: No usar ORM (Prisma/Drizzle)**
**Decisión:** SQL directo via `postgres` library

**Razones:**
- ✅ Simplicidad (menos abstracciones)
- ✅ Performance (queries optimizados)
- ✅ JSONB queries más fáciles
- ✅ Menos dependencies

**Trade-offs:**
- ⚠️ No type-safety en queries
- ⚠️ Migrations manuales

**Mitigación:**
- Helper functions en `storage.ts`
- Zod validation para runtime safety

---

### **ADR-003: Server Components First**
**Decisión:** Usar React Server Components por defecto

**Razones:**
- ✅ Reduce bundle size 40%
- ✅ SEO mejor
- ✅ Data fetching más simple
- ✅ Menos JavaScript al cliente

**Trade-offs:**
- ⚠️ Learning curve
- ⚠️ No hooks (useState, useEffect)

**Cuándo usar Client Components:**
- Interactividad (onClick, onChange)
- Browser APIs (localStorage)
- React hooks

---

### **ADR-004: Neo-Brutalism Design System**
**Decisión:** Usar Neo-Brutalism como design language

**Razones:**
- ✅ High contrast → mejor legibilidad
- ✅ Simple de implementar (borders + shadows)
- ✅ Moderno pero nostálgico
- ✅ Perfecto para herramientas de productividad

**Implementación:**
```css
/* tailwind.config.ts */
theme: {
  extend: {
    boxShadow: {
      'neo-sm': '4px 4px 0px 0px rgba(0, 0, 0, 1)',
      'neo': '4px 4px 0px 0px rgba(0, 0, 0, 1)',
      'neo-lg': '8px 8px 0px 0px rgba(0, 0, 0, 1)',
    },
    borderRadius: {
      DEFAULT: '0px', // Sin radius
    },
  },
}
```

---

### **ADR-005: JSONB para Schemas Dinámicos**
**Decisión:** Usar JSONB para features, metrics, designs

**Razones:**
- ✅ Flexible (schema evoluciona)
- ✅ No necesita migrations frecuentes
- ✅ PostgreSQL JSONB es rápido
- ✅ Perfect para MVP iteration

**Trade-offs:**
- ⚠️ No type-safety en DB
- ⚠️ Queries JSONB más complejas

**Mitigación:** Zod schemas para validación runtime

---

### **ADR-006: Claude API Direct vs LangChain**
**Decisión:** Usar `@anthropic-ai/sdk` directamente

**Razones:**
- ✅ Simplicidad (menos abstracciones)
- ✅ Control total de prompts
- ✅ Menos dependencies
- ✅ Más fácil debugging

**Trade-offs:**
- ⚠️ No chain composition helpers
- ⚠️ No built-in retry logic

**Implementación planeada:**
```typescript
// lib/claude.ts
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function validateIdea(idea: string) {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [{
      role: 'user',
      content: `Valida esta idea de negocio: ${idea}...`,
    }],
  });

  return response.content[0].text;
}
```

---

## 🔄 PRÓXIMOS PASOS

### **Fase 0B: Code Audit (3 días)**
- [ ] Auditar dependencies (npm audit)
- [ ] Eliminar código no usado
- [ ] Refactorizar estructura (mover a app/)
- [ ] Setup testing framework

### **Fase 1: Database Foundation (3 días)**
- [ ] Implementar todas las tablas (validations, plans, features, tools)
- [ ] Crear seeds para tools
- [ ] Implementar storage functions
- [ ] Testing de data layer

### **Fase 2-7: Implementación de Módulos (16 días)**
- Ver Workflow.md y .project-overview.md para timeline detallado

---

**Documento vivo - Se actualizará conforme el proyecto evoluciona**

**Última actualización:** Noviembre 2025 - Fase 0A
**Próxima revisión:** Post-Fase 0B
