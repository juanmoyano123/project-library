# Configuración de Base de Datos PostgreSQL en Neon para Producción

Esta guía te ayudará a configurar una base de datos PostgreSQL en la nube usando Neon y conectarla con tu deployment de Netlify.

## Paso 1: Crear cuenta en Neon

1. Ve a https://neon.tech
2. Haz clic en "Sign Up" (puedes usar tu cuenta de GitHub)
3. Una vez dentro, haz clic en "Create a project"
4. Dale un nombre a tu proyecto (ej: "project-library-prod")
5. Selecciona la región más cercana (ej: US East para mejor performance desde Netlify)

## Paso 2: Obtener el Connection String

Una vez creado el proyecto, Neon te mostrará el **Connection String**. Se verá algo así:

```
postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

**Guárdalo en un lugar seguro** - lo necesitarás en el Paso 4.

También podrás verlo en cualquier momento en: **Dashboard → Connection Details**

## Paso 3: Ejecutar las migraciones

### Opción A: Desde la consola de Neon (Recomendado - Más fácil)

1. En el dashboard de Neon, ve a la pestaña **"SQL Editor"**
2. Copia y pega el contenido del archivo `db/migrations/neon-setup.sql` (lo crearemos a continuación)
3. Haz clic en **"Run"**
4. Verifica que se crearon las tablas correctamente

### Opción B: Desde tu terminal local

```bash
# Usa el connection string de Neon
psql "postgresql://user:password@ep-xxx.aws.neon.tech/neondb?sslmode=require" -f db/migrations/neon-setup.sql
```

## Paso 4: Configurar variables de entorno en Netlify

1. Ve a tu dashboard de Netlify: https://app.netlify.com
2. Selecciona tu sitio "project-library"
3. Ve a **Site settings → Environment variables**
4. Agrega las siguientes variables:

### Variables de PostgreSQL (Neon)

Descompón tu connection string de Neon en estas variables:

Si tu connection string es:
```
postgresql://user123:pass456@ep-cool-123.us-east-2.aws.neon.tech/neondb?sslmode=require
```

Entonces configura:

- **POSTGRES_HOST**: `ep-cool-123.us-east-2.aws.neon.tech`
- **POSTGRES_PORT**: `5432`
- **POSTGRES_DB**: `neondb`
- **POSTGRES_USER**: `user123`
- **POSTGRES_PASSWORD**: `pass456`

### Variable de Anthropic

- **ANTHROPIC_API_KEY**: `sk-ant-api03-...` (tu API key de Claude)

## Paso 5: Re-deployar en Netlify

1. En Netlify, ve a **Deploys**
2. Haz clic en **"Trigger deploy" → "Deploy site"**
3. Espera a que termine el deploy (2-3 minutos)
4. Prueba tu sitio - ¡las ideas ahora deberían guardarse correctamente!

## Verificación

Para verificar que todo funciona:

1. Ve a tu sitio en producción
2. Crea una nueva idea usando el analizador de IA
3. Aprueba la idea
4. Verifica que aparece en la lista de ideas

## Migración de datos locales (Opcional)

Si tienes ideas en tu base de datos local que quieres migrar a Neon, puedes usar el script:

```bash
# Exportar datos locales
npm run export-ideas

# Luego importar en Neon desde la consola SQL o usando psql
```

## Costos

- **Neon Free Tier**: 0.5 GB de storage, 1 branch, compute ilimitado
- **Netlify Free Tier**: 100 GB bandwidth, 300 build minutes
- **Anthropic API**: Pay-as-you-go (Claude Sonnet: ~$3 per million tokens)

Para este proyecto en etapa inicial, todo debería caber en los planes gratuitos.

## Troubleshooting

### Error: "Failed to fetch ideas"
- Verifica que todas las variables de entorno estén configuradas en Netlify
- Re-deploya el sitio después de agregar las variables

### Error: "Connection timeout"
- Verifica que el POSTGRES_HOST sea correcto (sin el prefijo `postgresql://`)
- Asegúrate de que el puerto sea `5432`

### Las ideas no se guardan
- Verifica en los logs de Netlify (Functions → View logs)
- Asegúrate de que las tablas existan en Neon (usa el SQL Editor)

## Recursos

- Neon Documentation: https://neon.tech/docs/introduction
- Netlify Environment Variables: https://docs.netlify.com/environment-variables/overview/
- PostgreSQL Connection String Format: https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING
