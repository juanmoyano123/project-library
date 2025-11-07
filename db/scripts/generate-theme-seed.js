// Script para generar seed SQL del theme automotive-style-guide
// Fecha: 2025-11-06

const fs = require('fs');
const path = require('path');

const THEME_DIR = '/Users/jeroniki/Documents/Github/project-library/automotive-style-guide';
const OUTPUT_FILE = path.join(__dirname, '../seeds/003_automotive_theme_seed.sql');

// Archivos a procesar
const FILES_TO_PROCESS = [
  { path: 'README.md', type: 'md' },
  { path: 'PROJECT-SUMMARY.md', type: 'md' },
  { path: 'research/design-patterns-analysis.md', type: 'md' },
  { path: 'style-guide.html', type: 'html' },
  { path: 'wireframes/index.html', type: 'html' },
  { path: 'wireframes/wireframes.css', type: 'css' },
  { path: 'components/buttons.html', type: 'html' },
  { path: 'components/cards.html', type: 'html' },
  { path: 'components/navigation.html', type: 'html' },
  { path: 'mockups/index.html', type: 'html' },
  { path: 'mockups/styles.css', type: 'css' },
  { path: 'mockups/script.js', type: 'js' }
];

// Escapar single quotes para SQL
function escapeSQLString(str) {
  return str.replace(/'/g, "''");
}

// Generar SQL
function generateSeedSQL() {
  let sql = `-- Seed 003: Automotive Theme Data
-- Fecha: 2025-11-06
-- Descripción: Migración del theme automotive-style-guide a la base de datos

-- Limpiar datos existentes (opcional)
DELETE FROM theme_files WHERE theme_id = 'THEME-001';
DELETE FROM themes WHERE id = 'THEME-001';

-- Insertar theme principal
INSERT INTO themes (id, name, description, preview_path, created_at) VALUES (
  'THEME-001',
  'Automotive Dark Style Guide',
  'A precision-engineered design system inspired by the automotive industry. Features monochromatic palette, bold typography, and asymmetric grids. Complete with wireframes, mockups, and component library.',
  'style-guide.html',
  CURRENT_TIMESTAMP
);

-- Insertar archivos del theme
`;

  FILES_TO_PROCESS.forEach((file, index) => {
    const filePath = path.join(THEME_DIR, file.path);

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const escapedContent = escapeSQLString(content);

      sql += `\n-- File ${index + 1}: ${file.path}\n`;
      sql += `INSERT INTO theme_files (theme_id, file_path, file_content, file_type) VALUES (\n`;
      sql += `  'THEME-001',\n`;
      sql += `  '${file.path}',\n`;
      sql += `  '${escapedContent}',\n`;
      sql += `  '${file.type}'\n`;
      sql += `);\n`;

      console.log(`✅ Procesado: ${file.path}`);
    } catch (error) {
      console.error(`❌ Error procesando ${file.path}:`, error.message);
    }
  });

  sql += `\n-- Verificar inserción\n`;
  sql += `SELECT COUNT(*) as total_files FROM theme_files WHERE theme_id = 'THEME-001';\n`;

  return sql;
}

// Ejecutar
try {
  console.log('🚀 Generando seed SQL para automotive-style-guide...\n');

  const sql = generateSeedSQL();

  // Crear directorio si no existe
  const seedDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(seedDir)) {
    fs.mkdirSync(seedDir, { recursive: true });
  }

  // Escribir archivo
  fs.writeFileSync(OUTPUT_FILE, sql, 'utf8');

  console.log(`\n✅ Seed SQL generado exitosamente en: ${OUTPUT_FILE}`);
  console.log(`📊 Total de archivos procesados: ${FILES_TO_PROCESS.length}`);
} catch (error) {
  console.error('❌ Error generando seed:', error);
  process.exit(1);
}
