# Migración de Supabase a PostgreSQL Local

## Resumen
La aplicación ha sido migrada de Supabase a PostgreSQL local para tener mayor control sobre la base de datos.

## Cambios realizados

### 1. Base de datos
- ✅ Creada base de datos `project_library` en PostgreSQL local
- ✅ Creadas tablas `projects` y `prompts` con índices optimizados
- ✅ Configurados triggers para actualizar automáticamente `updated_at`

### 2. Estructura de archivos

#### Nuevos archivos:
- `lib/postgres.ts` - Cliente de conexión a PostgreSQL (solo servidor)
- `lib/postgres-storage.ts` - Capa de acceso a datos usando PostgreSQL
- `lib/api-storage.ts` - Cliente que llama a las API routes
- `app/api/projects/route.ts` - API endpoints para proyectos
- `app/api/projects/[id]/route.ts` - API endpoints para proyecto individual
- `app/api/prompts/route.ts` - API endpoints para prompts
- `app/api/prompts/[id]/route.ts` - API endpoints para prompt individual
- `db/schema.sql` - Schema de la base de datos
- `scripts/setup-db.sh` - Script para configurar la base de datos

#### Archivos modificados:
- `hooks/use-projects.ts` - Ahora usa `api-storage` en lugar de `supabase-storage`
- `.env` - Actualizado con credenciales de PostgreSQL

### 3. Variables de entorno

El archivo `.env` ahora incluye:

```
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=project_library
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
```

### 4. Arquitectura

La nueva arquitectura sigue este flujo:

```
Cliente (React)
    ↓
hooks/use-projects.ts
    ↓
lib/api-storage.ts (hace fetch a API routes)
    ↓
app/api/.../route.ts (API Routes)
    ↓
lib/postgres-storage.ts (acceso a datos)
    ↓
lib/postgres.ts (conexión a BD)
    ↓
PostgreSQL
```

### 5. Fallback a localStorage

El sistema mantiene un fallback automático a localStorage si:
- PostgreSQL no está configurado
- Ocurre un error al conectar con la base de datos
- Alguna operación falla

## Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar PostgreSQL

Si aún no has configurado la base de datos:

```bash
# Opción 1: Usar el script automático (macOS/Linux)
chmod +x scripts/setup-db.sh
./scripts/setup-db.sh

# Opción 2: Manual
PGPASSWORD=tu_password /Library/PostgreSQL/18/bin/psql -U postgres -c "CREATE DATABASE project_library;"
PGPASSWORD=tu_password /Library/PostgreSQL/18/bin/psql -U postgres -d project_library -f db/schema.sql
```

### 3. Configurar variables de entorno

Actualiza `.env` con tu contraseña de PostgreSQL:

```
POSTGRES_PASSWORD=tu_password_real
```

### 4. Construir y ejecutar

```bash
npm run build
npm run start
```

## Esquema de base de datos

### Tabla `projects`

```sql
CREATE TABLE projects (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(500) NOT NULL,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) NOT NULL,
  current_stage INTEGER NOT NULL,
  tags TEXT[] DEFAULT '{}'
);
```

### Tabla `prompts`

```sql
CREATE TABLE prompts (
  id VARCHAR(255) PRIMARY KEY,
  project_id VARCHAR(255) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  original_prompt TEXT NOT NULL,
  improved_prompt TEXT,
  claude_plan TEXT NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  stage INTEGER NOT NULL,
  tokens INTEGER,
  model VARCHAR(100),
  execution_notes TEXT,
  notes_updated_at TIMESTAMP
);
```

## API Endpoints

### Projects

- `GET /api/projects` - Obtener todos los proyectos
- `POST /api/projects` - Crear nuevo proyecto
- `GET /api/projects/[id]` - Obtener proyecto por ID
- `PUT /api/projects/[id]` - Actualizar proyecto
- `DELETE /api/projects/[id]` - Eliminar proyecto

### Prompts

- `GET /api/prompts` - Obtener todos los prompts
- `GET /api/prompts?projectId=[id]` - Obtener prompts de un proyecto
- `POST /api/prompts` - Crear nuevo prompt
- `GET /api/prompts/[id]` - Obtener prompt por ID
- `PUT /api/prompts/[id]` - Actualizar prompt
- `DELETE /api/prompts/[id]` - Eliminar prompt

## Ventajas de PostgreSQL local

1. **Control total**: Tienes acceso completo a la base de datos
2. **Sin límites de API**: No hay restricciones de requests como en Supabase
3. **Desarrollo offline**: Puedes trabajar sin conexión a internet
4. **Mayor privacidad**: Todos los datos están en tu máquina
5. **Costo cero**: No hay costos de hosting

## Troubleshooting

### Error: "Cannot resolve 'fs', 'net', 'tls'"

Este error ocurre si intentas usar el cliente de PostgreSQL en el cliente de React. La solución es usar las API routes que ya están configuradas.

### Error: "Connection refused"

Verifica que PostgreSQL esté corriendo:

```bash
# macOS
brew services list

# Linux
sudo systemctl status postgresql
```

### Error: "password authentication failed"

Verifica que la contraseña en `.env` sea correcta.
