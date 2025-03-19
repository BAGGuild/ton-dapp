import pool from "@/utils/db";

function calculateClaimPoints(streak) {
  if (streak >= 14) return 1000;
  const increment = (1000 - 500) / 13;
  return Math.floor(500 + (streak - 1) * increment);
}

async function findUser(telegram_id) {
  const query = `SELECT * FROM users WHERE telegram_id = $1`;
  const result = await pool.query(query, [telegram_id]);
  return result.rows.length > 0 ? result.rows[0] : null;
}

async function updateUserClaim({ telegram_id, claimDate, streak, claimPoints }) {
  const newClaim = {
    points: claimPoints,
    source: "Daily Nomad",
    date: claimDate.toISOString()
  };

  const query = `
    UPDATE users 
    SET last_claim_time = $1,
        claim_streak = $2,
        total_points = COALESCE(total_points, 0) + $3,
        history = COALESCE(history, '[]'::jsonb) || $4::jsonb
    WHERE telegram_id = $5
    RETURNING *;
  `;
  const values = [
    claimDate,
    streak,
    claimPoints,
    JSON.stringify(newClaim),
    telegram_id
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function GET(request) {
  try {
    const initData = request.headers.get("initdata");
    const params = new URLSearchParams(initData);
    const userField = params.get("user");
    const userData = JSON.parse(decodeURIComponent(userField));
    const { id: telegram_id } = userData;

    const user = await findUser(telegram_id);
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const now = new Date();
    const todayUTC = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    );

    let streak = user.claim_streak || 0;
    if (user.last_claim_time) {
      const lastClaimDate = new Date(user.last_claim_time);
      const lastClaimMidnight = new Date(
        Date.UTC(
          lastClaimDate.getUTCFullYear(),
          lastClaimDate.getUTCMonth(),
          lastClaimDate.getUTCDate()
        )
      );

      const diffDays = (todayUTC - lastClaimMidnight) / (1000 * 60 * 60 * 24);
      if (diffDays >= 1) {
        streak = user.claim_streak + 1;
      }
    } else {
      streak = 1;
    }

    const claimPoints = streak >= 14 ? 1000 : calculateClaimPoints(streak);

    let nextClaimDate;
    if (user.last_claim_time) {
      const lastClaimDate = new Date(user.last_claim_time);
      nextClaimDate = new Date(
        Date.UTC(
          lastClaimDate.getUTCFullYear(),
          lastClaimDate.getUTCMonth(),
          lastClaimDate.getUTCDate() + 1
        )
      );
    } else {
      nextClaimDate = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
      );
    }

    const nextClaimTime = nextClaimDate.toISOString();

    return new Response(
      JSON.stringify({
        telegram_id,
        current_streak: user.claim_streak || 0,
        next_claim_points: claimPoints,
        remaining_until_max: streak >= 14 ? 0 : 1000 - claimPoints,
        next_claim_time: nextClaimTime,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in GET /api/claim:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(request) {
  try {
    const initData = request.headers.get("initdata");
    const params = new URLSearchParams(initData);
    const userField = params.get("user");
    const userData = JSON.parse(decodeURIComponent(userField));
    const { id: telegram_id } = userData;

    const user = await findUser(telegram_id);
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const now = new Date();
    const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    let userLastClaim = user.last_claim_time ? new Date(user.last_claim_time) : null;
    if (userLastClaim) {
      const lastClaimUTC = new Date(Date.UTC(userLastClaim.getUTCFullYear(), userLastClaim.getUTCMonth(), userLastClaim.getUTCDate()));
      if (todayUTC.getTime() === lastClaimUTC.getTime()) {
        return new Response(JSON.stringify({ error: "Already claimed today" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    let newStreak = 1;
    if (userLastClaim) {
      const lastClaimUTC = new Date(Date.UTC(userLastClaim.getUTCFullYear(), userLastClaim.getUTCMonth(), userLastClaim.getUTCDate()));
      const diffDays = (todayUTC - lastClaimUTC) / (1000 * 60 * 60 * 24);
      if (diffDays === 1) {
        newStreak = Number(user.claim_streak || 0) + 1;
      }
    }

    const claimPoints = newStreak >= 14 ? 1000 : calculateClaimPoints(newStreak);
    const updatedUser = await updateUserClaim({
      telegram_id,
      claimDate: todayUTC,
      streak: newStreak,
      claimPoints
    });

    return new Response(JSON.stringify({
      message: "Claim successful",
      awarded_points: claimPoints,
      new_streak: newStreak,
      total_points: updatedUser.points
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in POST /api/claim:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}