import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'project_library',
  password: 'Niki2611',
  port: 5432,
});

// Función para resolver paths relativos basándose en la ubicación del archivo
function resolveRelativePath(currentFilePath: string, relativePath: string): string {
  const parts = currentFilePath.split('/');
  parts.pop(); // Remover el nombre del archivo, quedarnos con la carpeta

  // Si el path relativo empieza con './', quitarlo
  const cleanRelativePath = relativePath.replace(/^\.\//, '');

  // Si hay '../', subir un nivel
  const relativeparts = cleanRelativePath.split('/');
  let folder = parts.join('/');

  for (const part of relativeparts) {
    if (part === '..') {
      const folderParts = folder.split('/').filter(p => p);
      folderParts.pop();
      folder = folderParts.join('/');
    } else if (part !== '.') {
      folder = folder ? `${folder}/${part}` : part;
    }
  }

  return folder;
}

// Procesar HTML y reemplazar referencias a assets
function processHTML(html: string, themeId: string, currentFilePath: string): string {
  // Reemplazar referencias a CSS
  html = html.replace(
    /<link\s+([^>]*\s+)?href=["']([^"']+\.css)["']/gi,
    (match, attrs, href) => {
      const resolvedPath = resolveRelativePath(currentFilePath, href);
      const apiPath = `/api/themes/${themeId}/files/${resolvedPath}`;
      return `<link ${attrs || ''}href="${apiPath}"`;
    }
  );

  // Reemplazar referencias a JS
  html = html.replace(
    /<script\s+([^>]*\s+)?src=["']([^"']+\.js)["']/gi,
    (match, attrs, src) => {
      const resolvedPath = resolveRelativePath(currentFilePath, src);
      const apiPath = `/api/themes/${themeId}/files/${resolvedPath}`;
      return `<script ${attrs || ''}src="${apiPath}"`;
    }
  );

  // Agregar base tag para resolver otros recursos
  if (!html.includes('<base')) {
    const baseUrl = `/api/themes/${themeId}/files/`;
    const folder = currentFilePath.split('/').slice(0, -1).join('/');
    const fullBase = folder ? `${baseUrl}${folder}/` : baseUrl;
    html = html.replace(
      /<head>/i,
      `<head>\n  <base href="${fullBase}">`
    );
  }

  return html;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; path: string[] }> }
) {
  try {
    const { id, path } = await params;
    const filePath = path.join('/');

    // Obtener archivo HTML de la base de datos
    const result = await pool.query(
      'SELECT file_content, file_type FROM theme_files WHERE theme_id = $1 AND file_path = $2',
      [id, filePath]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'File not found' },
        { status: 404 }
      );
    }

    const { file_content, file_type } = result.rows[0];

    // Solo procesar archivos HTML
    if (file_type !== 'html') {
      return new NextResponse(file_content, {
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }

    // Procesar HTML y reemplazar referencias
    const processedHTML = processHTML(file_content, id, filePath);

    return new NextResponse(processedHTML, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error serving preview:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to serve preview' },
      { status: 500 }
    );
  }
}
