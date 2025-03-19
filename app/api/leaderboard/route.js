import pool from "@/utils/db";

let cachedTopUsers = null;
let cachedAt = null;

export async function GET(request) {
  try {
    const now = Date.now();
    // استخدم الكاش إذا لم تنقض مدة 5 دقائق (300000 مللي ثانية)
    if (cachedTopUsers && cachedAt && now - cachedAt < 5 * 60 * 1000) {
      return new Response(JSON.stringify(cachedTopUsers), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // استعلام SQL لحساب نقاط المستخدم مع نقاط إحالات مستوى 1 فقط وترتيبهم من الأعلى للأدنى
    // يتم استخدام دوال JSONB للتعامل مع referrals->'referred_users_ids'
    const query = `
      WITH calc AS (
        SELECT
          COALESCE(u.total_points, 0) AS user_points,
          u.username,
          u.photo_url,
          COALESCE(jsonb_array_length(u.referrals->'referred_users_ids'), 0) AS l1_count,
          (
            SELECT COALESCE(SUM(u2.total_points), 0)
            FROM jsonb_array_elements(u.referrals->'referred_users_ids') AS r(rid)
            JOIN users u2 ON u2.id = (r.rid)::int
          ) AS l1_points_sum,
          (COALESCE(u.total_points, 0) + (0.1 * (
            SELECT COALESCE(SUM(u2.total_points), 0)
            FROM jsonb_array_elements(u.referrals->'referred_users_ids') AS r(rid)
            JOIN users u2 ON u2.id = (r.rid)::int
          ))) AS combinedPoints
        FROM users u
      ),
      ranked AS (
        SELECT
          row_number() OVER (ORDER BY combinedPoints DESC) AS ranking,
          user_points,
          (0.1 * l1_points_sum) AS referralPoints,
          combinedPoints,
          l1_count,
          username,
          photo_url
        FROM calc
        ORDER BY combinedPoints DESC
        LIMIT 100
      )
      SELECT json_agg(ranked) AS result FROM ranked;
    `;

    const dbResult = await pool.query(query);
    const topUsers = dbResult.rows[0].result || [];

    cachedTopUsers = topUsers;
    cachedAt = now;

    return new Response(JSON.stringify(topUsers), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching top users with referrals:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}