import pool from '../../../../utils/db';

const authorizedUsers = [1496782921, 1865781676];

export const dynamic = "force-dynamic";

export async function PUT(request) {
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
      id,
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
    if (!id || (!name && !description && !reward_hash_rate && !category)) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: id and at least one field to update' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const updates = [];
    const values = [];

    if (name) {
      updates.push("name = $" + (updates.length + 1));
      values.push(name);
    }
    if (description) {
      updates.push("description = $" + (updates.length + 1));
      values.push(description);
    }
    if (reward_hash_rate) {
      updates.push("reward_hash_rate = $" + (updates.length + 1));
      values.push(reward_hash_rate);
    }
    if (category) {
      updates.push("category = $" + (updates.length + 1));
      values.push(category);
    }
    if (expiration_date) {
      updates.push("expiration_date = $" + (updates.length + 1));
      values.push(new Date(expiration_date));
    }
    if (status) {
      updates.push("status = $" + (updates.length + 1));
      values.push(status);
    }
    if (recurrence_period) {
      updates.push("recurrence_period = $" + (updates.length + 1));
      values.push(recurrence_period);
    }
    if (max_completions_per_user) {
      updates.push("max_completions_per_user = $" + (updates.length + 1));
      values.push(max_completions_per_user);
    }
    if (priority) {
      updates.push("priority = $" + (updates.length + 1));
      values.push(priority);
    }
    if (requirements) {
      updates.push("requirements = $" + (updates.length + 1));
      values.push(JSON.stringify(requirements));
    }
    if (url) {
      updates.push("url = $" + (updates.length + 1));
      values.push(url);
    }
    if (imgurl && imgurl.trim() !== "") {
      updates.push(`imgurl = $${updates.length + 1}`);
      values.push(imgurl);
    } else {
      updates.push("imgurl = NULL");
    }
    if (task_value) {
      updates.push("task_value = $" + (updates.length + 1));
      values.push(task_value);
    }

    if (updates.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No fields to update' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    values.push(id);

    const query = `
      UPDATE tasks
      SET ${updates.join(", ")}
      WHERE id = $${values.length}
      RETURNING *;
    `;

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return new Response(
        JSON.stringify({ error: 'Task not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, task: result.rows[0] }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating task:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}