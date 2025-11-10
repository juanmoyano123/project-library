#!/bin/bash

# ============================================
# Full Database Migration Script: Local → Neon
# ============================================
# This script migrates your entire local PostgreSQL database to Neon
#
# Usage:
#   ./db/scripts/migrate-to-neon.sh "your-neon-connection-string"
#
# Example:
#   ./db/scripts/migrate-to-neon.sh "postgresql://user:pass@ep-xxx.aws.neon.tech/neondb?sslmode=require"

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if connection string was provided
if [ -z "$1" ]; then
    echo -e "${RED}❌ Error: No connection string provided${NC}"
    echo ""
    echo "Usage: $0 \"your-neon-connection-string\""
    echo ""
    echo "Example:"
    echo "  $0 \"postgresql://user:pass@ep-xxx.aws.neon.tech/neondb?sslmode=require\""
    echo ""
    echo "Get your connection string from:"
    echo "  1. Go to https://neon.tech"
    echo "  2. Open your project"
    echo "  3. Go to Dashboard → Connection Details"
    exit 1
fi

NEON_CONNECTION_STRING="$1"

# Local database credentials
LOCAL_HOST="localhost"
LOCAL_PORT="5432"
LOCAL_DB="project_library"
LOCAL_USER="postgres"
LOCAL_PASSWORD="Niki2611"

# Temporary files
TEMP_DIR="db/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
SCHEMA_FILE="$TEMP_DIR/schema_${TIMESTAMP}.sql"
DATA_FILE="$TEMP_DIR/data_${TIMESTAMP}.sql"

# Create backups directory if it doesn't exist
mkdir -p "$TEMP_DIR"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Full Database Migration: Local PostgreSQL → Neon         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Step 1: Export schema (structure)
echo -e "${YELLOW}📦 Step 1/4: Exporting database schema...${NC}"
PGPASSWORD=$LOCAL_PASSWORD /Library/PostgreSQL/18/bin/pg_dump \
  -h $LOCAL_HOST \
  -p $LOCAL_PORT \
  -U $LOCAL_USER \
  -d $LOCAL_DB \
  --schema-only \
  --no-owner \
  --no-privileges \
  > "$SCHEMA_FILE"

if [ $? -eq 0 ]; then
    SCHEMA_SIZE=$(wc -l < "$SCHEMA_FILE")
    echo -e "${GREEN}✅ Schema exported successfully ($SCHEMA_SIZE lines)${NC}"
else
    echo -e "${RED}❌ Failed to export schema${NC}"
    exit 1
fi

# Step 2: Export data
echo -e "${YELLOW}📦 Step 2/4: Exporting database data...${NC}"
PGPASSWORD=$LOCAL_PASSWORD /Library/PostgreSQL/18/bin/pg_dump \
  -h $LOCAL_HOST \
  -p $LOCAL_PORT \
  -U $LOCAL_USER \
  -d $LOCAL_DB \
  --data-only \
  --no-owner \
  --no-privileges \
  --column-inserts \
  > "$DATA_FILE"

if [ $? -eq 0 ]; then
    DATA_SIZE=$(wc -l < "$DATA_FILE")
    echo -e "${GREEN}✅ Data exported successfully ($DATA_SIZE lines)${NC}"
else
    echo -e "${RED}❌ Failed to export data${NC}"
    exit 1
fi

# Step 3: Import schema to Neon
echo -e "${YELLOW}🚀 Step 3/4: Importing schema to Neon...${NC}"
psql "$NEON_CONNECTION_STRING" < "$SCHEMA_FILE"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Schema imported successfully to Neon${NC}"
else
    echo -e "${RED}❌ Failed to import schema to Neon${NC}"
    echo -e "${YELLOW}💡 Tip: Check if the connection string is correct${NC}"
    exit 1
fi

# Step 4: Import data to Neon
echo -e "${YELLOW}🚀 Step 4/4: Importing data to Neon...${NC}"
psql "$NEON_CONNECTION_STRING" < "$DATA_FILE"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Data imported successfully to Neon${NC}"
else
    echo -e "${RED}❌ Failed to import data to Neon${NC}"
    exit 1
fi

# Verification
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 Migration completed successfully!${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Count records in Neon
echo -e "${YELLOW}📊 Verification - Record counts in Neon:${NC}"
psql "$NEON_CONNECTION_STRING" -c "
SELECT
  'projects' as table_name, COUNT(*) as count FROM projects
UNION ALL
SELECT 'prompts', COUNT(*) FROM prompts
UNION ALL
SELECT 'validations', COUNT(*) FROM validations
UNION ALL
SELECT 'product_plans', COUNT(*) FROM product_plans
UNION ALL
SELECT 'features', COUNT(*) FROM features
UNION ALL
SELECT 'designs', COUNT(*) FROM designs
UNION ALL
SELECT 'project_metrics', COUNT(*) FROM project_metrics
UNION ALL
SELECT 'tools', COUNT(*) FROM tools
UNION ALL
SELECT 'project_tools', COUNT(*) FROM project_tools
UNION ALL
SELECT 'ideas', COUNT(*) FROM ideas
UNION ALL
SELECT 'idea_combinations', COUNT(*) FROM idea_combinations
UNION ALL
SELECT 'themes', COUNT(*) FROM themes
UNION ALL
SELECT 'theme_files', COUNT(*) FROM theme_files
ORDER BY table_name;
" 2>/dev/null || echo -e "${YELLOW}⚠️  Some tables may not exist yet (that's ok if you haven't created them)${NC}"

echo ""
echo -e "${GREEN}✅ Backup files saved in:${NC}"
echo -e "   📁 Schema: $SCHEMA_FILE"
echo -e "   📁 Data:   $DATA_FILE"
echo ""
echo -e "${YELLOW}📝 Next steps:${NC}"
echo -e "   1. Update your Netlify environment variables with Neon credentials"
echo -e "   2. Re-deploy your site on Netlify"
echo -e "   3. Test that everything works in production"
echo ""
echo -e "${BLUE}🔗 Useful links:${NC}"
echo -e "   • Neon Dashboard: https://console.neon.tech"
echo -e "   • Netlify Dashboard: https://app.netlify.com"
echo ""
