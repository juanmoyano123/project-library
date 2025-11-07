import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'project_library',
  password: 'Niki2611',
  port: 5432,
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Obtener información del theme
    const themeResult = await pool.query(
      'SELECT * FROM themes WHERE id = $1',
      [id]
    );

    if (themeResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Theme not found' },
        { status: 404 }
      );
    }

    // Obtener archivos del theme
    const filesResult = await pool.query(
      `SELECT id, file_path, file_type, LENGTH(file_content) as size, created_at
       FROM theme_files
       WHERE theme_id = $1
       ORDER BY file_path`,
      [id]
    );

    return NextResponse.json({
      success: true,
      data: {
        theme: themeResult.rows[0],
        files: filesResult.rows,
      },
    });
  } catch (error) {
    console.error('Error fetching theme:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch theme' },
      { status: 500 }
    );
  }
}
