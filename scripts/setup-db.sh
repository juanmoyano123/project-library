#!/bin/bash

# Script to setup PostgreSQL database for project-library

echo "Setting up PostgreSQL database..."
echo ""
echo "This script will create the database and tables."
echo "You will be prompted for your PostgreSQL password."
echo ""

# PostgreSQL binary path
PSQL="/Library/PostgreSQL/18/bin/psql"

# Check if PostgreSQL is installed
if [ ! -f "$PSQL" ]; then
    echo "Error: PostgreSQL not found at $PSQL"
    echo "Please update the PSQL variable in this script with the correct path."
    exit 1
fi

# Database configuration
DB_NAME="project_library"
DB_USER="postgres"

# Step 1: Create database
echo "Step 1: Creating database '$DB_NAME'..."
$PSQL -U $DB_USER -c "CREATE DATABASE $DB_NAME;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✓ Database created successfully"
else
    echo "ℹ Database may already exist, continuing..."
fi

echo ""

# Step 2: Create tables
echo "Step 2: Creating tables and schema..."
$PSQL -U $DB_USER -d $DB_NAME -f ../db/schema.sql

if [ $? -eq 0 ]; then
    echo "✓ Tables created successfully"
else
    echo "✗ Error creating tables"
    exit 1
fi

echo ""
echo "✓ Database setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Update your .env file with your PostgreSQL password"
echo "2. Restart your Next.js server"
echo ""
