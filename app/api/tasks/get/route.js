import pool from '../../../../utils/db.js';

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const query = 'SELECT * FROM tasks';
    const result = await pool.query(query);

    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching tasks:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}