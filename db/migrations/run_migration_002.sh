#!/bin/bash

# ================================================
# Script para ejecutar Migration 002
# ================================================

echo "🔄 Ejecutando Migration 002: Add V2.0 Tables..."
echo ""

# Verificar que PostgreSQL esté corriendo
if ! pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
  echo "❌ Error: PostgreSQL no está corriendo"
  echo "Por favor inicia PostgreSQL antes de ejecutar este script"
  exit 1
fi

# Ejecutar migración
PGPASSWORD="${POSTGRES_PASSWORD:-password}" /Library/PostgreSQL/18/bin/psql \
  -U postgres \
  -d project_library \
  -f "$(dirname "$0")/002_add_v2_tables.sql"

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Migration 002 ejecutada exitosamente"
  echo ""
  echo "Tablas creadas:"
  echo "  ✅ validations"
  echo "  ✅ product_plans"
  echo "  ✅ features"
  echo "  ✅ designs"
  echo "  ✅ project_metrics"
  echo "  ✅ tools"
  echo "  ✅ project_tools"
  echo ""
  echo "Próximo paso: Ejecutar seed de tools"
  echo "  $ bash db/seeds/seed_tools.sh"
else
  echo ""
  echo "❌ Error ejecutando migration"
  exit 1
fi
