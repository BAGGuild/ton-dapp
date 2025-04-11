import pool from '../../../../utils/db';

const authorizedUsers = [1496782921, 1865781676];

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const initData = request.headers.get('initdata');
    const params = new URLSearchParams(initData);
    const userField = params.get('user');
    const userData = JSON.parse(decodeURIComponent(userField));
    const { id: telegram_id } = userData;

    if (!authorizedUsers.includes(Number(telegram_id))) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized user' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();
    const {
      name,
      description,
      reward_hash_rate,
      category,
      expiration_date,
      status,
      recurrence_period,
      max_completions_per_user,
      priority,
      requirements,
      url,
      imgurl,
      task_value,
    } = body;

    if (!name || !description || !reward_hash_rate || !category) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: name, description, reward_hash_rate, or category' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const query = `
      INSERT INTO tasks (
        name, description, reward_hash_rate, category, expiration_date, status, recurrence_period, 
        max_completions_per_user, priority, requirements, url, imgurl, task_value, created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *;
    `;

    const values = [
      name,
      description,
      reward_hash_rate,
      category,
      expiration_date ? new Date(expiration_date) : null,
      status || 'active',
      recurrence_period || null,
      max_completions_per_user || 1,
      priority || 'medium',
      requirements ? JSON.stringify(requirements) : null,
      url || null,
      imgurl && imgurl.trim() !== "" ? imgurl : null,
      task_value || null,
      telegram_id,
    ];

    const result = await pool.query(query, values);

    return new Response(
      JSON.stringify({ success: true, task: result.rows[0] }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error adding task:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}