# Feature THEMES - Plan de Implementación

## Objetivo
Crear una sección "Themes" donde se pueden almacenar y reutilizar guías de estilo generadas por `/design-system` en diferentes proyectos.

---

## Requerimientos Consolidados

### 1. Sección Themes
- Similar a la sección "Ideas" existente
- Listado de todos los themes guardados
- Cada theme es el output completo de un `/design-system` ejecutado
- Funcionalidad para subir/importar un nuevo theme desde una carpeta

### 2. Estructura de un Theme
Basado en ejemplo: `/automotive-style-guide/`

**Archivos que contiene:**
- `.md` files (README.md, PROJECT-SUMMARY.md, design-patterns-analysis.md)
- `.html` files (style-guide.html, wireframes/index.html, mockups/index.html, components/*.html)
- `.css` files (wireframes.css, styles.css)
- `.js` files (script.js)
- Estructura de carpetas (components/, mockups/, wireframes/, research/)

**Metadata del theme:**
- Nombre (ej: "Automotive Dark Style Guide")
- Descripción
- Fecha de creación
- Preview path (HTML principal para preview)

### 3. Asignación de Theme a Proyecto
- Cuando inicio o edito un proyecto, puedo elegir un theme de mi biblioteca
- Al asignar un theme, todos los archivos .md y .html de ese theme quedan asociados al proyecto

### 4. Visualización de Archivos del Theme
**Dentro de un proyecto que tiene theme asignado:**
- **Archivos .html/.css**: Visualizarlos renderizados (iframe o nueva pestaña) para ver el diseño real
- **Archivos .md**: Leerlos parseados como markdown (estilo GitHub README)

---

## Plan de Implementación

### FASE 1: Base de Datos para Themes
**Objetivo:** Crear estructura para almacenar themes y migrar automotive-style-guide como ejemplo

#### Paso 1.1 - Crear Migración SQL
```sql
-- Tabla themes (metadata del theme)
CREATE TABLE themes (
  id VARCHAR(50) PRIMARY KEY, -- THEME-001, THEME-002
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  preview_path VARCHAR(255) -- path al HTML principal para preview
);

-- Tabla theme_files (archivos del theme)
CREATE TABLE theme_files (
  id SERIAL PRIMARY KEY,
  theme_id VARCHAR(50) REFERENCES themes(id) ON DELETE CASCADE,
  file_path VARCHAR(255) NOT NULL, -- ej: "wireframes/index.html"
  file_content TEXT NOT NULL,
  file_type VARCHAR(10), -- md, html, css, js
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Paso 1.2 - Seed con automotive-style-guide
- Migrar todos los archivos de `/automotive-style-guide/` a la base
- Crear THEME-001: "Automotive Dark Style Guide"
- Insertar los 12 archivos identificados:
  - research/design-patterns-analysis.md
  - PROJECT-SUMMARY.md
  - README.md
  - style-guide.html
  - wireframes/index.html
  - wireframes/wireframes.css
  - components/buttons.html
  - components/cards.html
  - components/navigation.html
  - mockups/index.html
  - mockups/styles.css
  - mockups/script.js

---

### FASE 2: API para Servir Themes
**Objetivo:** Endpoints para obtener y servir archivos de themes

#### Paso 2.1 - Endpoints Básicos
- `GET /api/themes` - Listar todos los themes
- `GET /api/themes/[id]` - Detalle del theme con lista de archivos
- `GET /api/themes/[id]/files` - Obtener todos los archivos de un theme
- `POST /api/themes` - Crear nuevo theme (futuro)
- `DELETE /api/themes/[id]` - Eliminar theme (futuro)

#### Paso 2.2 - Endpoint para Servir Archivos
- `GET /api/themes/[id]/files/[...path]` - Obtener contenido de archivo específico
- Servir con content-type correcto según extensión
- Resolver referencias relativas para HTML

#### Paso 2.3 - Endpoint Especial para Preview HTML
- `GET /api/themes/[id]/preview/[...path]` - Servir HTML con sus assets
- Resolver referencias relativas (CSS, JS) dinámicamente
- Inyectar assets necesarios

---

### FASE 3: UI para Visualizar Themes
**Objetivo:** Interfaces para ver y explorar themes

#### Paso 3.1 - Página /themes (Listado)
- Crear ruta `/app/themes/page.tsx`
- Listado de themes disponibles en cards
- Cada card muestra:
  - Nombre y descripción
  - Preview thumbnail (iframe pequeño del style-guide.html)
  - Fecha de creación
  - Botón "Ver Detalle"

#### Paso 3.2 - Detalle del Theme (/themes/[id])
- Crear ruta `/app/themes/[id]/page.tsx`
- Layout de 2 columnas:
  - **Sidebar izquierdo**: Árbol de archivos organizado por carpetas
  - **Panel principal**: Visor de contenido

#### Paso 3.3 - Visor de Archivos Markdown
- Instalar `react-markdown` y `remark-gfm`
- Componente para renderizar .md con estilo GitHub
- Syntax highlighting para code blocks

#### Paso 3.4 - Visor de Archivos HTML
- Opción 1: iframe embebido con sandbox
- Opción 2: Botón "Abrir en nueva pestaña"
- Preview inline para archivos HTML pequeños

#### Paso 3.5 - Visor de CSS/JS
- Syntax highlighting con `react-syntax-highlighter`
- Vista de código formateado

---

### FASE 4: Renderizado Especial de HTML
**Objetivo:** Servir HTML completo con todos sus assets

#### Paso 4.1 - Resolver Paths Relativos
- En HTML que referencia CSS: `<link rel="stylesheet" href="wireframes.css">`
- Reemplazar con paths que apunten a la API: `/api/themes/THEME-001/files/wireframes/wireframes.css`

#### Paso 4.2 - Servidor de Assets
- Servir CSS con `Content-Type: text/css`
- Servir JS con `Content-Type: application/javascript`
- Cache headers apropiados

#### Paso 4.3 - Preview Funcional
- mockups/index.html debe verse exactamente como el original
- Incluir styles.css y script.js automáticamente
- Interacciones JavaScript deben funcionar

---

### FASE 5: Integración con Projects
**Objetivo:** Asignar themes a proyectos existentes

#### Paso 5.1 - Relación en Base de Datos
```sql
ALTER TABLE projects ADD COLUMN theme_id VARCHAR(50) REFERENCES themes(id);
```

#### Paso 5.2 - En Formulario de Proyecto
- Agregar dropdown/select para elegir theme
- Mostrar preview del theme seleccionado
- Permitir "Sin theme" (null)

#### Paso 5.3 - En Detalle del Proyecto
- Nueva tab "Design System" en la navegación del proyecto
- Mostrar todos los archivos del theme asignado
- Misma funcionalidad de visualización que en `/themes/[id]`
- Si no hay theme asignado, mostrar mensaje para asignar uno

#### Paso 5.4 - API para Relación
- `PATCH /api/projects/[id]` - Actualizar theme_id
- `GET /api/projects/[id]/theme` - Obtener theme del proyecto

---

### FASE 6: Upload de Nuevos Themes (Futuro)
**Objetivo:** Permitir subir nuevos themes manualmente

#### Paso 6.1 - Upload Interface
- Drag & drop de carpeta completa
- Parsear estructura y detectar archivos
- Validar que tenga estructura válida de theme

#### Paso 6.2 - Procesamiento de Upload
- Leer archivos recursivamente
- Preservar estructura de carpetas
- Guardar en base de datos

#### Paso 6.3 - Auto-captura desde /design-system
- Después de ejecutar `/design-system`
- Detectar output generado
- Opción para "Guardar como Theme"

---

## Orden de Implementación

1. ✅ **Documentar plan** (este archivo)
2. 🔄 **FASE 1**: Crear base de datos y migrar automotive-style-guide
3. 🔄 **FASE 2**: API endpoints para servir archivos
4. 🔄 **FASE 3**: UI básica para ver themes y archivos
5. 🔄 **FASE 4**: Renderizado especial de HTML con assets
6. 🔄 **FASE 5**: Integración con projects
7. 📅 **FASE 6**: Upload de nuevos themes (futuro)

---

## Archivos a Crear/Modificar

### Base de Datos
- `db/migrations/008_create_themes_tables.sql`
- `db/seeds/003_automotive_theme_seed.sql`

### API
- `app/api/themes/route.ts`
- `app/api/themes/[id]/route.ts`
- `app/api/themes/[id]/files/[...path]/route.ts`
- `app/api/themes/[id]/preview/[...path]/route.ts`

### UI
- `app/themes/page.tsx` (listado)
- `app/themes/[id]/page.tsx` (detalle)
- `components/themes/theme-card.tsx`
- `components/themes/theme-file-tree.tsx`
- `components/themes/theme-file-viewer.tsx`
- `components/themes/markdown-viewer.tsx`
- `components/themes/html-viewer.tsx`

### Integración Projects
- Modificar `app/projects/[id]/page.tsx` (agregar tab)
- Modificar `components/project-form.tsx` (agregar selector)
- `db/migrations/009_add_theme_to_projects.sql`

---

## Dependencias Nuevas
```json
{
  "react-markdown": "^9.0.0",
  "remark-gfm": "^4.0.0",
  "react-syntax-highlighter": "^15.5.0"
}
```

---

## Notas de Implementación

### Consideraciones de Seguridad
- Sanitizar HTML servido en iframes
- Validar paths para evitar directory traversal
- Sandbox iframes apropiadamente

### Performance
- Cache de archivos de themes
- Lazy loading de archivos grandes
- Paginación en listado de themes

### UX
- Loading states mientras se cargan archivos
- Error handling para archivos corruptos
- Preview rápido en hover de archivos

---

## Estado Actual
- **Fecha de inicio**: 2025-11-06
- **Fecha última actualización**: 2025-11-06
- **Fase actual**: FASE 4 - Renderizado Especial de HTML ✅ COMPLETADA
- **Próximo paso**: FASE 5 - Integración con Projects

### ✅ Fases Completadas:
- **FASE 1**: Base de Datos (tablas themes y theme_files, seed con automotive-style-guide)
- **FASE 2**: API Endpoints (GET themes, GET theme detail, GET files)
- **FASE 3**: UI Completa (listado, detalle, visores de MD/HTML/CSS/JS)
- **FASE 4**: Renderizado Especial de HTML con Assets (preview endpoint con paths resueltos)
