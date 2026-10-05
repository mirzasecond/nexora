import pool from '../db';

export async function unlockAchievement(playerId: string, achievementId: string): Promise<boolean> {
  try {
    await pool.query(
      `INSERT INTO player_achievements (id, player_id, achievement_id)
       VALUES (gen_random_uuid(), $1, $2)
       ON CONFLICT (player_id, achievement_id) DO NOTHING`,
      [playerId, achievementId]
    );
    return true;
  } catch (err) {
    return false;
  }
}

export async function getPlayerAchievements(playerId: string) {
  const result = await pool.query(
    `SELECT pa.*, a.title, a.description
     FROM player_achievements pa
     JOIN achievements a ON pa.achievement_id = a.id
     WHERE pa.player_id = $1
     ORDER BY pa.unlocked_at DESC`,
    [playerId]
  );
  return result.rows;
}

export async function getStatistics(playerId: string) {
  const result = await pool.query(
    'SELECT * FROM statistics WHERE player_id = $1',
    [playerId]
  );
  return result.rows[0] || null;
}

export async function updateStatistic(
  playerId: string,
  field: string,
  increment: number = 1
): Promise<void> {
  await pool.query(
    `UPDATE statistics SET ${field} = ${field} + $1, updated_at = NOW()
     WHERE player_id = $2`,
    [increment, playerId]
  );
}
