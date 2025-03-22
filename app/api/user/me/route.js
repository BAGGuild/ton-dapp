import pool from "@/utils/db";

async function findUser(telegram_id) {
  const query = `SELECT * FROM users WHERE telegram_id = $1`;
  const result = await pool.query(query, [telegram_id]);
  return result.rows.length > 0 ? result.rows[0] : null;
}

async function insertUser({
  telegram_id,
  username,
  photo_url,
  refCode,
  referred_by,
}) {
  const query = `
    INSERT INTO users (
      telegram_id,
      username,
      photo_url,
      ref_code,
      referred_by
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const values = [
    telegram_id,
    username,
    photo_url,
    refCode,
    referred_by,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
}

async function updateReferrer(startParam, newUserId) {
  const updateQuery = `
    UPDATE users
    SET referrals = 
      CASE 
        WHEN referrals @> jsonb_build_array($1) THEN referrals 
        ELSE referrals || jsonb_build_array($1)
      END
    WHERE ref_code = $2;
  `;
  await pool.query(updateQuery, [newUserId, startParam]);
}

export async function POST(request) {
  try {
    const initData = request.headers.get("initdata");
    const params = new URLSearchParams(initData);
    const userField = params.get("user");
    const startParam = params.get("start_param");

    const userData = JSON.parse(decodeURIComponent(userField));
    const { id: telegram_id, username, first_name, last_name, photo_url } = userData;

    const fullUsername = username || `${first_name ?? ""} ${last_name ?? ""}`.trim();

    const existingUser = await findUser(telegram_id);
    if (existingUser) {
      return new Response(JSON.stringify(existingUser), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const refCode = Math.random().toString(36).substring(2, 12).toUpperCase();

    const newUser = await insertUser({
      telegram_id,
      username: fullUsername,
      photo_url: photo_url || null,
      refCode,
      referred_by: startParam || null,
    });

    if (startParam) {
      await updateReferrer(startParam, newUser.id);
    }

    return new Response(JSON.stringify(newUser), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in /api/me route:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}