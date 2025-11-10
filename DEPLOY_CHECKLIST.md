# ✅ Checklist para Deploy en Producción

Sigue estos pasos en orden para tener tu app funcionando en producción con Netlify + Neon.

## 📋 Pre-requisitos

- [ ] Cuenta de GitHub (ya la tienes ✓)
- [ ] Cuenta de Netlify (conectada a tu repo ✓)
- [ ] Cuenta de Neon (la crearás ahora)
- [ ] API Key de Anthropic (ya la tienes ✓)

---

## 🗄️ Paso 1: Crear Base de Datos en Neon (5 minutos)

### 1.1 Crear cuenta y proyecto

1. Ve a **https://neon.tech**
2. Haz clic en **"Sign up"** (usa tu cuenta de GitHub para login rápido)
3. Una vez dentro, clic en **"Create a project"**
4. Configuración:
   - **Name**: `project-library-prod`
   - **Region**: `US East (Ohio)` (más cercano a Netlify)
   - **PostgreSQL version**: 16 (default)
5. Clic en **"Create project"**

### 1.2 Copiar el Connection String

Neon te mostrará algo como esto:

```
postgresql://neondb_owner:npg_abc123xyz@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

**🔴 MUY IMPORTANTE**: Copia este string completo y guárdalo en un lugar seguro (lo necesitarás en 2 minutos).

---

## 🔧 Paso 2: Crear las Tablas en Neon (2 minutos)

### 2.1 Abrir el SQL Editor

1. En el dashboard de Neon, haz clic en **"SQL Editor"** en el menú izquierdo
2. Se abrirá un editor de SQL

### 2.2 Ejecutar el script de setup

1. Abre el archivo `db/migrations/neon-setup.sql` en tu editor de código local
2. **Copia TODO el contenido** del archivo
3. **Pega** en el SQL Editor de Neon
4. Haz clic en **"Run"** (botón verde)
5. Deberías ver: ✅ **"Setup completed successfully!"**

### 2.3 (Opcional) Importar tus ideas locales

Si quieres migrar las 8 ideas que tienes en local a Neon:

1. Abre el archivo `db/migrations/local-ideas-export.sql`
2. Copia TODO el contenido
3. Pega en el SQL Editor de Neon
4. Clic en **"Run"**

---

## 🌐 Paso 3: Configurar Variables de Entorno en Netlify (3 minutos)

### 3.1 Ir a configuración de variables

1. Ve a **https://app.netlify.com**
2. Selecciona tu sitio **"project-library"**
3. Ve a **Site settings → Environment variables** (en el menú izquierdo)
4. Clic en **"Add a variable"**

### 3.2 Descomponer tu Connection String

Si tu connection string de Neon es:
```
postgresql://neondb_owner:npg_abc123xyz@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

Entonces las variables son:

| Variable | Valor del ejemplo | Tu valor |
|----------|------------------|----------|
| **POSTGRES_HOST** | `ep-cool-name-123456.us-east-2.aws.neon.tech` | ____________ |
| **POSTGRES_PORT** | `5432` | `5432` |
| **POSTGRES_DB** | `neondb` | ____________ |
| **POSTGRES_USER** | `neondb_owner` | ____________ |
| **POSTGRES_PASSWORD** | `npg_abc123xyz` | ____________ |

### 3.3 Agregar las 6 variables en Netlify

Para cada variable:
1. Clic en **"Add a variable"**
2. **Key**: el nombre de la variable (ej: `POSTGRES_HOST`)
3. **Value**: tu valor específico
4. **Scopes**: Selecciona "All scopes" o solo "Production"
5. Clic en **"Create variable"**

Agrega estas 6 variables:

- ✅ `POSTGRES_HOST`
- ✅ `POSTGRES_PORT`
- ✅ `POSTGRES_DB`
- ✅ `POSTGRES_USER`
- ✅ `POSTGRES_PASSWORD`
- ✅ `ANTHROPIC_API_KEY` (ya deberías tenerla, si no agrégala: `sk-ant-api03-...`)

---

## 🚀 Paso 4: Re-deployar el Sitio (2 minutos)

### 4.1 Trigger nuevo deploy

1. Aún en Netlify, ve a **"Deploys"** (menú superior)
2. Clic en **"Trigger deploy"**
3. Selecciona **"Deploy site"**
4. Espera 2-3 minutos mientras hace el build

### 4.2 Verificar que funcionó

1. Una vez termine el deploy, clic en el link de tu sitio
2. Ve a la sección **"Ideas"**
3. Prueba crear una nueva idea con el analizador de IA
4. Aprueba la idea
5. ✅ **¡Debería aparecer en la lista!**

---

## 🎉 ¡Listo!

Tu app ahora está 100% funcional en producción con:
- ✅ Base de datos PostgreSQL en la nube (Neon)
- ✅ Deploy automático en Netlify
- ✅ Análisis de ideas con IA (Claude)
- ✅ Persistencia de datos en producción

---

## 🔍 Troubleshooting

### ❌ Error: "Failed to fetch ideas"

**Posibles causas:**
1. Las variables de entorno no están configuradas
   - **Solución**: Verifica que las 6 variables existan en Netlify
2. El Connection String está mal descompuesto
   - **Solución**: Revisa que `POSTGRES_HOST` NO incluya `postgresql://`

### ❌ Error: "PostgreSQL not configured"

**Causa**: Falta alguna variable o está mal escrita
- **Solución**: Verifica que el nombre de las variables sea EXACTO (mayúsculas)

### ❌ Las ideas no se guardan

1. Abre las **Netlify Function Logs**: Site → Functions → View logs
2. Busca errores de PostgreSQL
3. Verifica que las tablas existan en Neon (SQL Editor: `SELECT * FROM ideas;`)

---

## 💰 Costos

Todo gratis para este volumen:
- **Neon**: 0.5 GB storage, compute ilimitado
- **Netlify**: 100 GB bandwidth, 300 build minutes/mes
- **Anthropic**: ~$0.15 por 100 ideas analizadas

---

## 📞 ¿Necesitas ayuda?

Si algo no funciona, revisa:
1. Los logs de Netlify Functions
2. Los logs de la consola del navegador (F12 → Console)
3. Que todas las variables estén en Netlify
4. Que las tablas existan en Neon

