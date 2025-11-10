# 🚀 Migración de Base de Datos a Neon

Este script migra tu base de datos PostgreSQL local completa a Neon en un solo comando.

## 📋 Pre-requisitos

1. **Cuenta en Neon creada**: https://neon.tech
2. **Connection String de Neon** a la mano
3. **PostgreSQL local corriendo** con tu base de datos `project_library`

## 🎯 Uso

### Comando básico:

```bash
./db/scripts/migrate-to-neon.sh "tu-connection-string-completo"
```

### Ejemplo real:

```bash
./db/scripts/migrate-to-neon.sh "postgresql://neondb_owner:npg_abc123xyz@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

**⚠️ IMPORTANTE**: Pon el connection string entre comillas `" "`

## 📦 ¿Qué hace el script?

1. ✅ Exporta toda la estructura de tu base de datos local (schema)
2. ✅ Exporta todos los datos (todas las tablas)
3. ✅ Importa la estructura a Neon
4. ✅ Importa todos los datos a Neon
5. ✅ Verifica que todo se migró correctamente
6. ✅ Guarda backups locales por seguridad

## 📊 Tablas que se migrarán:

- `projects` - Tus proyectos
- `prompts` - Historial de prompts
- `validations` - Validaciones de ideas
- `product_plans` - Planes de producto
- `features` - Features del roadmap
- `designs` - Diseños y design systems
- `project_metrics` - Métricas de proyectos
- `tools` - Catálogo de herramientas
- `project_tools` - Herramientas por proyecto
- `ideas` - Tus ideas analizadas
- `idea_combinations` - Combinaciones de ideas
- `themes` - Temas visuales
- `theme_files` - Archivos de temas

## 🔍 Verificación

Al finalizar, el script mostrará un resumen con el conteo de registros por tabla:

```
📊 Verification - Record counts in Neon:
 table_name        | count
-------------------+-------
 ideas             |     8
 projects          |     5
 features          |    12
 ...
```

## 💾 Backups

El script guarda backups automáticos en:

```
db/backups/
  ├── schema_20251109_201530.sql  (estructura)
  └── data_20251109_201530.sql    (datos)
```

Estos archivos quedan guardados por si necesitas revertir algo.

## ❌ Solución de Problemas

### Error: "Permission denied"

```bash
chmod +x db/scripts/migrate-to-neon.sh
```

### Error: "psql: command not found"

Instala PostgreSQL client:
- **Mac**: `brew install postgresql`
- **Linux**: `sudo apt-get install postgresql-client`

### Error: "Connection refused"

- Verifica que tu connection string de Neon sea correcto
- Asegúrate de que incluye `?sslmode=require` al final

### Error: "FATAL: password authentication failed"

- El connection string está mal copiado
- Ve a Neon Dashboard y copia nuevamente el connection string completo

## 🎉 Después de la migración

1. **Configura las variables en Netlify** (ver `DEPLOY_CHECKLIST.md`)
2. **Re-deploya tu sitio** en Netlify
3. **Prueba** que todo funcione en producción

## 💡 Tips

- **Tiempo estimado**: 30 segundos - 2 minutos (depende del tamaño)
- **Puedes ejecutar el script múltiples veces** sin problema (sobrescribe datos)
- **Los backups locales no se borran** automáticamente

## 📞 ¿Problemas?

Si el script falla:
1. Revisa el mensaje de error completo
2. Verifica tu connection string de Neon
3. Prueba la **Opción B: Migración Manual** en `DEPLOY_CHECKLIST.md`
