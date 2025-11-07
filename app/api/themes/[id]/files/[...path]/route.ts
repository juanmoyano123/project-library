import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'project_library',
  password: 'Niki2611',
  port: 5432,
});

// Determinar Content-Type según extensión
function getContentType(filePath: string): string {
  if (filePath.endsWith('.html')) return 'text/html';
  if (filePath.endsWith('.css')) return 'text/css';
  if (filePath.endsWith('.js')) return 'application/javascript';
  if (filePath.endsWith('.md')) return 'text/markdown';
  return 'text/plain';
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; path: string[] }> }
) {
  try {
    const { id, path } = await params;
    const filePath = path.join('/');

    // Obtener archivo de la base de datos
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
    const contentType = getContentType(filePath);

    // Retornar archivo con Content-Type apropiado
    return new NextResponse(file_content, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error fetching file:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch file' },
      { status: 500 }
    );
  }
}
