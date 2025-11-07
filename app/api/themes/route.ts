import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'project_library',
  password: 'Niki2611',
  port: 5432,
});

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
        t.id,
        t.name,
        t.description,
        t.preview_path,
        t.created_at,
        COUNT(tf.id) as file_count
      FROM themes t
      LEFT JOIN theme_files tf ON t.id = tf.theme_id
      GROUP BY t.id, t.name, t.description, t.preview_path, t.created_at
      ORDER BY t.created_at DESC
    `);

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching themes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch themes' },
      { status: 500 }
    );
  }
}
