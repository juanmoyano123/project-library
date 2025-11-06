# 🚀 PROJECT LIBRARY SYSTEM V2.0

**Sistema integral que automatiza el desarrollo de MVPs desde la validación de idea hasta producción**

> Transforma ideas de negocios USA en aplicaciones validadas para LATAM en 15-20 días, documentando cada paso automáticamente.

[![Next.js](https://img.shields.io/badge/Next.js-15.5.5-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-blue)](https://www.postgresql.org/)
[![Status](https://img.shields.io/badge/Status-Fase%200A-yellow)](https://github.com)

---

## 📋 TABLA DE CONTENIDOS

- [¿Qué es Project Library?](#-qué-es-project-library)
- [Problema que Resuelve](#-problema-que-resuelve)
- [Sistema de 8 Módulos](#-sistema-de-8-módulos)
- [Stack Tecnológico](#-stack-tecnológico)
- [Quick Start](#-quick-start)
- [Documentación](#-documentación)
- [Roadmap](#-roadmap)
- [Contribuir](#-contribuir)

---

## 🎯 ¿QUÉ ES PROJECT LIBRARY?

Una plataforma integral que **automatiza el desarrollo de MVPs** desde la validación de idea hasta producción, siguiendo un workflow multi-agente inspirado en metodologías de product management de empresas como Google y Meta.

### **Antes (Desarrollo tradicional):**
- ❌ Ideas sin validar → tiempo perdido construyendo lo que nadie quiere
- ❌ Prompts dispersos entre conversaciones de Claude Code
- ❌ Cada proyecto empieza desde cero, sin memoria
- ❌ Falta de visibilidad del progreso real
- ❌ No hay tracking de features tipo Jira
- ❌ Documentación manual que nunca se hace

### **Ahora (Con Project Library):**
- ✅ Validación automática de ideas USA → LATAM
- ✅ Sistema de workflow con 4 agentes especializados
- ✅ Tracking de features estilo Jira integrado
- ✅ Dashboard ejecutivo con métricas en tiempo real
- ✅ Documentación que se genera sola
- ✅ Hub de herramientas con todo lo necesario
- ✅ Trazabilidad completa desde idea hasta deploy

---

## 💡 PROBLEMA QUE RESUELVE

### **Workflow de 4 Agentes**
```
💡 IDEA CRUDA (USA)
   ↓
🔍 AGENTE 0: Idea Validator (1 día)
   → validacion.md (Go/No-Go + Stack recomendado)
   ↓
📋 AGENTE 1: Product Manager [Opus 4] (1-2 días)
   → plan.md (Features RICE, User Stories, Timeline)
   ↓
🎨 AGENTE 2: UX/UI Designer (3-5 días)
   → Wireframes + Mockups + Design System
   ↓
LOOP Feature-by-Feature:
   💻 AGENTE 3: Architect+Developer (2-3 días/feature)
      ├─ Arquitectura + Código
      ├─ Tests (unit + integration)
      ├─ Deploy a staging
      ├─ Validación
      ├─ Deploy a producción
      └─ Marca Done → Siguiente feature
   ↓
✅ MVP COMPLETO (15-20 días)
```

---

## 🧩 SISTEMA DE 8 MÓDULOS

### **M-001: 💡 Validador de Ideas** (Agente 0)
Analiza si una idea USA funciona en LATAM
- Wizard multi-step para ingresar la idea
- Análisis automático de mercado (USA vs LATAM)
- Evaluación de viabilidad técnica y comercial
- Recomendación de stack tecnológico
- Veredicto final: ✅ Go / ⚠️ Validar más / ❌ No viable
- **Output:** `validacion.md`

### **M-002: 📋 Product Manager** (Agente 1)
Convierte validación en plan ejecutable
- Editor de `plan.md` con preview en tiempo real
- Features priorizadas con RICE scoring
- User stories con acceptance criteria (Given-When-Then)
- Dependencies mapping visual
- Timeline con milestones
- **Output:** `plan.md` con todas las features

### **M-003: ✏️ Mejora de Prompts**
Optimiza prompts antes de ejecutarlos
- Historial cronológico de prompts por proyecto
- Mejora automática con Claude API
- Opción "skip" si ya está optimizado por Claude Code
- Versionado de prompts (original → mejorado → plan)
- Templates por tipo de tarea
- **Output:** Historial completo navegable

### **M-004: 🎨 UX/UI Designer** (Agente 2)
Genera diseños completos del MVP
- Visor de wireframes por pantalla
- Galería de mockups (mobile + desktop)
- Style guide interactivo
- Component specs con código exportable
- Design tokens (colores, tipografía, spacing)
- **Output:** Carpeta `/design` completa

### **M-005: 💻 Tickets & Features** (Agente 3)
Sistema Kanban tipo Jira para trackear desarrollo
- Board visual: To Do → In Progress → Testing → Done
- Vista por features (F-001, F-002, F-003...)
- Time tracking automático (estimado vs real)
- Dependencies visualization
- Estado de deploy en tiempo real (staging/prod)
- Integración con commits de git
- **Output:** Dashboard de progreso en vivo

### **M-006: 📈 Dashboard Visual**
Métricas ejecutivas del proyecto
- **Burndown chart:** Progreso vs timeline
- **Gantt chart:** Features en el tiempo
- **RACI matrix:** Qué features están Done
- **Velocity tracker:** Features/día completadas
- **Progress rings:** % por etapa (0-8)
- **Heatmap de actividad:** Días más productivos
- **Output:** Dashboards interactivos + Export PDF

### **M-007: 📚 Documentación Viva**
Genera docs automáticamente mientras trabajas
- Generación desde commits de git
- Extracción de decisiones arquitectónicas
- Timeline de features completadas
- Learnings y postmortems
- Templates personalizables
- **Output:** Docs siempre actualizadas

### **M-008: 🛠️ Hub de Herramientas**
Centraliza recursos para acelerar desarrollo

**Categorías:**
- **Design & UI:** Vercel V0, Shadcn/ui, Tailwind UI, Lucide, Coolors
- **APIs & Backend:** Supabase, Clerk, Stripe, Resend, Upstash
- **Deployment:** Vercel, Netlify, Railway, Render
- **Desarrollo:** Next.js Docs, TypeScript Playground, Bundlephobia
- **LATAM Específico:** Mercado Pago, WhatsApp Business API, AFIP, Wompi
- **Inspiración:** Dribbble, Product Hunt, Indie Hackers

**Funcionalidades:**
- Quick actions (abrir, copiar API key)
- Favoritos por proyecto
- Estado de API keys configuradas
- Búsqueda rápida

---

## 💻 STACK TECNOLÓGICO

### **Frontend**
- **Framework:** Next.js 15.5.5 (App Router)
- **Runtime:** React 19
- **Language:** TypeScript 5.x (strict mode)
- **Styling:** TailwindCSS 3.4.1
- **Components:** Shadcn/ui (Radix UI primitives)
- **Icons:** Lucide React 0.344.0
- **Charts:** Recharts 2.12.7
- **Design System:** Neo-Brutalism

### **Backend**
- **Runtime:** Node.js 20+
- **Framework:** Next.js API Routes
- **Database:** PostgreSQL 18 (local development)
- **DB Client:** postgres 3.4.3 (connection pooling)
- **Validation:** Zod (planeado)

### **Integraciones**
- **AI:** Claude API (@anthropic-ai/sdk 0.20.0)
- **Git:** @octokit/rest 20.0.2
- **Deployment:** @vercel/sdk 1.0.0

### **DevOps**
- **Hosting:** Vercel (autodeploy)
- **CI/CD:** Vercel Git Integration
- **Database Prod:** Supabase PostgreSQL (planeado)
- **Monitoring:** Vercel Analytics

---

## 🚀 QUICK START

### **Pre-requisitos**
- Node.js 20+
- PostgreSQL 18
- Claude API key (opcional para desarrollo)

### **1. Instalación**
```bash
# Clonar repositorio
git clone https://github.com/jeroniki/project-library.git
cd project-library

# Instalar dependencias
npm install
```

### **2. Configurar PostgreSQL**
```bash
# Crear base de datos
/Library/PostgreSQL/18/bin/psql -U postgres -c "CREATE DATABASE project_library;"

# Aplicar schema
/Library/PostgreSQL/18/bin/psql -U postgres -d project_library -f db/schema.sql
```

### **3. Variables de Entorno**
Crea un archivo `.env.local`:
```env
# Database
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/project_library

# Claude API (opcional - para M-001 y M-002)
ANTHROPIC_API_KEY=sk-ant-...

# GitHub API (futuro - para M-007)
GITHUB_TOKEN=ghp_...

# Vercel API (futuro - para M-005 deploy status)
VERCEL_TOKEN=...
```

### **4. Ejecutar**
```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm run start
```

Abre [http://localhost:3000](http://localhost:3000)

---

## 📁 ESTRUCTURA DEL PROYECTO

```
project-library/
├── app/                           # Next.js 15 App Router
│   ├── (marketing)/               # Landing page
│   ├── projects/                  # Main app
│   │   ├── page.tsx               # Projects dashboard
│   │   └── [id]/                  # Project detail
│   │       ├── page.tsx           # Prompts view (default)
│   │       ├── validator/         # M-001
│   │       ├── planner/           # M-002
│   │       ├── designer/          # M-004
│   │       ├── features/          # M-005
│   │       ├── dashboard/         # M-006
│   │       ├── docs/              # M-007
│   │       └── tools/             # M-008
│   └── api/                       # API Routes
│       ├── projects/
│       ├── validations/
│       ├── plans/
│       ├── features/
│       └── metrics/
├── components/                    # React Components
│   ├── ui/                        # Shadcn/ui base
│   ├── projects/
│   ├── validator/                 # M-001 components
│   ├── planner/                   # M-002 components
│   ├── kanban/                    # M-005 components
│   ├── charts/                    # M-006 components
│   └── tools/                     # M-008 components
├── lib/                           # Shared utilities
│   ├── db.ts                      # PostgreSQL client
│   ├── storage.ts                 # Data access layer
│   ├── types.ts                   # TypeScript types
│   └── utils.ts                   # General utilities
├── db/                            # Database
│   ├── schema.sql                 # Full schema
│   └── migrations/                # SQL migrations
├── docs/                          # Documentation
│   ├── .project-overview.md       # V2.0 - Sistema completo
│   ├── Workflow.md                # Workflow de 4 agentes
│   ├── ARCHITECTURE.md            # Specs técnicas
│   └── MIGRATION_GUIDE.md         # Migration guide V1→V2
└── public/
    └── design/                    # Design assets (M-004)
```

---

## 📚 DOCUMENTACIÓN

### **Documentos Principales**
- **[.project-overview.md](docs/.project-overview.md)** - Visión completa del sistema V2.0
- **[Workflow.md](docs/Workflow.md)** - Workflow de 4 agentes con ejemplos
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Arquitectura técnica detallada
- **[MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)** - Guía de migración V1.0 → V2.0

### **Database Schema**
Ver `db/schema.sql` para schema completo con:
- 9 tablas (projects, prompts, validations, product_plans, features, designs, project_metrics, tools, project_tools)
- Indexes optimizados
- JSONB para schemas flexibles

### **API Documentation** (planeado)
Ver `docs/API.md` para endpoints completos

---

## 🗺️ ROADMAP

### **Fase 0: Foundation** (4 días) ← **ESTAMOS AQUÍ**
- ✅ 0A: Consolidación de documentación
  - ✅ `.project-overview.md` V2.0
  - ✅ `Workflow.md` con ejemplos
  - ✅ `ARCHITECTURE.md`
  - ✅ `MIGRATION_GUIDE.md`
  - ✅ `README.md` actualizado
- ⏳ 0B: Auditoría y limpieza de código
  - ⏳ Dependency audit
  - ⏳ Code cleanup
  - ⏳ Refactor estructura
  - ⏳ Setup testing

### **Fase 1: Database Foundation** (3 días)
- [ ] Nuevas tablas PostgreSQL (7 tablas)
- [ ] API endpoints CRUD
- [ ] Data access layer
- [ ] Testing de data layer

### **Fase 2: Hub de Herramientas** (2 días) - **M-008**
- [ ] Component `<ToolsHub />` con categorías
- [ ] Gestión de favoritos y API keys
- [ ] Búsqueda rápida

### **Fase 3: Validador de Ideas** (2 días) - **M-001**
- [ ] Wizard de validación
- [ ] Integración Claude API
- [ ] Generación de `validacion.md`
- [ ] Veredicto visual

### **Fase 4: Product Manager** (3 días) - **M-002**
- [ ] Editor de `plan.md`
- [ ] RICE scoring calculator
- [ ] Dependencies mapping visual
- [ ] Handoff checklist

### **Fase 5: Sistema de Tickets** (4 días) - **M-005**
- [ ] Kanban board con drag & drop
- [ ] Time tracking
- [ ] Git integration
- [ ] Deploy status badges

### **Fase 6: Dashboard Visual** (3 días) - **M-006**
- [ ] Burndown chart
- [ ] Gantt chart
- [ ] RACI matrix
- [ ] Velocity tracker
- [ ] Export a PDF

### **Fase 7: Documentación Automática** (2 días) - **M-007**
- [ ] Generación desde git commits
- [ ] Architecture decisions log
- [ ] Auto-export Markdown/PDF

**Timeline total:** 23 días

---

## 🎨 DESIGN SYSTEM

### **Neo-Brutalism**
- **Estilo:** 90s web aesthetic con high contrast
- **Borders:** Always 2px solid black
- **Shadows:** Offset shadows (4px 4px 0px black)
- **Colors:** Black borders, Yellow accents (#FFEE00), Red primary (#FF3333)
- **Typography:** DM Sans (sans-serif), Space Mono (monospace)
- **Radius:** 0px (sharp corners)

### **Componentes Base**
- Shadcn/ui como fundación
- Customizados con Neo-Brutalism theme
- Full accessibility (WCAG AA)

---

## 🧪 TESTING (Planeado Fase 0B)

```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests (Playwright)
npm run test:e2e

# Coverage
npm run test:coverage
```

**Coverage objetivo:** >80%

---

## 🤝 CONTRIBUIR

Este es un proyecto de uso personal, pero si quieres contribuir:

1. Fork el proyecto
2. Crea una branch (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la branch (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

---

## 📊 MÉTRICAS Y KPIS

El sistema trackea automáticamente:

### **Métricas de Proceso:**
- Tiempo por fase (validación, planning, design, dev)
- Velocity (features completadas/día)
- Accuracy de estimaciones (estimado vs real)
- Deploy frequency (staging + producción)

### **Métricas de Calidad:**
- Test coverage (objetivo >80%)
- Bugs detectados por feature
- Acceptance criteria cumplidos

### **Métricas de Eficiencia:**
- Tokens usados por agente (Claude API)
- Prompts más efectivos
- Features bloqueadas por dependencies

---

## 🌟 VENTAJAS COMPETITIVAS

1. **Validación antes de construir:** No pierdas tiempo en ideas que no funcionan
2. **Documentación automática:** Se genera mientras trabajas
3. **Trazabilidad completa:** Desde idea hasta cada línea de código
4. **Métricas en tiempo real:** Ve el progreso como empresa grande
5. **Sistema multi-agente:** Cada fase tiene su especialista
6. **LATAM-first:** Adaptaciones culturales/técnicas incluidas
7. **Hub centralizado:** Todo lo que necesitas en un solo lugar
8. **Neo-Brutalism UI:** Interfaz moderna y de alto contraste

---

## 🔗 RECURSOS

- **Documentación:** [docs/.project-overview.md](docs/.project-overview.md)
- **Workflow:** [docs/Workflow.md](docs/Workflow.md)
- **Arquitectura:** [ARCHITECTURE.md](ARCHITECTURE.md)
- **Next.js:** [nextjs.org](https://nextjs.org/)
- **Shadcn/ui:** [ui.shadcn.com](https://ui.shadcn.com/)
- **Claude API:** [docs.anthropic.com](https://docs.anthropic.com/)

---

## 📄 LICENCIA

Uso personal - No distribuir

---

## 👨‍💻 AUTOR

**Juan Jeronimo Moyano**
- GitHub: [@jeroniki](https://github.com/jeroniki)

---

## 📝 CHANGELOG

### **V2.0** (En desarrollo - Fase 0A) - Noviembre 2025
- ✅ Documentación V2.0 completa
- ✅ Arquitectura de 8 módulos definida
- ✅ Database schema diseñado
- ✅ Neo-Brutalism design system implementado
- ✅ Landing page rediseñada
- ⏳ Migración a nuevo sistema

### **V1.0** (Actual) - Octubre 2025
- ✅ CRUD de proyectos
- ✅ Historial de prompts
- ✅ Mejora de prompts con Claude API
- ✅ PostgreSQL local integration
- ✅ Sidebar navigation (2 vistas)

---

<div align="center">

**🚀 PROJECT LIBRARY SYSTEM V2.0**

*Automatiza tu desarrollo de MVPs - De idea a producción en 15-20 días*

</div>
