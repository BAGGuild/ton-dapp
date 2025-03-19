import pool from "@/utils/db";

export async function GET(request) {
  try {
    const initData = request.headers.get("initdata");
    const params = new URLSearchParams(initData);
    const userField = params.get("user");
    const userData = JSON.parse(decodeURIComponent(userField));
    const { id: telegram_id } = userData;

    const query = `
      WITH main_user AS (
        SELECT *
        FROM users
        WHERE telegram_id = $1
      ),
      l1 AS (
        SELECT jsonb_array_elements_text(referrals->'referred_users_ids')::int AS l1_id
        FROM main_user
      )
      SELECT json_agg(u) AS result
      FROM users u
      JOIN l1 ON u.id = l1.l1_id;
    `;

    const dbResult = await pool.query(query, [telegram_id]);
    const result = dbResult.rows[0].result || [];

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching level 1 referrals:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
