# 📚 Project Library System - Librería de Proyectos

Sistema de gestión de proyectos con historial completo de prompts para desarrollo asistido por IA (vibe coding).

## 🚀 Quick Start

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Edita .env con tus credenciales

# Ejecutar en desarrollo
npm run dev

# Abrir en el navegador
# http://localhost:3000
```

## ✨ Features Implementadas - MVP v2.0

### Componente #1: Librería de Proyectos

#### **CRUD de Proyectos**
- ✅ Crear proyectos con nombre, descripción y tags
- ✅ Ver lista de todos los proyectos
- ✅ Archivar/Desarchivar proyectos
- ✅ Eliminar proyectos
- ✅ **Persistencia con Supabase** (fallback a localStorage si no está configurado)

#### **Gestión de Prompts Mejorada - NEW! 🎉**
- ✅ **Workflow de 3 pasos para crear prompts:**
  1. **Escribe tu prompt original** - Tu idea inicial
  2. **Claude mejora tu prompt** - API de Claude optimiza tu prompt automáticamente
  3. **Guarda el plan de Claude Code** - Pega la respuesta que obtuviste

- ✅ **Visualización con Tabs:**
  - Tab 1: Prompt Original
  - Tab 2: Prompt Mejorado por Claude
  - Tab 3: Plan de Claude Code

- ✅ **Funcionalidades:**
  - Historial cronológico completo
  - Organización por etapas (0-8)
  - Copiar cualquier prompt al portapapeles
  - Eliminar prompts individuales
  - Contador de tokens
  - Regenerar prompts mejorados

#### **Integración con Claude API**
- ✅ Mejora automática de prompts
- ✅ Sistema de optimización de prompts
- ✅ Contador de tokens usados
- ✅ Modelo: Claude 3.5 Sonnet

#### **Navegación por Etapas**
- 0. Inicialización
- 1. Discovery
- 2. Diseño
- 3. Setup
- 4. Backend
- 5. Frontend
- 6. Testing
- 7. Deploy
- 8. Docs

#### **Búsqueda y Filtros**
- ✅ Búsqueda por nombre, descripción o tags
- ✅ Vista en grid responsive
- ✅ Estado de proyectos (activo, completado, archivado)

## 🏗️ Stack Tecnológico

- **Frontend**: Next.js 15 + React 19 (App Router)
- **UI**: shadcn/ui + Tailwind CSS
- **Iconos**: Lucide React
- **TypeScript**: Full type safety
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase con fallback a localStorage
- **IA**: Claude API (Anthropic)
- **MCP**: Model Context Protocol configurado

## 📁 Estructura del Proyecto

```
/app
  /api
    /improve-prompt     # API route para mejorar prompts
  /projects             # Lista de proyectos
    /[id]              # Detalle del proyecto
  page.tsx             # Redirect a /projects
  layout.tsx
  globals.css

/components
  /ui                  # shadcn components
  /projects
    project-card.tsx
    project-grid.tsx
    new-project-dialog.tsx
    prompt-workflow.tsx         # NEW: Workflow de 3 pasos
    prompt-display-tabs.tsx     # NEW: Vista con tabs

/lib
  types.ts             # TypeScript types
  storage.ts           # localStorage utilities (fallback)
  supabase.ts          # Supabase client
  supabase-storage.ts  # Supabase storage con fallback
  utils.ts             # shadcn utils

/hooks
  use-projects.ts      # Custom hooks para CRUD
```

## 🎯 Uso del Nuevo Workflow

### 1. Crear un Proyecto
1. Click en "Nuevo Proyecto"
2. Completa nombre y descripción
3. (Opcional) Agrega tags
4. Click "Crear Proyecto"

### 2. Agregar Prompts con el Workflow Mejorado

#### Paso 1: Tu Prompt Original
Escribe tu idea inicial, por ejemplo:
```
Quiero crear un sistema de login con email y contraseña
```

#### Paso 2: Mejorar con Claude
- Click en "Mejorar con Claude"
- Claude API optimiza tu prompt automáticamente
- Recibes un prompt mejorado y detallado:
```
Implementa un sistema de autenticación completo con las siguientes características:
- Login con email y contraseña
- Registro de nuevos usuarios con validación de email
- Recuperación de contraseña
- Sesiones persistentes con JWT
- Protección contra ataques de fuerza bruta
- Hash de contraseñas con bcrypt
- Validación de fortaleza de contraseñas
...
```

#### Paso 3: Guardar Plan de Claude Code
- Copia el prompt mejorado
- Úsalo en Claude Code
- Pega el plan/respuesta que te dio Claude
- Guarda todo el historial

### 3. Ver Historial de Prompts
Cada prompt guardado muestra:
- **Tab Original**: Tu idea inicial
- **Tab Mejorado**: Versión optimizada por Claude
- **Tab Plan**: Respuesta de Claude Code
- Tokens usados
- Etapa del proyecto
- Fecha y hora

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env` con:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key

# Claude API
ANTHROPIC_API_KEY=tu_claude_api_key
```

### Configurar Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ejecuta el siguiente SQL:

```sql
-- Tabla de proyectos
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  status TEXT DEFAULT 'active',
  current_stage INT DEFAULT 0,
  tags TEXT[]
);

-- Tabla de prompts
CREATE TABLE prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  original_prompt TEXT NOT NULL,
  improved_prompt TEXT,
  claude_plan TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW(),
  stage INT,
  tokens INT,
  model TEXT DEFAULT 'claude-3-sonnet'
);

-- RLS Policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on projects" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on prompts" ON prompts FOR ALL USING (true) WITH CHECK (true);
```

3. Obtén tu `Project URL` y `anon key` de Project Settings → API

### Configurar Claude API

1. Ve a [Anthropic Console](https://console.anthropic.com/)
2. Crea una API key
3. Agrégala al `.env`

## 🚫 Sin Autenticación

Este proyecto está diseñado para **uso personal** sin autenticación. Las políticas RLS están abiertas para permitir acceso sin auth.

## 📊 Arquitectura de Datos

### Project
```typescript
{
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'completed' | 'archived';
  currentStage: 0-8;
  tags: string[];
}
```

### Prompt (Nueva Estructura)
```typescript
{
  id: string;
  projectId: string;
  originalPrompt: string;        // Tu prompt inicial
  improvedPrompt: string | null; // Optimizado por Claude
  claudePlan: string;            // Respuesta de Claude Code
  timestamp: string;
  stage: 0-8;
  tokens?: number;
  model?: string;
}
```

## 🔌 MCP Servers Configurados

El archivo `.mcp.json` incluye:
- **shadcn**: Componentes UI
- **filesystem**: Acceso a archivos
- **supabase**: Base de datos (requiere configuración)
- **git**: Control de versiones
- **web**: Fetching de datos

## 🛠️ Scripts

```bash
npm run dev      # Desarrollo
npm run build    # Build producción
npm run start    # Servidor producción
npm run lint     # Linter
```

## 🎉 Nuevas Features v2.0

### ✨ Mejora Automática de Prompts
- Integración con Claude API
- Optimización automática de prompts
- System prompt especializado para desarrollo
- Contador de tokens

### 📊 Supabase Integration
- Persistencia en la nube
- Fallback automático a localStorage
- Sin necesidad de configuración inicial
- Escalable y performante

### 🎨 UI Mejorada
- Workflow de 3 pasos intuitivo
- Visualización con tabs
- Estados de carga
- Manejo de errores
- Copiado rápido de prompts

## 📝 Roadmap

### Versión 2.1 (Próxima)
- [ ] Export/Import de proyectos (JSON)
- [ ] Selector de modelo Claude (Sonnet, Opus, Haiku)
- [ ] Historial de versiones de prompts
- [ ] Búsqueda en contenido de prompts

### Versión 3.0 (Futuro)
- [ ] Ejecución directa de prompts desde la UI
- [ ] Streaming de respuestas en tiempo real
- [ ] Agentes configurables por etapa
- [ ] Autenticación con Supabase Auth
- [ ] Colaboración multi-usuario
- [ ] Analytics de uso de tokens

## 📄 Licencia

Uso personal - No distribuir
